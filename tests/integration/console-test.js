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

const { Application, Input, Output } = require('../../src/console');
const EventEmitter = require('events');
const { Volume } = require('memfs');
const Path = require('path');

const fs = Volume.fromJSON(
    {
        './Z.Nr.10000-10499/10338.tif': '',
        // './Z.Nr.10000-10499/10339.tif': '', // this file is missing
        './Z.Nr.10000-10499/10340.TIF': '',
        './Z.Nr.10000-10499/10341.bak': '',
        './Z.Nr.10000-10499/10341.dft': '',
        './Z.Nr.10000-10499/10341.dwg': '',
        './Z.Nr.10000-10499/10341.dxf': '',
        './Z.Nr.10000-10499/10342.dft': '',
        './Z.Nr.10000-10499/10342.pdf': '',
        './Z.Nr.10000-10499/10342.stp': '',
        './Z.Nr.10000-10499/10342_3D': '',
        './Z.Nr.10000-10499/10343-R1.dft': '',
        './Z.Nr.10000-10499/10343-R1.pdf': '',
        './Z.Nr.10000-10499/10343.dft': '', // JS sorts the 6th symbol `.` (U+002E) after `-` (U+002D)
        './Z.Nr.10000-10499/10344-R0.dft': '',
        './Z.Nr.10000-10499/10344-R1.dft': '',
        './Z.Nr.10000-10499/10344-R2.dft': '',
        './Z.Nr.10000-10499/10344-R2.pdf': '',
        './Z.Nr.10000-10499/10345-R0.dft': '',
        './Z.Nr.10000-10499/10345-R0_Aufstellung.stp': '',
        './Z.Nr.10000-10499/10345-R1.dft': '',
        './Z.Nr.10000-10499/10345-R1.log': '',
        './Z.Nr.10000-10499/10345-R1.pdf': '',
        './Z.Nr.10000-10499/10345-R1_Aufstellung.stp': '',
        './Z.Nr.10000-10499/10346-R0 Blatt 1 von 2.dwg': '',
        './Z.Nr.10000-10499/10346-R0 Blatt 2 von 2.dwg': '',
        './Z.Nr.10000-10499/10346-R0.dft': '',
        './Z.Nr.10000-10499/10346-R0.pdf': '',
        './Z.Nr.10000-10499/10347-R0.bak': '',
        './Z.Nr.10000-10499/10347-R0.dft': '',
        './Z.Nr.10000-10499/10347-R0.dwg': '',
        './Z.Nr.10000-10499/Thumbs.db': '',
    },
    '/base_dir'
);

// console.log(fs.readdirSync('/base_dir/Z.Nr.10000-10499/'));

describe('The application with valuemap', () => {
    var values = [
        [
            'foobar', 'pdf',
            'Unerwartete Eingabe', '', '',
        ],
        [
            'version', 'pdf',
            '0.0.1', '', '',
        ],
        [
            'open', 'pdf',
            '', 'Warte auf Eingabe...', '',
        ],
        [
            'open 10338', 'pdf',
            'Index von 10338 wird geöffnet', '', 'openfileinfolder: /base_dir/Z.Nr.10000-10499/10338.tif'.replace(/\//g, Path.sep),
        ],
        [
            'open 10338.tif', 'pdf',
            '10338.tif wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10338.tif'.replace(/\//g, Path.sep),
        ],
        [
            'open 10339', 'pdf',
            'Index von 10339 wird geöffnet', '', 'openfileinfolder: /base_dir/Z.Nr.10000-10499/10340.TIF'.replace(/\//g, Path.sep),
        ],
        [
            'open 10340.tif', 'pdf',
            '10340.TIF wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10340.TIF'.replace(/\//g, Path.sep),
        ],
        [
            'open 10340.tif', 'pdf',
            '10340.TIF wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10340.TIF'.replace(/\//g, Path.sep),
        ],
        [
            'open 10341', 'dft',
            '10341.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10341.dft'.replace(/\//g, Path.sep),
        ],
        [
            'open 10341-R0', 'dft',
            '10341.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10341.dft'.replace(/\//g, Path.sep),
        ],
        [
            'open 10343 --in-folder', 'dft',
            'Index von 10343 wird geöffnet', '', 'openfileinfolder: /base_dir/Z.Nr.10000-10499/10343-R1.pdf'.replace(/\//g, Path.sep),
        ],
        [
            'open 10344', 'dft',
            '10344-R2.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10344-R2.dft'.replace(/\//g, Path.sep),
        ],
        [
            'open 10344/1', 'dft',
            '10344-R1.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10344-R1.dft'.replace(/\//g, Path.sep),
        ],
        [
            'open 10344-R1', 'dft',
            '10344-R1.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10344-R1.dft'.replace(/\//g, Path.sep),
        ],
        [
            'open 10346-RZ', 'dft',
            'Index von 10346 wird geöffnet', '', 'openfileinfolder: /base_dir/Z.Nr.10000-10499/10346-R0.pdf'.replace(/\//g, Path.sep),
        ],
        [
            'open 10346-R?', 'dft',
            '', 'Ungültige Zeichnungsnummer', '',
        ],
        [
            'open 10347', 'dft',
            '10347-R0.dft wird geöffnet', '', 'openfile: /base_dir/Z.Nr.10000-10499/10347-R0.dft'.replace(/\//g, Path.sep),
        ],
    ];

    for (var i = 0; i < values.length; i++) {
        describe('on method run("'+values[i][0]+'")', () => {
            var data = values[i];
            it('emits the correct output, error and ipcRenderer calls', () => {
                var stdin = data[0].split(' ');
                var configFileType = data[1];
                var expectedStdout = data[2];
                var expectedErrout = data[3];
                var expectedIpcout = data[4];

                var config = {
                    store: {
                        app_version: '0.0.1',
                        base_dir: Path.sep+'base_dir'+Path.sep,
                        default_file_type: configFileType,
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

                var checkExpectations = () => {
                    expect(stdout).toBe(expectedStdout);
                    expect(errout).toBe(expectedErrout);
                    expect(ipcout).toBe(expectedIpcout);
                };

                output.on('ended', () => {
                    checkExpectations();
                });

                Application.create(config, fs, ipcRenderer).run(new Input(stdin), output);
            });
        });
    }
});
