import Clutter from './gi-clutter.js';

export default {
    BoxLayout: class BoxLayout extends Clutter.Actor {
        constructor(params = {}) {
            super();
            this.name = params.name;
            this.reactive = params.reactive;
            this.track_hover = params.track_hover;
            this._style_class = '';
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
        }
        set_style_class_name(name) { this._style_class = name; }
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
        constructor() { super(); }
        add_actor(actor) { this.add_child(actor); }
    }
};
