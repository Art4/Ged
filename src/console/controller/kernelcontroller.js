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

const Draftpool = require('../../draftpool.js');
const LegacyKernel = require('../../legacykernel.js');
const StringInput = require('../../stringinput.js');
const Response = require('../../response.js');

// Constructor
function KernelController(config, fs) {
    this.config = config;
    this.fs = fs;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));

    this.kernel = new LegacyKernel({config: this.config});
}

// class methods
KernelController.prototype.register = function(commander) {
    commander
        .command('open [draft]')
        .description('find and open a specific draft file')
        .action((draft, command) => {
            this.executeCommand(draft, command, commander.output);
        });
};

KernelController.prototype.executeCommand = function(draft, command, output) {
    if (! draft) {
        throw new Error('Warte auf Eingabe...');
    }

    var input = new StringInput(draft);

    // Abort, if no input provided
    if (input.getQuery() === '')
    {
        throw new Error('Warte auf Eingabe...');
    }

    // Abort, if invalid identifier provided
    if (input.getIdentifier() === null)
    {
        throw new Error('Ungültige Zeichnungsnummer');
    }

    this.draftpool.findDraftByIdentifier(input.getIdentifier())
        .then((draft) => {
            // Call LegacyKernel
            this.kernel.handleInput(input, draft)
                .then((response) => {
                    output.writeLine(response.getContent());
                });
        })
        .catch(() => {
            // Abort, if draft not found
            throw new Error(input.getIdentifier() + ' wurde nicht gefunden');

        });
};

// export the class
module.exports = KernelController;
