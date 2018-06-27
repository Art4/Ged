/*
 * Ged
 * Copyright (C) 2018  Artur Weigandt  https://wlabs.de/kontakt

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

const Response = require('../../src/response.js');

describe("The Response", function() {
    describe('response.getContent()', () => {
        it('returns an empty string', () => {
            var response = new Response();

            expect(response.getContent()).toBe('');
        });

        it('returns the correct content', () => {
            var response = new Response('abc');

            expect(response.getContent()).toBe('abc');
        });
    });

    describe('response.getQuery()', () => {
        it('returns an empty string', () => {
            var response = new Response('');

            expect(response.getQuery()).toBe('');
        });

        it('returns the correct content', () => {
            var response = new Response('', 'foo');

            expect(response.getQuery()).toBe('foo');
        });
    });
});
