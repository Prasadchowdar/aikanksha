The Go project in `/app` is `logsift`, a CLI that summarizes structured log
files. A botched refactor broke both the module configuration and several
source files. Repair the project so it builds cleanly, passes `go vet`, and
behaves exactly as specified below.

## Success criteria

1. From `/app`, all of the following must succeed:

   ```
   make clean
   go build ./...
   go vet ./...
   make build
   ```

   `make build` must produce an executable at `/app/logsift`. `go vet ./...`
   must report nothing. The environment has no network access and
   `GOPROXY=off`; the project must build fully offline.
2. `./logsift --version` must print exactly `logsift 1.2.0` and exit 0.
   The version is injected from the `VERSION` file by the Makefile's
   `-ldflags` line; `VERSION` is the single source of truth.

## Input format

Every line of an input log file has the form:

```
<timestamp> <LEVEL> <latency_ms> <message...>
```

`LEVEL` is one of `INFO`, `WARN`, `ERROR`; `latency_ms` is a non-negative
integer; the message may contain spaces. A file is valid only if it has at
least one line and every line is well-formed.

## Required behavior

- `./logsift count FILE` prints exactly three lines, in this fixed order:

  ```
  INFO = <count>
  WARN = <count>
  ERROR = <count>
  ```

- `./logsift latency FILE` prints exactly two lines:

  ```
  mean = <arithmetic mean of all latencies>
  p95 = <nearest-rank 95th percentile>
  ```

  Both values are formatted with `%.3f`. The mean is computed in floating
  point (not integer-truncated). The 95th percentile uses the nearest-rank
  method: with the latencies sorted ascending, it is the element at
  0-based index `ceil(0.95 * n) - 1`.
- If the input file is missing, empty, or contains any malformed line, the
  tool prints `logsift: invalid input` to stderr and exits 1.
- Run with no arguments, or with an unknown command and a valid readable
  file, the tool prints a usage message to stderr and exits 2.
- `count` and `latency` on valid input exit 0.

The exact output formats above are normative. A sample log is provided at
`data/sample.log`; verification uses fresh log files of the same format, so
fix root causes rather than special-casing inputs.

## Constraints

- Do not modify the `VERSION` file (verified byte-for-byte).
- Everything else (`go.mod`, `Makefile`, all `.go` files) may be changed
  as needed.
- Go 1.24 is installed. `GOTOOLCHAIN=local` is set: the toolchain cannot
  be upgraded or downloaded.
