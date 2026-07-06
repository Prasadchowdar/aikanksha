package report

import (
	"fmt"
	"math"
	"strings"

	"example.com/logsift/internal/stats"
)

// Counts renders per-level counts in the fixed INFO/WARN/ERROR order.
func Counts(c stats.Counts) string {
	return fmt.Sprintf("INFO = %d\nWARN = %d\nERROR = %d\n", c.Info, c.Warn, c.Error)
}

// LatencySummary renders latency statistics with three decimal places.
func LatencySummary(s stats.Summary) string {
	return fmt.Sprintf("mean = %.3f\np95 = %.3f\n", s.Mean, s.P95)
}

// Round3 rounds to three decimal places.
func Round3(x float64) float64 {
	return math.Round(x*1000) / 1000
}
