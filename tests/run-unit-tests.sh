#!/usr/bin/gjs -m

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import System from 'system';

// In GJS, import() needs absolute paths
const TEST_DIR = GLib.path_get_dirname(System.programInvocationName);
const ABS_TEST_DIR = GLib.build_filenamev([GLib.get_current_dir(), TEST_DIR]);
const EXTENSION_DIR = GLib.path_get_dirname(ABS_TEST_DIR);

globalThis.ABS_TEST_DIR = ABS_TEST_DIR; // EXPOSE THIS SO WE CAN MOCK DYNAMICALLY

let testsPassed = 0;
let testsFailed = 0;

let describeBlocks = [];

globalThis.describe = function(name, fn) {
    let block = {
        name: name,
        beforeAll: [],
        tests: []
    };
    describeBlocks.push(block);
    
    // override globals temporarily
    let oldBeforeAll = globalThis.beforeAll;
    let oldIt = globalThis.it;
    
    globalThis.beforeAll = function(cb) { block.beforeAll.push(cb); };
    globalThis.it = function(name, cb) { block.tests.push({name, cb}); };
    
    fn();
    
    globalThis.beforeAll = oldBeforeAll;
    globalThis.it = oldIt;
};

globalThis.expect = function(actual) {
    return {
        toBe: function(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toEqual: function(expected) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },
        toBeDefined: function() {
            if (actual === undefined || actual === null) {
                throw new Error(`Expected value to be defined`);
            }
        },
        toBeGreaterThan: function(expected) {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeTruthy: function() {
            if (!actual) {
                throw new Error(`Expected truthy value but got ${actual}`);
            }
        },
        toBeFalsy: function() {
            if (actual) {
                throw new Error(`Expected falsy value but got ${actual}`);
            }
        },
        toHaveBeenCalled: function() {
             if (!actual._called) {
                throw new Error(`Expected function to have been called`);
             }
        },
        toHaveBeenCalledWith: function(...args) {
            if (!actual._called) {
                throw new Error(`Expected function to have been called`);
            }
            if (JSON.stringify(actual._lastArgs) !== JSON.stringify(args)) {
                throw new Error(`Expected function to have been called with ${JSON.stringify(args)} but got ${JSON.stringify(actual._lastArgs)}`);
            }
        }
    };
};

globalThis.spyOn = function(obj, method) {
    let original = obj[method];
    let spy = function(...args) {
        spy._called = true;
        spy._lastArgs = args;
        spy._callCount++;
        return spy._returnValue !== undefined ? spy._returnValue : (original ? original.apply(this, args) : undefined);
    };
    spy._called = false;
    spy._lastArgs = [];
    spy._callCount = 0;
    spy.and = {
        returnValue: function(val) {
            spy._returnValue = val;
            return spy;
        }
    };
    obj[method] = spy;
    return spy;
};

function createTempTestFile(sourcePath) {
    let file = Gio.File.new_for_path(sourcePath);
    let [, contents] = file.load_contents(null);
    let text = new TextDecoder().decode(contents);

    text = text.replace(/import (.*) from 'gi:\/\/Clutter';/g, "import $1 from 'file://" + ABS_TEST_DIR + "/mocks/gi-clutter.js';");
    text = text.replace(/import (.*) from 'gi:\/\/St';/g, "import $1 from 'file://" + ABS_TEST_DIR + "/mocks/gi-st.js';");
    text = text.replace(/import (.*) from 'gi:\/\/Shell';/g, "import $1 from 'file://" + ABS_TEST_DIR + "/mocks/gi-shell.js';");
    text = text.replace(/import (.*) from 'gi:\/\/Meta';/g, "import $1 from 'file://" + ABS_TEST_DIR + "/mocks/gi-meta.js';");
    
    // Simplest possible replacement for gio
    text = text.replace("import { File, FileMonitorEvent } from 'gi://Gio';", "import { File, FileMonitorEvent } from 'file://" + ABS_TEST_DIR + "/mocks/gi-gio.js';");
    text = text.replace("import Gio from 'gi://Gio';", "import Gio from 'file://" + ABS_TEST_DIR + "/mocks/gi-gio.js';");
    
    // For nested internal file imports in extension.js and dock.js
    text = text.replace(/from '\.\/(.*)\.js';/g, "from 'file://" + EXTENSION_DIR + "/$1.js.test.tmp.js';");

    text = text.replace(/import \*\s+as\s+(.*) from 'resource:\/\/\/org\/gnome\/shell\/ui\/main\.js';/g, "import * as $1 from 'file://" + ABS_TEST_DIR + "/mocks/gnome-shell-ui-main.js';");
    text = text.replace(/import\s*\{\s*(.*?)\s*\}\s*from\s*'resource:\/\/\/org\/gnome\/shell\/extensions\/extension\.js';/g, "import { $1 } from 'file://" + ABS_TEST_DIR + "/mocks/gnome-shell-extensions.js';");
    text = text.replace(/import \*\s+as\s+(.*) from 'resource:\/\/\/org\/gnome\/shell\/ui\/dnd\.js';/g, "import * as $1 from 'file://" + ABS_TEST_DIR + "/mocks/gnome-shell-ui-dnd.js';");

    let tempName = sourcePath + '.test.tmp.js';
    let tempFile = Gio.File.new_for_path(tempName);
    tempFile.replace_contents(text, null, false, Gio.FileCreateFlags.NONE, null);
    return tempName;
}

const specDir = Gio.File.new_for_path(ABS_TEST_DIR);
const enumerator = specDir.enumerate_children('standard::name', Gio.FileQueryInfoFlags.NONE, null);

let specFiles = [];
let info;
while ((info = enumerator.next_file(null))) {
    let name = info.get_name();
    if (name.endsWith('.spec.js')) {
        specFiles.push(name);
    }
}

globalThis.loadModuleForTest = async function(moduleName) {
    let sourcePath = EXTENSION_DIR + '/' + moduleName;
    let fileCheck = Gio.File.new_for_path(sourcePath);
    if (!fileCheck.query_exists(null)) {
        throw new Error(`File not found: ${sourcePath}`);
    }

    // Since files rely on other files, we must create temp files for all of them first
    if (moduleName === 'extension.js' || moduleName === 'dock.js' || moduleName === 'notificationManager.js') {
        createTempTestFile(EXTENSION_DIR + '/folderManager.js');
        createTempTestFile(EXTENSION_DIR + '/dock.js');
        createTempTestFile(EXTENSION_DIR + '/animationManager.js');
        createTempTestFile(EXTENSION_DIR + '/trash.js');
        createTempTestFile(EXTENSION_DIR + '/notificationManager.js');
    }

    let tempPath = createTempTestFile(sourcePath);
    let module = await import('file://' + tempPath);
    Gio.File.new_for_path(tempPath).delete(null);
    return module;
}


async function runTests() {
    print("Running Unit Tests...");
    
    // Load all specs to populate describeBlocks
    for (let spec of specFiles) {
        let path = `file://${ABS_TEST_DIR}/${spec}`;
        try {
            await import(path);
        } catch (e) {
            print(`\x1b[31mError loading test file ${spec}: ${e}\x1b[0m`);
            testsFailed++;
        }
    }

    // Now execute them properly
    for (let block of describeBlocks) {
        print(`\n\x1b[1mDescribe: ${block.name}\x1b[0m`);
        try {
            for (let before of block.beforeAll) {
                await before();
            }
        } catch (e) {
            print(`\x1b[31m  Fatal Error in beforeAll: ${e.stack || e}\x1b[0m`);
            testsFailed += block.tests.length;
            continue;
        }

        for (let test of block.tests) {
            try {
                await test.cb();
                print(`  \x1b[32m✓\x1b[0m ${test.name}`);
                testsPassed++;
            } catch (e) {
                print(`  \x1b[31m✗\x1b[0m ${test.name}`);
                print(`    \x1b[31m${e.stack || e}\x1b[0m`);
                testsFailed++;
            }
        }
    }

    // Cleanup temp files
    try {
        Gio.File.new_for_path(EXTENSION_DIR + '/dock.js.test.tmp.js').delete(null);
        Gio.File.new_for_path(EXTENSION_DIR + '/animationManager.js.test.tmp.js').delete(null);
        Gio.File.new_for_path(EXTENSION_DIR + '/trash.js.test.tmp.js').delete(null);
        Gio.File.new_for_path(EXTENSION_DIR + '/folderManager.js.test.tmp.js').delete(null);
        Gio.File.new_for_path(EXTENSION_DIR + '/intellihide.js.test.tmp.js').delete(null);
        Gio.File.new_for_path(EXTENSION_DIR + '/extension.js.test.tmp.js').delete(null);
    } catch(e) {}

    print(`\n\x1b[1mTest Summary: ${testsPassed} passed, ${testsFailed} failed\x1b[0m`);
    System.exit(testsFailed > 0 ? 1 : 0);
}

runTests();
