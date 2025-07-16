/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://wlabs.de/kontakt

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
const packageData = require('../package.json');
const compareVersions = require('compare-versions');

/** @type {Store} */
var store = new Store({
    name: 'config_0',
});

/**
 * migrate old config if needed
 *
 * @param {Config} config
 */
function migrateConfigIfNeeded(config) {
    if (config.get('app_version', '') === packageData.version) {
        return;
    }

    // Migrate 2.0.0-alpha.2
    if (compareVersions(config.get('app_version', '').toString(), '2.0.0-alpha.2') === -1) {
        // Delete dir_store_end
        config.delete('dir_store_end');

        // Update app_version
        config.set('app_version', '2.0.0-alpha.2');
    }

    // Migrate to 2.0.0-beta.3
    if (compareVersions(config.get('app_version', '').toString(), '2.0.0-beta.3') === -1) {
        // Delete max_revisions
        config.delete('max_revisions');

        // Set date of release v2.0.0-beta.1 as installDate
        var installDate = new Date('2018-07-13T12:00:00+0200');
        config.set('installed_at', installDate.toISOString());

        // Update app_version
        config.set('app_version', '2.0.0-beta.3');
    }

    // Migrate to 2.0.0-beta.5
    if (compareVersions(config.get('app_version', '').toString(), '2.0.0-beta.5') === -1) {
        config.set('autolaunch', false);

        // Update app_version
        config.set('app_version', '2.0.0-beta.5');
    }

    // Migrate to 2.4.0
    if (compareVersions(config.get('app_version', '').toString(), '2.4.0') === -1) {
        config.set('skip_taskbar', true);

        // Update app_version
        config.set('app_version', '2.4.0');
    }

    // Migrate to 2.10.0
    if (compareVersions(config.get('app_version', '').toString(), '2.10.0') === -1) {
        config.set('default_action', 'open');

        // Update app_version
        config.set('app_version', '2.10.0');
    }

    config.set('app_version', packageData.version);
}

/**
 * Constructor
 */
function Config() {
    var configVersion = 1;

    store = new Store({
        name: 'config_'+configVersion,
    });

    if (store.size === 0) {
        store.store = {
            config_version: configVersion,
            app_version: packageData.version,
            installed_at: new Date().toISOString(),
            base_dir: 'H:\\Zeichnungen\\',
            default_file_type: 'pdf',
            always_foreground: true,
            autolaunch: true,
            opacity: 1,
            displayX: null,
            displayY: null,
            skip_taskbar: true,
            default_action: 'open',
        };
    }

    migrateConfigIfNeeded(this);
}

/**
 * get a value by key
 *
 * @param {string} key
 * @param {string|boolean|number} def
 * @return {string|boolean|number}
 */
Config.prototype.get = function(key, def) {
    var value = store.get(key, def);

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }

    return def;
};

/**
 * set a value by key
 *
 * @param {string} key
 * @param {any} value
 */
Config.prototype.set = function(key, value) {
    store.set(key, value);
};

/**
 * delete a value by key
 *
 * @param {string} key
 */
Config.prototype.delete = function(key) {
    store.delete(key);
};

// export the class
module.exports = Config;
