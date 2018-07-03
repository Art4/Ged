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
const electron = require('electron');
const {app, BrowserWindow, ipcMain, shell, nativeImage} = electron;
const Config = require('./src/config.js');
const config = new Config();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function createMainWindow () {
    var width = 150;
    var height = 120;

    var xCustom = config.get('displayX', null);
    var yCustom = config.get('displayY', null);

    var calcCoor = function(screenSize, windowSize) {
        return Math.floor(screenSize / 2) - Math.floor(windowSize / 2);
    };

    if (xCustom === null) {
        xCustom = calcCoor(electron.screen.getPrimaryDisplay().workAreaSize.width, width);
        config.set('displayX', xCustom);
    }

    if (yCustom === null) {
        yCustom = calcCoor(electron.screen.getPrimaryDisplay().workAreaSize.height, height);
        config.set('displayY', yCustom);
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        x: xCustom,
        y: yCustom,
        resizable: false,
        frame: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: config.get('always_foreground', true),
        fullscreenable: false,
        skipTaskbar: true,
        icon: nativeImage.createFromPath('./pages/assets/img/icon.png'),
        acceptFirstMouse: true,
        backgroundColor: '#007bff',
        opacity: config.get('opacity', 1)
    });

    // and load the index.html of the app.
    mainWindow.loadFile('pages/search.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode: 'detach'});

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    var lastWindowPosition = {
        createdAt: Date.now(),
        x: xCustom,
        y: yCustom,
    };

    // Save new position if the window is moved.
    mainWindow.on('move', () => {
        var position = mainWindow.getPosition();
        var createdAt = Date.now();

        positionQueue = {
            createdAt: createdAt,
            x: position[0],
            y: position[1],
        };

        // Only save after 250ms, if position hasn't changed
        setTimeout(function() {
            if (positionQueue.createdAt > createdAt) {
                return;
            }

            config.set('displayX', positionQueue.x);
            config.set('displayY', positionQueue.y);
        }, 250);
    });

    ipcMain.on('getopacity', function (e) {
        e.returnValue = mainWindow.getOpacity();
    });

    ipcMain.on('changeopacity', function (e, o) {
        mainWindow.setOpacity(o);
    });

    ipcMain.on('closeapp', function (e) {
        mainWindow.close();
    });

    var settingsWindow = null;

    ipcMain.on('opensettingspage', function (e) {
        settingsWindow = new BrowserWindow({
            width: 600,
            height: 800,
            parent: mainWindow,
            modal: true,
            frame: true,
            skipTaskbar: false,
            backgroundColor: '#ffffff',
            icon: nativeImage.createFromPath('./pages/assets/img/icon.png'),
        });

        // settingsWindow.webContents.openDevTools({mode: 'detach'})

        settingsWindow.once('ready-to-show', () => {
            settingsWindow.show();
            // settingsWindow.focus();
        });
        settingsWindow.loadFile('pages/settings.html');
    });

    ipcMain.on('closesettingspage', function (e) {
        if (settingsWindow) {
            mainWindow.setAlwaysOnTop(config.get('always_foreground', true));
            mainWindow.setOpacity(config.get('opacity', 1));

            settingsWindow.close();
            settingsWindow = null;
        }
    });

    ipcMain.on('openfile', function (e, path) {
        shell.openItem(path);
    });

    ipcMain.on('openfileinfolder', function (e, path) {
        shell.showItemInFolder(path);
    });

    ipcMain.on('openexternalpage', function (e, url) {
        shell.openExternal(url);
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
    if (mainWindow === null) {
        createMainWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
