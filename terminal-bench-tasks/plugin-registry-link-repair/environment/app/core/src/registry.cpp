#include "registry/registry.hpp"

#include "registry/util.hpp"

namespace registry {

Registry &Registry::instance()
{
    static Registry r;
    return r;
}

void Registry::add(const PluginInfo &info)
{
    PluginInfo p = info;
    p.name = normalize(p.name);
    plugins_[p.name] = p;
}

std::vector<PluginInfo> Registry::list() const
{
    std::vector<PluginInfo> out;
    out.reserve(plugins_.size());
    for (const auto &kv : plugins_)
        out.push_back(kv.second);
    return out;
}

AutoRegister::AutoRegister(const PluginInfo &info)
{
    Registry::instance().add(info);
}

} // namespace registry
