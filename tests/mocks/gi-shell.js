// tests/mocks/gi-shell.js
export default {
    BlurMode: {
        BACKGROUND: 0,
        ACTOR: 1
    },
    BlurEffect: class BlurEffect {
        constructor(params) {
            this.brightness = params.brightness;
            this.sigma = params.sigma;
            this.mode = params.mode;
        }
    },
    AppState: {
        STOPPED: 0,
        STARTING: 1,
        RUNNING: 2
    },
    AppSystem: {
        get_default: () => ({
            _running: [],
            _signals: {},
            connect: function(sig, cb) {
                this._signals[sig] = cb;
                return 1;
            },
            disconnect: () => {},
            get_running: function() { return this._running; },
            lookup_app: function(id) {
                return {
                    get_id: () => id,
                    get_name: () => id,
                    get_state: () => 0,
                    create_icon_texture: (size) => ({ width: size, height: size }),
                    activate: () => {}
                };
            }
        })
    }
};
