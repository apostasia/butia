#!/bin/bash
env GNOME_SHELL_EXTENSION_PATH=$PWD dbus-run-session -- gnome-shell --wayland --devkit --virtual-monitor 1280x720
