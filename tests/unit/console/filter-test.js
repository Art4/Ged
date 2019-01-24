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
    describe('with invalid operator', () => {
        var operator = 'foo';

        it('throws an error', () => {
            expect(() => {new Filter(operator, 'bar')}).toThrow('"foo" is an invalid operator');
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
            ['0',    'neq', '0',    false],
            ['0',    'neq', '1',    true],
            ['1',    'neq', '0',    true],
            ['1',    'neq', '1',    false],
            ['dft',  'neq', 'dft',  false],
            ['pdf',  'neq', 'dft',  true],
            ['',     'neq', 'dft',  true],
            ['pdf',  'neq', 'pdf',  false],
            ['0',    'lt',  '0',    false],
            ['4',    'lt',  '5',    true],
            ['1',    'lt',  '0',    false],
            ['1',    'lt',  '1',    false],
            ['1',    'lt',  '2',    true],
            ['dft',  'lt',  'dft',  false],
            ['dft',  'lt',  'pdf',  true],
            ['pdf',  'lt',  'dft',  false],
            ['pdf',  'lt',  'pdf',  false],
            ['',     'lt',  'dft',  true],
            ['0',    'lte', '0',    true],
            ['4',    'lte', '5',    true],
            ['1',    'lte', '0',    false],
            ['1',    'lte', '1',    true],
            ['1',    'lte', '2',    true],
            ['dft',  'lte', 'dft',  true],
            ['dft',  'lte', 'pdf',  true],
            ['pdf',  'lte', 'dft',  false],
            ['pdf',  'lte', 'pdf',  true],
            ['',     'lte', 'dft',  true],
            ['abc',  'lte', '',     false],
            ['0',    'gt',  '0',    false],
            ['4',    'gt',  '5',    false],
            ['1',    'gt',  '0',    true],
            ['1',    'gt',  '1',    false],
            ['1',    'gt',  '2',    false],
            ['dft',  'gt',  'dft',  false],
            ['dft',  'gt',  'pdf',  false],
            ['pdf',  'gt',  'dft',  true],
            ['pdf',  'gt',  'pdf',  false],
            ['',     'gt',  'dft',  false],
            ['abc',  'gt',  '',     true],
            ['0',    'gte', '0',    true],
            ['4',    'gte', '5',    false],
            ['1',    'gte', '0',    true],
            ['1',    'gte', '1',    true],
            ['1',    'gte', '2',    false],
            ['dft',  'gte', 'dft',  true],
            ['dft',  'gte', 'pdf',  false],
            ['pdf',  'gte', 'dft',  true],
            ['pdf',  'gte', 'pdf',  true],
            ['',     'gte', 'dft',  false],
            ['abc',  'gte', '',     true],
        ];

        for (var i = 0; i < values.length; i++) {
            describe('compares', () => {
                var data = values[i];
                var result = (data[3]) ? 'true' : 'false';

                var filter = new Filter(data[1], data[2]);

                it(`"${data[0]}" ${data[1]} "${data[2]}" correct to "${result}"`, () => {
                    expect(filter.test(data[0])).toBe(data[3]);
                });
            });
        }
    });
});
