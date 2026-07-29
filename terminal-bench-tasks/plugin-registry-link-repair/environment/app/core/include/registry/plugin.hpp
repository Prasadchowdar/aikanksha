#pragma once

#include <string>

namespace registry {

struct PluginInfo {
    std::string name;
    std::string kind;
    std::uint32_t priority;
};

} // namespace registry
