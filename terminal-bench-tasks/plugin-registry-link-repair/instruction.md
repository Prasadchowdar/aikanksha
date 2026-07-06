The C++17 project in `/app` builds a plugin registry: a `registry_core`
library, a set of self-registering plugins, and a `registry-cli` executable.
After a rushed refactor the project no longer builds — and even once it
builds, it must actually work. Repair it so that a clean build passes and
the CLI behaves exactly as specified below.

## Success criteria

1. From `/app`, a clean configure and build must succeed:

   ```
   rm -rf build
   cmake -S . -B build
   cmake --build build
   ```

   and must produce an executable at `build/cli/registry-cli`.
2. `./build/cli/registry-cli --version` must print exactly `registry 1.4.2`.
   The `VERSION` file is the authoritative source of the version number.
3. `./build/cli/registry-cli list` must print one line per registered
   plugin, sorted by name, in the exact format `<name> <kind> <priority>`:

   ```
   alpha source 10
   beta transform 20
   gamma sink 30
   ```

   Plugin names are normalized (lowercased, surrounding whitespace
   stripped) when registered. All three plugins built into the project
   must appear — self-registration through their static initializers has
   to actually happen at runtime.
4. `./build/cli/registry-cli count` must print exactly `plugins: 3`.
5. Invoked with no arguments or an unknown command, the CLI must print a
   usage message to stderr and exit with code 2. `list`, `count`, and
   `--version` must exit with code 0.

## Constraints

- Do not modify `VERSION` or any file under `plugins/src/` — these are
  verified byte-for-byte. Plugins must keep registering themselves via
  their namespace-scope `AutoRegister` objects; do not add hardcoded
  plugin data anywhere else.
- Everything else (all `CMakeLists.txt` files, `cmake/version.hpp.in`,
  sources under `core/` and `cli/`) may be changed as needed.
- The environment has no network access; CMake 3.28 and GCC 13 are
  installed.
