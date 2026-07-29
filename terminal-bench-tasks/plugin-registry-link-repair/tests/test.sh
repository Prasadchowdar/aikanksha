#!/bin/bash
# Verifier for plugin-registry-link-repair.
#
# Checks, in order:
#   1. Protected files are untouched (sha256): VERSION, plugins/src/*.
#   2. Clean configure + build succeeds and produces build/cli/registry-cli.
#   3. --version reports the version from the VERSION file.
#   4. list / count show all three self-registered plugins with exact
#      formatting and ordering.
#   5. Usage errors exit with code 2; valid commands exit 0.
#
# Reward: 1 on full success, 0 otherwise, written to /logs/verifier/reward.txt.

APP_DIR="${APP_DIR:-/app}"
LOGS_DIR="${LOGS_DIR:-/logs/verifier}"

mkdir -p "$LOGS_DIR"
echo 0 > "$LOGS_DIR/reward.txt"

fail() {
    echo "FAIL: $1"
    exit 0
}

cd "$APP_DIR" || fail "working directory $APP_DIR is missing"

# --- 1. Protected files must be byte-identical to the originals.
checks="b99b4c7cdf236f59bc9f65d963deaecae3b16a7dad87939cacb9057f7664daee  VERSION
fb32edc2a717bbf0a60ce19df73125933939e38af264c0d96c14e24c570168f0  plugins/src/alpha.cpp
2ddbc3887160fccbc0a5a08ee9fd81d89a1d78a5b1ccb6cbdfe838a641cda4bc  plugins/src/beta.cpp
63d86f3bcc0c39e5a49503d9e916313ed57d4ae6b5167465abb8a56f102cdf5f  plugins/src/gamma.cpp"
echo "$checks" | sha256sum -c - >/dev/null 2>&1 \
    || fail "a protected file (VERSION or plugins/src/*) was modified"

# --- 2. Clean configure + build.
rm -rf build
if ! cmake -S . -B build > "$LOGS_DIR/configure.log" 2>&1; then
    tail -20 "$LOGS_DIR/configure.log"
    fail "cmake configure failed"
fi
if ! cmake --build build > "$LOGS_DIR/build.log" 2>&1; then
    tail -20 "$LOGS_DIR/build.log"
    fail "cmake --build failed"
fi
BIN=build/cli/registry-cli
[ -x "$BIN" ] || fail "build did not produce an executable at $BIN"

# --- 3. Version.
out=$("$BIN" --version)
rc=$?
[ "$rc" -eq 0 ] || fail "--version exited with $rc, expected 0"
[ "$out" = "registry 1.4.2" ] || fail "--version printed '$out', expected 'registry 1.4.2'"

# --- 4. Plugin registration actually happened at runtime.
expected_list=$(printf 'alpha source 10\nbeta transform 20\ngamma sink 30')
out=$("$BIN" list)
rc=$?
[ "$rc" -eq 0 ] || fail "list exited with $rc, expected 0"
if [ "$out" != "$expected_list" ]; then
    echo "expected:"
    echo "$expected_list"
    echo "actual:"
    echo "$out"
    fail "list output mismatch (are the plugin static initializers linked in?)"
fi

out=$("$BIN" count)
rc=$?
[ "$rc" -eq 0 ] || fail "count exited with $rc, expected 0"
[ "$out" = "plugins: 3" ] || fail "count printed '$out', expected 'plugins: 3'"

# --- 5. Usage errors.
"$BIN" >/dev/null 2>&1
[ $? -eq 2 ] || fail "no arguments: expected exit code 2"
"$BIN" frobnicate >/dev/null 2>&1
[ $? -eq 2 ] || fail "unknown command: expected exit code 2"

echo 1 > "$LOGS_DIR/reward.txt"
echo "PASS: all checks passed"
