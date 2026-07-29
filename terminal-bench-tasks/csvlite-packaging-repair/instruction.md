The Python project in `/app` is `csvlite`, a small CSV statistics toolkit
packaged with setuptools via `pyproject.toml`. The packaging metadata and a
couple of source-level defects currently make it impossible to install and
run. Repair the project so it installs from source and the installed CLI
behaves exactly as specified below.

## Success criteria

1. From `/app`, this exact command must succeed:

   ```
   python3 -m pip install --no-build-isolation --no-index --break-system-packages .
   ```

   The environment has no network access, so the install must work
   offline with the system-provided setuptools and wheel.
2. The installed distribution must be named `csvlite`, and installing it
   must provide a `csvlite` executable on `PATH`.
3. The package version is `0.7.3` and its single source of truth is
   `lib/csvlite/__init__.py`'s `__version__` attribute (which matches the
   `VERSION` file). It must be exposed to the packaging metadata
   dynamically — do not write a literal version string into
   `pyproject.toml`.
4. Keep the source layout: the import package must remain at
   `lib/csvlite/` (there must be no top-level `csvlite/` directory in
   `/app`).

## Required behavior of the installed CLI

- `csvlite --version` prints exactly `csvlite 0.7.3` and exits 0.
- `csvlite stats FILE --col NAME` reads the CSV file (first row is the
  header) and prints exactly four lines, where each floating-point value
  is formatted with three decimal places (`%.3f`):

  ```
  count = <number of data rows>
  mean = <arithmetic mean>
  min = <minimum>
  max = <maximum>
  ```

- Input files may begin with a UTF-8 byte-order mark (BOM); it must be
  ignored, so a header cell `value` in a BOM-prefixed file is still the
  column `value`.
- If the named column does not exist in the header, print
  `csvlite: no such column: NAME` to stderr and exit 1.
- If a cell in the column is not a number, print
  `csvlite: invalid number: <cell>` to stderr and exit 1.
- Invoked with no arguments or an unknown subcommand, the CLI must print
  an error to stderr and exit 2.

A sample input lives at `data/sample.csv`. Verification uses fresh CSV
files of the same shape, and it reinstalls the package from the source
tree in `/app` before testing — so all fixes must be present in the
source, not just in a previously installed copy.

## Constraints

- Do not modify the `VERSION` file (verified byte-for-byte).
- Everything else (`pyproject.toml`, files under `lib/csvlite/`) may be
  changed as needed.
