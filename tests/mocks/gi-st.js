import Clutter from './gi-clutter.js';

export default {
    BoxLayout: class BoxLayout extends Clutter.Actor {
        constructor(params = {}) {
            super();
            this.name = params.name;
            this.reactive = params.reactive;
            this.track_hover = params.track_hover;
            this._style_class = '';
            this.x_expand = params.x_expand || false;
            this.y_expand = params.y_expand || false;
        }
        set_style_class_name(name) { this._style_class = name; }
        get_preferred_width() { return [0, 100]; }
        get_preferred_height() { return [0, 80]; }
    },
    Widget: class Widget extends Clutter.Actor {
        constructor(params = {}) {
            super();
            this.name = params.name;
            this.style = params.style || '';
            this.width = params.width || 0;
            this.height = params.height || 0;
            this._style_class = '';
            this.x_expand = params.x_expand || false;
            this.y_expand = params.y_expand || false;
        }
        set_style_class_name(name) { this._style_class = name; }
        add_effect(effect) { this._effect = effect; }
    },
    Button: class Button extends Clutter.Actor {
        constructor(params = {}) {
            super();
            this.reactive = params.reactive;
            this._style_class = params.style_class || '';
            this._child = null;
            this._signals = {};
        }
        set_style_class_name(name) { this._style_class = name; }
        set_child(child) { this._child = child; this.add_child(child); }
        connect(sig, cb) { this._signals[sig] = cb; return 1; }
        emit(sig) { if (this._signals[sig]) this._signals[sig](); }
    },
    ScrollView: class ScrollView extends Clutter.Actor {
        constructor(params = {}) {
            super();
            this.x_expand = params.x_expand || false;
            this.y_expand = params.y_expand || false;
        }
        add_actor(actor) { this.add_child(actor); }
    }
};
