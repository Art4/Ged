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

const { Output } = require('../../../src/console');

describe("The Output", function() {
    describe('with valuemap', () => {
        var values = [
            ['line1'],
            ['line2'],
            ['line_with_linebreak'+"\n"],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('on method write()', () => {
                var line = values[i][0];
                var buffer = '';

                var output = new Output();
                output.on('data', (chunk) => {
                    buffer += chunk;
                });

                output.write(line);

                it('emit the data event', () => {
                    expect(buffer).toBe(line);
                });
            });

            describe('on method writeLine()', () => {
                var line = values[i][0];
                var expected = line+"\n";
                var buffer = '';

                var output = new Output();
                output.on('data', (chunk) => {
                    buffer += chunk;
                });

                output.writeLine(line);

                it('emit the data event', () => {
                    expect(buffer).toBe(expected);
                });
            });
        }
    });

    describe('on method end()', () => {
        var line = 'string';
        var buffer = '';

        var output = new Output();
        output.on('data', (chunk) => {
            buffer += chunk;
        });

        output.end(line);

        it('emit the data event', () => {
            expect(buffer).toBe(line);
        });
    });
});
