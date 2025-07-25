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
'use strict';

var ipcRenderer;
var fs;
var config = null;
var cfg = new Array();

const DraftProperties = require('./draftproperties');
let getDraftProperties = new DraftProperties();

var returnMessage = '';
var returnQuery = '';

// Hauptprozess
function run(input, draft, mode, revision)
{
    return new Promise((resolve, reject) => {
        // Wenn keine Eingabe gemacht wurde, Fehler ausgeben
        if (input.getQuery() == '')
        {
            reject('Warte auf Eingabe...');
            return false;
        }

        // Suchstring analysieren
        var query_vars = get_query_vars(input, draft, mode, revision);

        // Wenn keine Endung gesetzt wurde, den Defaultwert verwenden
        if (query_vars['file_type'] === null) {
            query_vars['file_type'] = cfg['default_file_type'];
        }

        // 3D-Ordner öffnen
        if (query_vars['action'] == 'explorer') {
            run_explorer(query_vars, resolve, reject);
            return true;
        }

        // Index zur Datei öffnen
        if (query_vars['action'] == 'index') {
            run_index(query_vars, draft, resolve, reject);
            return true;
        }

        // Richtigen Dateinamen finden
        var results = build_file_name(input, draft, query_vars);

        if (results['error'] === true) {
            // Index öffnen, wenn die Datei nicht existiert
            // since v1.1.0
            run_index(query_vars, draft, resolve, reject);
            return true;
        }

        query_vars['filename'] = results['filename'];
        query_vars['revision'] = results['revision'];

        // Datei öffnen
        ipcRenderer.send('openfile', query_vars['main_dir'] + query_vars['filename']);

        // Rückmeldung generieren
        if (query_vars['file_type'] !== 'dft' || draft.identifier < 36251) {
            resolve(query_vars['filename'] + ' wird geöffnet');
            return true;
        }

        // Prüfen, ob Draft richtiges Template hat
        getDraftProperties.fromFilePath(query_vars['main_dir'] + query_vars['filename'])
            .then((data) => {
                if (data.has('System.Document.Template') && data.get('System.Document.Template').trim() !== 'BKM_2019.dft') {
                    resolve(query_vars['filename'] + ' <span class="text-danger fa-solid fa-triangle-exclamation" title="Diese Zeichnung verwendet nicht die aktuellste Zeichnungsvorlage"></span> wird geöffnet');
                } else {
                    resolve(query_vars['filename'] + ' wird geöffnet');
                }
            })
            .catch((err) => {
                resolve(query_vars['filename'] + ' wird geöffnet');
            });
    });
};

// Sucht und öffnet den 3D-Ordner einer Zeichnung
// since v1.0.3 (ausgelagert)
function run_explorer(query_vars, resolve, reject)
{
    // Wenn der Ordner nicht existiert, Fehler ausgeben
    if (fs.existsSync(query_vars['3D_dir']+'\\') === false)
    {
        set_query(query_vars['query']);

        reject('Der Ordner '+query_vars['3D']+' existiert nicht.');
        return false;
    }

    // Eingabefeld leeren
    set_query('');

    // 3D-Ordner öffnen
    ipcRenderer.send('openfile', query_vars['3D_dir']);

    resolve('Öffne den Ordner '+query_vars['3D']);
    return true;
}

//Index zur Datei öffnen
//since v1.0.2
//ausgelagert since v1.0.3
function run_index(query_vars, draft, resolve, reject)
{
    var near = draft.getNearestFile();

    if(near === null)
    {
        set_query(query_vars['query']);

        reject('Keine ähnliche Datei gefunden...');
        return false;
    }

    //Eingabefeld leeren
    set_query('');

    //Datei öffnen
    ipcRenderer.send('openfileinfolder', near.getAbsolutePath());

    //Fertig
    resolve('Index von ' + query_vars['filename'] + ' wird geöffnet');
    return true;
}

//Setzt den übergebenen String in das Suchfeld
function set_query(v)
{
    returnQuery = v;
    return true;
}

//Setzt eine Nachricht unter das Suchfeld
function message(v)
{
    returnMessage = v;
    return true;
}

//analysiert den Suchstring und gibt alle notwendigen Information zurück.
function get_query_vars(input, draft, mode, revision)
{
    var arr = new Array();
    arr['query'] = input.getQuery();

    /* Befehle abfangen */
    arr['action'] = parse_actions(mode);

    /* Endung abfangen */
    arr['file_type'] = input.getType();

    /* Revisionen abfangen */
    arr['revision'] = revision;

    // Jetzt müsste nur noch der Dateiname übrig sein
    arr['filename'] = input.getIdentifier();

    /* Zeichnungspfad bestimmen */
    arr['3D_dir'] = draft.get3DFolderPath();
    arr['main_dir'] = arr['3D_dir'].slice(0, -8);
    arr['3D'] = input.getIdentifier() + '_3D';

    /* Pfad zum 3D-Ordner */
    //-------------------

    return arr;
}

// überprüft die übergebenen Befehle ab und gibt sie zurück
// So können später einfacher neue Befehle hinzugefügt werden
function parse_actions(c)
{
    if (c === null) {
        return 'open';
    }
    // Grossschreibung
    var a = c.toUpperCase();

    // Explorer
    if(a == 'E')
    {
        return 'explorer';
    }

    // Open Advanced
    if(a == 'A')
    {
        return 'open_advanced';
    }

    // Index
    if(a == 'I')
    {
        return 'index';
    }

    // Open
    if(a == 'O')
    {
        return 'open';
    }

    //Default ist open
    return 'open';
}

/* FILE HANDLER FUNCTIONS */
function build_file_name(input, draft, qv)
{
    var files = draft.getFiles();
    var file = null;

    var path = qv['main_dir'];
    var name = qv['filename'];
    var rev = qv['revision'];
    var type = qv['file_type'];

    //Ausgabe vorbereiten
    var arr = new Array();
    arr['error'] = false;
    arr['filename'] = '';
    arr['revision'] = '';

    var search_for = function (files, rev, type) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].getRevision() === rev && files[i].getExtension().toLowerCase() === type.toLowerCase()) {
                return files[i];
            }
        }

        return null;
    };

    //Wenn explizit eine Revision angegeben wurde, dann nach dieser suchen
    file = search_for(files, rev, type);

    if (file) {
        arr['filename'] = name + '-R' + rev + '.' + file.getExtension();
        arr['revision'] = rev;
        return arr;
    }

    //Wenn nichts gefunden wurde, aber Rev = 0 ist, auf Datei ohne Rev prüfen
    if (rev == 0) {
        file = search_for(files, null, type);

        if (file) {
            arr['filename'] = name + '.' + file.getExtension();
            arr['revision'] = false;
            return arr;
        }
    }

    //since 1.0.1
    //Noch ein letzter Versuch, die Zeichnung im 3D-Ordner zu finden
    //Nur auf Befehl "open_advanced" prüfen, ob ein 3D-Ordner existiert
    if (qv['action'] == 'open_advanced') {
        if (fs.existsSync(qv['3D_dir']+'\\')) {
            if (fs.existsSync(qv['3D_dir'] + '\\' + name + '-R0' + '.' + type)) {
                arr['filename'] = qv['3D'] + '\\' + name + '-R0' + '.' + type;
                arr['revision'] = '0';
                return arr;
            }
        }
    }

    // Wenn wir immer noch hier sind, wurde nichts gefunden

    // Fehler ausgeben
    arr['error'] = true;
    arr['error_message'] = name + '.' + type + ' nicht gefunden';
    return arr;
}

// Constructor
function Kernel(cnf, filesystem, ipc) {
    config = cnf;
    fs = filesystem;
    ipcRenderer = ipc;
}

Kernel.prototype.handleInput = function(input, output, draft, mode, revision) {
    // Reload Config, because it could have changed
    cfg['base_dir'] = config.get('base_dir', 'H:\\Zeichnungen\\');
    cfg['default_file_type'] = config.get('default_file_type', 'pdf');

    run(input, draft, mode, revision)
        .then((msg) => {
            if (returnQuery === '') {
                output.end(msg);
            } else {
                output.destroy(msg);
            }
        })
        .catch((err) => {
            console.log(err);
            output.destroy(err);
        });

};

// export the class
module.exports = Kernel;
