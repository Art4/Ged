/*
 * Ged
 * Copyright (C) 2011-2018  Artur Weigandt  https://wlabs.de/kontakt

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict'

const Store = require('electron-store');
const Utils = require('./window-utils.js');

var store = null;

/**
 * create electron-store with defaults
 */
function init() {
    if (store !== null) {
        return;
    }

    var configVersion = 1;

    store = new Store({
        name: 'config_'+configVersion,
    });

    if (store.size === 0) {
        store.store = {
            config_version: configVersion,
            app_version: Utils.getAppVersion(),
            max_revisions: 25,
            base_dir: 'H:\\Zeichnungen\\',
            default_file_type: 'pdf',
            always_foreground: true,
            opacity: 1,
            displayX: null,
            displayY: null,
        };
    }

    migrateConfigIfNeeded();
}

/**
 * migrate old config if needed
 */
function migrateConfigIfNeeded() {
    if (store.get('app_version', '') === Utils.getAppVersion()) {
        return;
    }

    // Migrate 2.0.0-alpha.1 to 2.0.0-alpha.2
    if (store.get('app_version', '') === '2.0.0-alpha.1') {
        // Delete dir_store_end
        store.delete('dir_store_end');

        // Update app_version
        store.set('app_version', '2.0.0-alpha.2');
    }

    migrateConfigIfNeeded();
}

/**
 * Constructor
 */
function Config() {}

/**
 * get a value by key
 */
Config.prototype.get = function(key, def) {
    init();
    return store.get(key, def);
}

/**
 * set a value by key
 */
Config.prototype.set = function(key, value) {
    init();
    store.set(key, value);
}

// export the class
module.exports = Config;
