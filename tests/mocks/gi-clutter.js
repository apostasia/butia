// tests/mocks/gi-clutter.js
export default {
    ActorAlign: {
        CENTER: 0,
        START: 1,
        END: 2
    },
    EventType: {
        MOTION: 0
    },
    EVENT_PROPAGATE: false,
    EVENT_STOP: true,
    Actor: class Actor {
        constructor() {
            this._children = [];
            this.x = 0;
            this.y = 0;
            this.scale_x = 1.0;
            this.scale_y = 1.0;
        }
        add_child(child) { this._children.push(child); }
        get_children() { return this._children; }
        set_position(x, y) { this.x = x; this.y = y; }
        get_transformed_position() { return [this.x, this.y]; }
        get_width() { return 64; }
        get_height() { return 64; }
        set_scale(x, y) { this.scale_x = x; this.scale_y = y; }
        set_pivot_point(x, y) { this.pivot_x = x; this.pivot_y = y; }
        destroy() { this._destroyed = true; }
        remove_all_children() { this._children = []; }
        add_effect(effect) { this._effect = effect; }
        set_x_align(align) { this._x_align = align; }
        set_y_align(align) { this._y_align = align; }
    },
    PropertyTransition: class PropertyTransition {
        constructor(name) {
            this.name = name;
        }
        set_interval() {}
        set_duration() {}
        start() {}
    }
};
