#ifndef VECLAB_VECTOR_H
#define VECLAB_VECTOR_H

#include <stddef.h>

#define VL_MAX 1024

typedef struct {
    double v[VL_MAX];
    size_t n;
} vl_vec;

double vl_dot(const vl_vec *a, const vl_vec *b);
double vl_norm(const vl_vec *a);

#endif /* VECLAB_VECTOR_H */
