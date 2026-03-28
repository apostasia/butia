// tests/trash.spec.js
describe('Trash Manager', () => {
    let TrashManagerModule;
    let trashManager;
    let StMock;

    beforeAll(async () => {
        TrashManagerModule = await globalThis.loadModuleForTest('trash.js');
        StMock = (await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gi-st.js')).default;
        trashManager = new TrashManagerModule.default();
    });

    it('should create a trash bin actor', () => {
        let actor = trashManager.getActor();
        expect(actor).toBeDefined();
        expect(actor.name).toBe('ButiaTrashBin');
    });

    it('should setup Gio.FileMonitor on trash://', () => {
        // Our mock returns true for query_exists so it should setup the monitor
        expect(trashManager._monitor).toBeDefined();
    });

    it('should trigger checkAsync to update trash state', async () => {
        spyOn(trashManager, '_updateIcon');
        await trashManager._checkTrashStateAsync();
        expect(trashManager._updateIcon).toHaveBeenCalledWith(true); // Our mock says it has items
    });
});
