VERSION := $(shell cat VERSION)

build:
	go build -ldflags "-X main.version=$(VERSION)" -o logsift ./cmd/logsift

clean:
	rm -f logsift

.PHONY: build clean
