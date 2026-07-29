//go:build ignore

package stats

import "math"

// Percentile returns the nearest-rank q-quantile of an ascending-sorted
// slice: the element at index ceil(q*n)-1.
func Percentile(sorted []int64, q float64) float64 {
	if len(sorted) == 0 {
		return 0
	}
	rank := int(math.Ceil(q * float64(len(sorted))))
	if rank < 1 {
		rank = 1
	}
	if rank > len(sorted) {
		rank = len(sorted)
	}
	return float64(sorted[rank-1])
}
