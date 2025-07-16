/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://weigandtlabs.de/kontakt

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

// Constructor
function StringInput(query) {
    this.query = String(query);
    this.identifier = null;
    this.revision = null;
    this.type = null;

    // Format 12345[-R0][.dft]
    var regex = /^(\d{5})(-R[0-9a-z]{1})?(\.[a-z]{1,3})?$/i;
    var results = regex.exec(this.query);

    if (results) {
        this.identifier = results[1];
        this.revision = (results[2]) ? results[2].slice(2) : null;
        this.type = (results[3]) ? results[3].slice(1) : null;

        return;
    }

    // Format 12345[/0][/3][.dft]
    var regex = /^(\d{5})(\/[0-9a-z]{1})?(\/[0-9a-z]{1})?(\.[a-z]{1,3})?$/i;
    var results = regex.exec(this.query);

    if (results) {
        this.identifier = results[1];
        this.revision = (results[2]) ? results[2].slice(1) : null;
        // results[3] Blattformat wird ignoriert
        this.type = (results[4]) ? results[4].slice(1) : null;
    }
}

// class methods
StringInput.prototype.getQuery = function() {
    return this.query;
};

StringInput.prototype.getIdentifier = function() {
    return this.identifier;
};

StringInput.prototype.getRevision = function() {
    return this.revision;
};

StringInput.prototype.getType = function() {
    return this.type;
};

// export the class
module.exports = StringInput;
