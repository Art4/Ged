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

const fs = require('fs');

// Constructor
function FsUtils() {}

/**
 * @see https://stackoverflow.com/a/30062783
 */
FsUtils.isFileWriteProtected = function(filepath) {
    var stats = fs.statSync(filepath);

    //stats.mode = 33206: beschreibbar; = 33060: schreibgeschützt
    return ((stats.mode & 146) === 0);
}

/**
 * @see https://stackoverflow.com/a/30062783
 */
FsUtils.setFileWriteProtected = function(filepath, writeProtected) {
    if (writeProtected === false) {
        // Ist Datei schreibgeschützt?
        if (FsUtils.isFileWriteProtected(filepath)) {
            // Hebe Schreibschutz auf
            fs.chmodSync(filepath, 766);
        }

        return true;
    }

    // Ist Datei beschreibbar?
    if (! FsUtils.isFileWriteProtected(filepath)) {
        // Setze Schreibschutz
        fs.chmodSync(filepath, 544);
    }

    return true;
}

// export the class
module.exports = FsUtils;
