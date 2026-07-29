add_library(regsitry_core STATIC
    src/registry.cpp
)

target_include_directories(registry_core PUBLIC
    include
    "${CMAKE_BINARY_DIR}/generated"
)
