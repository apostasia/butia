import Gio from 'gi://Gio';
import St from 'gi://St';

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
            
            // In a real implementation we would also write the child schema for the specific folder
            // e.g. org.gnome.desktop.app-folders.folder:/org/gnome/desktop/app-folders/folders/Productivity/
            // this._folderSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.app-folders.folder', path: `...`});
            // this._folderSettings.set_strv('apps', apps);
        }
    }

    createExpandedView(folderName) {
        // Full screen blur overlay
        let overlay = new St.ScrollView();
        
        let container = new St.BoxLayout({
            name: 'FolderExpandedContainer'
        });
        
        // Populate container with icons from folder
        overlay.add_actor(container);
        
        return overlay;
    }
}
