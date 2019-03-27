/*
 * Ged
 * Copyright (C) 2011-2019  Artur Weigandt  https://wlabs.de/kontakt

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
'use strict';

const Store = require('electron-store');
const Utils = require('./window-utils.js');
const compareVersions = require('compare-versions');

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
            installed_at: new Date().toISOString(),
            base_dir: 'H:\\Zeichnungen\\',
            default_file_type: 'pdf',
            always_foreground: true,
            autolaunch: true,
            opacity: 1,
            displayX: null,
            displayY: null,
            skip_taskbar: true,
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

    // Migrate 2.0.0-alpha.2
    if (compareVersions(store.get('app_version', ''), '2.0.0-alpha.2') === -1) {
        // Delete dir_store_end
        store.delete('dir_store_end');

        // Update app_version
        store.set('app_version', '2.0.0-alpha.2');
    }

    // Migrate to 2.0.0-beta.3
    if (compareVersions(store.get('app_version', ''), '2.0.0-beta.3') === -1) {
        // Delete max_revisions
        store.delete('max_revisions');

        // Set date of release v2.0.0-beta.1 as installDate
        var installDate = new Date('2018-07-13T12:00:00+0200');
        store.set('installed_at', installDate.toISOString());

        // Update app_version
        store.set('app_version', '2.0.0-beta.3');
    }

    // Migrate to 2.0.0-beta.5
    if (compareVersions(store.get('app_version', ''), '2.0.0-beta.5') === -1) {
        store.set('autolaunch', false);

        // Update app_version
        store.set('app_version', '2.0.0-beta.5');
    }

    // Migrate to 2.4.0
    if (compareVersions(store.get('app_version', ''), '2.4.0') === -1) {
        store.set('skip_taskbar', true);

        // Update app_version
        store.set('app_version', '2.4.0');
    }

    store.set('app_version', Utils.getAppVersion());
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
};

/**
 * set a value by key
 */
Config.prototype.set = function(key, value) {
    init();
    store.set(key, value);
};

// export the class
module.exports = Config;
