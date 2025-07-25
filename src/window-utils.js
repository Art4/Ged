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

const {app, BrowserWindow, ipcMain, ipcRenderer, Menu, MenuItem, nativeImage, screen, shell} = require('electron');
const Config = require('./config.js');
const config = new Config();

let appBounds = {};

let calcCoor = function(screenSize, windowSize) {
    return Math.floor(screenSize / 2) - Math.floor(windowSize / 2);
};

function initAppBounds() {
    let width = 150;
    let height = 120;

    let xCustom = config.get('displayX', null);
    let yCustom = config.get('displayY', null);

    if (xCustom === null) {
        xCustom = calcCoor(screen.getPrimaryDisplay().workAreaSize.width, width);
        config.set('displayX', xCustom);
    }

    if (yCustom === null) {
        yCustom = calcCoor(screen.getPrimaryDisplay().workAreaSize.height, height);
        config.set('displayY', yCustom);
    }

    appBounds = {
        createdAt: Date.now(),
        width: width,
        height: height,
        x: xCustom,
        y: yCustom
    };

    const isVisible = screen.getAllDisplays().some(display => {
        return isBoundsWithinBounds(appBounds, display.bounds);
    });

    if (! isVisible) {
        appBounds = {
            createdAt: Date.now(),
            width: width,
            height: height,
            x: calcCoor(screen.getPrimaryDisplay().workAreaSize.width, width),
            y: calcCoor(screen.getPrimaryDisplay().workAreaSize.height, height),
        };
    }
}

function isBoundsWithinBounds(boundsA, boundsB) {
    return (
        boundsA.x >= boundsB.x
        && boundsA.y >= boundsB.y
        && boundsA.x + boundsA.width <= boundsB.x + boundsB.width
        && boundsA.y + boundsA.height <= boundsB.y + boundsB.height
    );
}

function Utils() {}

Utils.createWindows = function(isDevEnv) {
    let mainWindow;

    initAppBounds();

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: appBounds.width,
        height: appBounds.height,
        x: appBounds.x,
        y: appBounds.y,
        resizable: false,
        frame: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: config.get('always_foreground', true),
        fullscreenable: false,
        skipTaskbar: config.get('skip_taskbar', true),
        focusable: true, // Must be true, or input fields are no longer focusable
        icon: nativeImage.createFromPath(`${app.getAppPath()}/pages/assets/img/icon-256.png`),
        acceptFirstMouse: true,
        backgroundColor: '#00007bff',
        transparent: true,
        opacity: config.get('opacity', 1),
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile('pages/search.html')

    // Open the DevTools if in dev environment
    if (isDevEnv) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    // Save new position if the window is moved.
    mainWindow.on('move', () => {
        let windowBounds = mainWindow.getBounds();
        let lastChangeOfBounds = Date.now();
        appBounds.createdAt = lastChangeOfBounds;

        // Only save after 250ms, if position hasn't changed
        setTimeout(function() {
            if (appBounds.createdAt > lastChangeOfBounds) {
                return;
            }

            appBounds.x = windowBounds.x;
            appBounds.y = windowBounds.y;

            config.set('displayX', appBounds.x);
            config.set('displayY', appBounds.y);
        }, 250);
    });

    // Focus search field on focus window
    mainWindow.on('focus', () => {
        Utils.changeWindowOpacity(mainWindow.getOpacity(), 1, function(opacity) {
            mainWindow.setOpacity(opacity);
        });
        mainWindow.webContents.send('windowgetfocused');
    });

    // Focus search field on focus window
    mainWindow.on('blur', () => {
        // wait 100ms to avoid racecondition with mouseover event
        setTimeout(function() {
            Utils.changeWindowOpacity(mainWindow.getOpacity(), config.get('opacity', 1), function(opacity) {
                mainWindow.setOpacity(opacity);
            });
        }, 100);
    });

    ipcMain.on('windowisfocused', function (e) {
        e.returnValue = mainWindow.isFocused();
    });

    ipcMain.on('getopacity', function (e) {
        e.returnValue = mainWindow.getOpacity();
    });

    ipcMain.on('setopacity', function (e) {
        if (! mainWindow.isFocused()) {
            Utils.changeWindowOpacity(mainWindow.getOpacity(), config.get('opacity', 1), function(opacity) {
                mainWindow.setOpacity(opacity);
            });
        }
    });

    ipcMain.on('removeopacity', function (e) {
        if (! mainWindow.isFocused()) {
            // wait 100ms to avoid racecondition with mouseover event
            setTimeout(function() {
                Utils.changeWindowOpacity(mainWindow.getOpacity(), 1, function(opacity) {
                    mainWindow.setOpacity(opacity);
                });
            }, 100);
        }
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
            autoHideMenuBar: true,
            backgroundColor: '#ffffff',
            icon: nativeImage.createFromPath(`${app.getAppPath()}/pages/assets/img/icon-256.png`),
            webPreferences: {
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegration: true
            },
            show: false,
        });

        // settingsWindow.webContents.openDevTools({mode: 'detach'})

        settingsWindow.center();

        settingsWindow.once('ready-to-show', () => {
            settingsWindow.show();
            // settingsWindow.focus();
        });

        // Trigger to mainWindow if settingspage is closed
        settingsWindow.on('close', () => {
            mainWindow.webContents.send('settingspageclosed');
        });

        settingsWindow.loadFile('pages/settings.html');

        // Open the DevTools if in dev environment
        if (isDevEnv) {
            settingsWindow.webContents.openDevTools({mode: 'detach'});
        }
    });

    ipcMain.on('closesettingspage', function (e) {
        if (settingsWindow) {
            mainWindow.setAlwaysOnTop(config.get('always_foreground', true));
            mainWindow.setOpacity(config.get('opacity', 1));
            mainWindow.setSkipTaskbar(config.get('skip_taskbar', true));

            // setup Autolaunch
            app.setLoginItemSettings({
                openAtLogin: config.get('autolaunch', true),
            });

            settingsWindow.close();
            settingsWindow = null;
        }
    });

    ipcMain.on('openfile', function (e, path) {
        shell.openPath(path);
    });

    ipcMain.on('openfileinfolder', function (e, path) {
        shell.showItemInFolder(path);
    });

    ipcMain.on('openexternalpage', function (e, url) {
        shell.openExternal(url);
    });

    const contextMenu = new Menu;
    // contextMenu.append(new MenuItem({label: 'Rückgängig machen', role: 'undo'}));
    // contextMenu.append(new MenuItem({label: 'Wiederherstellen', role: 'redo'}));
    // contextMenu.append(new MenuItem({type: 'separator'}));
    contextMenu.append(new MenuItem({label: 'Einfügen', role: 'paste'}));
    contextMenu.append(new MenuItem({label: 'Kopieren', role: 'copy'}));
    contextMenu.append(new MenuItem({label: 'Ausschneiden', role: 'cut'}));
    // contextMenu.append(new MenuItem({label: 'Löschen', role: 'delete'}));
    contextMenu.append(new MenuItem({type: 'separator'}));
    contextMenu.append(new MenuItem({label: 'Alle auswählen', role: 'selectall'}));

    ipcMain.on('showcontextmenu', function (e) {
        contextMenu.popup();
    });

    return mainWindow;
};

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

module.exports = Utils;
