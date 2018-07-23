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

const Application = require('../../../src/console/application.js');
const BufferedOutput = require('../../../src/console/bufferedoutput.js');

describe("The application", function() {
    var application;

    beforeEach(function() {
        config = {
            store: {
                app_version: 'v1',
            },
            get: function(key, def) {
                return this.store[key];
            },
        };

        application = new Application({
            config: config,
        });
    });

    describe('application.run()', () => {
        it('returns Promise instance', () => {
            var input = {
                getArgv: () => {
                    return ['node', 'ged', 'version'];
                }
            };
            var output = new BufferedOutput();

            application.run(input, output)
                .then(() => {
                    expect(output.fetch()).toBe("v1\n");
                });
        });
    });
});
