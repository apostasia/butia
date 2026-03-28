// tests/mocks/gnome-shell-ui-main.js
export const layoutManager = {
    _startingUp: false,
    primaryMonitor: {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
    },
    monitors: [{x: 0, y: 0, width: 1920, height: 1080}],
    addChrome: () => {},
    removeChrome: () => {},
    connect: () => 1,
    disconnect: () => {}
};

export const panel = {
    statusArea: {}
};
