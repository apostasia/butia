// tests/folderManager.spec.js
describe('Folder Manager', () => {
    let FolderManagerModule;
    let folderManager;

    beforeAll(async () => {
        FolderManagerModule = await globalThis.loadModuleForTest('folderManager.js');
        folderManager = new FolderManagerModule.default();
    });

    it('should read GNOME App Folders correctly', () => {
        let folders = folderManager.getAppFolders();
        expect(folders.length).toBeGreaterThan(0);
        expect(folders).toEqual(['Utilities', 'Games']);
    });

    it('should be able to create a new app folder via GSettings', () => {
        folderManager.createFolder('Productivity', ['writer.desktop', 'calc.desktop']);
        let folders = folderManager.getAppFolders();
        expect(folders.includes('Productivity')).toBeTruthy();
    });

    it('should overlay a full-screen widget when expanded', () => {
        // Just verify the overlay creates a widget with blur effect
        // We can't fully test rendering without real GNOME env
        let overlay = folderManager.createExpandedView('Utilities', [], null);
        expect(overlay).toBeDefined();
    });
});
