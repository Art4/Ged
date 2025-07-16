/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://weigandtlabs.de/kontakt

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
const FsUtils = require('../fs-utils.js');
const StringInput = require('../stringinput.js');

// Constructor
function ChmodController(config, fs, ipcRenderer) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));
    this.fsutils = new FsUtils(this.fs);
}

// class methods
ChmodController.prototype.register = function(commander) {
    commander
        .command('chmod [draft]')
        .description('change read-write permission of a specific draft file')
        .option('--read-only', 'Set the draft to read-only')
        .option('--read-write', 'Set the draft to read-write')
        .action((draft, options, command) => {
            this.executeCommand(draft, options, commander.output);
        });
};

ChmodController.prototype.executeCommand = function(draft, options, output) {
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
            // Schreibschutz zur Datei setzen/aufheben
            // since v1.0.4

            var writeProtected = true;
            if (options.readOnly === true) {
                writeProtected = true;
            } else if(options.readWrite) {
                writeProtected = false;
            }

            var file = null;
            var rev = input.getRevision();

            // First try to search for specified revision
            if (rev !== null) {
                draft.getFiles().forEach((f) => {
                    if (f.getExtension().toLowerCase() === 'dft') {
                        if (rev === f.getRevision()) {
                            file = f;
                        }
                    }
                });
            }

            // second try: iterate through all files
            if (file === null) {
                draft.getFiles().forEach((f) => {
                    if (f.getExtension().toLowerCase() === 'dft') {
                        if (rev === null && f.getRevision() === null) {
                            file = f;
                        } else if (rev === null && f.getRevision() >= 0) {
                            file = f;
                            rev = f.getRevision();
                        } else if (rev !== null && f.getRevision() > rev) {
                            file = f;
                            rev = f.getRevision();
                        }
                    }
                });
            }

            if (file === null) {
                // Open file in folder if no specific file was found
                this.ipcRenderer.send('openfileinfolder', draft.getNearestFile().getAbsolutePath());
                output.end('Index von ' + draft.getNearestFile().getName() + ' wird geöffnet');
                return;
            }

            this.fsutils.setFileWriteProtected(file.getAbsolutePath(), writeProtected);

            if (writeProtected) {
                output.end(file.getName() + ' ist schreibgesch&uuml;tzt');
            } else {
                output.end(file.getName() + ' ist beschreibbar');
            }
        })
        .catch((err) => {
            // Abort, if draft not found
            output.destroy(input.getIdentifier() + ' wurde nicht gefunden');
        });
};

// export the class
module.exports = ChmodController;
