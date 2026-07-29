#include "veclab/vector.h"

#include <math.h>

double vl_dot(const vl_vec *a, const vl_vec *b)
{
    double s = 0.0;
    size_t i;

    for (i = 0; i < a->n && i < b->n; i++)
        s += a->v[i] * b->v[i];

    return s;
}

double vl_norm(const vl_vec *a)
{
    return sqrt(vl_dot(a, a));
}
