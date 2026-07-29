#ifndef VECLAB_INTERNAL_H
#define VECLAB_INTERNAL_H

#include "veclab/vector.h"

/* Read two whitespace-separated rows of doubles from the file at `path`
 * into `a` and `b`. Both rows must be non-empty and the same length.
 *
 * Returns 0 on success and a nonzero value on any error (unreadable
 * file, malformed number, empty row, row too long, or length mismatch).
 */
int vl_read_pairs(const char *path, vl_vec *a, vl_vec *b);

#endif /* VECLAB_INTERNAL_H */
