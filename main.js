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

const electron = require('electron');
const {app, ipcMain, Notification} = electron;
const Utils = require('./src/window-utils.js');
const autoUpdater = require('electron-updater').autoUpdater;
const isDevEnv = ('ELECTRON_IS_DEV' in process.env);
const Logger = require('electron-log');
const packageData = require('./package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isGedEol = (new Date() > new Date(Date.UTC(2025, 7, 1))); // Ged is EOL since 2025-10-01

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
    Logger.initialize();
    Logger.transports.file.fileName = isDevEnv ? 'dev.log' : 'main.log';

    const updateLogger = Logger.scope('AutoUpdater');

    Logger.info('Ged ' + packageData.version + ' started');

    // Create windows for search and settings
    mainWindow = Utils.createWindows(isDevEnv);

    // autoUpdater.forceDevUpdateConfig = true;

    // Log errors from autoUpdater
    autoUpdater.logger = updateLogger;

    autoUpdater.on('update-not-available', (info) => {
        updateLogger.info('no update available');
    });

    // Restart after update downloaded
    autoUpdater.on('update-downloaded', (info) => {
        new Notification({
            title: 'Für Ged ist ein Update verfügbar',
            body: `Ged ${info.version} wurde heruntergeladen und wird jetzt automatisch installiert.`,
            icon: `${app.getAppPath()}/pages/assets/img/icon-256.png`
        }).show();

        setTimeout(() => {
            autoUpdater.quitAndInstall(true, true);
        }, 5000);
    });

    ipcMain.on('ged-is-eol-check', function (e) {
        Logger.info('isGedEol:', isGedEol);

        if (isGedEol === true) {
            e.reply('ged-is-eol-response', 'Ged is end of life.');
        }
    });

    // Check for updates
    setTimeout(() => {
        if (isGedEol === true) {
            updateLogger.info('Ged is end of life, no updates will be checked');
            return;
        }

        updateLogger.info('start check for updates');
        autoUpdater.checkForUpdates().then(info => {
            updateLogger.info(info);
            // Wenn Updateserver erreichbar ist, wird Ged noch maintained
            isGedEol = false;
        }).catch(err => {
            updateLogger.info(err);
            // Wenn Updateserver erreichbar ist, wird Ged noch maintained
            isGedEol = true;
        });
    }, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    Logger.info('Ged ' + packageData.version + ' closed');

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
