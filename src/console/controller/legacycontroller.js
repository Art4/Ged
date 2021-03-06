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
function LegacyController(config, fs, ipcRenderer) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));

    this.kernel = new LegacyKernel(this.config, this.fs, this.ipcRenderer);
}

// class methods
LegacyController.prototype.register = function(commander) {
    commander
        .command('open [draft]')
        .description('find and open a specific draft file')
        .option('--in-folder', 'Open the folder that contains the draft')
        .option('--in-3d-folder', 'Open the 3D folder of the draft')
        .option('--search-in-3d-folder', 'Search also in 3D folder for the draft')
        .action((draft, command) => {
            var mode = 'o';

            if (command.inFolder) {
                mode = 'i';
            } else if (command.in3dFolder) {
                mode = 'e';
            } else if (command.searchIn3dFolder) {
                mode = 'a';
            }
            this.executeCommand(draft, command, commander.output, mode);
        });
};

LegacyController.prototype.executeCommand = function(draft, command, output, mode) {
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
module.exports = LegacyController;
