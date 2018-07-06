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

const Draft = require('../../src/draft.js');
const Draftpool = require('../../src/draftpool.js');

describe("The draftpool", function() {
    describe('on findDraftByString', () => {
        var fs = {};
        var path = '';
        var draftpool = new Draftpool(fs, path);

        it('with incorrect identifier returns null', () => {
            expect(draftpool.findDraftByString('not-an-identifier')).toBe(null);
        });

        it('with too short identifier returns null', () => {
            expect(draftpool.findDraftByString('1234')).toBe(null);
        });

        it('with too long identifier returns null', () => {
            expect(draftpool.findDraftByString('123456')).toBe(null);
        });

        it('with correct identifier returns Draft', () => {
            expect(draftpool.findDraftByString('12345')).toEqual(jasmine.any(Draft));
        });
    });
});
