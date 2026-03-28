// tests/intellihide.spec.js
describe('Intellihide Manager', () => {
    let IntellihideManagerModule;
    let intellihideManager;
    let dockMock;

    beforeAll(async () => {
        IntellihideManagerModule = await globalThis.loadModuleForTest('intellihide.js');
        // Simple mock of a dock container with height/y
        dockMock = {
            container: {
                y: 1000,
                get_height: () => 80,
                get_width: () => 500,
                x: 700,
                _effect: { enabled: true } // Shell.BlurEffect mock
            }
        };
        intellihideManager = new IntellihideManagerModule.default(dockMock);
    });

    it('should detect overlap when a window intersects dock bounds', () => {
        let overlappingWindow = {
            get_frame_rect: () => ({ x: 0, y: 0, width: 1920, height: 1080 })
        };
        expect(intellihideManager.checkOverlap(overlappingWindow)).toBeTruthy();
    });

    it('should not detect overlap when a window is above dock', () => {
        let normalWindow = {
            get_frame_rect: () => ({ x: 0, y: 0, width: 1920, height: 800 })
        };
        expect(intellihideManager.checkOverlap(normalWindow)).toBe(false); // Should be false
    });

    it('should disable blur effect when hidden to save energy', () => {
        intellihideManager.hide();
        expect(dockMock.container._effect.enabled).toBe(false);
    });

    it('should enable blur effect when shown', () => {
        intellihideManager.show();
        expect(dockMock.container._effect.enabled).toBe(true);
    });
});
