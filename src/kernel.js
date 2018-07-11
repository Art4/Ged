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

const fs = require('fs');
const Draftpool = require('./draftpool.js');
const Response = require('./response.js');
const Request = require('./request.js');
const StringInput = require('./stringinput.js');
const LegacyKernel = require('./legacykernel.js');

// Constructor
function Kernel(options) {
    this.config = options.config;
    this.draftpool = new Draftpool(fs, this.config.get('base_dir'));

    this.kernel = new LegacyKernel(options);
}

// class methods
Kernel.prototype.handleRequest = function(request) {
    return new Promise((resolve, reject) => {
        var input = new StringInput(request.getContent());

        // Abort, if no input provided
        if (input.getQuery() === '')
        {
            resolve(new Response('Warte auf Eingabe...', ''));
            return;
        }

        // Abort, if invalid identifier provided
        if (input.getIdentifier() === null)
        {
            resolve(new Response('Ungültige Zeichnungsnummer', input.getQuery()));
            return;
        }

        var draft = this.draftpool.findDraftByString(input.getIdentifier());

        // Abort, if draft not found
        if (draft === null)
        {
            resolve(new Response(input.getQuery() + ' wurde nicht gefunden', input.getQuery()));
            return;
        }

        resolve(this.kernel.handleInput(input, draft));
    });
};

// export the class
module.exports = Kernel;
