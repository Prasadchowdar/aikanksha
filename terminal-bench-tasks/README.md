# TerminalBench Build-Fix Task Suite (Harbor format)

Tasks authored for the **Thanos — TerminalBench Agent Eval** project:
build-fix failure scenarios for benchmarking the Terminus agent across
frontier models. Every task strictly follows the Harbor framework task
format used by terminal-bench 2.x.

## Task format

Each task directory follows the Harbor layout:

```
<task-name>/
├── task.toml            # schema version, metadata, agent/verifier/environment config
├── instruction.md       # shown to the agent (tests and solution are NOT visible)
├── environment/
│   ├── Dockerfile       # ubuntu:24.04-based, self-contained, no tests/solution baked in
│   └── app/             # the broken project, copied to /app
├── solution/
│   └── solve.sh         # oracle fix, used only by Harbor's OracleAgent
└── tests/
    ├── test.sh          # verifier; writes 1 or 0 to /logs/verifier/reward.txt
    └── data/            # verifier-owned inputs (not visible to the agent)
```

Conventions honored (per Harbor's built-in task quality rubric):

- Everything the verifier checks is documented in `instruction.md`
  (filenames, exact output formats, exit codes, install/build commands).
- Tests and solutions are never copied into the image; the harness mounts
  them at `/tests` and `/solution` respectively.
- No test-only dependencies are installed in the image.
- Environments run with `network_mode = "no-network"`; verifiers are
  fully offline (pure shell + the toolchain already in the image).
- Oracle solutions derive the fix step by step (sed edits mirroring the
  diagnosis order); they never echo final answers.
- Protected files are enforced byte-for-byte via sha256 in the verifier,
  and the protection is declared to the agent in the instruction.

## Difficulty calibration (target: 30–80% failure)

The project goal is that frontier agents (Claude Opus 4.8/4.7, Sonnet 5,
GPT-5.5/5.4/5.3, Gemini 3.1 Pro) fail **between 3/10 and 8/10 trials** per
task — hard enough to discriminate, never impossible. Three mechanisms
produce that band:

1. **Layered failure chains** (6–7 sequential, independent build breaks).
   Each fix reveals the next error; the pass rate decays with chain length.
2. **Semantic traps** — at least one break per task where the *obvious*
   fix compiles/installs but silently breaks documented behavior, which the
   functional checks then catch. These punish symptom-patching and reward
   root-cause analysis.
3. **Constraint enforcement** — protected files (checksummed), mandated
   compiler flags greppable in the build log, forced clean rebuilds, and
   forced reinstalls from source. The escape hatches (relax `-Werror`,
   hardcode data, edit the frozen files) are all detected and scored 0.

Every task was validated in four states: pristine-broken (reward 0),
oracle-solved (reward 1), lazy-fix traps (reward 0 each), and at least one
*alternative legitimate* fix path (reward 1) so honest solutions are not
false-negatived.

### Calibration protocol

For each task and model, run 10 trials and record mean reward:

```bash
harbor run --path terminal-bench-tasks/<task-name> \
  --agent terminus-2 --model <provider/model> --n-attempts 10
```

Sanity checks first (should be deterministic):

```bash
# oracle must always score 1
harbor run --path terminal-bench-tasks/<task-name> --agent oracle
# nop must always score 0
harbor run --path terminal-bench-tasks/<task-name> --agent nop
```

If a task lands outside the 30–80% failure band for a given model family,
tune it with the knobs listed per task below (each knob is one commit-sized
change; re-run 10 trials after each adjustment).

## Tasks

### 1. `veclab-build-repair` — C / Make (difficulty: hard)

A small C vector-math CLI whose build is broken seven ways. Diagnosis
order as the errors surface:

| # | Defect | Kind |
|---|--------|------|
| 1 | A later `CFLAGS = -O2` wipes the `+=` line with `-Iinclude` and the mandated warning flags | Makefile variable shadowing |
| 2 | Generated-header rule writes `confg.h` instead of `config.h` (sed output typo), so the target never materializes | build-rule bug |
| 3 | `if (rc = 0)` under `-Werror=parentheses`; the agent must decide `!=` vs `==` from the read contract — the compiling-but-wrong variants fail functional tests | **semantic trap** |
| 4 | `size_t` printed with `%d` under `-Werror=format` | attrition |
| 5 | `vl_read_pairs` definition conflicts with its prototype (`size_t` vs `int`) *and* inverts the documented return convention; casting it away compiles but breaks every functional test | **semantic trap** |
| 6 | `src/stats.c` missing from `OBJS` → undefined reference to `vl_mean` | link error |
| 7 | `-lm` placed before the object files → `undefined reference to 'sqrt'` under default `--as-needed` | link-order error |

Escape hatches closed: dropping `-Werror`/`-Wall`/`-Wextra`/`-std=c11` is
caught by grepping the clean-rebuild log per source file; the public
headers and `VERSION` are checksummed.

Tuning knobs: remove layer 7 (easier), make the format bug functional
(harder), shorten agent timeout (harder).

### 2. `plugin-registry-link-repair` — C++17 / CMake (difficulty: hard)

A plugin-registry with self-registering static initializers. Seven
defects; the last one is the discriminator, because the build succeeds
while the program is silently wrong:

| # | Defect | Kind |
|---|--------|------|
| 1 | `cmake_minimum_required(VERSION 4.2)` — newer than any installed CMake | configure error |
| 2 | `add_library(regsitry_core …)` typo vs `target_include_directories(registry_core …)` | configure error |
| 3 | `std::uint32_t` without `<cstdint>` (GCC 13 dropped the transitive include) | compile error |
| 4 | `registry_plugins` never links `registry_core` — no include dirs, no core objects | CMake dependency graph |
| 5 | `project()` has no `VERSION`, so `configure_file` leaves `@PROJECT_VERSION_MAJOR@` empty → generated header doesn't compile | configure/codegen |
| 6 | Non-inline function defined in a header included by two TUs → multiple definition at link | ODR |
| 7 | Plugins are self-registering static initializers inside a **static archive**; nothing references their symbols, so the linker drops them and the registry is empty at runtime (`plugins: 0`). Requires OBJECT library / `--whole-archive` / equivalent | **semantic trap (silent)** |
| 8 | Plugin sources are read-only (checksummed), so hardcoding registrations elsewhere is detected | anti-cheat |

Tuning knobs: hint "static initializers in static libraries" in the
instruction (easier), drop layer 6 (easier), require both `--whole-archive`
awareness *and* keeping the plugins a `STATIC` library (much harder).

### 3. `csvlite-packaging-repair` — Python / setuptools (difficulty: medium)

An offline `pip install` repair with six defects across metadata and
source:

| # | Defect | Kind |
|---|--------|------|
| 1 | `[project].name` declared twice → invalid TOML | parse error |
| 2 | `version` both static and listed in `dynamic` → PEP 621 violation | metadata error |
| 3 | Package lives under `lib/` with no `package-dir`/`packages.find` mapping → "multiple top-level packages" + dynamic `attr:` can't resolve | discovery error |
| 4 | Console script points at `csvlite.cli:run`; the function is `main` | entry-point error |
| 5 | `__init__.py` imports from `csvlite.cli` before defining `__version__`, which `cli.py` imports back → circular ImportError the moment the CLI starts | **semantic trap** |
| 6 | Parser opens files as `utf-8` instead of `utf-8-sig`; the documented BOM requirement fails | encoding bug |

Constraint enforcement: hardcoding a static version in `pyproject.toml` is
rejected (version must stay dynamic per the instruction); the verifier
reinstalls from source (`--force-reinstall`), so stale-installed-copy fixes
don't count; the environment is offline, so the agent must know
`--no-build-isolation` / `--no-index` workflows.

Tuning knobs: remove the BOM layer (easier), move the package to a
namespace layout (harder), add a `MANIFEST.in`/sdist-completeness layer
(harder).

### 4. `gomod-build-repair` — Go / go modules (difficulty: medium)

A log-summarizing CLI whose module configuration and sources are broken
seven ways. Offline (`GOPROXY=off`, `GOTOOLCHAIN=local`):

| # | Defect | Kind |
|---|--------|------|
| 1 | `go 1.99` directive with `GOTOOLCHAIN=local` — no toolchain download possible | go.mod error |
| 2 | Module declared as `example.com/logsft` (typo) while all imports say `example.com/logsift` | module path |
| 3 | `stats` imports `report` for a rounding helper while `report` imports `stats` for its types → import cycle; the correct fix understands the helper is redundant before `%.3f` formatting | restructuring |
| 4 | `var mean float64 = sum / int64(n)` — the compiling shortcut `float64(sum / int64(n))` silently truncates and fails the functional mean check; correct is float division | **semantic trap** |
| 5 | Leftover `//go:build ignore` tag excludes the file defining `Percentile` → `undefined: Percentile` even though the function visibly exists | build tags |
| 6 | Unused import (hard error in Go) | attrition |
| 7 | `fmt.Errorf("... %d", raw)` with a string argument — `go vet ./...` must pass per the instruction | vet enforcement |

Functional checks also discriminate a nearest-rank p95 implemented as
`max()` (the two largest test latencies differ). `VERSION` is checksummed.

Tuning knobs: drop the vet requirement (easier), give the percentile
formula only by name without the index formula (harder), add a vendored
third-party dependency with a broken `vendor/modules.txt` (much harder).

## Expected calibration (to be measured)

| Task | Predicted failure band |
|------|------------------------|
| `veclab-build-repair` | 40–70% |
| `plugin-registry-link-repair` | 50–80% |
| `csvlite-packaging-repair` | 30–50% |
| `gomod-build-repair` | 30–60% |

Predictions are design targets based on chain length and trap count; the
authoritative numbers come from the 10-trial calibration protocol above,
and the per-task knobs exist precisely to move a task back into band after
measurement.

## Local verification performed

All verification was run on a toolchain matching the task images (GCC
13.3, CMake 3.28, GNU Make 4.3, Python 3.11+ with setuptools ≥ 61, Go
1.24 with `GOTOOLCHAIN=local GOPROXY=off`):

- Broken state: first error of every layer reproduced in the documented
  order for all three tasks; verifier reward = 0.
- Oracle: `solution/solve.sh` fixes every layer; verifier reward = 1.
- Traps: `((rc = 0))` parenthesization, count-cast return, `-Werror`
  removal, `STATIC`-archive dead registration, protected-file edits,
  static version hardcoding, missing BOM fix — all scored 0 with a
  precise failure message.
- Alternative honest fixes (e.g. the `size_t`-contract variant in veclab,
  version hardcoded in `version.hpp.in` while `VERSION` stays untouched)
  scored 1 — no false negatives on legitimate solution paths.
