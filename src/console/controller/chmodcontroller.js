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

const Draftpool = require('../draftpool.js');
const LegacyKernel = require('../legacykernel.js');
const StringInput = require('../stringinput.js');

// Constructor
function ChmodController(config, fs, ipcRenderer) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));

    this.kernel = new LegacyKernel(this.config, this.fs, this.ipcRenderer);
}

// class methods
ChmodController.prototype.register = function(commander) {
    commander
        .command('chmod [draft]')
        .description('change read-write permission of a specific draft file')
        .option('--read-only', 'Set the draft to read-only')
        .option('--read-write', 'Set the draft to read-write')
        .action((draft, command) => {
            var mode = 's';

            if (command.readWrite) {
                mode = 'f';
            }

            this.executeCommand(draft, command, commander.output, mode);
        });
};

ChmodController.prototype.executeCommand = function(draft, command, output, mode) {
    if (! draft) {
        output.destroy('Warte auf Eingabe...');
        return;
    }

    var input = new StringInput(draft);

    // Abort, if invalid identifier provided
    if (input.getIdentifier() === null)
    {
        output.destroy('Ungültige Zeichnungsnummer');
        return;
    }

    this.draftpool.findDraftByIdentifier(input.getIdentifier())
        .then((draft) => {
            // Call LegacyKernel
            this.kernel.handleInput(input, output, draft, mode);
        })
        .catch((err) => {
            // Abort, if draft not found
            output.destroy(input.getIdentifier() + ' wurde nicht gefunden');
        });
};

// export the class
module.exports = ChmodController;
