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

// Constructor
function File(path) {
    this.path = String(path);

    var parts = this.path.split('\\');

    this.filename = parts.pop();

    parts = this.filename.split('.');

    this.extension = (parts.length > 1) ? parts.pop() : '';
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

// export the class
module.exports = File;
