// tests/mocks/gi-gio-file.js
export default {
    File: {
        new_for_uri: (uri) => ({
            query_exists: () => true,
            monitor_directory: () => ({
                connect: (sig, cb) => {
                    this._cb = cb;
                    return 1;
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
    },
    FileMonitorEvent: {
        CHANGED: 0,
        DELETED: 1
    }
};
