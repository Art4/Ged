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
const FsUtils = require('../fs-utils.js');
const StringInput = require('../stringinput.js');

// Constructor
function CleanController(config, fs, ipcRenderer) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));
    this.fsutils = new FsUtils(this.fs);
}

// class methods
CleanController.prototype.register = function(commander) {
    commander
        .command('clean [draft]')
        .description('Remove unused and old files next to a draft')
        .option('--all-revisions', 'Check files of all revisions')
        .option('--only-previous-revision', 'Clean only files for the previous revision of the defined/latest revision')
        .action((draft, options, command) => {
            this.executeCommand(draft, options, commander.output);
        });
};

CleanController.prototype.executeCommand = function(draft, options, output) {
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
            // Call clean function for previous revision
            if (options.onlyPreviousRevision) {
                this.cleanPreviousRevisionOfDraft(draft, input, output);
            }
        })
        .catch((err) => {
            // Abort, if draft not found
            console.log(err);
            output.destroy(input.getIdentifier() + ' wurde nicht gefunden');
        });
};

// Datei Schreibschutz setzen und evtl. vorhandene PDF-Datei löschen
// since v1.0.5
CleanController.prototype.cleanPreviousRevisionOfDraft = function(draft, input, output)
{
    // Abbrechen, wenn keine Dateien gefunden wurden
    if (draft.getFiles().length === 0) {
        output.destroy('Keine Dateien zu ' + input.getIdentifier() + ' gefunden');
        return;
    }

    var nearest_file = draft.getNearestFile();
    var ignore_files = [];
    var writeprotect_files = [];
    var remove_files = [];

    var revision = nearest_file.getRevision();

    if(input.getRevision() !== null)
    {
        revision = input.getRevision();
    }

    // Vorherige Revision nehmen
    // FIXME Support für Buchstaben-Revisionen fehlt noch
    var prev_revision = (revision - 1).toString();

    // Files filtern, deren Revision der prev_revision entspricht
    const files = draft.getFiles().filter((f) => {
        if (f.getRevision() === revision && f.getExtension().toLowerCase() === 'dft') {
            nearest_file = f;
        }
        return (f.getRevision() === prev_revision)
    });

    files.forEach((f) => {
        if (f.getExtension().toLowerCase() === 'dft') {
            writeprotect_files.push(f);
        }
        else if (f.getExtension().toLowerCase() === 'dft') {
            ignore_files.push(f);
        }
        else if (f.getExtension().toLowerCase() === 'tif') {
            ignore_files.push(f);
        }
        else if (f.getExtension().toLowerCase() === 'tiff') {
            ignore_files.push(f);
        }
        else {
            remove_files.push(f);
        }
    });

    // DWG nicht löschen, wenn passende dft nicht existiert
    if (writeprotect_files.length === 0) {
        remove_files.forEach((f, i, o) => {
            if (f.getExtension().toLowerCase() === 'dwg') {
                writeprotect_files.push(f);
                o.splice(i, 1);
            }
        });
    }

    // Schreibschutz setzen
    writeprotect_files.forEach((f) => {
        // Schreibschutz setzen
        // Bugfix since v1.0.6
        this.fsutils.setFileWriteProtected(f.getAbsolutePath(), true);
    });

    // Dateien nach Rückfrage löschen
    remove_files.forEach((f) => {
        // Sicherheits-Abfrage, bevor eine Datei gelöscht wird
        if(confirm('Datei ' + f.getName() + ' wird entfernt?') === true)
        {
            this.fs.unlinkSync(f.getAbsolutePath());
        }
    });

    output.end(nearest_file.getName() + ' bereinigt');
}

// export the class
module.exports = CleanController;
