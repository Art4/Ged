/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://weigandtlabs.de/kontakt

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
function VersionController(config) {
    this.config = config;
}

// class methods
VersionController.prototype.register = function(commander) {
    commander
        .command('version')
        .description('output the version number')
        .action((options, command) => {
            this.executeCommand(command, commander.output);
        });
};

VersionController.prototype.executeCommand = function(command, output) {
    output.write(this.config.get('app_version', ''));
};

// export the class
module.exports = VersionController;
