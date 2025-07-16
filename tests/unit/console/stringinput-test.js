/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://wlabs.de/kontakt

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

const StringInput = require('../../../src/console/stringinput.js');

describe('The StringInput', function() {
    describe('with valuemap', () => {
        var values = [
            ['12345', '12345', null, null],
            ['12345-R0', '12345', '0', null],
            ['12345-r0.pdf', '12345', '0', 'pdf'],
            ['12345/1', '12345', '1', null],
            ['12345/2/0', '12345', '2', null],
            ['12345/3.pdf', '12345', '3', 'pdf'],
            ['12345/4/9.pdf', '12345', '4', 'pdf'],
            ['12345/B/9.pdf', '12345', 'B', 'pdf'],
            // test invalid inputs
            ['12345i', null, null, null],
            ['112345-R0.pdf', null, null, null],
            ['1234-R0.pdf', null, null, null],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('get data through the constructor', () => {
                var query = values[i][0];
                var identifier = values[i][1];
                var revision = values[i][2];
                var type = values[i][3];
                var stringinput = new StringInput(query);

                it('and getQuery() returns the original query', () => {
                    expect(stringinput.getQuery()).toBe(query);
                });

                it('and getIdentifier() returns the identifier', () => {
                    expect(stringinput.getIdentifier()).toBe(identifier);
                });

                it('and getRevision() returns the revision', () => {
                    expect(stringinput.getRevision()).toBe(revision);
                });

                it('and getType() returns the type', () => {
                    expect(stringinput.getType()).toBe(type);
                });
            });
        }
    });
});
