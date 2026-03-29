import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Shell from 'gi://Shell';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import * as DND from 'resource:///org/gnome/shell/ui/dnd.js';
import FolderManager from './folderManager.js';

export default class Dock {
    constructor() {
        this.container = new St.BoxLayout({
            name: 'ButiaDockContainer',
            reactive: true,
            track_hover: true
        });
        
        this.container.set_style_class_name('butia-dock-container');
        this.container.set_x_align(Clutter.ActorAlign.CENTER);
        this.container.set_y_align(Clutter.ActorAlign.END);

        let blurEffect = new Shell.BlurEffect({
            brightness: 0.60,
            sigma: 30,
            mode: Shell.BlurMode.BACKGROUND
        });
        this.container.add_effect(blurEffect);
        
        this._folderManager = new FolderManager();
        this._animationManager = null;
        this._appSystem = Shell.AppSystem.get_default();
        this._windowTracker = Meta.WindowTracker.get_default();
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.shell' });
    }

    populate() {
        this.container.remove_all_children();
        
        let favorites = this._settings.get_strv('favorite-apps');
        let running = this._appSystem.get_running();
        
        let appIds = new Set(favorites);
        running.forEach(app => appIds.add(app.get_id()));

        for (let appId of appIds) {
            let app = this._appSystem.lookup_app(appId);
            if (!app) continue;

            let iconActor = this._createAppIcon(app);
            this.container.add_child(iconActor);
        }
    }

    _createAppIcon(app) {
        let button = new St.Button({
            reactive: true,
            style_class: 'butia-dock-item'
        });
        
        button.set_pivot_point(0.5, 0.5);
        button.appId = app.get_id();
        button.app = app;

        // Visual layout for icon + dot
        let box = new St.BoxLayout({ vertical: true, x_align: Clutter.ActorAlign.CENTER });
        
        // Use app's texture
        let texture = app.create_icon_texture(64);
        box.add_child(texture);
        
        // Indicator dot
        let dot = new St.Widget({
            style_class: 'butia-app-indicator',
            width: 4, height: 4
        });
        
        // Initial state logic
        this._updateIndicator(app, dot);
        box.add_child(dot);
        
        button.set_child(box);

        button.connect('clicked', () => {
            app.activate();
            this._animationManager.playLaunchAnimation(button);
            // Animation triggers would go here
        });

        // DND Implementation
        button.handleDragOver = (source, actor, x, y, time) => {
            if (source === button) return DND.DragMotionResult.NO_DROP;
            return DND.DragMotionResult.MOVE_DROP;
        };

        button.acceptDrop = (source, actor, x, y, time) => {
            if (source === button) return false;
            let folderName = `Folder_${source.appId}_${button.appId}`;
            this._folderManager.createFolder(folderName, [source.appId, button.appId]);
            return true;
        };

        DND.makeDraggable(button, { restoreOnSuccess: true });
        
        return button;
    }

    _updateIndicator(app, dotWidget) {
        let state = app.get_state();
        if (state === Shell.AppState.RUNNING) {
            let focusApp = this._windowTracker.focus_app;
            if (focusApp && focusApp.get_id() === app.get_id()) {
                dotWidget.set_style_class_name('butia-app-indicator butia-app-focused');
            } else {
                dotWidget.set_style_class_name('butia-app-indicator butia-app-running');
            }
        } else {
            dotWidget.set_style_class_name('butia-app-indicator butia-app-stopped');
        }
    }
}
