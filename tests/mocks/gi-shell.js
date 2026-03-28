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
    AppSystem: {
        get_default: () => ({
            get_running: () => [],
            lookup_app: (id) => ({
                get_name: () => id,
                get_state: () => 0
            })
        })
    }
};
