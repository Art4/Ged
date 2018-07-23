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

const Utils = require('../src/window-utils.js');
const Config = require('../src/config.js');
const Kernel = require('../src/kernel.js');
const Request = require('../src/request.js');
const {Application, BufferedOutput, SearchInput} = require('../src/console');
const EventEmitter = require('events');
const fs = require('fs');

const config = new Config();
const inputField = document.getElementById('inputField');
const output = document.getElementById('outputField');
const searchWin = document.getElementById('search__wrapper');
const closeButton = document.getElementById('close-button');
const settingsButton = document.getElementById('settings-button');

var kernel = new Kernel({
    config: config,
});

const app = Application.create(config, fs);

class Search extends EventEmitter {}
const search = new Search();

// Register search events
search.on('search.output', (message) => {
    output.innerHTML = message;
});

search.on('search.start', (event) => {
    search.emit('search.output', '<span class="fas fa-spinner fa-spin"></span>');

    var buffer = new BufferedOutput();

    app.run(new SearchInput(event.target.value), buffer)
        .then(() => {
            search.emit('search.output', buffer.fetch());
            event.target.value = '';
        })
        .catch(() => {
            search.emit('search.output', buffer.fetch());
            event.target.value = event.target.value;
        });

    // kernel.handleRequest(Request.createFromString(event.target.value))
    //     .then((response) => {
    //         console.log(response);
    //         search.emit('search.output', response.getContent());
    //         event.target.value = response.getQuery();
    //     });
});

// Register universal events
Utils.registerEventlistener();

inputField.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        search.emit('search.start', event);
    }
});

closeButton.addEventListener('click', (event) => {
    Utils.closeWindow();
});

settingsButton.addEventListener('click', (event) => {
    Utils.openSettingsPage();
});

searchWin.addEventListener('mouseover', (event) => {
    Utils.changeWindowOpacity(1);
});

searchWin.addEventListener('mouseleave', (event) => {
    // wait 100ms to avoid racecondition with mouseover event
    setTimeout(function() {
        Utils.changeWindowOpacity(config.get('opacity', 1));
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
