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

const { Application, Input, Output } = require('../../src/console');
const EventEmitter = require('events');

describe("The application", function() {
    describe('with fs mock on method run()', () => {
        var config = {
            store: {
                app_version: '0.0.1',
                base_dir: '\\base_dir\\',
            },
            get: function(key, def) {
                return this.store[key];
            },
        };
        var fs = {
            readdir: function(path, cb) {
                cb(null, new Array(
                    '12338.tif',
                    // '12339.tif', // this file is missing
                    '12340.tif',
                    '12341.bak',
                    '12341.dwg',
                    '12341.dxf',
                    '12342.dft',
                    '12342.pdf',
                    '12342_3D',
                    '12343.dft',
                    '12343.pdf',
                    '12343-R2.dft',
                    '12343-R2.pdf',
                    '12344-R0.dft',
                    '12344-R1.dft',
                    '12344-R2.dft',
                    '12344-R2.pdf',
                    '12345-R0.dft',
                    '12345-R0_Aufstellung.stp',
                    '12345-R1.dft',
                    '12345-R1.log',
                    '12345-R1.pdf',
                    '12345-R1_Aufstellung.stp',
                    '12346-R0 Blatt 1 von 2.dwg',
                    '12346-R0 Blatt 2 von 2.dwg',
                    '12346-R0.dft',
                    '12346-R0.pdf',
                    'Thumbs.db',
                ));
            },
            statSync: function(path) {
                // return stat mock
                return {
                    isDirectory: function() {
                        return (path.slice(-3) === '_3D');
                    },
                };
            },
            constants: {
                F_OK: 'F_OK'
            },
            access: function(path, mode, cb) {
                cb(null);
            },
        };
        var ipcRenderer = new EventEmitter();
        ipcRenderer.send = (key, value) => {
            this.emit(key, value);
        };
        var output = new Output();

        var app = Application.create(config, fs, ipcRenderer);

        it('return version', () => {
            var expectedOutput = '';
            var expectedError = '';

            output.on('data', (chunk) => {
                expectedOutput += chunk;
            });
            output.on('error', (chunk) => {
                expectedError += chunk;
            });
            expect(app).toEqual(jasmine.any(Application));

            app.run(new Input(['version']), output);

            expect(expectedOutput).toBe('0.0.1');
            expect(expectedError).toBe('');
        });
    });
});
