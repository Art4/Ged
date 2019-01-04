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
        .action((draft, command) => {
            this.executeCommand(draft, command, commander.output);
        });
};

CleanController.prototype.executeCommand = function(draft, command, output) {
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
            if (command.onlyPreviousRevision) {
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
    // Zeichnungspfad bestimmen
    var main_dir = draft.get3DFolderPath().slice(0, -8);

    var file = draft.getNearestFile();
    var prev_revision_file = null;
    var prev_revision_pdffile = null;

    var revision = file.getRevision();

    if(input.getRevision() !== null)
    {
        revision = input.getRevision();
    }

    // Vorherige Revision nehmen
    var prev_revision = (revision - 1).toString();

    draft.getFiles().forEach((f) => {
        if (f.getRevision() === revision && f.getExtension().toLowerCase() === 'dft') {
            file = f;
        }
        else if (f.getRevision() === prev_revision && f.getExtension().toLowerCase() === 'dft') {
            prev_revision_file = f;
        }
        else if (f.getRevision() === prev_revision && f.getExtension().toLowerCase() === 'pdf') {
            prev_revision_pdffile = f;
        }
    });

    if (prev_revision_file !== null) {
        // Schreibschutz setzen
        // Bugfix since v1.0.6
        this.fsutils.setFileWriteProtected(prev_revision_file.getAbsolutePath(), true);
    }

    if (prev_revision_pdffile !== null) {
        // Sicherheits-Abfrage, bevor eine Datei gelöscht wird
        if(confirm('Datei ' + prev_revision_pdffile.getName() + ' wird entfernt?') === true)
        {
            // PDF-Datei löschen
            this.fs.unlinkSync(prev_revision_pdffile.getAbsolutePath());
        }
    }

    output.end(file.getName() + ' bereinigt');
}

// export the class
module.exports = CleanController;
