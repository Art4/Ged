//Dir-Store definieren
//Gibt ein Array zurück, mit dem später der übergeordnete Ordner einer Zeichnung bestimmt werden kann
function setup_dir_store(e)
{
	var end = 300;
	
	if (setup_dir_store.arguments.length >= 0)
		end = setup_dir_store.arguments[0];
	
	var arr = new Array();

	var j = 100;
	var i;
	for(i = j; i < end; i += 5)
	{
		f = j;
		j = j + 4;
		l = j;
		j = j + 1;
		arr[i] = f + "00-" + l + "99";
	}
	
	return arr;
}

function setup_rev_store()
{
	rev_store = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
	
	return true;
}

//ermittelt die Eingabe des Textfeldes
function get_query()
{
	return document.getElementById("q").value;
}

//Setzt den übergebenen String in das Suchfeld
function set_query(v)
{
	document.getElementById("q").value = v;
	return true;
}

//Setzt eine Nachricht unter das Suchfeld
function message(v)
{
	DataArea.innerHTML = v;
	return true;
}

//analysiert den Suchstring und gibt alle notwendigen Information zurück.
function get_query_vars(q)
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
	
	// Open
	if(a == "O" || a == "OPEN" )
	{
		return 'open';
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
			return arr;
		}
		
		//Wenn nichts gefunden wurde, aber Rev = 0 ist, auf Datei ohne Rev prüfen
		if(rev == 0 && file_exists(path + name + '.' + type))
		{
			arr['filename'] = name + '.' + type;
			return arr;
		}
		
		//Wenn wieder nicht gefunden wurde, Fehler ausgeben
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
		return arr;
	}
	
	//Letzter Versuch, die Datei zu finden
	if(file_exists(path + name + '.' + type))
	{
		arr['filename'] = name + '.' + type;
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
	
	while(c <= max_revisions)
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
	
	/*DEBUG
	//kann später gelöscht werden
	//##########################
	
	message("Typ: "+type+" Wert: "+filename);
	return output;
	
	var folder = FileSysObj.GetFolder(main_dir);
	
	filesArrayString = '';
	
	//Alle Dateien in files auflisten
	var files = new Enumerator(folder.files);
	
	var thisFile = files.item();
	output['prev'] = thisFile.name;
	
	return output;
	
	//######################
	//DEBUG ENDE */
	
	var folder = FileSysObj.GetFolder(main_dir);
	
	filesArrayString = '';
	
	//Alle Dateien in files auflisten
	var files = new Enumerator(folder.files);
	
	while(!files.atEnd() && output['next'] === false)
	{
		var thisFile = files.item();
		var thisFileBase = thisFile.name.slice(0, 5);
		
		if(thisFileBase < filename)
		{
			output['prev'] = thisFile.name;
		}
		else if(thisFileBase == filename)
		{
			output['this'] = thisFile.name;
		}
		else
		{
			output['next'] = thisFile.name;
		}
		
		files.moveNext();
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

//Öffnet eine Datei, der absolute Pfad wird benötigt
function open_file(pfad)
{
	//DataArea.innerHTML = ProgPath;
	WshShell.Run(pfad);
}

//Öffnet den Explorer und selektiert die gewünschte Datei
//since v1.0.2
function select_file(pfad)
{
	WshShell.Run('Explorer.exe /select, '+pfad);
}

//prüft, ob eine Datei existiert
function file_exists(filename)
{
	if(FileSysObj.FileExists(filename) == true)
		return true;
	
	return false;
}

//prüft, ob ein Verzeichnis existiert
function folder_exists(foldername)
{
	if(FileSysObj.FolderExists(foldername) == true)
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

/* DEBUG FUNCTIONS */
function is_debug()
{
	if(debug_mode === true)
		return true;
	
	return false;
}

function add_debug_point(id)
{
	debug_point = id;
}

function debug_handler(id, msg)
{
	if(!is_debug())
		return false;
	
	if(debug_point == id)
	{
		message(msg);
		return true;
	}
}