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

const LegacyController = require('./controller/legacycontroller.js');
const ChmodController = require('./controller/chmodcontroller.js');
const CleanController = require('./controller/cleancontroller.js');
const ListController = require('./controller/listcontroller.js');
const VersionController = require('./controller/versioncontroller.js');
const { Command } = require('commander');

// Constructor
function Application() {
    this.program = null;
    this.controllers = [];
}

Application.prototype.setupCommander = function() {
    // Commander kann nicht mehrfach verwendet werden, sondern muss immer wieder
    // neu geladen werden, siehe https://github.com/tj/commander.js/pull/499
    this.program = new Command();
    this.program
        .version('unknown', '-OV, --original-version');

    this.program
        .command('*')
        .description('catch-all for errors')
        .action(() => {
            this.program.output.destroy('Unerwartete Eingabe');
        });

    for (var i = 0; i < this.controllers.length; i++) {
        var controller = this.controllers[i];

        controller.register(this.program);
    }
};

// class methods
Application.prototype.addController = function(controller) {
    this.controllers.push(controller);
};

Application.prototype.run = function(input, output) {
    // Setup commander
    this.setupCommander();

    this.program.output = output;
    this.program.parse(input.getArgv());

    this.program = null;
};

// Factory method
Application.create = function(config, fs, ipcRenderer) {
    var app = new Application();

    // Register Controllers
    app.addController(new VersionController(config));
    app.addController(new LegacyController(config, fs, ipcRenderer));
    app.addController(new ChmodController(config, fs, ipcRenderer));
    app.addController(new CleanController(config, fs, ipcRenderer));
    app.addController(new ListController(config, fs, ipcRenderer));

    return app;
};

// export the class
module.exports = Application;
