/*
 * Ged
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
'use strict'

const {ipcRenderer} = require('electron');
const fs = require('fs');
const Response = require('./response.js');
const Request = require('./request.js');
const FsUtils = require('./fs-utils.js');
const Config = require('./config.js');
const config = new Config();

var cfg = new Array();
cfg['current_version'] = config.get('config_version', '');
//Höchte Revision, nach der gesucht wird
cfg['max_revisions'] = config.get('max_revisions', 25);
//Ende der dir_store generierung
cfg['dir_store_end'] = config.get('dir_store_end', 395);

/* Dir-Store definieren */
var dir_store = setup_dir_store();

/* Dir-Store definieren */
//-----------------------------
var rev_store = setup_rev_store();

//since v1.0.2
//letzte Suche
var last_search_filename = '';
var last_search_filetype = '';

var returnMessage = '';
var returnQuery = '';

//Zeigt eine Ja/Nein Nachricht beim User an und liefert das Ergebnis als bool zurück
//since v1.0.5
function msgbox_confirm(msg)
{
    //VBS-Funktion definieren
    window.execScript( //- Add MsgBox functionality for displaying error messages
        'Function vbsMsgBox(prompt)\r\n'
        + ' vbsMsgBox = MsgBox(prompt, 1, \'OpenDrafts\')\r\n'
        + 'End Function', "vbscript"
    );

    //VBSFunktion ausführen
    confirm_value = vbsMsgBox(msg);

    if(confirm_value == 1)
        return true;

    return false;
}

//Hauptprozess
function run(query)
{
    var options = setup_options();

    //Wenn keine Eingabe gemacht wurde, Fehler ausgeben
    if(query == "")
    {
        message('Warte auf Eingabe...');
        return false;
    }

    //Suchstring analysieren
    var query_vars = get_query_vars(query, options);

    //Wenn keine Endung gesetzt wurde, den Defaultwert verwenden
    if(query_vars['file_type'] === false)
        query_vars['file_type'] = options['default_file_type'];

    //3D-Ordner öffnen
    if(query_vars['action'] == 'explorer')
    {
        run_explorer(query_vars);
        return true;
    }

    //Index zur Datei öffnen
    if(query_vars['action'] == 'index')
    {
        run_index(query_vars);
        return true;
    }

    //Richtigen Dateinamen finden
    var results = build_file_name(query_vars);

    if(results['error'] === true)
    {
        //Index öffnen, wenn die Datei nicht existiert
        //since v1.1.0
        run_index(query_vars);
        return true;
    }

    query_vars['filename'] = results['filename'];
    query_vars['revision'] = results['revision'];

    //Letze Suche löschen
    clean_last_search();

    //Schreibschutz zur Datei setzen/aufheben
    //since v1.0.4
    if(query_vars['action'] == 'read_only' || query_vars['action'] == 'read_write')
    {
        run_set_attributes(query_vars);
        return true;
    }

    //Eine Datei auf Schreibschutz setzen und evtl. vorhandene PDF-Datei löschen
    //since v1.0.5
    if(query_vars['action'] == 'clean')
    {
        run_clean(query_vars);
        return true;
    }

    /* Datei öffnen */

    //Eingabefeld leeren
    set_query('');
    //Nachricht ausgeben
    message(query_vars['filename'] + ' wird ge&ouml;ffnet');
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

    //Letze Suche löschen
    clean_last_search();

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
function run_index(query_vars)
{
    message('Index '+query_vars['filename']+' wird aufgebaut, bitte warten...');

    //Wenn es den Zielordner nicht gibt, Fehlermeldung
    if(folder_exists(query_vars['main_dir']+'\\') === false)
    {
        message("Ordner existiert nicht...");
        return false;
    }

    var next_files = search_files_next_to(query_vars['filename'], query_vars['main_dir']);

    if(next_files['near'] === false)
    {
        message("Keine &auml;hnliche Datei gefunden...");
        return false;
    }

    var near = next_files['near'];

    //Letze Suche löschen
    clean_last_search();

    //Eingabefeld leeren
    set_query('');
    //Nachricht ausgeben
    message('Index von ' + query_vars['filename'] + ' wird ge&ouml;ffnet');
    //Debug:
    //message('prev: ' + next_files['prev'] + ', this: ' + next_files['this'] + ', next: ' + next_files['next'] + ', near: ' + next_files['near'] + ', ');
    //Datei öffnen
    select_file(query_vars['main_dir'] + near);

    //Fertig
    return true;
}

//Schreibschutz setzen/aufheben
//since v1.0.4
//Infos zu Bitwise-Operators:
//https://developer.mozilla.org/en/JavaScript/Reference/Operators/Bitwise_Operators
function run_set_attributes(query_vars)
{
    file = query_vars['main_dir'] + query_vars['filename'];

    //message(query_vars['filename'] + ' ist ' + file.Attributes);

    //Schreibschutz aufheben
    if(query_vars['action'] == 'read_write')
    {
        set_file_permission(file, 'read_write');
        message(query_vars['filename'] + ' ist beschreibbar');
    }
    else
    {
        //Schreibschutz setzen
        set_file_permission(file, 'read_only');
        message(query_vars['filename'] + ' ist schreibgesch&uuml;tzt');
    }

    //Suchfeld leeren
    set_query('');
    return true;
}

//Datei Schreibschutz setzen und evtl. vorhandene PDF-Datei löschen
//since v1.0.5
function run_clean(query_vars)
{
    var file = query_vars['main_dir'] + query_vars['filename'];

    //*
    var revision = false;

    if(query_vars['revision'] !== false)
        revision = parseInt(query_vars['revision'], 10);

    if(revision !== false && revision > 0)
    {
        //Vorherige Revision nehmen
        prev_revision = revision - 1;
        prev_revision_file = query_vars['filename'].replace('-R'+query_vars['revision'], '-R'+prev_revision);

        if(file_exists(query_vars['main_dir'] + prev_revision_file))
        {
            file = prev_revision_file;
        }
        else
        {
            prev_revision_file = query_vars['filename'].replace('-R'+query_vars['revision'], '');

            if(file_exists(query_vars['main_dir'] + prev_revision_file))
            {
                file = prev_revision_file;
            }
        }
    }
    //*/

    //PDF-Datei ermitteln
    file_type = query_vars['file_type'];
    pdffile = file.replace(file_type, 'pdf');

    //Existiert die Datei?
    if(file_exists(query_vars['main_dir'] + pdffile))
    {
        //Sicherheits-Abfrage, bevor eine Datei gelöscht wird
        if(msgbox_confirm('Datei ' + pdffile + ' wird entfernt?') == true)
        {
            //PDF-Datei löschen
            delete_file(query_vars['main_dir'] + pdffile);

            //Schreibschutz setzen
            //Bugfix since v1.0.6
            set_file_permission(query_vars['main_dir'] + file, 'read_only');

            message(file + " bereinigt");
            //Suchfeld leeren
            set_query('');

            return true;
        }
        else if(file_exists(query_vars['main_dir'] + file))
        {
            //Schreibschutz setzen
            set_file_permission(query_vars['main_dir'] + file, 'read_only');

            message(file + " wurde schreibgesch&uuml;tzt");
            //Suchfeld leeren
            set_query('');

            return true;
        }
    }
    else if(file_exists(query_vars['main_dir'] + file))
    {
        //Schreibschutz setzen
        set_file_permission(query_vars['main_dir'] + file, 'read_only');

        message(file + " wurde schreibgesch&uuml;tzt");
        //Suchfeld leeren
        set_query('');

        return true;
    }

    //set_query('');
    message('Cleaning fehlgeschlagen');

    return true;
}

//Schreibschutz einer Datei setzen oder aufheben
//ausgelagert aus run_set_attributes()
//since v1.0.5
function set_file_permission(filename, mode)
{
    //Schreibschutz aufheben
    if(mode == 'read_write')
    {
        FsUtils.setFileWriteProtected(filename, false);

        return true;
    }

    //Schreibschutz setzen
    if(mode == 'read_only')
    {
        FsUtils.setFileWriteProtected(filename, true);

        return true;
    }
}

//Dir-Store definieren
//Gibt ein Array zurück, mit dem später der übergeordnete Ordner einer Zeichnung bestimmt werden kann
// TODO: Dynamische Ermittlung des Ordnernamens unterstützen anstelle der Liste von möglichen Ordnernamen
function setup_dir_store(e)
{
    var end = cfg['dir_store_end'];

    var arr = new Array();

    var j = 100;
    var i;
    for(i = j; i <= end; i += 5)
    {
        var f = j;
        j = j + 4;
        var l = j;
        j = j + 1;
        arr[i] = f + "00-" + l + "99";
    }

    return arr;
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
function get_query_vars(q, options)
{
    var arr = new Array();
    arr['query'] = q;

    /* Befehle abfangen */
    //-------------------
    var action_parts = q.split(' ');

    // Den ersten Teil wieder q zuweisen
    q = action_parts[0];

    var a = "";
    //a kann e/3d => explorer (in 3d_ordner) oder o => open sein
    if(action_parts.length > 1)
        a = action_parts[1];

    arr['action'] = parse_actions(a);

    /* Endung abfangen */
    //-------------------
    var ext_parts = q.split('.');
    // Den ersten Teil wieder q zuweisen
    q = ext_parts[0];

    arr['file_type'] = false;

    if(ext_parts.length > 1)
        arr['file_type'] = ext_parts[1];

    /* Revisionen abfangen */
    //-------------------
    var upper_filename = q.toUpperCase();
    var rev_parts = upper_filename.split('-R');
    // Den ersten Teil wieder q zuweisen
    q = rev_parts[0];

    arr['revision'] = false;

    if(rev_parts.length > 1)
        arr['revision'] = rev_parts[1];

    // Jetzt müsste nur noch der Dateiname übrig sein
    arr['filename'] = q;

    /* Zeichnungspfad bestimmen */
    //-------------------
    var pre_dir = q.slice(0, 2);
    var sub = q.slice(2, 3);

    var sub_dir = '5';
    if(sub >= 0 && sub <= 4)
        sub_dir = '0';

    var dir_index = pre_dir + sub_dir;

    arr['dir_index'] = dir_index;
    arr['main_dir'] = options['base_dir'] + 'Z.Nr.' + dir_store[dir_index] + '\\';
    arr['3D'] = arr['filename'] + '_3D';

    /* Pfad zum 3D-Ordner */
    //-------------------
    arr['3D_dir'] = arr['main_dir'] + arr['3D'];

    return arr;
}

// parse_actions überprüft die übergebenen Befehle ab und gibt sie zurück
// So können später einfacher neue Befehle hinzugefügt werden
function parse_actions(c)
{
    // Grossschreibung
    var a = c.toUpperCase();

    // Explorer
    if(a == "E" || a == "3D" )
    {
        return 'explorer';
    }

    // Open Advanced
    if(a == "A" || a == "+")
    {
        return 'open_advanced';
    }

    // Index
    if(a == "I" || a == "index")
    {
        return 'index';
    }

    // Schreibschutz setzen; since v1.0.4
    if(a == "S")
    {
        return 'read_only';
    }

    // Schreibschutz aufheben; since v1.0.4
    if(a == "F")
    {
        return 'read_write';
    }

    // Open
    if(a == "O" || a == "OPEN" )
    {
        return 'open';
    }

    // Clean
    if(a == "C" || a == "CLEAN" )
    {
        return 'clean';
    }

    //Default ist open
    return 'open';
}

//funktioniert wie trim() in PHP
function trim(z)
{
    return z.replace (/^\s+/, '').replace (/\s+$/, '');
}

/* FILE HANDLER FUNCTIONS */
function build_file_name(qv)
{
    var path = qv['main_dir'];
    var name = qv['filename'];
    var rev = qv['revision'];
    var type = qv['file_type'];

    //Ausgabe vorbereiten
    var arr = new Array();
    arr['error'] = false;

    //Wenn explizit eine Revision angegeben wurde, dann nach dieser suchen
    if(rev !== false)
    {
        if(file_exists(path + name + '-R' + rev + '.' + type))
        {
            arr['filename'] = name + '-R' + rev + '.' + type;
            arr['revision'] = rev;
            return arr;
        }

        //Wenn nichts gefunden wurde, aber Rev = 0 ist, auf Datei ohne Rev prüfen
        if(rev == 0 && file_exists(path + name + '.' + type))
        {
            arr['filename'] = name + '.' + type;
            arr['revision'] = false;
            return arr;
        }

        //Wenn wieder nichts gefunden wurde, Fehler ausgeben
        arr['error'] = true;
        arr['error_message'] = name + '-R' + rev + '.' + type + ' nicht gefunden';
        return arr;
    }

    //Wenn keine Rev angegeben, gehts hier weiter
    //Neuste Revision suchen
    var have_rev = check_for_revisions(path, name, 0, type);
    if(have_rev !== false)
    {
        arr['filename'] = name + '-R' + have_rev + '.' + type;
        arr['revision'] = have_rev;
        return arr;
    }

    //Letzter Versuch, die Datei zu finden
    if(file_exists(path + name + '.' + type))
    {
        arr['filename'] = name + '.' + type;
        arr['revision'] = false;
        return arr;
    }

    //since 1.0.1
    //Noch ein letzter Versuch, die Zeichnung im 3D-Ordner zu finden
    //Nur auf Befehl "open_advanced" prüfen, ob ein 3D-Ordner existiert
    if(qv['action'] == "open_advanced")
    {
        if(folder_exists(qv['3D_dir']+'\\'))
        {
            if(file_exists(qv['3D_dir'] + '\\' + name + '-R0' + '.' + type))
            {
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
    if(rev == "")
    {
        rev = rev_store[0];
    }

    var c = 0;

    while(c <= cfg['max_revisions'])
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

//Sucht nach der ähnlichen und nächstgelegenen Datei zu einer Zeichnung
//benötigt den gesuchten Zeichnungsnamen "filename" und den Ordner-Namen "main_dir", in dem gesucht wird
//gibt ein Array zurück mit den Werten prev, this und next, die die nächsten Dateien enthalten
//since v1.0.2
//based on http://classicasp.aspfaq.com/files/directories-fso/how-do-i-sort-a-list-of-files.html, thanks!
function search_files_next_to(filenamen, main_dir)
{
    var output = new Array();
    output['prev'] = false;
    output['this'] = false;
    output['next'] = false;
    output['near'] = false;

    var filename = parseInt(filenamen, 10);

    if (isNaN(filename))
    {
        return output;
    }

    //Alle Dateien in files auflisten
    var files = fs.readdirSync(main_dir);
    var i = 0;

    while(i < files.length && output['next'] === false)
    {
        var file = files[i];
        i++;

        var stats = fs.statSync(main_dir + file);

        // ingnore directories
        if (stats.isDirectory()) {
            continue;
        }

        var fileBase = file.slice(0, 5);

        if(fileBase < filename)
        {
            output['prev'] = file;
        }
        else if(fileBase == filename)
        {
            output['this'] = file;
        }
        else
        {
            output['next'] = file;
        }
    }

    //Die nächste vorhandene Datei bestimmen
    if(output['this'] !== false)
    {
        output['near'] = output['this'];
    }
    else if(output['next'] !== false)
    {
        output['near'] = output['next'];
    }
    else if(output['prev'] !== false)
    {
        output['near'] = output['prev'];
    }

    return output;
}

//Löscht eine Datei, der absolute Pfad wird benötigt
//via http://www.java2s.com/Tutorial/JavaScript/0600__MS-JScript/FileSystemObjectDeleteFile.htm, thanks!
//since v1.0.5
function delete_file(file)
{
    if(file_exists(file))
    {
        fs.unlinkSync(file);
        return true;
    }

    return false;
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

//Überprüft, ob das zweite Mal nach der gleichen Datei gesucht wurde
//since v1.0.2
function is_same_search_as_last(query_vars)
{
    if(last_search_filename == "" || last_search_filetype == "")
        return false;

    if(last_search_filename == query_vars['filename'] && last_search_filetype == query_vars['file_type'] && query_vars['action'] == 'open')
        return true;

    return false;
}

//Löscht die letzen Suche aus dem Cache
//since v1.0.3
function clean_last_search()
{
    last_search_filename = "";
    last_search_filetype = "";
}

//
//Options
//

//Lädt die Einstellungen und packt sie in ein Array
function setup_options()
{
    var arr = new Array();

    /* Pfad bestimmen - base_dir */
    arr['base_dir'] = config.get('base_dir', 'H:\\Zeichnungen\\');

    /* Datei-Typen bestimmen */
    arr['default_file_type'] = config.get('default_file_type', 'pdf');

    return arr;
}

// Constructor
function Kernel() {
    // always initialize all instance properties
    // this.bar = bar;
    // this.baz = 'baz'; // default value
}

// class methods
Kernel.prototype.handleInputString = function(inputString) {
    return this.handleRequest(
        Request.createFromString(inputString)
    );
};

Kernel.prototype.handleRequest = function(request) {
    run(request.getContent());

    return new Response(returnMessage, returnQuery);
};

// export the class
module.exports = Kernel;
