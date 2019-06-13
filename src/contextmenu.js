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

const { remote } = require('electron');
const { Menu, MenuItem } = remote;

const inputMenu = new Menu();
// inputMenu.append(new MenuItem({label: 'Rückgängig machen', role: 'undo'}));
// inputMenu.append(new MenuItem({label: 'Wiederherstellen', role: 'redo'}));
// inputMenu.append(new MenuItem({type: 'separator'}));
inputMenu.append(new MenuItem({label: 'Einfügen', role: 'paste'}));
inputMenu.append(new MenuItem({label: 'Kopieren', role: 'copy'}));
inputMenu.append(new MenuItem({label: 'Ausschneiden', role: 'cut'}));
// inputMenu.append(new MenuItem({label: 'Löschen', role: 'delete'}));
inputMenu.append(new MenuItem({type: 'separator'}));
inputMenu.append(new MenuItem({label: 'Alle auswählen', role: 'selectall'}));

function Menus() {}

Menus.allowOnInputs = function(element) {
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let node = e.target;

        while (node) {
            if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
                inputMenu.popup(remote.getCurrentWindow());
                break;
            }
            node = node.parentNode;
        }
    });
};

module.exports = Menus;
