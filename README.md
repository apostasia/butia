# Butiá - Advanced GNOME Shell Dock

**Butiá** (`butia@apostasia.github.com`) is a high-performance, Wayland-only dock  designed specifically for modern GNOME Shell environments (versions 49, 50, and above).

Built entirely on ECMAScript Modules (ESM), it intercepts the GNOME compositor's paint cycle to inject hardware-accelerated visual transformations and organic physics. The result is a premium, lag-free user experience that seamlessly integrates with the Linux desktop.

---

## 🚀 Core Architecture & Technologies

The engine is built strictly for modern GNOME, discarding legacy paradigms to ensure absolute stability:

* **Wayland-Native & Pure ESM:** Completely removes legacy X11 dependencies and nested session flags. The extension is built on modern GNOME Shell architectural standards, ensuring forward compatibility with the Mutter compositor.
* **Singleton Engine Pattern:** Manages instances per monitor efficiently, intercepting events at the `global.stage` (level 0) to ensure continuous and precise mouse coordinate tracking, regardless of which window is in focus.
* **Zero-Leak Lifecycle:** Implements aggressive and defensive memory management. 
  * Every `Clutter.Clone` instantiated for rendering is tracked.
  * Every D-Bus signal and global stage event is explicitly disconnected during the `disable()` phase.
  * This prevents memory leaks and ensures the GNOME Shell remains stable across multiple enable/disable cycles.
* **Frame Hook Rendering:** Utilizes `Meta.later_add` with a `BEFORE_REDRAW` priority. This guarantees that all positional and scale calculations occur milliseconds before the GPU draws the frame, effectively eliminating input lag and visual stuttering.

---

## 🧮 Physics Engine & Motion Design

Butiá does not rely on simple CSS transitions. It uses a reactive rendering loop based on continuous mathematical functions to create organic inertia and dynamic magnification.

### Gaussian Magnification
We reject linear scaling in favor of a Normal Distribution function. The scale of each icon is calculated dynamically based on cursor proximity:

* **Base Size:** 64px (dynamically adjustable via auto-scaling algorithm).
* **Maximum Scale:** 134.4px (2.1x magnification).
* **Sigma (Standard Deviation):** Strictly set to 115px. This defines the width and smoothness of the magnification wave.
* **Algorithm:** `Scale = Base + (Max - Base) * e^(-(Mouse_X - Icon_X)^2 / (2 * Sigma^2))`

### Organic Inertia (LERP)
To ensure UI elements do not instantly teleport but instead float and settle naturally, we employ Linear Interpolation:

* **LERP Factor:** Strictly set to 0.20.
* **Behavior:** This guarantees that an icon reaches its target scale in approximately 22 frames (on a 120Hz display), mimicking the physical weight and resistance of real objects.

---

## 🎨 UI & Interaction Design

* **Glassmorphism Rendering:** Utilizes direct texture buffer manipulation. It creates a reactive glass floor via `Clutter.Clone` (180-degree X-axis rotation) and applies dual-filtering Gaussian blur shaders for deep, translucent background aesthetics.
* **Responsive Auto-Scaling:** Automatically calculates the total width of the dock. If it exceeds 90% of the monitor's viewport, the engine actively recalculates the base icon size while maintaining a fixed 8px gap.
* **Folder Merging Logic:** Features Bounding Box Intersection detection. Hovering an icon over a target zone for 500ms (Dwell Time) triggers a cubic Bézier animation, safely signaling folder creation without accidental clustering.

---

## 🛠️ Development Setup (CachyOS / Arch Linux)

To contribute or test the extension in an isolated, safe environment without risking your primary desktop session:

1. **Install Core Dependencies:** Ensure you have the necessary introspection and compositor packages installed:
   ```bash
   sudo pacman -S base-devel gnome-shell mutter gjs gobject-introspection python-gobject glib2 dbus
   ```

2. **Compile GSettings Schemas:** Before running the extension, you must compile the schemas to manage dynamic state:
   ```bash
   glib-compile-schemas schemas/
   ```

3. **Launch Hot Reload Environment:** Start the extension in a sandboxed Wayland virtual monitor using the provided development script:
   ```bash
   ./run-butia-virtual.sh
   # Or manually: env GNOME_SHELL_EXTENSION_PATH=$PWD dbus-run-session -- gnome-shell --wayland --devkit --virtual-monitor 1280x720
   ```

---

## 📂 Project Structure

```text
/butia@apostasia.github.com
├── metadata.json      # Extension identity and GNOME 49/50+ targets
├── extension.js       # Core Engine, Physics Loop, and ESM Lifecycle
├── folderManager.js   # Popover logic and folder clustering
├── stylesheet.css     # Visual definitions, Blur parameters, and Shaders
├── icon.png           # Official Butiá asset
├── schemas/           # GSettings XML configurations
└── run-butia-virtual.sh # Wayland sandbox testing script
```

---

## 📄 License

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
