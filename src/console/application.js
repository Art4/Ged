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

const LegacyController = require('./controller/legacycontroller.js');
const ChmodController = require('./controller/chmodcontroller.js');
const CleanController = require('./controller/cleancontroller.js');
const ListController = require('./controller/listcontroller.js');
const VersionController = require('./controller/versioncontroller.js');
const { Command } = require('commander');

// Constructor
function Application(Logger) {
    this.logger = Logger;

    this.logger.info('App started');

    this.controllers = [];
}

Application.prototype.setupCommander = function(output) {
    // Commander kann nicht mehrfach verwendet werden, sondern muss immer wieder
    // neu geladen werden, siehe https://github.com/tj/commander.js/pull/499
    var program = new Command();

    program.output = output;

    program.configureOutput({
        writeOut: function(str) {
            program.output.end(str);
        },
        writeErr: function(str) {
             program.output.end(str);
        },
        outputError: function(err) {
            program.output.end(err);
        },
    });

    program
        .command('default', { isDefault: true })
        .allowUnknownOption(true)
        .allowExcessArguments(true)
        .description('catch-all for errors')
        .action(() => {
            program.output.end('Unerwartete Eingabe');
        });

    for (var i = 0; i < this.controllers.length; i++) {
        var controller = this.controllers[i];

        controller.register(program);
    }

    return program;
};

// class methods
Application.prototype.addController = function(controller) {
    this.controllers.push(controller);
};

Application.prototype.run = function(input, output) {
    // Setup and run command
    return this.setupCommander(output).parseAsync(input.getArgv());
};

// Factory method
Application.create = function(config, fs, ipcRenderer, logger) {
    var app = new Application(logger);

    // Register Controllers
    app.addController(new VersionController(config));
    app.addController(new LegacyController(config, fs, ipcRenderer, logger));
    app.addController(new ChmodController(config, fs, ipcRenderer));
    app.addController(new CleanController(config, fs, ipcRenderer));
    app.addController(new ListController(config, fs, ipcRenderer));

    return app;
};

// export the class
module.exports = Application;
