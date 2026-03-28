// tests/mocks/gi-gio.js
export default {
    Settings: class Settings {
        constructor(params) {
            this.schema_id = params.schema_id;
            this._store = {
                'folder-children': ['Utilities', 'Games']
            };
        }
        get_strv(key) {
            return this._store[key] || [];
        }
        set_strv(key, val) {
            this._store[key] = val;
        }
    }
};
