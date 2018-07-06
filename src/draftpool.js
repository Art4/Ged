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

const Draft = require('./draft.js');
const File = require('./file.js');

// Constructor
function Draftpool(fs, path) {
    this.fs = fs;
    this.path = String(path);
}

// class methods
Draftpool.prototype.findDraftByString = function(id) {
    if (! String(id).match(/^\d{5}$/)) {
        return null;
    }

    return new Draft(id, []);
};

// export the class
module.exports = Draftpool;
