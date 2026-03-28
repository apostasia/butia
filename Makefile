# Minimal Makefile for compiling schemas and packing extension
EXTENSION_UUID ?= butia@apostasia.github.com
SCHEMAS_DIR = schemas

all: compile-schemas

compile-schemas:
	glib-compile-schemas $(SCHEMAS_DIR)

test:
	./tests/run-unit-tests.sh

install: compile-schemas
	mkdir -p ~/.local/share/gnome-shell/extensions/$(EXTENSION_UUID)
	cp -r * ~/.local/share/gnome-shell/extensions/$(EXTENSION_UUID)/

pack: compile-schemas
	gnome-extensions pack --force --extra-source=dock.js --extra-source=animationManager.js --extra-source=folderManager.js --extra-source=intellihide.js --extra-source=trash.js --extra-source=prefs.js --extra-source=tests/

clean:
	rm -f $(SCHEMAS_DIR)/gschemas.compiled
	rm -f butia@apostasia.github.com.shell-extension.zip

.PHONY: all compile-schemas test install pack clean
