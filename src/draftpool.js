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

const Draft = require('./draft.js');
const File = require('./file.js');

// Constructor
function Draftpool(fs, path) {
    this.fs = fs;
    this.path = String(path);
}

// class methods
Draftpool.prototype.findDraftByString = function(identifier) {
    if (! String(identifier).match(/^\d{5}$/)) {
        return null;
    }

    var path = this.path + this.generateSubfolderNameFromIdentifier(identifier);
    var prev = false;
    var next = false;
    var newestFile = null;
    var nearestFile = null;
    var files = new Array();

    var i = 0;
    var dirfiles = this.fs.readdirSync(path);

    while (i < dirfiles.length && next === false) {
        var filename = dirfiles[i];
        i++;

        // ingnore directories
        // var stats = fs.statSync(main_dir + file);
        //
        // if (stats.isDirectory()) {
        //     continue;
        // }

        var fileBase = filename.slice(0, 5);

        if (fileBase < identifier) {
            prev = filename;
        }
        else if (fileBase === identifier) {
            newestFile = new File(path + '\\' + filename);
            files.push(newestFile);
        }
        else {
            next = filename;
        }
    }

    // define nearest file
    if (newestFile !== null) {
        nearestFile = newestFile;
    }
    else if (next !== false) {
        nearestFile = new File(path + '\\' + next);
    }
    else if (prev !== false) {
        nearestFile = new File(path + '\\' + prev);
    }

    return new Draft(identifier, files, nearestFile);
};

/**
 * Generates the subfolder name from a identifier
 *
 * 12345 => Z.Nr.12000-12499
 *
 * @param string identifier
 * @return string
 */
Draftpool.prototype.generateSubfolderNameFromIdentifier = function (identifier) {
    var end1 = (identifier.slice(2,3) < 5) ? '000' : '500';
    var end2 = (identifier.slice(2,3) < 5) ? '499' : '999';
    var begin = identifier.slice(0,2);

    return 'Z.Nr.' + begin + end1 + '-' + begin + end2;
}

// export the class
module.exports = Draftpool;
