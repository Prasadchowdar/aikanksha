import argparse
import sys

from csvlite import __version__
from csvlite.parser import read_rows
from csvlite.stats import summarize


def main(argv=None):
    parser = argparse.ArgumentParser(prog="csvlite")
    parser.add_argument(
        "--version", action="version", version=f"csvlite {__version__}"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_stats = sub.add_parser("stats", help="summarize a numeric CSV column")
    p_stats.add_argument("file")
    p_stats.add_argument("--col", required=True)

    args = parser.parse_args(argv)

    if args.command == "stats":
        try:
            rows = read_rows(args.file)
        except OSError:
            print("csvlite: cannot read file", file=sys.stderr)
            return 1
        try:
            result = summarize(rows, args.col)
        except KeyError:
            print(f"csvlite: no such column: {args.col}", file=sys.stderr)
            return 1
        except ValueError as exc:
            print(f"csvlite: invalid number: {exc.args[0]}", file=sys.stderr)
            return 1
        print(f"count = {result['count']}")
        print(f"mean = {result['mean']:.3f}")
        print(f"min = {result['min']:.3f}")
        print(f"max = {result['max']:.3f}")
        return 0

    return 2
