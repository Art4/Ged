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

const fs = require('fs');
const { spawn } = require('child_process');

function parsePropExeResult(raw) {
    let data = new Map;
    raw.split('\n').forEach((line) => {
        if (line === '') {
            return;
        }
        let lineData = line.split(/(^[^:]+): /);

        data.set(lineData[1], lineData[2]);
    });

    return data;

}

// Constructor
function DraftProperties() {
    this.isPropExeFound = false;
    this.propExePath = 'C:\\Program Files\\Solid Edge ST8\\Program\\prop.exe';

    // feature detection for Solid Edge ST8 prop.exe
    fs.stat(this.propExePath, (err, stats) => {
        if (err) {
            return;
        }

        this.isPropExeFound = true;
    });
}

// class methods
DraftProperties.prototype.fromFilePath = function(path) {
    return new Promise((resolve, reject) => {
        if (! this.isPropExeFound) {
            reject('prop.exe not found');
            return;
        }

        let child = spawn(this.propExePath, ['dump', path]);

        child.stdout.on('data', (data) => {
            resolve(parsePropExeResult(`filename: ${data}`));
        });

    });
    return this.files;
};

// export the class
module.exports = DraftProperties;
