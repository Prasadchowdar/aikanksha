#pragma once

#include <map>
#include <string>
#include <vector>

#include "registry/plugin.hpp"

namespace registry {

class Registry {
public:
    static Registry &instance();

    void add(const PluginInfo &info);
    std::vector<PluginInfo> list() const;

private:
    std::map<std::string, PluginInfo> plugins_;
};

/* Constructing an AutoRegister adds the plugin to the global registry.
 * Plugin translation units create one at namespace scope so that plugins
 * register themselves when their objects are initialized. */
struct AutoRegister {
    explicit AutoRegister(const PluginInfo &info);
};

} // namespace registry
