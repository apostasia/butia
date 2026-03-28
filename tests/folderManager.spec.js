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

    it('should overlay a ScrollView when expanded', () => {
        let overlay = folderManager.createExpandedView('Utilities');
        expect(overlay).toBeDefined();
        // Just checking it creates an actor
        expect(overlay.add_actor).toBeDefined();
    });
});
