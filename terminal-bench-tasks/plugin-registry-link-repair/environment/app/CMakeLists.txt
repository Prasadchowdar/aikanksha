cmake_minimum_required(VERSION 4.2)

project(registry LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

configure_file(
    cmake/version.hpp.in
    "${CMAKE_BINARY_DIR}/generated/registry/version.hpp"
    @ONLY
)

add_subdirectory(core)
add_subdirectory(plugins)
add_subdirectory(cli)
