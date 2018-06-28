/*
 * Ged
 * Copyright (C) 2018  Artur Weigandt  https://wlabs.de/kontakt

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
            dir_store_end: 395,
            base_dir: 'H:\\Zeichnungen\\',
            default_file_type: 'pdf',
            displayX: null,
            displayY: null,
        };
    }
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
