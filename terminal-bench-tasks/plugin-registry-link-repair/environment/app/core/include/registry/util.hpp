#pragma once

#include <cctype>
#include <string>

namespace registry {

/* Lowercase a string and strip leading/trailing whitespace. Registry
 * keys and CLI commands are normalized with this before use. */
std::string normalize(const std::string &s)
{
    std::size_t b = 0;
    std::size_t e = s.size();

    while (b < e && std::isspace(static_cast<unsigned char>(s[b])))
        b++;
    while (e > b && std::isspace(static_cast<unsigned char>(s[e - 1])))
        e--;

    std::string out;
    out.reserve(e - b);
    for (std::size_t i = b; i < e; i++)
        out.push_back(static_cast<char>(
            std::tolower(static_cast<unsigned char>(s[i]))));
    return out;
}

} // namespace registry
