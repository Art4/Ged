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
	rev_store = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','DS','E','E','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
	
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
	
	// Open
	if(a == "O")
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
	
	//NEU!
	//*
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

//Öffnet eine Datei, der absolute Pfad wird benötigt
function open_file(pfad)
{
	//DataArea.innerHTML = ProgPath;
	WshShell.Run(pfad);
}

function file_exists(filename)
{
	if(FileSysObj.FileExists(filename) == true)
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

/* Abstellgleis für alte Dateien
Werden nicht mehr benötigt, nur fürs Archiv */

/*
//das ist der Vorgänger von run();
function open_draft()
{
	file = document.getElementById("command").value;
	
	file_infos = get_file_infos(file);
	
	//Pfad bestimmen
	path = options['base_dir'];
	
	//Standard bestimmen
	if(path == '')
	{
		path = 'H:\\Zeichnungen\\';
	}
	
	dir_index = file_infos['dir_index'];
	
	filepath = path + 'Z.Nr.' + dirs[dir_index] + '\\';
	
	if(file_infos['do'] == 'explorer')
	{
		explorer_path = filepath + file_infos['filename'] + '_3D';
		//Eingabefeld leeren
		document.getElementById("command").value = '';
		//window.open(explorer_path);
		open_file(explorer_path);
		return true;
	}
	
	//Dateityp bestimmen
	
	
	//Richtigen Dateinamen finden
	file_name = build_file_name(filepath, file_infos['filename'], file_infos['revision'], file_infos['file_ext']);
	
	//DataArea.innerHTML = file_name;
	//return true;
	
	if(file_name == false)
	{
		DataArea.innerHTML = 'Datei existiert nicht!';
		return true;
	}
	
	//Kompletten Pfad mit Dateinamen zusammensetzen
	full_filepath = filepath + file_name + '.' + file_infos['file_ext'];
	DataArea.innerHTML = file_name + '.' + file_infos['file_ext'];
	//Eingabefeld leeren
	document.getElementById("command").value = '';
	
	//Datei öffnen
	
	//window.open(full_filepath);
	open_file(full_filepath);
}
//*/

//Das ist der vorgänger von get_query_vars();
/*
function get_file_infos(command)
{
	infos = new Array();
	
	//Befehle abfangen
	command_parts = command.split(' ');
	
	//command_part kann e => explorer oder o => open sein
	if(command_parts.length > 1)
	{
		filename = command_parts[0];
		command_part = command_parts[1];
	}
	else
	{
		command_part = 'o';
		filename = command_parts[0];
	}
	
	command_part = command_part.toUpperCase();
	if(command_part == "E" || command_part == "3D" )
	{
		infos['do'] = 'explorer';
	}
	
	else
	{
		infos['do'] = 'open';
	}
	
	//Endung abfangen
	ext_parts = filename.split('.');
		//command_part kann e => explorer oder o => open sein
	if(ext_parts.length > 1)
	{
		infos['file_type'] = ext_parts[1];
	}
	else
	{
		infos['file_type'] = false;
	}
	filename = ext_parts[0];
	
	//Revisionen abfangen
	upper_filename = filename.toUpperCase();
	rev_parts = upper_filename.split('-R');
	
	//command_part kann e => explorer oder o => open sein
	if(rev_parts.length > 1)
	{
		infos['revision'] = rev_parts[1];
	}
	else
	{
		infos['revision'] = '';
	}
	
	//Wird noch gebraucht
	filename = rev_parts[0];
	
	//document.getElementById("command").value = revision;
	//return true;
	
	
	//MUSS NOCH ANGEPASST WERDEN
	//filename = command;
	infos['filename'] = filename;
	
	//dir_index bestimmen
	pre_dir = filename.slice(0, 2);
	sub = filename.slice(2, 3);
	
	if(sub >= 0 && sub <= 4)
	{
		sub_dir = '0';
	}
	else
	{
		sub_dir = '5';
	}
	
	infos['dir_index'] = pre_dir + sub_dir;
	
	//Dateiendungen bestimmen
	types = get_filetypes();
	
	if(infos['file_type'] == false)
	{
		infos['file_ext'] = trim(types[0]);
	}
	else
	{
		infos['file_ext'] = infos['file_type'];
	}
	
	return infos;
}
//*/

