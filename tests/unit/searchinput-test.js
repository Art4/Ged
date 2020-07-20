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

const SearchInput = require('../../src/searchinput.js');

describe('The SearchInput', function() {
    describe('with valuemap', () => {
        var values = [
            ['12345', ['node', 'ged', 'open', '12345']],
            ['12345-R0', ['node', 'ged', 'open', '12345-R0']],
            ['12345-r0.pdf', ['node', 'ged', 'open', '12345-r0.pdf']],
            ['12345-r0.pdf o', ['node', 'ged', 'open', '12345-r0.pdf']],
            ['12345-r0.pdf O', ['node', 'ged', 'open', '12345-r0.pdf']],
            ['12345/1', ['node', 'ged', 'open', '12345/1']],
            ['12345/2.pdf', ['node', 'ged', 'open', '12345/2.pdf']],
            ['12345/3/0', ['node', 'ged', 'open', '12345/3/0']],
            ['12345/B/9.pdf', ['node', 'ged', 'open', '12345/B/9.pdf']],
            ['12345 i', ['node', 'ged', 'open', '12345', '--in-folder']],
            ['12345 I', ['node', 'ged', 'open', '12345', '--in-folder']],
            ['12345 e', ['node', 'ged', 'open', '12345', '--in-3d-folder']],
            ['12345 E', ['node', 'ged', 'open', '12345', '--in-3d-folder']],
            ['12345 3d', ['node', 'ged', 'open', '12345', '--in-3d-folder']],
            ['12345 3D', ['node', 'ged', 'open', '12345', '--in-3d-folder']],
            ['12345 +', ['node', 'ged', 'open', '12345', '--search-in-3d-folder']],
            ['12345 a', ['node', 'ged', 'open', '12345', '--search-in-3d-folder']],
            ['12345 A', ['node', 'ged', 'open', '12345', '--search-in-3d-folder']],
            ['12345 c', ['node', 'ged', 'clean', '12345', '--only-previous-revision']],
            ['12345 C', ['node', 'ged', 'clean', '12345', '--only-previous-revision']],
            ['12345 s', ['node', 'ged', 'chmod', '12345', '--read-only']],
            ['12345 S', ['node', 'ged', 'chmod', '12345', '--read-only']],
            ['12345 f', ['node', 'ged', 'chmod', '12345', '--read-write']],
            ['12345 F', ['node', 'ged', 'chmod', '12345', '--read-write']],
            // test invalid inputs
            ['112345-R0.pdf o', ['node', 'ged', 'open', '112345-R0.pdf']],
            ['1234-R0.pdf o', ['node', 'ged', 'open', '1234-R0.pdf']],
            ['12345 R1', ['node', 'ged', 'R1', '12345']],
            ['', ['node', 'ged', 'open']],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('get data through the constructor', () => {
                var query = values[i][0];
                var argv = values[i][1];
                var searchinput = new SearchInput(query);

                it('and getQuery() returns the original query', () => {
                    expect(searchinput.getQuery()).toBe(query);
                });

                it('and getArgv() returns an array', () => {
                    expect(searchinput.getArgv()).toEqual(argv);
                });
            });
        }
    });
});
