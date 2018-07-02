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

const Response = require('./response.js');
const Request = require('./request.js');
const LegacyKernel = require('./legacykernel.js');

// Constructor
function Kernel(options) {
    this.kernel = new LegacyKernel(options);
}

// class methods
Kernel.prototype.handleInputStringSync = function(inputString) {
    return this.handleRequestSync(
        Request.createFromString(inputString)
    );
};

Kernel.prototype.handleRequestSync = function(request) {
    return this.kernel.handleRequestSync(request);
};

Kernel.prototype.handleRequest = function(request, cb) {
    this.kernel.handleRequest(request, cb);
};

// export the class
module.exports = Kernel;
