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

const BufferedOutput = require('../../../src/console/bufferedoutput.js');

describe("The BufferedOutput", function() {
    describe('with valuemap', () => {
        var values = [
            ['line1', 'line2'],
            ['line3', 'line4'],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('get data through the constructor', () => {
                var lines = values[i];
                var expected = lines.join("\n")+"\n";
                var bufferedoutput = new BufferedOutput();

                for (var j = 0; j < lines.length; j++) {
                    bufferedoutput.writeLine(lines[j]);
                }

                it('and the first fetch() returns a string and every other fetch() returns a empty string', () => {
                    expect(bufferedoutput.fetch()).toBe(expected);
                    expect(bufferedoutput.fetch()).toBe('');
                });
            });
        }
    });
});
