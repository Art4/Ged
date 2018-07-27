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
const fs = require('fs');

describe("The application with valuemap", () => {
    var values = [
        ['foobar', '', 'Unerwartete Eingabe', ''],
        ['version', '0.0.1', '', ''],
        ['open', '', 'Warte auf Eingabe...', ''],
        ['open 12338', 'Index von 12338 wird geöffnet', '', 'openfileinfolder: '+__dirname+'\\mock\\Z.Nr.12000-12499\\12338.tif'],
    ];

    for (var i = 0; i < values.length; i++) {
        describe('on method run("'+values[i][0]+'")', () => {
            var data = values[i];
            it('emits the correct output, error and ipcRenderer calls', () => {
                var stdin = data[0].split(' ');
                var expectedStdout = data[1];
                var expectedErrout = data[2];
                var expectedIpcout = data[3];

                var config = {
                    store: {
                        app_version: '0.0.1',
                        base_dir: __dirname+'\\mock\\',
                        default_file_type: 'pdf',
                        max_revisions: '25',
                    },
                    get: function(key, def) {
                        return this.store[key];
                    },
                };
                var ipcRenderer = new EventEmitter();
                var stdout = '';
                var errout = '';
                var ipcout = '';

                ipcRenderer.send = (key, value) => {
                    ipcRenderer.emit('send', key+': '+value);
                };
                ipcRenderer.on('send', (chunk) => {
                    ipcout += chunk;
                });

                var output = new Output();
                output.on('data', (chunk) => {
                    stdout += chunk;
                });
                output.on('error', (chunk) => {
                    errout += chunk;
                });
                output.on('ended', () => {
                    expect(stdout).toBe(expectedStdout);
                    expect(errout).toBe(expectedErrout);
                    expect(ipcout).toBe(expectedIpcout);
                });
                output.on('error', () => {
                    expect(stdout).toBe(expectedStdout);
                    expect(errout).toBe(expectedErrout);
                    expect(ipcout).toBe(expectedIpcout);
                });


                var app = Application.create(config, fs, ipcRenderer);
                app.run(new Input(stdin), output);
            });
        });
    }
});
