# Butiá - Advanced GNOME Shell Dock

**Butiá** (`butia@apostasia.github.com`) is a premium, high-performance, Wayland-only dock extension designed specifically for modern GNOME Shell environments (versions 49, 50, and above).

Built entirely on **ECMAScript Modules (ESM)** and developed using **Test-Driven Development (TDD)**, it replaces the original GNOME Dash with an advanced dock featuring macOS aesthetics and iOS functionality.

---

## 🚀 Core Architecture & Features

The engine is built strictly for modern GNOME, discarding legacy paradigms to ensure absolute stability:

* **Wayland-Native & Pure ESM:** Completely removes legacy X11 dependencies. The extension is built on modern GNOME Shell architectural standards, ensuring forward compatibility with the Mutter compositor.
* **Glassmorphism UI:** Implements static Glassmorphism via `Shell.BlurEffect`. The background is a reactive translucent glass (Apple style) with 1px stroke borders and 24px rounded corners.
* **Intellihide Behavior:** The dock automatically hides when overlapping with windows, utilizing the `Meta.WindowTracker` signals (`size-changed` and `position-changed`).
* **Z-Axis Elevation & Animation:** Escales only the icon directly under the cursor (1.3x magnification) with a central pivot point (0.5, 0.5) and dynamic diffuse shadows.
* **iOS-Style App Folders:** Full integration with GNOME's native app folders (`org.gnome.desktop.app-folders`). Clicking a folder expands it into a full-screen view with deep background blur and horizontal pagination (EASE_OUT_QUINT snap physics).
* **Jiggle Mode:** Edit mode activated via an 800ms long press. Icons oscillate ($\pm 2^\circ$) with random delays for a natural, organic feel.
* **Trash Integration:** Fixed trash icon on the right side with real-time monitoring via `Gio.FileMonitor` (`trash://`), supporting asynchronous empty operations.
* **Customizable Preferences:** Native GTK4/Libadwaita configuration window (`prefs.js`) to choose Launch Animations (Zoom Launch or Glow Pulse) and Multi-Monitor behavior.

---

## 🧪 Test-Driven Development (TDD)

Butiá is developed with a strict TDD methodology. We use a custom, headless GJS test runner that executes Jasmine-style specs (`describe`, `it`, `expect`, `spyOn`).

### Running the Tests

To run the unit tests without launching a full GNOME Shell instance, simply execute:

```bash
make test
# or manually:
./tests/run-unit-tests.sh
```

Our test suite uses custom lightweight mocks for `gi://Clutter`, `gi://St`, `gi://Shell`, `gi://Meta`, and `gi://Gio` to ensure logic is verified rapidly and independently of the compositor's rendering cycle.

---

## 🛠️ Development Setup & Building

To contribute or test the extension:

1. **Install Core Dependencies:** Ensure you have the necessary introspection and compositor packages installed (example for Arch/CachyOS):
   ```bash
   sudo pacman -S base-devel gnome-shell mutter gjs gobject-introspection glib2 dbus
   ```

2. **Compile Schemas & Pack:**
   ```bash
   make all     # Compiles the GSettings schemas
   make pack    # Bundles the extension into a ZIP file using gnome-extensions CLI
   ```

3. **Install Locally:**
   ```bash
   make install # Copies the extension to ~/.local/share/gnome-shell/extensions/
   ```

4. **Launch Smoke Test Environment:** Start the extension in a nested Wayland session:
   ```bash
   ./run-tests.sh
   ```

---

## 📂 Project Structure

```text
/butia@apostasia.github.com
├── metadata.json       # Extension identity and GNOME 49/50+ targets
├── extension.js        # Core Extension Lifecycle (enable/disable)
├── dock.js             # St.BoxLayout and Glassmorphism rendering
├── animationManager.js # Hover transitions, Launch FX, and Jiggle Mode
├── intellihide.js      # Meta.WindowTracker overlap detection
├── folderManager.js    # GSettings org.gnome.desktop.app-folders integration
├── trash.js            # Gio.FileMonitor for trash:///
├── prefs.js            # GTK4/Libadwaita preferences window
├── stylesheet.css      # Visual definitions and animations
├── schemas/            # GSettings XML configurations
└── tests/              # TDD Specs and gi:// Mocks
```

---

## 📄 License

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
