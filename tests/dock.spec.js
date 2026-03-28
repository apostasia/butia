// tests/dock.spec.js
describe('Butia Dock', () => {
    let DockModule;
    let ShellMock;
    let MetaMock;
    let Dock;

    beforeAll(async () => {
        DockModule = await globalThis.loadModuleForTest('dock.js');
        ShellMock = await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gi-shell.js');
        MetaMock = await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gi-meta.js');
        Dock = DockModule.default;
    });

    it('should exist', () => {
        expect(Dock).toBeDefined();
    });

    it('should create a BoxLayout container', () => {
        let dock = new Dock();
        expect(dock.container).toBeDefined();
        expect(dock.container.name).toBe('ButiaDockContainer');
    });

    it('should apply the BlurEffect for Glassmorphism', () => {
        let dock = new Dock();
        expect(dock.container._effect).toBeDefined();
        expect(dock.container._effect.mode).toBe(0); // BACKGROUND
    });

    it('should populate with real apps from AppSystem and Favorites', () => {
        let dock = new Dock();
        dock.populate();
        
        let children = dock.container.get_children();
        expect(children.length).toBeGreaterThan(0);
        
        let firstIcon = children[0];
        let box = firstIcon.get_children()[0];
        let dot = box.get_children()[1];
        
        expect(dot._style_class).toBe('butia-app-indicator butia-app-stopped');
    });

    it('should update indicator to focused when app is running and focused', () => {
        let dock = new Dock();
        
        // Mock that terminal is focused on the singleton
        MetaMock.default.WindowTracker.get_default().focus_app = {
            get_id: () => 'org.gnome.Terminal.desktop'
        };
        
        // Re-inject mock for app system logic inside this specific dock instance
        dock._appSystem.lookup_app = (id) => ({
            get_id: () => id,
            get_name: () => id,
            get_state: () => (id === 'org.gnome.Terminal.desktop' ? ShellMock.default.AppState.RUNNING : ShellMock.default.AppState.STOPPED),
            create_icon_texture: (size) => ({ width: size, height: size }),
            activate: () => {}
        });

        dock.populate();
        
        let terminalBtn = dock.container.get_children().find(btn => btn.appId === 'org.gnome.Terminal.desktop');
        let box = terminalBtn.get_children()[0];
        let dot = box.get_children()[1];

        expect(dot._style_class).toBe('butia-app-indicator butia-app-focused');
        
        // Reset singleton
        MetaMock.default.WindowTracker.get_default().focus_app = null;
    });
});
