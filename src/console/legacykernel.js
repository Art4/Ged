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
'use strict';

var ipcRenderer;
var fs;
var config = null;
var cfg = new Array();

/* Dir-Store definieren */
//-----------------------------
var rev_store = setup_rev_store();

var returnMessage = '';
var returnQuery = '';

//Hauptprozess
function run(input, draft, mode)
{
    //Wenn keine Eingabe gemacht wurde, Fehler ausgeben
    if(input.getQuery() == '')
    {
        message('Warte auf Eingabe...');
        return false;
    }

    //Suchstring analysieren
    var query_vars = get_query_vars(input, draft, mode);

    //Wenn keine Endung gesetzt wurde, den Defaultwert verwenden
    if (query_vars['file_type'] === null) {
        query_vars['file_type'] = cfg['default_file_type'];
    }

    //3D-Ordner öffnen
    if (query_vars['action'] == 'explorer') {
        run_explorer(query_vars, draft);
        return true;
    }

    //Index zur Datei öffnen
    if (query_vars['action'] == 'index') {
        run_index(query_vars, draft);
        return true;
    }

    //Richtigen Dateinamen finden
    var results = build_file_name(input, draft, query_vars);

    if (results['error'] === true) {
        //Index öffnen, wenn die Datei nicht existiert
        //since v1.1.0
        run_index(query_vars, draft);
        return true;
    }

    query_vars['filename'] = results['filename'];
    query_vars['revision'] = results['revision'];

    /* Datei öffnen */

    //Eingabefeld leeren
    set_query('');
    //Nachricht ausgeben
    message(query_vars['filename'] + ' wird geöffnet');
    //Datei öffnen
    open_file(query_vars['main_dir'] + query_vars['filename']);

    //Fertig
    return true;
}

//Sucht und öffnet den 3D-Ordner einer Zeichnung
//since v1.0.3 (ausgelagert)
function run_explorer(query_vars)
{
    //Wenn der Ordner nicht existiert, Fehler ausgeben
    if(folder_exists(query_vars['3D_dir']+'\\') === false)
    {
        message('Der Ordner '+query_vars['3D']+' existiert nicht.');
        return false;
    }

    //Eingabefeld leeren
    set_query('');
    message(' &Ouml;ffne den Ordner '+query_vars['3D']);
    //3D-Ordner öffnen
    open_file(query_vars['3D_dir']);
    return true;
}

//Index zur Datei öffnen
//since v1.0.2
//ausgelagert since v1.0.3
function run_index(query_vars, draft)
{
    var near = draft.getNearestFile();

    if(near === null)
    {
        set_query(query_vars['query']);
        message('Keine &auml;hnliche Datei gefunden...');
        return false;
    }

    //Eingabefeld leeren
    set_query('');

    //Nachricht ausgeben
    message('Index von ' + query_vars['filename'] + ' wird geöffnet');
    //Debug:
    //message('prev: ' + next_files['prev'] + ', this: ' + next_files['this'] + ', next: ' + next_files['next'] + ', near: ' + next_files['near'] + ', ');
    //Datei öffnen
    select_file(near.getAbsolutePath());

    //Fertig
    return true;
}

function setup_rev_store()
{
    return new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
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
function get_query_vars(input, draft, mode)
{
    var arr = new Array();
    arr['query'] = input.getQuery();

    /* Befehle abfangen */
    arr['action'] = parse_actions(mode);

    /* Endung abfangen */
    arr['file_type'] = input.getType();

    /* Revisionen abfangen */
    arr['revision'] = input.getRevision();

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
    if(a == 'E' || a == '3D' )
    {
        return 'explorer';
    }

    // Open Advanced
    if(a == 'A' || a == '+')
    {
        return 'open_advanced';
    }

    // Index
    if(a == 'I' || a == 'index')
    {
        return 'index';
    }

    // Schreibschutz setzen; since v1.0.4
    if(a == 'S')
    {
        return 'read_only';
    }

    // Schreibschutz aufheben; since v1.0.4
    if(a == 'F')
    {
        return 'read_write';
    }

    // Open
    if(a == 'O' || a == 'OPEN' )
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
    if (rev !== null) {
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

        //Wenn wieder nichts gefunden wurde, Fehler ausgeben
        arr['error'] = true;
        arr['error_message'] = name + '-R' + rev + '.' + type + ' nicht gefunden';
        return arr;
    }

    //Wenn keine Rev angegeben, gehts hier weiter
    //Neuste Revision suchen
    var have_rev = check_for_revisions(path, name, 0, type);
    if (have_rev !== false) {
        arr['filename'] = name + '-R' + have_rev + '.' + type;
        arr['revision'] = have_rev;
        return arr;
    }

    //Letzter Versuch, die Datei zu finden
    file = search_for(files, null, type);

    if (file) {
        arr['filename'] = name + '.' + file.getExtension();
        arr['revision'] = false;
        return arr;
    }

    //since 1.0.1
    //Noch ein letzter Versuch, die Zeichnung im 3D-Ordner zu finden
    //Nur auf Befehl "open_advanced" prüfen, ob ein 3D-Ordner existiert
    if (qv['action'] == 'open_advanced') {
        if (folder_exists(qv['3D_dir']+'\\')) {
            if (file_exists(qv['3D_dir'] + '\\' + name + '-R0' + '.' + type)) {
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

//Prüft, ob es von einer Zeichnung neuere Revisionen gibt und gibt die Nummer zurück
//Wenn es keine neuere gibt, wird false zurück gegeben
function check_for_revisions(path, name, rev, ext)
{
    var last_found = false;
    if(rev == '')
    {
        rev = rev_store[0];
    }

    var c = 0;

    // Höchte Revision, nach der gesucht wird, ist 25
    while(c <= 25)
    {
        rev = rev_store[c];
        var check_file = path + name + '-R' + rev + '.' + ext;

        if(file_exists(check_file))
        {
            last_found = rev;
        }

        rev = rev + 1;
        c = c + 1;
    }

    return last_found;
}

//Öffnet eine Datei, der absolute Pfad wird benötigt
function open_file(pfad)
{
    ipcRenderer.send('openfile', pfad);
}

//Öffnet den Explorer und selektiert die gewünschte Datei
//since v1.0.2
function select_file(pfad)
{
    ipcRenderer.send('openfileinfolder', pfad);
}

//prüft, ob eine Datei existiert
function file_exists(filename)
{
    return fs.existsSync(filename);
}

//prüft, ob ein Verzeichnis existiert
function folder_exists(foldername)
{
    return fs.existsSync(foldername);
}

// Constructor
function Kernel(cnf, filesystem, ipc) {
    config = cnf;
    fs = filesystem;
    ipcRenderer = ipc;
}

Kernel.prototype.handleInput = function(input, output, draft, mode) {
    // Reload Config, because it could have changed
    cfg['base_dir'] = config.get('base_dir', 'H:\\Zeichnungen\\');
    cfg['default_file_type'] = config.get('default_file_type', 'pdf');

    run(input, draft, mode);

    if (returnQuery === '') {
        output.end(returnMessage);
    } else {
        output.destroy(returnMessage);
    }
};

// export the class
module.exports = Kernel;
