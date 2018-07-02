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

const Request = require('../../src/request.js');

describe("The Request", function() {
    describe('Request.createFromString()', () => {
        it('returns Request instance', () => {
            var request = Request.createFromString('abc');

            expect(request).toEqual(jasmine.any(Request));
            expect(request.getContent()).toBe('abc');
        });
    });

    describe('request.getContent()', () => {
        it('returns the correct value', () => {
            var request = new Request();
            expect(request.getContent()).toBe('');

            request.setContent('abc');
            expect(request.getContent()).toBe('abc');
        });
    });
});
