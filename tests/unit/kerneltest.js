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

const Kernel = require('../../src/kernel.js');
const Request = require('../../src/request.js');
const Response = require('../../src/response.js');

describe("The kernel", function() {
    describe('kernel.handleInputString()', () => {
        it('returns Response instance', () => {
            var kernel = new Kernel();
            var response = kernel.handleInputString('abc');

            expect(response).toEqual(jasmine.any(Response));
        });
    });

    describe('kernel.handleRequest()', () => {
        it('returns Response instance', () => {
            var kernel = new Kernel();
            var response = kernel.handleRequest(
                Request.createFromString('abc')
            );

            expect(response).toEqual(jasmine.any(Response));
        });
    });
});
