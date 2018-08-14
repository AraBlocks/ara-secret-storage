OS ?= $(shell uname)
RM ?= $(shell which rm)
CWD ?= $(shell pwd)
NPM ?= $(shell which npm)
BUILD ?= $(CWD)/build
PREFIX ?= /usr/local
TARGET ?= ass

.PHONY: default install uninstall clean

default: build

build: node_modules
	./scripts/package.sh

node_modules: package.json

package.json:
	$(NPM) install

ifeq (Linux, $(OS))
install: build
	install $(BUILD)/linux/$(TARGET) $(PREFIX)/bin
else ifeq (Darwin, $(OS))
install: build
	install $(BUILD)/macos/$(TARGET) $(PREFIX)/bin
else
install: build
	$(error "Error: $(OS) is not supported")
endif

ifeq (Linux, $(OS))
uninstall:
	if test -f $(PREFIX)/bin/$(TARGET); then $(RM) $(PREFIX)/bin/$(TARGET); fi
else ifeq (Darwin, $(OS))
uninstall:
	if test -f $(PREFIX)/bin/$(TARGET); then $(RM) $(PREFIX)/bin/$(TARGET); fi
else
uninstall:
	$(error "Error: $(OS) is not supported")
endif

clean:
	$(RM) -rf $(BUILD)
