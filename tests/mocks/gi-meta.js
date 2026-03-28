// tests/mocks/gi-meta.js
const defaultTracker = {
    get_startup_sequences: () => [],
    focus_app: null,
    connect: () => 1,
    disconnect: () => {}
};

export default {
    LaterType: {
        BEFORE_REDRAW: 0
    },
    WindowTracker: {
        get_default: () => defaultTracker
    }
};
