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
function Kernel() {
    this.kernel = new LegacyKernel();
}

// class methods
Kernel.prototype.handleInputString = function(inputString) {
    return this.handleRequest(
        Request.createFromString(inputString)
    );
};

Kernel.prototype.handleRequest = function(request) {
    return this.kernel.handleRequest(request);
};

// export the class
module.exports = Kernel;
