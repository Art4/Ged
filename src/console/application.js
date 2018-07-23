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

// Constructor
function Application(options) {
    this.config = options.config;
    this.program = require('commander');
    this.program
        .version(config.get('app_version', ''), '-OV, --original-version');

    this.program
        .command('version')
        .description('output the version number')
        .action(function (command) {
            command.parent.output.writeLine(config.get('app_version', ''));
        });

    this.program
        .command('open [query]')
        .description('find and open a draft')
        .option('--in-folder', 'Open the folder that contains the draft')
        .option('--in-3D-folder', 'Open the 3D folder of the draft')
        .action(function (query, options) {
        });
}

// class methods
Application.prototype.run = function(input, output) {
    return new Promise((resolve, reject) => {
        this.program.output = output;
        this.program.parse(input.getArgv());
        resolve();
    });
};

// export the class
module.exports = Application;
