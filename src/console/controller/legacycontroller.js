/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://wlabs.de/kontakt

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

const revisionStore = new Array(
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
);

// Constructor
function LegacyController(config, fs, ipcRenderer, Logger) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;
    this.logger = Logger.scope('LegacyController');

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
        .action((draft, options, command) => {
            var mode = 'o';

            if (options.inFolder) {
                mode = 'i';
            } else if (options.in3dFolder) {
                mode = 'e';
            } else if (options.searchIn3dFolder) {
                mode = 'a';
            }

            this.logger.info(mode, draft, options);
            this.executeCommand(draft, options, commander.output, mode);
        });
};

LegacyController.prototype.executeCommand = function(draft, options, output, mode) {
    if (! draft) {
        this.logger.info('empty input');
        output.destroy('Warte auf Eingabe...');
        return;
    }

    var input = new StringInput(draft);

    // Abort, if invalid identifier provided
    if (input.getIdentifier() === null)
    {
        this.logger.info('invalid identifier');
        output.destroy('Ungültige Zeichnungsnummer');
        return;
    }

    this.draftpool.findDraftByIdentifier(input.getIdentifier())
        .then((draft) => {
            var revision = this.getOrGuessRevision(input, draft);

            // Call LegacyKernel
            this.logger.debug('draft:', draft);
            this.logger.debug('revision:', revision);
            this.logger.debug('mode:', mode);
            this.kernel.handleInput(input, output, draft, mode, revision);
        })
        .catch((err) => {
            // Abort, if draft not found
            this.logger.info('draft not found', err);
            output.destroy(input.getIdentifier() + ' wurde nicht gefunden');
        });
};

LegacyController.prototype.getOrGuessRevision = function(input, draft) {
    let guessedRevision = input.getRevision();

    if (guessedRevision !== null) {
        return guessedRevision;
    }

    let fileType = input.getType();

    if (fileType === null) {
        fileType = this.config.get('default_file_type', 'pdf');
    }

    let biggestRevisionIndex = 0;
    let foundRevisionIndex = 0;

    draft.getFiles().forEach((f) => {
        if (f.getRevision() === null) {
            return;
        }

        if (f.getExtension().toLowerCase() !== fileType) {
            return;
        }

        foundRevisionIndex = revisionStore.findIndex((element) => element === f.getRevision());

        if (foundRevisionIndex === -1) {
            return;
        }

        if (foundRevisionIndex > biggestRevisionIndex) {
            biggestRevisionIndex = foundRevisionIndex;
        }
    });

    return revisionStore[biggestRevisionIndex];
};

// export the class
module.exports = LegacyController;
