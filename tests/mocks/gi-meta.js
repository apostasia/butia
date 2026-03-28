// tests/mocks/gi-meta.js
export default {
    LaterType: {
        BEFORE_REDRAW: 0
    },
    WindowTracker: {
        get_default: () => ({
            get_startup_sequences: () => [],
            focus_app: null
        })
    }
};
