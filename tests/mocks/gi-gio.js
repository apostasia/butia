class Settings {
    constructor(params) {
        this.schema_id = params.schema_id;
        this._store = {
            'folder-children': ['Utilities', 'Games'],
            'favorite-apps': ['firefox.desktop', 'org.gnome.Terminal.desktop'],
            'launch-animation': 'zoom'
        };
    }
    get_strv(key) { return this._store[key] || []; }
    set_strv(key, val) { this._store[key] = val; }
    get_string(key) { return this._store[key] || ''; }
    set_string(key, val) { this._store[key] = val; }
    connect() {}
    disconnect() {}
}

export const File = {
    new_for_uri: (uri) => ({
        query_exists: () => true,
        monitor_directory: () => ({
            connect: (sig, cb) => {
                let id = 1;
                return id;
            },
            cancel: () => {}
        }),
        enumerate_children_async: async () => ({
            next_files_async: async () => [{
                get_name: () => 'trashed_item.txt'
            }],
            close_async: async () => {}
        })
    })
};

export const FileMonitorEvent = {
    CHANGED: 0,
    DELETED: 1
};

export default { Settings };
