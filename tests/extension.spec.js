describe('Butia Extension Class', () => {
    let ExtensionModule;
    let MainMock;
    let extension;

    beforeAll(async () => {
        ExtensionModule = await globalThis.loadModuleForTest('extension.js');
        MainMock = await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gnome-shell-ui-main.js');
        extension = new ExtensionModule.default({ uuid: 'butia@apostasia.github.com' });
    });

    it('should hide the default GNOME dash when enabled', () => {
        // Reset state
        MainMock.overview.dash._visible = true;
        
        extension.enable();
        // Since it calls _initializeUI
        expect(MainMock.overview.dash._visible).toBeFalsy();
    });

    it('should show the default GNOME dash when disabled', () => {
        extension.disable();
        expect(MainMock.overview.dash._visible).toBeTruthy();
    });
});
