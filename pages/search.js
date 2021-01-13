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

const Utils = require('../src/window-utils.js');
const Config = require('../src/config.js');
const { Application, Output } = require('../src/console');
const SearchInput = require('../src/searchinput.js');
const Menus = require('../src/contextmenu.js');
const EventEmitter = require('events');
const config = new Config();
const { ipcRenderer } = require('electron');
const fs = require('fs');

const inputField = document.getElementById('inputField');
const outputElement = document.getElementById('outputField');
const searchWin = document.getElementById('search__wrapper');
const closeButton = document.getElementById('close-button');
const settingsButton = document.getElementById('settings-button');
const menuButton = document.getElementById('menu-button');
const menubox = document.getElementById('menubox');

const app = Application.create(config, fs, ipcRenderer);

class Search extends EventEmitter {}
const search = new Search();

// Allow context menu on input and textarea fields
Menus.allowOnInputs(document.body);

// Register search events
search.on('search.output', (message) => {
    outputElement.innerHTML = message;
});

search.on('search.start', (event) => {
    var input = new SearchInput(event.target.value);
    var buffer = new Output();

    buffer.on('data', (data) => {
        search.emit('search.output', data);
    });
    buffer.on('error', (error) => {
        search.emit('search.output', error);
    });
    buffer.on('ended', () => {
        // Input field leeren
        event.target.value = '';
    });

    buffer.emit('data', '<span class="fas fa-spinner fa-spin"></span>');

    app.run(input, buffer);
});

// Register universal events
Utils.registerEventlistener();

// Prevent middleclick on links of they will be open in a browser window
document.addEventListener('auxclick', (event) => {
    if (event.target.localName === 'a') {
        event.preventDefault();
        return
    }
    var parent = event.target.parentElement;
    if (parent.localName === 'a') {
        event.preventDefault();
        return
    }
}, false);

inputField.addEventListener('keyup', (event) => {
    if (menubox.classList.contains('show')) {
        menuButton.click();
    }
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
    if (! ipcRenderer.sendSync('windowisfocused')) {
        Utils.changeWindowOpacity(ipcRenderer.sendSync('getopacity'), 1, function(opacity) {
            ipcRenderer.send('changeopacity', opacity);
        });
    }
});

searchWin.addEventListener('mouseleave', (event) => {
    if (! ipcRenderer.sendSync('windowisfocused')) {
        // wait 100ms to avoid racecondition with mouseover event
        setTimeout(function() {
            Utils.changeWindowOpacity(ipcRenderer.sendSync('getopacity'), config.get('opacity', 1), function(opacity) {
                ipcRenderer.send('changeopacity', opacity);
            });
        }, 100);
    }
});

// Effects
(function () {
    var rotated = true;

    // Let the menu icon rotate on click
    menuButton.addEventListener('click', (event) => {
        if (rotated === false) {
            return;
        }

        rotated = false;

        setTimeout(() => {
            rotated = true;
        }, 250);

        document.getElementById('menu-button-icon').classList.toggle('open');
    });

    // close the menu if search is on focus
    inputField.addEventListener('focus', () => {
        if (menubox.classList.contains('show')) {
            menuButton.click();
        }
    });

    // close the menu if settingspage was closed
    ipcRenderer.on('settingspageclosed', (e) => {
        if (menubox.classList.contains('show')) {
            menuButton.click();
        }
    });

    // focus search field
    ipcRenderer.on('windowgetfocused', (e) => {
        inputField.focus();
    });
})();
