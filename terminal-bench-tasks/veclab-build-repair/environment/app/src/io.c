#include "internal.h"

#include <stdio.h>
#include <stdlib.h>

static int read_row(FILE *f, vl_vec *out)
{
    char line[8192];
    char *p;
    char *end;

    if (!fgets(line, sizeof line, f))
        return -1;

    out->n = 0;
    p = line;
    for (;;) {
        while (*p == ' ' || *p == '\t' || *p == '\r' || *p == '\n')
            p++;
        if (*p == '\0')
            break;
        if (out->n >= VL_MAX) {
            fprintf(stderr, "veclab: row too long (%zu values max, got %d)\n",
                    (size_t)VL_MAX, out->n);
            return -1;
        }
        out->v[out->n] = strtod(p, &end);
        if (end == p)
            return -1;
        out->n++;
        p = end;
    }

    return (out->n == 0) ? -1 : 0;
}

size_t vl_read_pairs(const char *path, vl_vec *a, vl_vec *b)
{
    FILE *f = fopen(path, "r");

    if (!f)
        return 0;

    if (read_row(f, a) != 0 || read_row(f, b) != 0) {
        fclose(f);
        return 0;
    }
    fclose(f);

    if (a->n != b->n)
        return 0;

    return a->n;
}
