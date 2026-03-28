// tests/animationManager.spec.js
describe('Animation Manager', () => {
    let AnimationManagerModule;
    let StMock;
    let ClutterMock;
    let animationManager;

    beforeAll(async () => {
        AnimationManagerModule = await globalThis.loadModuleForTest('animationManager.js');
        StMock = (await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gi-st.js')).default;
        ClutterMock = (await import('file://' + globalThis.ABS_TEST_DIR + '/mocks/gi-clutter.js')).default;
        animationManager = new AnimationManagerModule.default();
    });

    it('should attach hover transition to an actor', () => {
        let actor = new StMock.Widget();
        spyOn(actor, 'set_scale');
        
        animationManager.setupHoverAnimation(actor);
        actor.emit_hover_enter = actor._hoverEnterCb;
        actor.emit_hover_leave = actor._hoverLeaveCb;

        actor.emit_hover_enter();
        expect(actor.scale_x).toBe(1.3);
        expect(actor.scale_y).toBe(1.3);

        actor.emit_hover_leave();
        expect(actor.scale_x).toBe(1.0);
        expect(actor.scale_y).toBe(1.0);
    });

    it('should setup the actor pivot point to center (0.5, 0.5)', () => {
        let actor = new StMock.Widget();
        animationManager.setupHoverAnimation(actor);
        expect(actor.pivot_x).toBe(0.5);
        expect(actor.pivot_y).toBe(0.5);
    });

    it('should setup Jiggle Mode for editing', () => {
        let dockItems = [new StMock.Widget(), new StMock.Widget()];
        animationManager.setupJiggleMode(dockItems);
        expect(dockItems[0]._style_class).toBe('butia-dock-item butia-jiggle');
    });

    it('should disable Jiggle Mode', () => {
        let dockItems = [new StMock.Widget(), new StMock.Widget()];
        animationManager.setupJiggleMode(dockItems);
        animationManager.stopJiggleMode(dockItems);
        expect(dockItems[0]._style_class).toBe('butia-dock-item');
    });
});
