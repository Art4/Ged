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
    describe('on generateSubfolderNameFromIdentifier() method with different arguments', () => {
        var values = new Array(
            new Array('10000', 'Z.Nr.10000-10499\\'),
            new Array('12345', 'Z.Nr.12000-12499\\'),
            new Array('12499', 'Z.Nr.12000-12499\\'),
            new Array('12500', 'Z.Nr.12500-12999\\'),
            new Array('35689', 'Z.Nr.35500-35999\\'),
            new Array('78000', 'Z.Nr.78000-78499\\'),
            new Array('99999', 'Z.Nr.99500-99999\\'),
        );

        for (var i = 0; i < values.length; i++) {
            describe('returns correct subfolder name', () => {
                var draftpool = new Draftpool({}, '')
                var data = values[i];

                it('the absolute path with the right value', () => {
                    expect(draftpool.generateSubfolderNameFromIdentifier(data[0])).toBe(data[1]);
                });
            });
        }
    });

    describe('on findDraftByString() with incorrect identifier', () => {
        var fs = {};
        var path = '';
        var draftpool = new Draftpool(fs, path);

        it('(not an integer) returns null', () => {
            expect(draftpool.findDraftByString('not-an-identifier')).toBe(null);
        });

        it('(too short) returns null', () => {
            expect(draftpool.findDraftByString('1234')).toBe(null);
        });

        it('(too long) returns null', () => {
            expect(draftpool.findDraftByString('123456')).toBe(null);
        });
    });

    describe('on findDraftByString() with notexisting folder', () => {
        var fs = {
            existsSync: function(path) {
                return false;
            }
        };
        var path = '';
        var draftpool = new Draftpool(fs, path);

        it('returns null', () => {
            expect(draftpool.findDraftByString('50999')).toBe(null);
        });
    });

    describe('with fs mock on findDraftByString()', () => {
        var fs = {
            readdirSync: function(path) {
                return new Array(
                    '12338.tif',
                    // '12339.tif', // this file is missing
                    '12340.tif',
                    '12341.bak',
                    '12341.dwg',
                    '12341.dxf',
                    '12342.dft',
                    '12342.pdf',
                    '12342_3D',
                    '12343.dft',
                    '12343.pdf',
                    '12343-R2.dft',
                    '12343-R2.pdf',
                    '12344-R0.dft',
                    '12344-R1.dft',
                    '12344-R2.dft',
                    '12344-R2.pdf',
                    '12345-R0.dft',
                    '12345-R0_Aufstellung.stp',
                    '12345-R1.dft',
                    '12345-R1.log',
                    '12345-R1.pdf',
                    '12345-R1_Aufstellung.stp',
                    '12346-R0 Blatt 1 von 2.dwg',
                    '12346-R0 Blatt 2 von 2.dwg',
                    '12346-R0.dft',
                    '12346-R0.pdf',
                );
            },
            statSync: function(path) {
                // return stat mock
                return {
                    isDirectory: function() {
                        return (path.slice(-3) === '_3D');
                    },
                };
            },
            existsSync: function(path) {
                return true;
            },
        };
        var path = '\\base_dir\\';
        var draftpool = new Draftpool(fs, path);

        it('with correct identifier returns Draft', () => {
            var draft = draftpool.findDraftByString('12345');

            expect(draft).toEqual(jasmine.any(Draft));
            expect(draft.getFiles().length).toBe(6);
            expect(draft.getNearestFile().getAbsolutePath()).toBe(
                '\\base_dir\\Z.Nr.12000-12499\\12345-R1_Aufstellung.stp'
            );
        });

        it('with correct identifier returns Draft', () => {
            var draft = draftpool.findDraftByString('12338');

            expect(draft).toEqual(jasmine.any(Draft));
            expect(draft.getFiles().length).toBe(1);
            expect(draft.getNearestFile().getAbsolutePath()).toBe(
                '\\base_dir\\Z.Nr.12000-12499\\12338.tif'
            );
        });

        it('with correct identifier returns Draft', () => {
            var draft = draftpool.findDraftByString('12339');

            expect(draft).toEqual(jasmine.any(Draft));
            expect(draft.getFiles().length).toBe(0);
            expect(draft.getNearestFile().getAbsolutePath()).toBe(
                '\\base_dir\\Z.Nr.12000-12499\\12340.tif'
            );
        });

        it('with correct identifier returns Draft and ignores folder', () => {
            var draft = draftpool.findDraftByString('12342');

            expect(draft).toEqual(jasmine.any(Draft));
            expect(draft.getFiles().length).toBe(2);
            expect(draft.getNearestFile().getAbsolutePath()).toBe(
                '\\base_dir\\Z.Nr.12000-12499\\12342.pdf'
            );
        });
    });

    describe('with full stack fs mock on findDraftByString()', () => {
        var getRandomArbitrary = function(min, max) {
            return Math.floor(Math.random() * (max - min) + min)+'';
        };

        var values = [
            ['23000'], // minimal
            ['23456'],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            [getRandomArbitrary(23000,23500)],
            ['23499'], // maximal
        ];

        for (var i = 0; i < values.length; i++) {
            describe('expect data and', () => {
                var fs = {
                    hitCounter: 0,
                    readdirSync: function(path) {
                        var files = new Array();
                        var i = 0;

                        // Create a list with 5000 files
                        for (var i = 0; i < 500; i++) {
                            var identifier = 23000+i;
                            files.push(identifier+'-R0.dft');
                            files.push(identifier+'-R0.dwg');
                            files.push(identifier+'-R0.pdf');
                            files.push(identifier+'-R1.dft');
                            files.push(identifier+'-R1.dwg');
                            files.push(identifier+'-R1.pdf');
                            files.push(identifier+'-R2.dft');
                            files.push(identifier+'-R2.dwg');
                            files.push(identifier+'-R2.pdf');
                            files.push(identifier+'_3D');
                        }

                        return files;
                    },
                    statSync: function(path) {
                        this.hitCounter++;
                        // return stat mock
                        return {
                            isDirectory: function() {
                                return (path.slice(-3) === '_3D');
                            },
                        };
                    },
                    existsSync: function(path) {
                        return true;
                    },
                };

                var identifier = values[i][0];

                it('shouldn\'t be run more than 20 times', () => {
                    var path = '\\base_dir\\';
                    var draftpool = new Draftpool(fs, path);
                    var draft = draftpool.findDraftByString(identifier);

                    expect(draft).toEqual(jasmine.any(Draft));
                    expect(draft.getNearestFile().getAbsolutePath()).toBe(
                        '\\base_dir\\Z.Nr.23000-23499\\'+identifier+'-R2.pdf'
                    );
                    expect(fs.hitCounter).toBeLessThanOrEqual(20);
                });
            });
        }
    });
});