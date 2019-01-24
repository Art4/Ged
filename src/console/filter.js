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

var operators = [
    'EQ',
    'NEQ',
    'LT',
    'LTE',
    'GT',
    'GTE',
];

// Constructor
function Filter(operator, value) {
    if (operators.indexOf(operator.toUpperCase()) < 0) {
        throw `"${operator}" is an invalid operator`;
    }

    this.operator = operator.toUpperCase();
    this.value = value;
}

// class methods
Filter.prototype.test = function(value) {
    if (this.operator === 'EQ') {
        return (value === this.value);
    }

    if (this.operator === 'NEQ') {
        return (value !== this.value);
    }

    if (this.operator === 'LT') {
        return (value < this.value);
    }

    return false;
};

// export the class
module.exports = Filter;
