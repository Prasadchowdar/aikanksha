package main

import (
	"fmt"
	"os"

	"example.com/logsift/internal/parse"
	"example.com/logsift/internal/report"
	"example.com/logsift/internal/stats"
)

// version is injected at build time via -ldflags (see Makefile).
var version = "dev"

func usage() {
	fmt.Fprintln(os.Stderr, "usage: logsift {count|latency} FILE | logsift --version")
}

func main() {
	os.Exit(run(os.Args[1:]))
}

func run(args []string) int {
	if len(args) == 1 && args[0] == "--version" {
		fmt.Printf("logsift %s\n", version)
		return 0
	}
	if len(args) != 2 {
		usage()
		return 2
	}

	entries, err := parse.File(args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, "logsift: invalid input")
		return 1
	}

	switch args[0] {
	case "count":
		fmt.Print(report.Counts(stats.Count(entries)))
	case "latency":
		fmt.Print(report.LatencySummary(stats.Latency(entries)))
	default:
		usage()
		return 2
	}
	return 0
}
