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

const electron = require('electron');
const {app, Notification} = electron;
const Utils = require('./src/window-utils.js');
const autoUpdater = require('electron-updater').autoUpdater;
const isDevEnv = ('ELECTRON_IS_DEV' in process.env);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit app in favor of the first instance
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

// Someone tried to run a second instance, we should focus our window.
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function createMainWindow () {
    // Create windows for search and settings
    mainWindow = Utils.createWindows(isDevEnv);

    // Ignore errors in autoUpdater
    autoUpdater.on('error', (err) => {
        // #TODO Log autoUpdater errors
        console.log(err);
    });

    // Restart after update downloaded
    autoUpdater.on('update-downloaded', (info) => {
        console.log(info);
        new Notification({
            title: 'Neues Update ist verfügbar',
            body: `Ged Version ${info.version} wurde heruntergeladen und wird jetzt automatisch installiert.`,
            icon: `${app.getAppPath()}/pages/assets/img/icon-256.png`
        }).show();

        setTimeout(() => {
            autoUpdater.quitAndInstall(true, true);
        }, 5000);
    });

    // Check for updates
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow();
    }
});
