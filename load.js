//Initialisierung
function init()
{
	cfg = new Array();
	cfg['current_version'] = "1.0.4";
	
	/* Weitere Einstellungen */
	//-----------------------------
	//Höchte Revision, nach der gesucht wird
	max_revisions = 25;
	//Ende der dir_store generierung
	dir_store_end = 300;
	
	/* AB HIER NICHTS MEHR ÄNDERN */
	//-----------------------------
	
	/* Globales Options-Array laden */
	//-----------------------------
	//options = setup_options();
	
	/* Dir-Store definieren */
	//-----------------------------
	dir_store = setup_dir_store(dir_store_end);
	
	/* Dir-Store definieren */
	//-----------------------------
	setup_rev_store();
	
	/* Wichtige Objekte deklarieren */
	//-----------------------------
	WshShell = new ActiveXObject("WScript.Shell");
	FileSysObj = new ActiveXObject("Scripting.FileSystemObject");
	
	//since v1.0.2
	//letzte Suche
	last_search_filename = "";
	last_search_filetype = "";
	
	//Auf Updates prüfen
	check_updates();
}

//Hauptprozess
function run()
{
	options = setup_options();
	//Suchstring ermitteln
	var query = get_query();
	//query = document.getElementById("q").value;
	
	//Wenn keine Eingabe gemacht wurde, Fehler ausgeben
	if(query == "")
	{
		message('Warte auf Eingabe...');
		return false;
	}
	
	//Suchstring analysieren
	var query_vars = get_query_vars(query);
	
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
	
	//DataArea.innerHTML = file_name;
	//return true;
	
	if(results['error'] === true)
	{
		//Wenn bereits die letzte Suche nach dieser Datei fehlgeschlagen ist, Index öffnen
		//since v1.0.2
		if(is_same_search_as_last(query_vars))
		{
			run_index(query_vars);
			return true;
		}
		
		//letzte fehlgeschlagene Suche aktualisieren
		last_search_filename = query_vars['filename'];
		last_search_filetype = query_vars['file_type'];
		
		message(results['error_message']);
		return true;
	}
	
	//Letze Suche löschen
	clean_last_search();
	
	//Schreibschutz zur Datei setzen/aufheben
	//since v1.0.4
	if(query_vars['action'] == 'read_only' || query_vars['action'] == 'read_write')
	{
		query_vars['filename'] = results['filename'];
		run_set_attributes(query_vars);
		return true;
	}
	
	/* Datei öffnen */
	
	//Eingabefeld leeren
	set_query('');
	//Nachricht ausgeben
	message(results['filename'] + ' wird ge&ouml;ffnet');
	//Datei öffnen
	open_file(query_vars['main_dir'] + results['filename']);
	
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
	file = FileSysObj.GetFile(query_vars['main_dir'] + query_vars['filename']);
	
	//message(query_vars['filename'] + ' ist ' + file.Attributes);
	
	//Schreibschutz aufheben
	if(query_vars['action'] == 'read_write')
	{
		//Wenn Schreibschutz gesetzt ist
		if(file.Attributes & 1) //AND
		{
			file.Attributes = file.Attributes -= 1;
		}
		
		message(query_vars['filename'] + ' ist beschreibbar');
	}
	else
	{
		//Wenn Schreibschutz nicht gesetzt ist
		if(file.Attributes ^ 1 && file.Attributes < 33) //XOR
		{
			file.Attributes = file.Attributes += 1;
		}
		
		message(query_vars['filename'] + ' ist schreibgesch&uuml;tzt');
	}
	
	//Suchfeld leeren
	set_query('');
	return true;
}