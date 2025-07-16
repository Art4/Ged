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

const { Input } = require('../../../src/console');

describe('The Input', function() {
    describe('with valuemap', () => {
        var values = [
            [[], ['node', 'ged']],
            [['open', '12345'], ['node', 'ged', 'open', '12345']],
            [['12345', 'R1'], ['node', 'ged', '12345', 'R1']],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('get data through the constructor', () => {
                var argv = values[i][0];
                var expected = values[i][1];
                var input = new Input(argv);

                it('and getArgv() returns an array', () => {
                    expect(input.getArgv()).toEqual(expected);
                });
            });
        }
    });
});
