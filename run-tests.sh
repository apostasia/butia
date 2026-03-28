#!/bin/bash
# Butiá - Script de teste em sessão Wayland aninhada isolada
EXTENSION_UUID="butia@apostasia.github.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

if [ ! -L "$EXTENSION_DIR" ] && [ ! -d "$EXTENSION_DIR" ]; then
    ln -sf "$PWD" "$EXTENSION_DIR"
    echo "[Butiá] Link simbólico criado: $EXTENSION_DIR -> $PWD"
fi

make compile-schemas

# Como o Wayland puro --nested não funciona nesta config, usamos a approach original
timeout 5 dbus-run-session -- bash -c "
    gsettings set org.gnome.shell enabled-extensions \"['$EXTENSION_UUID']\"
    gnome-shell --wayland --devkit --virtual-monitor 1280x720 --mode=user 2>&1
" || true
