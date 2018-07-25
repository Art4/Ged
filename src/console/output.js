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

const { Writable } = require('stream');

// Constructor
class Output extends Writable {
    constructor(options) {
        super(options);
    }

    _write(chunk) {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        this.emit('data', chunk);
    }

    end(chunk, encoding, cb) {
        super.end(chunk, encoding, cb);
        if (! this._writableState.destroyed) {
            this.emit('ended');
        }
    }

    writeLine(chunk) {
        this.write(chunk+"\n");
    }
}

// export the class
module.exports = Output;
