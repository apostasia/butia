import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Dock from './dock.js';
import AnimationManager from './animationManager.js';

export default class ButiaEngine extends Extension {
    constructor(metadata) {
        super(metadata);
        this._dock = null;
        this._animationManager = null;
        this._startupId = 0;
    }

    enable() {
        console.debug(`[Butiá] Inicializando Engine (Wayland/ESM)...`);

        if (Main.layoutManager._startingUp) {
            this._startupId = Main.layoutManager.connect('startup-complete', () => {
                this._initializeUI();
            });
        } else {
            this._initializeUI();
        }
    }

    _initializeUI() {
        if (this._dock) return;

        this._animationManager = new AnimationManager();
        this._dock = new Dock();
        
        // Popula os mockups (Phase 2)
        this._dock.populate();
        
        // Aplica animações (Phase 3)
        let children = this._dock.container.get_children();
        for(let i=0; i<children.length; i++) {
            this._animationManager.setupHoverAnimation(children[i]);
        }

        // Adiciona na tela
        Main.layoutManager.addChrome(this._dock.container);

        let monitor = Main.layoutManager.primaryMonitor;
        if (monitor) {
            let natWidth = this._dock.container.get_preferred_width(-1)[1];
            let natHeight = this._dock.container.get_preferred_height(-1)[1];
            this._dock.container.set_position(
                monitor.x + Math.floor((monitor.width - natWidth) / 2),
                monitor.y + monitor.height - natHeight - 24
            );
        }
    }

    disable() {
        console.debug(`[Butiá] Desativando Engine e executando limpeza profunda...`);

        if (this._startupId) {
            Main.layoutManager.disconnect(this._startupId);
            this._startupId = 0;
        }

        if (this._dock) {
            Main.layoutManager.removeChrome(this._dock.container);
            this._dock.container.destroy();
            this._dock = null;
            this._animationManager = null;
        }
    }
}
