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

const Utils = require('../src/window-utils.js');
const Kernel = require('../src/kernel.js');
const Request = require('../src/request.js');

const inputField = document.getElementById('inputField');
const output = document.getElementById('outputField');
const searchWin = document.getElementById('search__wrapper');
const closeButton = document.getElementById('close-button');

var kernel = new Kernel();

// Set app version in menu
(function () {
    var elements = document.getElementsByClassName('app-version');

    for (const element of elements) {
        element.innerHTML = Utils.getAppVersion();
    }
})();

inputField.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        var response = kernel.handleRequest(
            Request.createFromString(event.target.value)
        );

        console.log(response);
        output.innerHTML = response.getContent();
        event.target.value = response.getQuery();
    }
});

closeButton.addEventListener('click', (event) => {
    Utils.closeWindow();
});

searchWin.addEventListener('mouseover', (event) => {
    Utils.changeWindowOpacity(1.0);
});

searchWin.addEventListener('mouseleave', (event) => {
    // wait 100ms to avoid racecondition with mouseover event
    setTimeout(function() {
        Utils.changeWindowOpacity(0.4);
    }, 100);
});

// Let the menu icon rotate
(function () {
    var button = document.getElementById('menu-button');
    var rotated = true;

    button.addEventListener('click', (event) => {
        if (rotated === false) {
            return;
        }

        rotated = false;

        setTimeout(() => {
            rotated = true;
        }, 250);

        document.getElementById('menu-button-icon').classList.toggle('open');
    });
})();
