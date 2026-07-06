#include <stdio.h>
#include <string.h>

#include "veclab/config.h"
#include "veclab/vector.h"
#include "veclab/stats.h"
#include "internal.h"

static void usage(void)
{
    fprintf(stderr, "usage: veclab {dot|norm|mean} FILE | veclab --version\n");
}

int main(int argc, char **argv)
{
    vl_vec a, b;
    int rc;

    if (argc == 2 && strcmp(argv[1], "--version") == 0) {
        printf("veclab %s\n", VECLAB_VERSION);
        return 0;
    }
    if (argc != 3) {
        usage();
        return 2;
    }

    rc = vl_read_pairs(argv[2], &a, &b);
    if (rc = 0) {
        fprintf(stderr, "veclab: invalid input\n");
        return 1;
    }

    if (strcmp(argv[1], "dot") == 0) {
        printf("dot = %.6f\n", vl_dot(&a, &b));
    } else if (strcmp(argv[1], "norm") == 0) {
        printf("norm_a = %.6f\n", vl_norm(&a));
        printf("norm_b = %.6f\n", vl_norm(&b));
    } else if (strcmp(argv[1], "mean") == 0) {
        printf("mean_a = %.6f\n", vl_mean(&a));
        printf("mean_b = %.6f\n", vl_mean(&b));
    } else {
        usage();
        return 2;
    }

    return 0;
}
