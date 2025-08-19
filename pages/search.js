/*
 * Ged
 * Copyright (C) 2011-2025  Artur Weigandt  https://weigandtlabs.de/kontakt

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

const Config = require('../src/config.js');
const { Application, Input, Output } = require('../src/console');
const SearchInput = require('../src/searchinput.js');
const EventEmitter = require('events');
const config = new Config();
const { ipcRenderer } = require('electron');
const fs = require('fs');
const Logger = require('electron-log');

const inputField = document.getElementById('inputField');
const outputElement = document.getElementById('outputField');
const searchWin = document.getElementById('search__wrapper');
const closeButton = document.getElementById('close-button');
const settingsButton = document.getElementById('settings-button');
const menuButton = document.getElementById('menu-button');
const menubox = document.getElementById('menubox');

const app = Application.create(config, fs, ipcRenderer, Logger);

class Search extends EventEmitter {}
const search = new Search();
const searchLogger = Logger.scope('Search');

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
search.on('search.input', (message) => {
    inputField.value = message;
    inputField.classList.remove('is-valid');
    inputField.classList.remove('is-invalid');
});

search.on('search.output', (message) => {
    outputElement.innerHTML = message;
});

search.on('search.quickvalidation', (input) => {
    var buffer = new Output();

    buffer.on('data', (data) => {
        inputField.classList.remove('is-invalid');
        inputField.classList.add('is-valid');
    });
    buffer.on('error', (error) => {
        inputField.classList.remove('is-valid');
        inputField.classList.add('is-invalid');
    });

    app.run(input, buffer);
});

search.on('search.start', (input) => {
    var buffer = new Output();

    buffer.on('data', (data) => {
        searchLogger.info('output:', data);
        search.emit('search.output', data);
    });
    buffer.on('error', (error) => {
        inputField.classList.remove('is-valid');
        inputField.classList.add('is-invalid');
        searchLogger.info('error output:', error);
        search.emit('search.output', error);
    });
    buffer.on('ended', () => {
        // Input field leeren
        search.emit('search.input', '');
    });

    buffer.emit('data', '<span class="fa-solid fa-spinner fa-spin"></span>');

    searchLogger.info('started:', input.getQuery());

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

    // Initialize history array and index
    if (!window.inputHistory) {
        window.inputHistory = [];
        window.inputHistoryIndex = -1;
    }

    if (event.key === 'Enter') {
        // Save to history if not empty and not duplicate of last entry
        const value = event.target.value;
        if (value.length > 0) {
            window.inputHistory.push(value);
        }
        window.inputHistoryIndex = window.inputHistory.length;
        search.emit('search.start', new SearchInput(value, config.get('default_action')));
    } else if (event.key === 'ArrowUp') {
        if (window.inputHistory.length > 0 && window.inputHistoryIndex > 0) {
            window.inputHistoryIndex--;
            inputField.value = window.inputHistory[window.inputHistoryIndex];
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);
        } else {
            // If we are at the top of the history, keep cursor at the end
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);
        }
    } else if (event.key === 'ArrowDown') {
        if (window.inputHistory.length > 0 && window.inputHistoryIndex < window.inputHistory.length - 1) {
            window.inputHistoryIndex++;
            inputField.value = window.inputHistory[window.inputHistoryIndex];
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);
        } else if (window.inputHistoryIndex === window.inputHistory.length - 1) {
            window.inputHistoryIndex++;
            inputField.value = '';
        }
    }

    // quick validation
    if (inputField.value.length < 5) {
        inputField.classList.remove('is-valid');
        inputField.classList.remove('is-invalid');
    } else if (inputField.value.length === 5) {
        search.emit('search.quickvalidation', new Input(['list', inputField.value]));
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

    ipcRenderer.on('health-check-response', (e, results) => {
        if (results.length > 0) {
            let result = results[0];
            search.emit('search.output', '<span class="text-bg-' + result.severity + '">' + result.title + '</span>');

            searchLogger.info('show health-check response: ', result);
        }
    });

    setTimeout(() => {
        ipcRenderer.send('health-check');
    }, 10000);
})();
