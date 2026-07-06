#!/bin/bash
# Verifier for gomod-build-repair.
#
# Checks, in order:
#   1. Protected file untouched (sha256).
#   2. make clean && go build ./... && go vet ./... && make build all
#      succeed offline and produce ./logsift.
#   3. --version reports the version from the VERSION file.
#   4. count/latency output, error handling, and exit codes exactly as
#      documented in the instruction.
#
# Reward: 1 on full success, 0 otherwise, written to /logs/verifier/reward.txt.

APP_DIR="${APP_DIR:-/app}"
TESTS_DIR="${TESTS_DIR:-/tests}"
LOGS_DIR="${LOGS_DIR:-/logs/verifier}"

mkdir -p "$LOGS_DIR"
echo 0 > "$LOGS_DIR/reward.txt"

fail() {
    echo "FAIL: $1"
    exit 0
}

cd "$APP_DIR" || fail "working directory $APP_DIR is missing"

# --- 1. Protected file.
echo "1e5b51cde515396a9fa762909cf8ca6584ccc564b325d2eebeea76175fe95c4d  VERSION" | sha256sum -c - >/dev/null 2>&1 \
    || fail "protected file VERSION was modified"

# --- 2. Clean offline build and vet.
make clean >/dev/null 2>&1
if ! go build ./... > "$LOGS_DIR/build.log" 2>&1; then
    cat "$LOGS_DIR/build.log"
    fail "go build ./... failed"
fi
if ! go vet ./... > "$LOGS_DIR/vet.log" 2>&1; then
    cat "$LOGS_DIR/vet.log"
    fail "go vet ./... reported problems"
fi
if ! make build > "$LOGS_DIR/make.log" 2>&1; then
    cat "$LOGS_DIR/make.log"
    fail "make build failed"
fi
[ -x ./logsift ] || fail "make build did not produce an executable ./logsift"

# --- 3. Version.
out=$(./logsift --version)
rc=$?
[ "$rc" -eq 0 ] || fail "--version exited with $rc, expected 0"
[ "$out" = "logsift 1.2.0" ] || fail "--version printed '$out', expected 'logsift 1.2.0'"

# --- 4. Functional checks.
check_output() {
    local desc="$1" expected="$2" actual="$3"
    if [ "$actual" != "$expected" ]; then
        echo "expected:"
        echo "$expected"
        echo "actual:"
        echo "$actual"
        fail "$desc"
    fi
}

d="$TESTS_DIR/data"

check_output "count app1" "$(printf 'INFO = 3\nWARN = 2\nERROR = 1')" "$(./logsift count "$d/app1.log")"
check_output "latency app1" "$(printf 'mean = 41.167\np95 = 130.000')" "$(./logsift latency "$d/app1.log")"

check_output "count app2" "$(printf 'INFO = 11\nWARN = 5\nERROR = 4')" "$(./logsift count "$d/app2.log")"
check_output "latency app2" "$(printf 'mean = 93.650\np95 = 500.000')" "$(./logsift latency "$d/app2.log")"

# Malformed input: exit 1 and the documented stderr message.
err=$(./logsift count "$d/bad.log" 2>&1 >/dev/null)
rc=$?
[ "$rc" -eq 1 ] || fail "malformed input: exit code was $rc, expected 1"
[ "$err" = "logsift: invalid input" ] || fail "malformed input: stderr was '$err', expected 'logsift: invalid input'"

# Usage errors: exit code 2.
./logsift >/dev/null 2>&1
[ $? -eq 2 ] || fail "no arguments: expected exit code 2"
./logsift frobnicate "$d/app1.log" >/dev/null 2>&1
[ $? -eq 2 ] || fail "unknown command with valid file: expected exit code 2"

echo 1 > "$LOGS_DIR/reward.txt"
echo "PASS: all checks passed"
