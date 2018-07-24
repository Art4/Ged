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

function analyseQuery(query) {
    var raw = query.split(' ');
    var argv = [];

    if (! raw[1]) {
        return ['open', raw[0]];
    }

    switch (raw[1]) {
        case 'o':
            return ['open', raw[0]];
            break;
        case 'e':
        case '3d':
            return ['open', raw[0], '--in-3d-folder'];
            break;
        case 'i':
            return ['open', raw[0], '--in-folder'];
            break;
        case '+':
        case 'a':
            return ['open', raw[0], '--search-in-3d-folder'];
            break;
        case 's':
            return ['chmod', raw[0], '--read-only'];
            break;
        case 'f':
            return ['chmod', raw[0], '--read-write'];
            break;
        case 'c':
            return ['clean', raw[0]];
            break;
        default:
            return [raw[1], raw[0]];
            break;
    }
}

// Constructor
function SearchInput(query) {
    this.query = String(query);
    this.argv = ['node', 'ged'];

    var argv = analyseQuery(this.query);

    for (var i = 0; i < argv.length; i++) {
        if (argv[i] !== '') {
            this.argv.push(argv[i]);
        }
    }
}

// class methods
SearchInput.prototype.getQuery = function() {
    return this.query;
};

SearchInput.prototype.getArgv = function() {
    return this.argv;
};

// export the class
module.exports = SearchInput;
