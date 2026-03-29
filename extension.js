import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Gio from 'gi://Gio';
import Dock from './dock.js';
import AnimationManager from './animationManager.js';
import TrashManager from './trash.js';
import IntellihideManager from './intellihide.js';

export default class Butia extends Extension {
    constructor(metadata) {
        super(metadata);
        this._docks = [];
        this._animationManager = null;
        this._trashManager = null;
        this._intellihideManager = null;
        this._startupId = 0;
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.shell.extensions.butia' });
    }

    enable() {
        console.debug(`[Butiá] Inicializando (Wayland/ESM)...`);

        if (Main.layoutManager._startingUp) {
            this._startupId = Main.layoutManager.connect('startup-complete', () => {
                this._initializeUI();
            });
        } else {
            this._initializeUI();
        }
    }

    _initializeUI() {
        if (this._docks.length > 0) return;

        // Hide default Dash
        if (Main.sessionMode.hasDash && Main.overview.dash) {
            Main.overview.dash.hide();
        }

        this._animationManager = new AnimationManager();
        this._trashManager = new TrashManager();

        let multiMonitorMode = this._settings.get_string('multi-monitor');
        let monitors = Main.layoutManager.monitors;
        
        let targetMonitors = (multiMonitorMode === 'all') 
            ? monitors 
            : [Main.layoutManager.primaryMonitor];

        targetMonitors.forEach((monitor, index) => {
            let dock = new Dock();
            dock._animationManager = this._animationManager;
            dock.populate();
            
            if (index === 0) {
                dock.container.add_child(this._trashManager.getActor());
            }

            let children = dock.container.get_children();
            for(let i=0; i<children.length; i++) {
                this._animationManager.setupHoverAnimation(children[i]);
            }

            Main.layoutManager.addChrome(dock.container);
            
            let natWidth = dock.container.get_preferred_width(-1)[1];
            let natHeight = dock.container.get_preferred_height(-1)[1];
            
            dock.container.set_position(
                monitor.x + Math.floor((monitor.width - natWidth) / 2),
                monitor.y + monitor.height - natHeight - 24
            );

            this._docks.push(dock);
        });

        // Initialize Intellihide for the first dock
        if (this._docks.length > 0) {
            this._intellihideManager = new IntellihideManager(this._docks[0]);
        }
    }

    disable() {
        console.debug(`[Butiá] Desativando e executando limpeza profunda...`);

        if (this._startupId) {
            Main.layoutManager.disconnect(this._startupId);
            this._startupId = 0;
        }

        if (this._trashManager) {
            this._trashManager.destroy();
            this._trashManager = null;
        }

        if (this._intellihideManager) {
            this._intellihideManager.destroy();
            this._intellihideManager = null;
        }

        this._docks.forEach(dock => {
            Main.layoutManager.removeChrome(dock.container);
            dock.container.destroy();
        });
        this._docks = [];
        this._animationManager = null;

        // Restore default Dash
        if (Main.sessionMode.hasDash && Main.overview.dash) {
            Main.overview.dash.show();
        }
    }
}
