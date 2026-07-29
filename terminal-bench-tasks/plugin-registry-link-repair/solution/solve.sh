#!/bin/bash
# Oracle solution for plugin-registry-link-repair.
#
# Repairs the seven defects in the order the build surfaces them, then
# rebuilds from clean and exercises the documented CLI behavior.

set -euo pipefail

cd "${APP_DIR:-/app}"

# --- 1. cmake_minimum_required demands CMake 4.2, newer than any
#        installed toolchain. Lower it to a version the project needs.
sed -i 's/cmake_minimum_required(VERSION 4.2)/cmake_minimum_required(VERSION 3.22)/' CMakeLists.txt

# --- 2. core/CMakeLists.txt defines the library under a misspelled name
#        (regsitry_core) and then configures registry_core.
sed -i 's/add_library(regsitry_core STATIC/add_library(registry_core STATIC/' core/CMakeLists.txt

# --- 3. plugin.hpp uses std::uint32_t without including <cstdint>
#        (GCC 13 no longer provides it transitively).
sed -i 's|#include <string>|#include <cstdint>\n#include <string>|' core/include/registry/plugin.hpp

# --- 4. The plugins library never links registry_core, so it inherits
#        neither the include directories nor the core objects.
printf '\ntarget_link_libraries(registry_plugins PUBLIC registry_core)\n' >> plugins/CMakeLists.txt

# --- 5. project() declares no VERSION, so configure_file leaves
#        @PROJECT_VERSION_MAJOR@ and friends empty and the generated
#        header does not compile. VERSION (the file) says 1.4.2.
sed -i 's/project(registry LANGUAGES CXX)/project(registry VERSION 1.4.2 LANGUAGES CXX)/' CMakeLists.txt

# --- 6. util.hpp defines normalize() as a non-inline function in a
#        header included by two translation units -> multiple definition
#        at link time. Make it inline.
sed -i 's/^std::string normalize(const std::string &s)$/inline std::string normalize(const std::string \&s)/' core/include/registry/util.hpp

# --- 7. The plugins are self-registering static initializers inside a
#        static archive; nothing references their symbols, so the linker
#        never pulls the objects in and the registry stays empty at
#        runtime. Building them as an OBJECT library forces all plugin
#        objects onto the final link line.
sed -i 's/add_library(registry_plugins STATIC/add_library(registry_plugins OBJECT/' plugins/CMakeLists.txt

# --- Rebuild from clean and sanity-check the documented behavior.
rm -rf build
cmake -S . -B build
cmake --build build

./build/cli/registry-cli --version
./build/cli/registry-cli list
./build/cli/registry-cli count
