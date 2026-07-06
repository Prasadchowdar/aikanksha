#!/bin/bash
# Verifier for veclab-build-repair.
#
# Checks, in order:
#   1. Protected files are untouched (sha256).
#   2. `make clean && make` succeeds from a clean tree.
#   3. Every C source file is compiled with the mandated flags
#      (-Wall -Wextra -Werror -std=c11), visible in the build log.
#   4. The binary reports the correct version.
#   5. Functional behavior: dot/norm/mean output, error handling and
#      exit codes exactly as documented in the instruction.
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

# --- 1. Protected files must be byte-identical to the originals.
echo "f6363c9023c082cacad7e1f7a3d19ec85288b8a3a2cf5d14317103cade268fb0  include/veclab/vector.h" | sha256sum -c - >/dev/null 2>&1 \
    || fail "protected file include/veclab/vector.h was modified"
echo "56e2aba5d3d9ab50b22bb1d8897112a4e0289f07655d610fff985ad92b4ef858  include/veclab/stats.h" | sha256sum -c - >/dev/null 2>&1 \
    || fail "protected file include/veclab/stats.h was modified"
echo "ad8650bc9057d9dfd809961b69dbad640c288d809fa44437d44d83d3b118c821  VERSION" | sha256sum -c - >/dev/null 2>&1 \
    || fail "protected file VERSION was modified"

# --- 2. Clean rebuild must succeed.
make clean >/dev/null 2>&1
if ! make > "$LOGS_DIR/build.log" 2>&1; then
    cat "$LOGS_DIR/build.log"
    fail "make failed from a clean tree"
fi
[ -x ./veclab ] || fail "make did not produce an executable ./veclab"

# --- 3. Mandated compiler flags on every C source file.
for src in src/main.c src/vector.c src/io.c src/stats.c; do
    line=$(grep -F "$src" "$LOGS_DIR/build.log" | grep -- "-Werror" | grep -- "-Wall" | grep -- "-Wextra" | grep -- "-std=c11")
    [ -n "$line" ] || fail "build log has no compile line for $src with -Wall -Wextra -Werror -std=c11"
done

# --- 4. Version comes from the VERSION file via the generated header.
out=$(./veclab --version)
[ "$out" = "veclab 2.3.1" ] || fail "--version printed '$out', expected 'veclab 2.3.1'"

# --- 5. Functional checks.
check_output() {
    local desc="$1" expected="$2" actual="$3"
    if [ "$actual" != "$expected" ]; then
        echo "expected: $expected"
        echo "actual:   $actual"
        fail "$desc"
    fi
}

d="$TESTS_DIR/data"

check_output "dot t1"  "dot = 12.375000"                      "$(./veclab dot  "$d/t1.txt")"
check_output "norm t1" "$(printf 'norm_a = 5.750000\nnorm_b = 4.636809')" "$(./veclab norm "$d/t1.txt")"
check_output "mean t1" "$(printf 'mean_a = 0.950000\nmean_b = 0.600000')" "$(./veclab mean "$d/t1.txt")"

check_output "dot t2"  "dot = -21.750000"                     "$(./veclab dot  "$d/t2.txt")"
check_output "norm t2" "$(printf 'norm_a = 7.250000\nnorm_b = 3.000000')" "$(./veclab norm "$d/t2.txt")"
check_output "mean t2" "$(printf 'mean_a = 7.250000\nmean_b = -3.000000')" "$(./veclab mean "$d/t2.txt")"

check_output "dot t4"  "dot = -1.875000"                      "$(./veclab dot  "$d/t4.txt")"
check_output "norm t4" "$(printf 'norm_a = 10.606602\nnorm_b = 1.754459')" "$(./veclab norm "$d/t4.txt")"
check_output "mean t4" "$(printf 'mean_a = 1.666667\nmean_b = 0.187500')" "$(./veclab mean "$d/t4.txt")"

# Length mismatch: exit code 1 and the documented message on stderr.
err=$(./veclab dot "$d/t3_mismatch.txt" 2>&1 >/dev/null)
rc=$?
[ "$rc" -eq 1 ] || fail "mismatched rows: exit code was $rc, expected 1"
[ "$err" = "veclab: invalid input" ] || fail "mismatched rows: stderr was '$err', expected 'veclab: invalid input'"

# Usage errors: exit code 2.
./veclab >/dev/null 2>&1
[ $? -eq 2 ] || fail "no arguments: expected exit code 2"
./veclab frobnicate "$d/t1.txt" >/dev/null 2>&1
[ $? -eq 2 ] || fail "unknown command: expected exit code 2"

echo 1 > "$LOGS_DIR/reward.txt"
echo "PASS: all checks passed"
