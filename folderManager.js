import Gio from 'gi://Gio';
import St from 'gi://St';
import Shell from 'gi://Shell';
import Clutter from 'gi://Clutter';

export default class FolderManager {
    constructor() {
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.app-folders' });
    }

    getAppFolders() {
        return this._settings.get_strv('folder-children');
    }

    createFolder(name, apps) {
        let current = this.getAppFolders();
        if (!current.includes(name)) {
            current.push(name);
            this._settings.set_strv('folder-children', current);
            
            // In a real environment, we'd also create the sub-schema for this folder's 'apps' array
        }
    }

    createExpandedView(folderName, appsList, appSystem) {
        // Deep blur background covering the whole screen
        let overlay = new St.Widget({
            style_class: 'butia-folder-overlay',
            reactive: true,
            x_expand: true,
            y_expand: true
        });

        let blurEffect = new Shell.BlurEffect({
            brightness: 0.40,
            sigma: 60, // Much stronger blur than the dock
            mode: Shell.BlurMode.BACKGROUND
        });
        overlay.add_effect(blurEffect);

        // Click outside the grid to close
        overlay.connect('button-release-event', () => {
            this._closeExpandedView(overlay);
            return Clutter.EVENT_STOP;
        });

        // The scrollable area (horizontal pagination like iOS)
        let scrollView = new St.ScrollView({
            style_class: 'butia-folder-scroll',
            x_expand: true, y_expand: true
        });
        
        let gridContainer = new St.BoxLayout({
            vertical: false, // Horizontal pagination
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'butia-folder-grid'
        });

        // Populate with real apps from the folder
        if (appsList && appSystem) {
            appsList.forEach(appId => {
                let app = appSystem.lookup_app(appId);
                if (app) {
                    let iconBtn = this._createFolderItem(app, overlay);
                    gridContainer.add_child(iconBtn);
                }
            });
        }

        scrollView.add_actor(gridContainer);
        overlay.add_child(scrollView);

        return overlay;
    }

    _createFolderItem(app, overlayRef) {
        let button = new St.Button({
            reactive: true,
            style_class: 'butia-dock-item butia-folder-item'
        });

        let texture = app.create_icon_texture(96); // Larger icons in folder view
        button.set_child(texture);

        button.connect('clicked', () => {
            app.activate();
            this._closeExpandedView(overlayRef);
        });

        return button;
    }

    _closeExpandedView(overlay) {
        // In reality, we'd animate opacity to 0 here before destroying
        overlay.destroy();
    }
}
