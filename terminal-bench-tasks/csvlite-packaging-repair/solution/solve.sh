#!/bin/bash
# Oracle solution for csvlite-packaging-repair.
#
# Repairs the six defects in the order the install/run flow surfaces
# them, then reinstalls from source and exercises the documented CLI.

set -euo pipefail

cd "${APP_DIR:-/app}"

# --- 1. pyproject.toml declares [project].name twice, which is invalid
#        TOML and kills the build before setuptools even starts.
sed -i '/^name = "csvlite-tools"$/d' pyproject.toml

# --- 2. version is provided statically AND listed under dynamic, which
#        PEP 621 forbids. The version must stay dynamic (sourced from
#        csvlite.__version__), so drop the static line.
sed -i '/^version = "0.0.0"$/d' pyproject.toml

# --- 3. The import package lives under lib/, but nothing tells
#        setuptools that: automatic discovery fails with "multiple
#        top-level packages" and the dynamic attr can't locate csvlite.
cat >> pyproject.toml <<'EOF'

[tool.setuptools]
package-dir = {"" = "lib"}

[tool.setuptools.packages.find]
where = ["lib"]
EOF

# --- 4. The console script points at csvlite.cli:run, but the function
#        is csvlite.cli:main.
sed -i 's|csvlite = "csvlite.cli:run"|csvlite = "csvlite.cli:main"|' pyproject.toml

# --- 5. csvlite/__init__.py imports from csvlite.cli before defining
#        __version__, while csvlite.cli imports __version__ back from
#        the package -> circular ImportError the moment the console
#        script starts. Define __version__ first.
cat > lib/csvlite/__init__.py <<'EOF'
__version__ = "0.7.3"

from csvlite.cli import main

__all__ = ["main", "__version__"]
EOF

# --- 6. The parser opens files as plain utf-8, so a UTF-8 BOM leaks
#        into the first header cell and column lookups fail. The spec
#        says BOMs must be ignored.
sed -i 's/encoding="utf-8"/encoding="utf-8-sig"/' lib/csvlite/parser.py

# --- Reinstall from source and sanity-check the documented behavior.
PIP_INSTALL_FLAGS="${PIP_INSTALL_FLAGS:---no-build-isolation --no-index --force-reinstall --break-system-packages}"
# shellcheck disable=SC2086
python3 -m pip install $PIP_INSTALL_FLAGS .

csvlite --version
csvlite stats data/sample.csv --col value
