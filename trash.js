import { File, FileMonitorEvent } from 'gi://Gio';
import St from 'gi://St';

export default class TrashManager {
    constructor() {
        this.actor = new St.Widget({
            name: 'ButiaTrashBin',
            width: 64, height: 64
        });
        
        this._monitor = null;
        this._setupMonitor();
    }

    getActor() {
        return this.actor;
    }

    _setupMonitor() {
        let trashFile = File.new_for_uri('trash://');
        if (trashFile.query_exists(null)) {
            this._monitor = trashFile.monitor_directory(0, null);
            this._monitor.connect('changed', this._onTrashChanged.bind(this));
            // Check initial state
            this._checkTrashStateAsync();
        }
    }

    _onTrashChanged(monitor, file, otherFile, eventType) {
        if (eventType === FileMonitorEvent.CHANGED || eventType === FileMonitorEvent.DELETED) {
            this._checkTrashStateAsync();
        }
    }

    async _checkTrashStateAsync() {
        let trashFile = File.new_for_uri('trash://');
        let enumerator = await trashFile.enumerate_children_async('standard::name', 0, 0, null);
        let items = await enumerator.next_files_async(1, 0, null);
        
        let hasItems = items.length > 0;
        await enumerator.close_async(0, null);
        
        this._updateIcon(hasItems);
    }

    _updateIcon(hasItems) {
        // In reality we would set a full or empty trash icon
        this.actor.set_style_class_name(hasItems ? 'butia-trash-full' : 'butia-trash-empty');
    }

    destroy() {
        if (this._monitor) {
            this._monitor.cancel();
            this._monitor = null;
        }
        if (this.actor) {
            this.actor.destroy();
            this.actor = null;
        }
    }
}
