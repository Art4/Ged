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

const { Input } = require('./console');

function analyseQuery(query) {
    var raw = query.split(' ');
    var argv = [];

    if (! raw[1]) {
        return ['open', raw[0]];
    }

    /*eslint no-unreachable: "off"*/

    switch (raw[1].toLowerCase()) {
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
        return ['clean', raw[0], '--only-previous-revision'];
        break;
    case 'l':
        return ['list', raw[0]];
        break;
    default:
        return [raw[1], raw[0]];
        break;
    }
}

// Class
class SearchInput extends Input {
    constructor(query) {
        query = String(query);
        var rawArgv = analyseQuery(query);
        var argv = [];

        for (var i = 0; i < rawArgv.length; i++) {
            if (rawArgv[i] !== '') {
                argv.push(rawArgv[i]);
            }
        }

        super(argv);
        this.query = query;
    }

    getQuery() {
        return this.query;
    }
}

// export the class
module.exports = SearchInput;
