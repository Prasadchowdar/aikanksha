import csv


def read_rows(path):
    """Read a CSV file with a header row into a list of dicts."""
    with open(path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)
