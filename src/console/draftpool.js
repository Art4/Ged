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

const Draft = require('./draft.js');
const File = require('./file.js');
const Path = require('path');

// Constructor
function Draftpool(fs, path) {
    this.fs = fs;
    this.path = String(path).replace(/(\\|\/)*$/, '')+Path.sep;
}

// class methods
Draftpool.prototype.findDraftByIdentifier = function(identifier) {
    return new Promise((resolve, reject) => {
        if (! String(identifier).match(/^\d{5}$/)) {
            reject(null);
            return;
        }

        var path = this.path + this.generateSubfolderNameFromIdentifier(identifier);

        this.fs.access(path, (err) => {
            // Abort if folder not exists
            if (err) {
                reject(null);
                return;
            }

            this.fs.readdir(path, (err, dirfiles) => {
                if (err) {
                    reject(null);
                    return;
                }

                resolve(this.createDraftFromFilelist(dirfiles, identifier, path));
            });
        });
    });
};

/**
 * Create Draft from filelist
 *
 * @param array filelist
 * @return Draft
 */
Draftpool.prototype.createDraftFromFilelist = function (dirfiles, identifier, path) {
    // Optimize list so we don't have to iterate over all files
    dirfiles = this.optimizeFileList(dirfiles, identifier);

    // sort files for Windows
    dirfiles = dirfiles.sort(this.compareFilesForWindows);

    var nearestFile = null;
    var newestFile = null;
    var prev = null;
    var next = null;
    var files = new Array();

    var i = 0;
    while (i < dirfiles.length && next === null) {
        var filename = dirfiles[i];
        i++;

        // ingnore Thumbs.db files
        if (filename.toLowerCase() === 'thumbs.db') {
            continue;
        }

        var stats = this.fs.statSync(path + filename);

        // ingnore directory
        if (stats.isDirectory()) {
            continue;
        }

        var fileBase = filename.slice(0, 5);

        if (fileBase < identifier) {
            prev = filename;
        }
        else if (fileBase === identifier) {
            newestFile = new File(path + filename);
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
    else if (next !== null) {
        nearestFile = new File(path + next);
    }
    else if (prev !== null) {
        nearestFile = new File(path + prev);
    }

    return new Draft(identifier, path, files, nearestFile);
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

    return 'Z.Nr.' + begin + end1 + '-' + begin + end2 + Path.sep;
};

/**
 * optimize the file list
 *
 * @param array filelist
 * @param string identifier
 * @param string optional pick to start from
 * @return array
 */
Draftpool.prototype.optimizeFileList = function (filelist, identifier, pick) {
    if (filelist.length < 20) {
        return filelist;
    }

    // Get given pick or choose 50%
    var newPick = (pick) ? pick : Math.floor(filelist.length / 2);

    if (filelist[newPick].slice(0,5) === identifier) {
        // Abort, if we have already optimized but again hit the identifier
        if (newPick === pick) {
            return filelist;
        }

        // check again at 25%
        return this.optimizeFileList(filelist, identifier, Math.floor(filelist.length / 4));
    }

    var newFilelist;

    if (filelist[newPick].slice(0,5) < identifier) {
        newFilelist = filelist.slice(newPick);
    } else {
        newFilelist = filelist.slice(0, newPick);
    }

    return this.optimizeFileList(newFilelist, identifier);
};

/**
 * sort files for Windows
 *
 * JS sorts the 6th symbol `.` (U+002E) after `-` (U+002D)
 *
 * @param string a
 * @param string b
 * @return int
 */
Draftpool.prototype.compareFilesForWindows = function (a, b) {
    var defaultSort = function (varA, varB) {
        if (varA < varB) {
            return -1;
        }

        if (varA > varB) {
            return 1;
        }

        // names must be equal
        return 0;
    };

    if (a.slice(0,5) !== b.slice(0,5)) {
        return defaultSort(a, b);
    }

    if (a.slice(5,6) == '-' && b.slice(5,6) == '.') {
        return 1;
    }

    if (a.slice(5,6) == '.' && b.slice(5,6) == '-') {
        return -1;
    }

    return defaultSort(a, b);
};

// export the class
module.exports = Draftpool;
