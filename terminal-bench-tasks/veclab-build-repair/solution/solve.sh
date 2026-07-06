#!/bin/bash
# Oracle solution for veclab-build-repair.
#
# Diagnoses and repairs the seven defects that break the build, in the
# order they surface, then verifies the binary against the documented
# behavior. Each step below mirrors what a human would do after reading
# the corresponding compiler/linker error.

set -euo pipefail

cd "${APP_DIR:-/app}"

# --- 1. Makefile: a later `CFLAGS = -O2` wipes out the include path and
#        the mandated warning flags. Merge it into the additive line.
sed -i 's/^CFLAGS += -Iinclude -Wall -Wextra -Werror -std=c11$/CFLAGS += -O2 -Iinclude -Wall -Wextra -Werror -std=c11/' Makefile
sed -i '/^# Release tuning$/,+1d' Makefile

# --- 2. Makefile: the generated-header rule writes to a misspelled path
#        (confg.h), so include/veclab/config.h never appears.
sed -i 's|> include/veclab/confg.h|> include/veclab/config.h|' Makefile
rm -f include/veclab/confg.h

# --- 3. main.c: `if (rc = 0)` assigns instead of comparing, so input
#        errors are never reported. The read contract is 0 on success.
sed -i 's/if (rc = 0) {/if (rc != 0) {/' src/main.c

# --- 4. io.c: format string prints a size_t with %d (error under
#        -Werror=format). Print it with %zu.
sed -i 's/got %d)/got %zu)/' src/io.c

# --- 5. io.c: the definition disagrees with the internal.h prototype
#        (size_t vs int) and inverts the documented return convention
#        (it returns the element count on success and 0 on error, while
#        the contract is 0 on success / nonzero on error).
sed -i 's/^size_t vl_read_pairs(const char \*path, vl_vec \*a, vl_vec \*b)$/int vl_read_pairs(const char *path, vl_vec *a, vl_vec *b)/' src/io.c
sed -i 's/^        return 0;$/        return -1;/' src/io.c
sed -i 's/^    return a->n;$/    return 0;/' src/io.c

# --- 6. Makefile: src/stats.c is never compiled, leaving vl_mean
#        undefined at link time.
sed -i 's|^OBJS = src/main.o src/vector.o src/io.o$|OBJS = src/main.o src/vector.o src/io.o src/stats.o|' Makefile

# --- 7. Makefile: -lm is passed before the object files; with the
#        linker's default --as-needed, libm is discarded before any
#        undefined math symbols are seen. Libraries go after objects.
sed -i 's|$(CC) $(LDLIBS) $(OBJS) -o $@|$(CC) $(OBJS) $(LDLIBS) -o $@|' Makefile

# --- Rebuild from clean and sanity-check the documented behavior.
make clean
make

./veclab --version
printf '1 2 3\n4 5 6\n' > /tmp/solve-check.txt
./veclab dot /tmp/solve-check.txt
./veclab norm /tmp/solve-check.txt
./veclab mean /tmp/solve-check.txt
rm -f /tmp/solve-check.txt
