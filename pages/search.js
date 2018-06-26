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

const utils = require('../src/window-utils.js');
const Kernel = require('../src/kernel.js');
const Request = require('../src/request.js');

const inputField = document.getElementById('inputField');
const output = document.getElementById('outputField');
const searchWin = document.getElementById('search__main');

var kernel = new Kernel();

inputField.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        var response = kernel.handleRequest(
            Request.createFromString(event.target.value)
        );

        console.log(response);
        output.innerHTML = response.getContent();
        event.target.value = '';
    }
});

searchWin.addEventListener('mouseover', (event) => {
    utils.changeWindowOpacity(1.0);
});
searchWin.addEventListener('mouseleave', (event) => {
    utils.changeWindowOpacity(0.4);
});
