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
    ScrollView: class ScrollView extends Clutter.Actor {
        constructor() { super(); }
        add_actor(actor) { this.add_child(actor); }
    }
};
