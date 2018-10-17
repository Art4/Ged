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
'use strict';

// Constructor
function StringInput(query) {
    this.query = String(query);
    this.identifier = null;
    this.revision = null;
    this.type = null;

    var regex = /^(\d+)(-R[0-9a-z]{1})?(\.[a-z]{1,3})?/i;
    var results = regex.exec(this.query);

    if (results && results[1].length === 5) {
        // Prevent inputs like '12345i'
        if (this.query.slice(5,6) === '-' || this.query.slice(5,6) === '.' || this.query.slice(5,6) === '') {
            this.identifier = results[1];
            this.revision = (results[2]) ? results[2].slice(2) : null;
            this.type = (results[3]) ? results[3].slice(1) : null;
        }
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
