/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://wlabs.de/kontakt

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

const fs = require('fs');
const FsUtils = require('../../../src/console/fs-utils.js');

describe('FsUtils', function() {
    var filepath = './tests/testfile';
    var fsutils = new FsUtils(fs);

    beforeEach(function() {
        fs.writeFileSync(filepath, 'file content');
    });

    afterEach(function() {
        fs.unlinkSync(filepath);
    });

    describe('on method isFileWriteProtected()', () => {
        it('returns false', () => {
            expect(fsutils.isFileWriteProtected(filepath)).toBe(false);
        });
    });

    describe('on method setFileWriteProtected()', () => {
        it('set the file writeprotected', () => {
            expect(fsutils.setFileWriteProtected(filepath, true)).toBe(true);
            expect(fsutils.isFileWriteProtected(filepath)).toBe(true);
        });
    });

    describe('on method setFileWriteProtected()', () => {
        it('set the file writeprotected and back again', () => {
            expect(fsutils.setFileWriteProtected(filepath, true)).toBe(true);
            expect(fsutils.isFileWriteProtected(filepath)).toBe(true);
            expect(fsutils.setFileWriteProtected(filepath, false)).toBe(true);
            expect(fsutils.isFileWriteProtected(filepath)).toBe(false);
        });
    });
});
