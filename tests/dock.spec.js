// tests/dock.spec.js
describe('Butia Dock', () => {
    let DockModule;
    let Dock;

    beforeAll(async () => {
        // Load the module substituting imports
        DockModule = await globalThis.loadModuleForTest('dock.js');
        Dock = DockModule.default;
    });

    it('should exist', () => {
        expect(Dock).toBeDefined();
    });

    it('should create a BoxLayout container', () => {
        let dock = new Dock();
        expect(dock.container).toBeDefined();
        // Since it's a mock, we can check properties we assigned
        expect(dock.container.name).toBe('ButiaDockContainer');
    });

    it('should apply the BlurEffect for Glassmorphism', () => {
        let dock = new Dock();
        expect(dock.container._effect).toBeDefined();
        expect(dock.container._effect.mode).toBe(0); // Shell.BlurMode.BACKGROUND
    });

    it('should populate with mock icons initially (testing population logic)', () => {
        let dock = new Dock();
        dock.populate();
        expect(dock.container.get_children().length).toBeGreaterThan(0);
    });
});
