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

const { Application, Output } = require('../../../src/console');
const VersionController = require('../../../src/console/controller/versioncontroller.js');
const Logger = require('electron-log');

Logger.transports.file.level = false;
Logger.transports.console.level = false;

describe('The application', function() {
    var config;

    beforeEach(function() {
        config = {
            store: {
                app_version: 'v1',
            },
            get: function(key, def) {
                return this.store[key];
            },
        };
    });

    describe('without controllers on method application.run()', () => {
        it('triggers error', () => {
            var input = {
                getArgv: () => {
                    return ['node', 'ged', 'version'];
                }
            };

            var output = new Output();
            output.on('error', (err) => {
                expect(false).toBe('error should never been called');
            });
            output.on('finish', (msg) => {
                expect(false).toBe('finisch should never been called');
            });
            output.on('data', (msg) => {
                expect(msg).toBe('Unerwartete Eingabe');
            });

            new Application(Logger).run(input, output);
        });
    });

    describe('with controller on method application.run()', () => {
        it('writes the correct content to output', () => {
            var input = {
                getArgv: () => {
                    return ['node', 'ged', 'version'];
                }
            };
            var output = new Output();
            output.on('error', (error) => {
                expect(false).toBe('this should never been called');
            });
            output.on('data', (data) => {
                expect(data).toBe('v1');
            });
            output.on('ended', () => {
                expect(true).toBe(true);
            });

            const application = new Application(Logger);
            application.addController(new VersionController(config));

            application.run(input, output);
        });
    });

    describe('on static method Application.create()', () => {
        it('returns Application instance', () => {
            var application = Application.create(config, {}, {}, Logger);

            expect(application).toEqual(jasmine.any(Application));
        });
    });
});
