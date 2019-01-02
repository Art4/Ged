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

const File = require('../../../src/console/file.js');
const Draft = require('../../../src/console/draft.js');

describe('The draft', function() {
    describe('without data', () => {
        it('returns empty array', () => {
            var draft = new Draft('12345', 'path/', []);

            expect(draft.getFiles()).toEqual([]);
            expect(draft.getNearestFile()).toBe(null);
            expect(draft.get3DFolderPath()).toBe('path/12345_3D');
        });
    });

    describe('with file list', () => {
        var files = [
            new File('12345.dft', []),
            new File('12345.pdf', []),
        ];

        it('returns file list', () => {
            var draft = new Draft('12345', 'path\\', files);

            expect(draft.getFiles()).toBe(files);
            expect(draft.getNearestFile()).toBe(null);
            expect(draft.get3DFolderPath()).toBe('path\\12345_3D');
        });
    });

    describe('without file list and nearestFile', () => {
        var files = [];
        var nearestFile = new File('12344.dft');

        it('returns empty array and nearestFile', () => {
            var draft = new Draft('12345', 'path\\', files, nearestFile);

            expect(draft.getFiles()).toBe(files);
            expect(draft.getNearestFile()).toBe(nearestFile);
            expect(draft.get3DFolderPath()).toBe('path\\12345_3D');
        });
    });
});
