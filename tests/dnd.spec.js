describe('Drag and Drop Manager', () => {
    let DockModule;
    let DndMock;

    beforeAll(async () => {
        DockModule = await globalThis.loadModuleForTest('dock.js');
        DndMock = await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gnome-shell-ui-dnd.js');
    });

    it('should initialize icons as draggable', () => {
        let dock = new DockModule.default();
        dock.populate();
        let firstChild = dock.container.get_children()[0];
        
        // Assert that makeDraggable was called
        expect(firstChild._isDraggable).toBeTruthy();
    });

    it('should implement handleDragOver on dock items', () => {
        let dock = new DockModule.default();
        dock.populate();
        let target = dock.container.get_children()[0];
        let source = dock.container.get_children()[1];
        
        // Dragging source over target
        let result = target.handleDragOver(source, null, 0, 0, 0);
        expect(result).toBe(DndMock.DragMotionResult.MOVE_DROP);
    });

    it('should accept drops and initiate folder creation', () => {
        let dock = new DockModule.default();
        dock.populate();
        
        let target = dock.container.get_children()[0];
        let source = dock.container.get_children()[1];
        
        // When dropped, it should return true
        let accepted = target.acceptDrop(source, null, 0, 0, 0);
        expect(accepted).toBeTruthy();
    });
});
