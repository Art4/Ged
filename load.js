//Initialisierung
function init()
{
	cfg = new Array();
	/* DEBUG-Modus ein/ausschalten */
	//-----------------------------
	debug_mode = false;
	
	/* Weitere Einstellungen */
	//-----------------------------
	//Höchte Revision, nach der gesucht wird
	max_revisions = 25;
	//Ende der dir_store generierung
	dir_store_end = 290;
	
	/* AB HIER NICHTS MEHR ÄNDERN */
	//-----------------------------
	
	/* Globales Options-Array laden */
	//-----------------------------
	//options = setup_options();
	/* Punkt definieren, an dem beim Debug abgebrochen werden soll */
	add_debug_point('init_end')
	
	/* Definierte Debug-Points:
		'init_end'		am Ende von init()
		'run'			beim Start von run()
		'get_query_vars'		wenn get_query_vars beendet wurde()
		'run_explorer'	in run(), wenn der explorer geöffnet werden soll
		'run_end'		am Ende von run()
		
	*/
	
	//Hiermit kann ein Ausstiegspunkt gesetzt werden
	/*
	if(debug_handler('debug-point', 'message')){return true;}
	//*/
	
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
	
	if(debug_handler('init_end', max_revisions)){return true;}
	
	//since v1.0.2
	//letzte Suche
	last_search_filename = "";
	last_search_filetype = "";
}

//Hauptprozess
function run()
{
	if(debug_handler('run', 'run() wollte beginnen')){return true;}
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
	
	if(debug_handler('get_query_vars', options['default_file_type'])){return true;}
	
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
	
	/* Datei öffnen */
	
	//Letze Suche löschen
	clean_last_search();
	
	//Eingabefeld leeren
	set_query('');
	//Nachricht ausgeben
	message(results['filename'] + ' wird ge&ouml;ffnet');
	//Datei öffnen
	open_file(query_vars['main_dir'] + results['filename']);
	
	if(debug_handler('run_end', 'run() beendet')){return true;}
	
	//Fertig
	return true;
}

//Sucht und öffnet den 3D-Ordner einer Zeichnung
//since v1.0.3 (ausgelagert)
function run_explorer(query_vars)
{
	if(debug_handler('run_explorer', query_vars['3D_dir'])){return true;}
	
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