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

/**
 * Constructor
 *
 * @param {string[]} argv
 */
function Input(argv) {
    this.argv = ['node', 'ged'];

    for (var i = 0; i < argv.length; i++) {
        this.argv.push(argv[i]);
    }
}

// class methods
Input.prototype.getArgv = function() {
    return this.argv;
};

// export the class
module.exports = Input;
