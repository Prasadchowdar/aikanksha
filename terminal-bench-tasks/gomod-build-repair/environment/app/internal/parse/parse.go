package parse

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Entry is one parsed log line.
type Entry struct {
	Level     string
	LatencyMS int64
}

// File reads a log file where every line has the form
//
//	<timestamp> <LEVEL> <latency_ms> <message...>
//
// LEVEL is one of INFO, WARN, ERROR and latency_ms is a non-negative
// integer. The file must contain at least one line, and every line must
// be well-formed; otherwise an error is returned.
func File(path string) ([]Entry, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var entries []Entry
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		raw := sc.Text()
		fields := strings.Fields(raw)
		if len(fields) < 4 {
			return nil, fmt.Errorf("malformed line %d", raw)
		}
		level := fields[1]
		if level != "INFO" && level != "WARN" && level != "ERROR" {
			return nil, fmt.Errorf("unknown level %q", level)
		}
		ms, err := strconv.ParseInt(fields[2], 10, 64)
		if err != nil || ms < 0 {
			return nil, fmt.Errorf("bad latency in line %q", raw)
		}
		entries = append(entries, Entry{Level: level, LatencyMS: ms})
	}
	if err := sc.Err(); err != nil {
		return nil, err
	}
	if len(entries) == 0 {
		return nil, fmt.Errorf("empty log")
	}
	return entries, nil
}
