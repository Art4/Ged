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
'use strict';

const KernelController = require('./controller/kernelcontroller.js');
const VersionController = require('./controller/versioncontroller.js');
const { Command } = require('commander');

// Constructor
function Application() {
    this.program = new Command();
    this.program
        .version('unknown', '-OV, --original-version');

    this.program
        .command('*')
        .description('catch-all for errors')
        .action(() => {
            throw new Error('Unerwartete Eingabe');
        });

    // this.program
    //     .command('open [query]')
    //     .description('find and open a draft')
    //     .option('--in-folder', 'Open the folder that contains the draft')
    //     .option('--in-3D-folder', 'Open the 3D folder of the draft')
    //     .action(function (query, options) {
    //     });
}

// class methods
Application.prototype.addController = function(controller) {
    controller.register(this.program);
};

Application.prototype.run = function(input, output) {
    return new Promise((resolve, reject) => {
        try {
            this.program.output = output;
            this.program.parse(input.getArgv());
            resolve();
        } catch (e) {
            output.writeLine(e.message);
            reject();
        }
    });
};

// Factory method
Application.create = function(config, fs) {
    var app = new Application();

    // Register Controllers
    app.addController(new VersionController(config));
    app.addController(new KernelController(config, fs));

    return app;
};

// export the class
module.exports = Application;
