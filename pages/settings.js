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

const { ipcRenderer } = require('electron');
const Config = require('../src/config.js');
const config = new Config();
const packageData = require('../package.json');

const draftPathInput = document.getElementById('formDraftPathInput');
const defaultFileTypeInput = document.getElementById('formDefaultFileTypeInput');
const alwaysForegroundInput = document.getElementById('formAlwaysForegroundInput');
const autolaunchInput = document.getElementById('formAutolaunchInput');
const skipTaskbarInput = document.getElementById('formSkipTaskbarInput');
const opacityInput = document.getElementById('formOpacityInput');
const saveButton = document.getElementById('formSaveButton');
const abortButton = document.getElementById('formAbortButton');

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

(function() {
    draftPathInput.value = config.get('base_dir', '');
    defaultFileTypeInput.value = config.get('default_file_type', 'pdf');
    alwaysForegroundInput.checked = config.get('always_foreground', true);
    autolaunchInput.checked = config.get('autolaunch', true);
    skipTaskbarInput.checked = config.get('skip_taskbar', true) ? false : true;
    opacityInput.value = config.get('opacity', 1);

    // Set app version
    var elements = document.getElementsByClassName('app-version');

    for (const element of elements) {
        element.innerHTML = packageData.version;;
    }

    // open links in external browser
    var externalButtons = document.getElementsByClassName('open-external');

    for (var i = 0; i < externalButtons.length; i++) {
        externalButtons[i].addEventListener('click', function(e) {
            e.preventDefault();
            ipcRenderer.send('openexternalpage', this.href);
        }, false);
    }
})();

saveButton.addEventListener('click', (event) => {
    config.set('base_dir', draftPathInput.value);
    config.set('default_file_type', defaultFileTypeInput.value);
    config.set('always_foreground', alwaysForegroundInput.checked);
    config.set('autolaunch', autolaunchInput.checked);
    config.set('skip_taskbar', !skipTaskbarInput.checked);
    config.set('opacity', parseFloat(opacityInput.value));

    ipcRenderer.send('closesettingspage');
});

abortButton.addEventListener('click', (event) => {
    ipcRenderer.send('closesettingspage');
});
