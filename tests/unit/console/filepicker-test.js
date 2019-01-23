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

const Draft = require('../../../src/console/draft.js');
const Filepicker = require('../../../src/console/filepicker.js');
const Path = require('path');

describe('The filepicker', function() {
    describe('with draft without files', () => {
        var draft = new Draft('1', 'path', [], null);

        it('returns empty array on pickFromDraft()', () => {
            var filepicker = new Filepicker();
            var returnValue = filepicker.pickFromDraft(draft);

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([]);
            });
        });
    });
});
