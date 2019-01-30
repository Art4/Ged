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
'use strict';

const Filter = require('./filter.js');

// Constructor
function FilePicker() {
    this.revFilter = [];
    this.extFilter = [];
}

// static methods
FilePicker.pickOneFromList = function(files, rev, ext) {
    return new Promise((resolve, reject) => {
        var fp = new FilePicker();
        fp.addRevisionFilter(new Filter('eq', rev));
        fp.addExtensionFilter(new Filter('eq', ext));

        fp.pickFromList(files)
            .then((results) => {
                resolve(results.shift());
            });
    });
};

// class methods
FilePicker.prototype.addRevisionFilter = function(filter) {
    this.revFilter.push(filter);
};

FilePicker.prototype.addExtensionFilter = function(filter) {
    this.extFilter.push(filter);
};

FilePicker.prototype.pickFromDraft = function(draft) {
    return this.pickFromList(draft.getFiles());
};

FilePicker.prototype.pickFromList = function(files) {
    return new Promise((resolve, reject) => {
        var result = files.filter((element) => {
            if (! this.revFilter.every((filter) => {
                return filter.test(element.getRevision());
            })) {
                return false;
            }

            if (! this.extFilter.every((filter) => {
                return filter.test(element.getExtension());
            })) {
                return false;
            }

            return true;
        });

        resolve(result);
    });
};

// export the class
module.exports = FilePicker;
