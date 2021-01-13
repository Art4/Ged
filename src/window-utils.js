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

const {ipcRenderer} = require('electron');
const packageData = require('../package.json');

function Utils() {}

Utils.changeWindowOpacity = function(startOpacity, endOpacity, changeOpacityCallback) {
    // var startOpacity = ipcRenderer.sendSync('getopacity');

    var diffOpacity = endOpacity - startOpacity;
    var increaseOpacity = (diffOpacity > 0);
    var steps = Math.abs(Math.floor(diffOpacity/0.1));

    function changeOpacity(currentOpacity, endOpacity, currentStep, steps) {
        if (currentStep >= steps) {
            changeOpacityCallback(endOpacity);
            return;
        }

        currentStep++;

        if (increaseOpacity) {
            currentOpacity = currentOpacity + 0.1;
        } else {
            currentOpacity = currentOpacity - 0.1;
        }
        setTimeout(function() {
            changeOpacityCallback(currentOpacity);
            changeOpacity(currentOpacity, endOpacity, currentStep, steps);
        }, 25);
    }

    changeOpacity(startOpacity, endOpacity, 0, steps);
};

Utils.getAppVersion = function() {
    return packageData.version;
};

module.exports = Utils;
