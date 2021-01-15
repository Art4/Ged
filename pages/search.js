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
document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            ipcRenderer.send('showcontextmenu');
            break;
        }
        node = node.parentNode;
    }
});

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

// open links in external browser
var externalButtons = document.getElementsByClassName('open-external');

for (var i = 0; i < externalButtons.length; i++) {
    externalButtons[i].addEventListener('click', function(e) {
        e.preventDefault();
        ipcRenderer.send('openexternalpage', this.href);
    }, false);
}

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
    ipcRenderer.send('closeapp');
});

settingsButton.addEventListener('click', (event) => {
    ipcRenderer.send('opensettingspage');
});

searchWin.addEventListener('mouseover', (event) => {
    ipcRenderer.send('removeopacity');
});

searchWin.addEventListener('mouseleave', (event) => {
    ipcRenderer.send('setopacity');
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
