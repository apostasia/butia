import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ButiaPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Inicializa as configurações definidas no schema (org.gnome.shell.extensions.butia)
        const settings = this.getSettings();

        // Cria a página principal de preferências
        const page = new Adw.PreferencesPage();
        window.add(page);

        // Cria o grupo de configurações
        const group = new Adw.PreferencesGroup({
            title: 'Configurações Visuais e Comportamentais',
            description: 'Ajuste o comportamento do dock Butiá.'
        });
        page.add(group);

        // --- Opção: Animação de Lançamento ---
        const animationModel = new Gtk.StringList();
        animationModel.append('Zoom (Expansão do ícone)');
        animationModel.append('Glow (Brilho pulsante)');

        const animationRow = new Adw.ComboRow({
            title: 'Animação de Lançamento',
            subtitle: 'Efeito visual exibido ao clicar em um aplicativo',
            model: animationModel
        });

        // Valores mapeados no schema (gschema.xml: "zoom" ou "glow")
        const animationMap = ['zoom', 'glow'];
        
        // Carrega o valor inicial
        let currentAnim = settings.get_string('launch-animation');
        let initialAnimIndex = animationMap.indexOf(currentAnim);
        if (initialAnimIndex !== -1) {
            animationRow.set_selected(initialAnimIndex);
        }

        // Sincroniza UI -> GSettings
        animationRow.connect('notify::selected', () => {
            let idx = animationRow.get_selected();
            if (idx >= 0 && idx < animationMap.length) {
                settings.set_string('launch-animation', animationMap[idx]);
            }
        });
        
        // Sincroniza GSettings -> UI (útil se for alterado via dconf-editor simultaneamente)
        settings.connect('changed::launch-animation', () => {
            let newVal = settings.get_string('launch-animation');
            let idx = animationMap.indexOf(newVal);
            if (idx !== -1 && animationRow.get_selected() !== idx) {
                animationRow.set_selected(idx);
            }
        });

        group.add(animationRow);

        // --- Opção: Comportamento Multi-Monitor ---
        const monitorModel = new Gtk.StringList();
        monitorModel.append('Apenas Monitor Primário');
        monitorModel.append('Em Todos os Monitores');

        const monitorRow = new Adw.ComboRow({
            title: 'Exibição Multi-Monitor',
            subtitle: 'Onde o dock Butiá deve ser renderizado',
            model: monitorModel
        });

        // Valores mapeados no schema (gschema.xml: "primary" ou "all")
        const monitorMap = ['primary', 'all'];

        let currentMonitor = settings.get_string('multi-monitor');
        let initialMonitorIndex = monitorMap.indexOf(currentMonitor);
        if (initialMonitorIndex !== -1) {
            monitorRow.set_selected(initialMonitorIndex);
        }

        monitorRow.connect('notify::selected', () => {
            let idx = monitorRow.get_selected();
            if (idx >= 0 && idx < monitorMap.length) {
                settings.set_string('multi-monitor', monitorMap[idx]);
            }
        });

        settings.connect('changed::multi-monitor', () => {
            let newVal = settings.get_string('multi-monitor');
            let idx = monitorMap.indexOf(newVal);
            if (idx !== -1 && monitorRow.get_selected() !== idx) {
                monitorRow.set_selected(idx);
            }
        });

        group.add(monitorRow);
    }
}
