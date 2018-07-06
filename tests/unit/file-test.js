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

const File = require('../../src/file.js');

describe("The file", function() {
    describe('constructor expect data', () => {
        var values = new Array(
            new Array('null', null),
            new Array('true', true),
            new Array('false', false),
            new Array('789', 789),
            new Array('123.456', 123.456),
            new Array('string', 'string'),
            new Array('', new Array()),
            new Array('[object Object]', {}),
        );

        it('and returns the absolute path with the right value', () => {
            for (var i = 0; i < values.length; i++) {
                var data = values[i];
                var file = new File(data[1]);

                expect(file.getAbsolutePath()).toBe(data[0]);
            }
        });

        it('and returns the file name', () => {
            for (var i = 0; i < values.length; i++) {
                var data = values[i];
                var file = new File(data[1]);

                expect(file.getName()).toBe(data[0]);
            }
        });

        it('and returns the file extension', () => {
            for (var i = 0; i < values.length; i++) {
                var data = values[i];
                var expected = (data[0] === '123.456') ? '456' : '';

                var file = new File(data[1]);

                expect(file.getExtension()).toBe(expected);
            }
        });

        it('and returns the revision', () => {
            for (var i = 0; i < values.length; i++) {
                var data = values[i];

                var file = new File(data[1]);

                expect(file.getRevision()).toBe(null);
            }
        });
    });

    describe('with data provider', () => {
        var values = [
            ['\\path\\to\\file', 'file', '', null],
            ['\\path\\to\\.notext', '.notext', '', null],
            ['\\path\\to\\file.ext', 'file.ext', 'ext', null],
            ['\\path\\to\\12345.pdf', '12345.pdf', 'pdf', null],
            ['\\path\\to\\12345-R5.pdf', '12345-R5.pdf', 'pdf', '5'],
            ['\\path\\to\\12345-RC.dft', '12345-RC.dft', 'dft', 'C'],
            // test wrong revisions
            ['\\path\\to\\12345-R.dft', '12345-R.dft', 'dft', null],
            ['\\path\\to\\12345-R12_layout.stp', '12345-R12_layout.stp', 'stp', '1'],
        ];

        it('returns the correct absolute path', () => {
            for (var i = 0; i < values.length; i++) {
                var path = values[i][0];

                var file = new File(path);

                expect(file.getAbsolutePath()).toBe(path);
            }
        });

        it('returns the correct name', () => {
            for (var i = 0; i < values.length; i++) {
                var path = values[i][0];
                var name = values[i][1];

                var file = new File(path);

                expect(file.getName()).toBe(name);
            }
        });

        it('returns the correct extension', () => {
            for (var i = 0; i < values.length; i++) {
                var path = values[i][0];
                var ext = values[i][2];

                var file = new File(path);

                expect(file.getExtension()).toBe(ext);
            }
        });

        it('returns the correct extension', () => {
            for (var i = 0; i < values.length; i++) {
                var path = values[i][0];
                var revision = values[i][3];

                var file = new File(path);

                expect(file.getRevision()).toBe(revision);
            }
        });
    });
});
