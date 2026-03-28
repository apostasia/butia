import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import St from 'gi://St';

export default class ButiaEngine extends Extension {
    constructor(metadata) {
        super(metadata);
        // Pré-alocação de variáveis para evitar vazamentos e acionamentos do Garbage Collector
        this._stageEventId = null;
        this._laterId = 0;
        this._dockContainer = null;
        
        // Coordenadas em cache para o cálculo Gaussiano
        this._mouseX = 0;
        this._mouseY = 0;
    }

    enable() {
        console.debug(`[Butiá] Inicializando Engine (Wayland/ESM)...`);

        // 1. Criação do container principal (Dock)
        this._dockContainer = new St.BoxLayout({
            name: 'ButiaDockContainer',
            reactive: true,
            track_hover: true,
            style_class: 'butia-dock-container'
        });

        // Adiciona ao layout gerenciado pelo Mutter
        Main.layoutManager.addTopChrome(this._dockContainer);

        // 2. Interceptação de Eventos (Event Bubbling no Nível 0)
        // Captura o movimento do mouse globalmente para garantir precisão máxima
        this._stageEventId = global.stage.connect('captured-event', (actor, event) => {
            if (event.type() === Clutter.EventType.MOTION) {
                let [x, y] = event.get_coords();
                this._mouseX = x;
                this._mouseY = y;
            }
            // Retorna PROPAGATE para não bloquear o evento de chegar a outras janelas
            return Clutter.EVENT_PROPAGATE; 
        });

        // 3. Hook de Frame (BEFORE_REDRAW)
        // Garante que a física e interpolação ocorram milissegundos antes do render da GPU
        let laters = global.display.get_laters();
        this._laterId = laters.add(Meta.LaterType.BEFORE_REDRAW, () => {
            this._renderTick();
            return true;
        });

    }

    disable() {
        console.debug(`[Butiá] Desativando Engine e executando limpeza profunda...`);

        // 1. Remoção do Hook de Frame
        if (this._laterId !== 0) {
            global.display.get_laters().remove(this._laterId);
            this._laterId = 0;
        }


        // 2. Desconexão de Sinais Globais
        if (this._stageEventId) {
            global.stage.disconnect(this._stageEventId);
            this._stageEventId = null;
        }

        // 3. Destruição rigorosa dos atores visuais
        if (this._dockContainer) {
            if (Main.layoutManager.removeChrome) {
                Main.layoutManager.removeChrome(this._dockContainer);
            } else {
                // Compatibilidade dependendo da versão exata do Shell
                this._dockContainer.get_parent()?.remove_child(this._dockContainer);
            }
            this._dockContainer.destroy();
            this._dockContainer = null;
        }
    }

    _renderTick() {
        // Loop de física atrelado à taxa de atualização do monitor (ex: 120Hz/144Hz).
        // Aqui aplicaremos o LERP (0.20) e a Magnificação Gaussiana (Sigma 115).
        // Como o container ainda está vazio, deixamos a função inativa por enquanto.
    }
}
