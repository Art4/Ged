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

const Filter = require('../../../src/console/filter.js');

describe('The filter', function() {
    describe('with comparison lt 5', () => {
        var filter = new Filter('lt', 5);

        it('returns true on test(4)', () => {
            expect(filter.test(4)).toBe(true);
        });
    });

    describe('with arguments on test()', () => {
        var values = [
            ['0',    'eq',  '0',    true],
            ['0',    'eq',  '1',    false],
            ['1',    'eq',  '0',    false],
            ['1',    'eq',  '1',    true],
            ['dft',  'eq',  'dft',  true],
            ['pdf',  'eq',  'dft',  false],
            ['',     'eq',  'dft',  false],
            ['pdf',  'eq',  'pdf',  true],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('compares', () => {
                var data = values[i];
                var result = (data[3]) ? 'true' : 'false';

                var filter = new Filter(data[1], data[2]);

                it(`${data[0]} ${data[1]} ${data[2]} correct to "${result}"`, () => {
                    expect(filter.test(data[0])).toBe(data[3]);
                });
            });
        }
    });
});
