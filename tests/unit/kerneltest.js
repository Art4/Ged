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
    var kernel, config;

    beforeEach(function() {
        config = {
            store: {
                config_version: 1,
                max_revisions: 25,
                dir_store_end: 395,
                base_dir: 'A:\\bcd\\efg\\',
                default_file_type: 'pdf',
            },
            get: function(key, def) {
                return this.store[key];
            },
        };

        kernel = new Kernel({
            config: config,
        });
    });

    describe('kernel.handleInputStringSync()', () => {
        it('returns Response instance', () => {
            var response = kernel.handleInputStringSync('abc');

            expect(response).toEqual(jasmine.any(Response));
        });
    });

    describe('kernel.handleRequestSync()', () => {
        it('returns Response instance', () => {
            var response = kernel.handleRequestSync(
                Request.createFromString('abc')
            );

            expect(response).toEqual(jasmine.any(Response));
        });
    });
});
