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
const StringInput = require('../stringinput.js');

// Constructor
function ListController(config, fs, ipcRenderer) {
    this.config = config;
    this.fs = fs;
    this.ipcRenderer = ipcRenderer;

    this.draftpool = new Draftpool(this.fs, this.config.get('base_dir'));
}

// class methods
ListController.prototype.register = function(commander) {
    commander
        .command('list [draft]')
        .description('List filenames and foldernames that matches the draft number')
        .action((draft, options, command) => {
            this.executeCommand(draft, options, commander.output);
        });
};

ListController.prototype.executeCommand = function(draft, options, output) {
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
            this.listSearchMatchesOfDraft(draft, input, output);
        })
        .catch((err) => {
            // Abort, if draft not found
            console.log(err);
            output.destroy(input.getIdentifier() + ' wurde nicht gefunden');
        });
};

// Suchergebnisse auflisten
ListController.prototype.listSearchMatchesOfDraft = function(draft, input, output)
{
    // Abbrechen, wenn keine Dateien gefunden wurden
    if (draft.getFiles().length === 0) {
        output.destroy('Keine Dateien zu ' + input.getIdentifier() + ' gefunden');
        return;
    }

    console.log(draft);

    // Nichts anzeigen
    output.destroy(' ');
}

// export the class
module.exports = ListController;
