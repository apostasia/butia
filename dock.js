import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Shell from 'gi://Shell';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as DND from 'resource:///org/gnome/shell/ui/dnd.js';
import FolderManager from './folderManager.js';
import NotificationManager from './notificationManager.js';

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
        this._notificationManager = new NotificationManager();
        this._animationManager = null;
        this._appSystem = Shell.AppSystem.get_default();
        this._windowTracker = Meta.WindowTracker.get_default();
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.shell' });
        this._appFolders = this._folderManager.getAppFolders();
        this._overlayActive = false;
        this._jiggleTimeout = null;
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

        // Container for icon + dot + badge
        let mainBox = new St.BoxLayout({ vertical: true, x_align: Clutter.ActorAlign.CENTER });
        
        // Icon container (to position badge absolutely)
        let iconBox = new St.BoxLayout({ vertical: false });
        
        let texture = app.create_icon_texture(64);
        iconBox.add_child(texture);
        
        // Badge
        let badge = new St.Widget({
            style_class: 'butia-app-badge',
            width: 18, height: 18,
            visible: false
        });
        this._updateBadge(app.get_id(), badge);
        
        // Position badge in top-right corner
        badge.set_position(48, -4);
        iconBox.add_child(badge);
        
        mainBox.add_child(iconBox);
        
        // Indicator dot
        let dot = new St.Widget({
            style_class: 'butia-app-indicator',
            width: 4, height: 4
        });
        
        this._updateIndicator(app, dot);
        mainBox.add_child(dot);
        
        button.set_child(mainBox);

        // Long press for Jiggle Mode
        let longPressTimer = null;
        button.connect('button-press-event', () => {
            longPressTimer = setTimeout(() => {
                this._startJiggleMode();
            }, 800);
        });
        button.connect('button-release-event', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });
        
        button.connect('clicked', () => {
            this._stopJiggleMode();
            
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            if (this._isFolder(app.get_id())) {
                this._openFolderOverlay(app.get_id());
            } else {
                app.activate();
                if (this._animationManager) {
                    this._animationManager.playLaunchAnimation(button);
                }
            }
        });

        button.handleDragOver = (source, actor, x, y, time) => {
            if (source === button) return DND.DragMotionResult.NO_DROP;
            return DND.DragMotionResult.MOVE_DROP;
        };

        button.acceptDrop = (source, actor, x, y, time) => {
            if (source === button) return false;
            let folderName = `Folder_${source.appId}_${button.appId}`;
            this._folderManager.createFolder(folderName, [source.appId, button.appId]);
            this._appFolders = this._folderManager.getAppFolders();
            return true;
        };

        DND.makeDraggable(button, { restoreOnSuccess: true });
        
        return button;
    }

    _updateBadge(appId, badgeWidget) {
        let count = this._notificationManager.getBadgeCount(appId);
        if (count > 0) {
            badgeWidget.visible = true;
            badgeWidget.label = count > 99 ? '99+' : count.toString();
        } else {
            badgeWidget.visible = false;
        }
    }

    _isFolder(appId) {
        return this._appFolders.some(f => f.includes(appId) || appId.includes(f));
    }

    _openFolderOverlay(folderName) {
        if (this._overlayActive) return;
        this._overlayActive = true;

        let folderApps = ['firefox.desktop', 'terminal.desktop'];
        let overlay = this._folderManager.createExpandedView(folderName, folderApps, this._appSystem);

        Main.layoutManager.addChrome(overlay);
        overlay.set_position(0, 0);
        
        this._currentOverlay = overlay;
        
        overlay.connect('button-release-event', () => {
            this._closeFolderOverlay();
            return Clutter.EVENT_STOP;
        });
    }

    _closeFolderOverlay() {
        if (this._currentOverlay) {
            Main.layoutManager.removeChrome(this._currentOverlay);
            this._currentOverlay.destroy();
            this._currentOverlay = null;
            this._overlayActive = false;
        }
    }

    _startJiggleMode() {
        let children = this.container.get_children();
        let dockItems = children.filter(c => c.appId);
        if (this._animationManager) {
            this._animationManager.setupJiggleMode(dockItems);
            this._jiggleTimeout = setTimeout(() => {
                this._stopJiggleMode();
            }, 5000);
        }
    }

    _stopJiggleMode() {
        if (this._jiggleTimeout) {
            clearTimeout(this._jiggleTimeout);
            this._jiggleTimeout = null;
        }
        let children = this.container.get_children();
        let dockItems = children.filter(c => c.appId);
        if (this._animationManager) {
            this._animationManager.stopJiggleMode(dockItems);
        }
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
