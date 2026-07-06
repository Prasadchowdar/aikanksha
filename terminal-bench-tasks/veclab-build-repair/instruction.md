The `veclab` project in `/app` is a small C command-line tool for pairwise
vector math. It used to build cleanly, but a series of careless commits has
left the build broken in several independent ways. Your job is to repair the
project so that it builds from a clean tree and behaves exactly as specified
below.

## Success criteria

1. Running `make clean && make` in `/app` must complete successfully and
   produce an executable at `/app/veclab`.
2. Project policy: every C source file must be compiled with
   `-Wall -Wextra -Werror -std=c11`. The compiler invocations printed in the
   `make` output must show these flags for every `.c` file. Do not weaken or
   remove them.
3. The version reported by the binary must come from the `VERSION` file
   (via the generated header `include/veclab/config.h`); `./veclab --version`
   must print exactly:

   ```
   veclab 2.3.1
   ```

## Required behavior

The tool reads an input file containing exactly two rows of
whitespace-separated decimal numbers. Both rows must be non-empty, contain at
most 1024 values each, and have the same length.

- `./veclab dot FILE` prints one line: `dot = X` where X is the dot product
  of the two rows, formatted with `%.6f`.
- `./veclab norm FILE` prints two lines: `norm_a = X` and `norm_b = X`, the
  Euclidean norms of row 1 and row 2, each formatted with `%.6f`.
- `./veclab mean FILE` prints two lines: `mean_a = X` and `mean_b = X`, the
  arithmetic means of row 1 and row 2, each formatted with `%.6f`.
- `./veclab --version` prints `veclab <version>` as described above and
  exits with code 0.
- If the input file is missing, malformed, contains an empty row, a row
  longer than 1024 values, or rows of different lengths, the tool must print
  `veclab: invalid input` to stderr and exit with code 1.
- If invoked with a wrong number of arguments or an unknown command, the
  tool must print a usage message to stderr and exit with code 2.

The exact output formats above are normative. A sample input file is
provided at `data/example.txt`; verification uses fresh input files of the
same format, so fix root causes rather than special-casing any particular
file.

## Constraints

- Do not modify `include/veclab/vector.h`, `include/veclab/stats.h`, or
  `VERSION`. These are frozen public interfaces; they are verified
  byte-for-byte.
- Everything else in `/app` (Makefile, sources under `src/`, `config.h.in`)
  may be changed as needed.
- The environment has no network access; everything you need is already
  installed.
