add_executable(registry-cli
    src/main.cpp
)

target_link_libraries(registry-cli PRIVATE registry_plugins)
