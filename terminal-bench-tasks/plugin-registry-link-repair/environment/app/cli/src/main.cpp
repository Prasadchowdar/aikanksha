#include <cstdio>
#include <string>

#include "registry/registry.hpp"
#include "registry/util.hpp"
#include "registry/version.hpp"

static void usage()
{
    std::fprintf(stderr, "usage: registry-cli {list|count|--version}\n");
}

int main(int argc, char **argv)
{
    if (argc != 2) {
        usage();
        return 2;
    }

    const std::string cmd = registry::normalize(argv[1]);

    if (cmd == "--version") {
        std::printf("registry %s\n", registry::kVersion);
        return 0;
    }
    if (cmd == "list") {
        for (const auto &p : registry::Registry::instance().list())
            std::printf("%s %s %u\n", p.name.c_str(), p.kind.c_str(),
                        p.priority);
        return 0;
    }
    if (cmd == "count") {
        std::printf("plugins: %zu\n",
                    registry::Registry::instance().list().size());
        return 0;
    }

    usage();
    return 2;
}
