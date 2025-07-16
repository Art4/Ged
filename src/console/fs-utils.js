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

// Constructor
function FsUtils(fs) {
    this.fs = fs;
}

/**
 * @see https://stackoverflow.com/a/30062783
 */
FsUtils.prototype.isFileWriteProtected = function(filepath) {
    var stats = this.fs.statSync(filepath);

    //stats.mode = 33206: beschreibbar; = 33060: schreibgeschützt
    return ((stats.mode & 146) === 0);
};

/**
 * @see https://stackoverflow.com/a/30062783
 */
FsUtils.prototype.setFileWriteProtected = function(filepath, writeProtected) {
    if (writeProtected === false) {
        // Ist Datei schreibgeschützt?
        if (this.isFileWriteProtected(filepath)) {
            // Hebe Schreibschutz auf
            this.fs.chmodSync(filepath, 766);
        }

        return true;
    }

    // Ist Datei beschreibbar?
    if (! this.isFileWriteProtected(filepath)) {
        // Setze Schreibschutz
        this.fs.chmodSync(filepath, 544);
    }

    return true;
};

// export the class
module.exports = FsUtils;
