#include "veclab/stats.h"

double vl_mean(const vl_vec *a)
{
    double s = 0.0;
    size_t i;

    if (a->n == 0)
        return 0.0;

    for (i = 0; i < a->n; i++)
        s += a->v[i];

    return s / (double)a->n;
}
