#!/bin/bash
# Oracle solution for gomod-build-repair.
#
# Repairs the seven defects in the order the build surfaces them, then
# rebuilds and exercises the documented behavior.

set -euo pipefail

cd "${APP_DIR:-/app}"

# --- 1. go.mod demands go >= 1.99; with GOTOOLCHAIN=local nothing newer
#        can be downloaded. The code needs nothing past 1.22.
sed -i 's/^go 1.99$/go 1.22/' go.mod

# --- 2. go.mod declares module example.com/logsft (typo) while every
#        import path in the tree says example.com/logsift.
sed -i 's|^module example.com/logsft$|module example.com/logsift|' go.mod

# --- 3. Import cycle: stats imports report for Round3 while report
#        imports stats for its types. Rounding before %.3f formatting is
#        redundant, so drop the report dependency from stats.
sed -i '\|"example.com/logsift/internal/report"|d' internal/stats/stats.go
sed -i '/mean = report.Round3(mean)/d' internal/stats/stats.go

# --- 4. The mean is declared float64 but computed with integer division
#        (sum / int64(n)). Wrapping the whole expression in float64()
#        would compile but silently truncate; divide in floating point.
sed -i 's|var mean float64 = sum / int64(len(lat))|mean := float64(sum) / float64(len(lat))|' internal/stats/stats.go

# --- 5. quantile.go carries a leftover //go:build ignore tag, so
#        Percentile is excluded from the build and undefined.
sed -i '/^\/\/go:build ignore$/d' internal/stats/quantile.go
sed -i '1{/^$/d}' internal/stats/quantile.go

# --- 6. report.go imports "strings" without using it (hard error in Go).
sed -i '/^\t"strings"$/d' internal/report/report.go

# --- 7. go vet: fmt.Errorf("malformed line %d", raw) passes a string to
#        %d. Use %q.
sed -i 's/malformed line %d/malformed line %q/' internal/parse/parse.go

# --- Rebuild from clean and sanity-check the documented behavior.
make clean
go build ./...
go vet ./...
make build

./logsift --version
./logsift count data/sample.log
./logsift latency data/sample.log
