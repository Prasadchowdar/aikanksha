package stats

import (
	"sort"

	"example.com/logsift/internal/parse"
	"example.com/logsift/internal/report"
)

// Counts holds per-level line counts.
type Counts struct {
	Info  int
	Warn  int
	Error int
}

// Summary holds latency statistics in milliseconds.
type Summary struct {
	Mean float64
	P95  float64
}

// Count tallies entries per log level.
func Count(entries []parse.Entry) Counts {
	var c Counts
	for _, e := range entries {
		switch e.Level {
		case "INFO":
			c.Info++
		case "WARN":
			c.Warn++
		case "ERROR":
			c.Error++
		}
	}
	return c
}

// Latency computes the mean and the nearest-rank 95th percentile of the
// entry latencies.
func Latency(entries []parse.Entry) Summary {
	lat := make([]int64, 0, len(entries))
	var sum int64
	for _, e := range entries {
		lat = append(lat, e.LatencyMS)
		sum += e.LatencyMS
	}
	sort.Slice(lat, func(i, j int) bool { return lat[i] < lat[j] })

	var mean float64 = sum / int64(len(lat))
	mean = report.Round3(mean)

	return Summary{Mean: mean, P95: Percentile(lat, 0.95)}
}
