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
const File = require('../../../src/console/file.js');
const FilePicker = require('../../../src/console/filepicker.js');
const Filter = require('../../../src/console/filter.js');
const Path = require('path');

describe('The filepicker', function() {
    describe('with draft without files', () => {
        var draft = new Draft('1', 'path', [], null);

        it('returns empty array on pickFromDraft()', () => {
            var filepicker = new FilePicker();
            var returnValue = filepicker.pickFromDraft(draft);

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([]);
            });
        });

        it('returns empty array on pickFromList()', () => {
            var filepicker = new FilePicker();
            var returnValue = filepicker.pickFromList(draft.getFiles());

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([]);
            });
        });
    });

    describe('with draft and some files', () => {
        it('returns array with files on pickFromDraft()', () => {
            var file1 = new File('path/32165.ext');
            var draft = new Draft('1', 'path', [file1], file1);
            var filepicker = new FilePicker();
            var returnValue = filepicker.pickFromDraft(draft);

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([file1]);
            });
        });

        it('returns array with files on pickFromList()', () => {
            var file1 = new File('path/32165.ext');
            var draft = new Draft('1', 'path', [file1], file1);
            var filepicker = new FilePicker();
            var returnValue = filepicker.pickFromList(draft.getFiles());

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([file1]);
            });
        });

        it('returns array with files on pickFromList()', () => {
            var file1 = new File('path/32165.ext');
            var file2 = new File('path/34567-R1.ext');
            var draft = new Draft('1', 'path', [file1, file2], file2);
            var filepicker = new FilePicker();
            filepicker.addRevisionFilter(new Filter('eq', '1'));
            var returnValue = filepicker.pickFromList(draft.getFiles());

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toEqual([file2]);
            });
        });
    });

    describe('with filelist', () => {
        var file1 = new File('path/12345.ext');
        var file2 = new File('path/12345-R1.ext');

        var files = [
            file1,
            file2,
        ];

        it('returns one file on pickOneFromList()', () => {
            var returnValue = FilePicker.pickOneFromList(files, null, 'ext');

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toBe(file1);
            });
        });

        it('returns one file on pickOneFromList()', () => {
            var returnValue = FilePicker.pickOneFromList(files, '1', 'ext');

            // check if return is a Promise
            expect(returnValue instanceof Promise).toBe(true);

            returnValue.then((val) => {
                expect(val).toBe(file2);
            });
        });
    });
});
