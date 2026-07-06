def summarize(rows, col):
    """Summarize a numeric column.

    Raises KeyError if the column does not exist in the header, and
    ValueError (with the offending cell as the argument) if a value in
    the column is not a number.
    """
    values = []
    for row in rows:
        if col not in row or row[col] is None:
            raise KeyError(col)
        cell = row[col].strip()
        try:
            values.append(float(cell))
        except ValueError:
            raise ValueError(cell) from None

    if not values:
        raise KeyError(col)

    return {
        "count": len(values),
        "mean": sum(values) / len(values),
        "min": min(values),
        "max": max(values),
    }
