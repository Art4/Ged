/*
 * Ged-App
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
// const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const {app, BrowserWindow} = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function createWindow () {
    var width = 150;
    var height = 100;

    var xCustom = 1750; // TODO get this from settings
    var yCustom = 450; // TODO get this from settings

    var parseCoor = function(customSize, screenSize, windowSize) {
        if (customSize) {
            return customSize;
        }

        return Math.floor(screenSize / 2) - Math.floor(windowSize / 2);
    };

    xCustom = parseCoor(xCustom, electron.screen.getPrimaryDisplay().workAreaSize.width, width);
    yCustom = parseCoor(yCustom, electron.screen.getPrimaryDisplay().workAreaSize.height, height);

    if (! xCustom) {

    }

    // Create the browser window.
    win = new BrowserWindow({
        width: width,
        height: height,
        x: xCustom,
        y: yCustom,
        resizable: false,
        frame: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: true,
        fullscreenable: false,
        skipTaskbar: true,
        acceptFirstMouse: true,
        backgroundColor: '#007bff',
        opacity: 0.4
    });

    // and load the index.html of the app.
    win.loadFile('pages/search.html')

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    // Change opacity if on focus
    win.on('focus', () => {
        win.setOpacity(1.0);
    });
    // Change opacity if focus lost
    win.on('blur', () => {
        win.setOpacity(0.4);
    });
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.