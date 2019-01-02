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

const Path = require('path');

// Constructor
function File(path) {
    this.path = String(path).replace(/\\|\//g, Path.sep);

    var parts = this.path.split(Path.sep);

    // could be 12345.tif, 12345-R1.dft or 12345-R3_layout.stp
    this.filename = parts.pop();

    parts = this.filename.split('.');

    this.extension = (parts.length > 1 && parts[0] !== '') ? parts.pop() : '';

    this.revision = null;

    if (this.filename.match(/^\d{5}-R[0-9a-z]+/i)) {
        this.revision = this.filename.slice(7, 8);
    }
}

// class methods
File.prototype.getAbsolutePath = function() {
    return this.path;
};

File.prototype.getName = function() {
    return this.filename;
};

File.prototype.getExtension = function() {
    return this.extension;
};

File.prototype.getRevision = function() {
    return this.revision;
};

// export the class
module.exports = File;
