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
		message('Warte auf Eingabe');
		return false;
	}
	
	//Suchstring analysieren
	var query_vars = get_query_vars(query);
	
	//Wenn keine Endung gesetzt wurde, den Defaultwert verwenden
	if(query_vars['file_type'] === false)
		query_vars['file_type'] = options['default_file_type'];
	
	if(debug_handler('get_query_vars', options['default_file_type'])){return true;}
	
	if(query_vars['action'] == 'explorer')
	{
		if(debug_handler('run_explorer', query_vars['3D_dir'])){return true;}
		
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
	
	//Richtigen Dateinamen finden
	var results = build_file_name(query_vars);
	
	//DataArea.innerHTML = file_name;
	//return true;
	
	if(results['error'] === true)
	{
		message(results['error_message']);
		return true;
	}
	
	//Eingabefeld leeren
	set_query('');
	//Nachricht ausgeben
	message(results['filename'] + ' wird ge&ouml;ffnet');
	//Datei öffnen
	open_file(query_vars['main_dir'] + results['filename']);
	
	if(debug_handler('run_end', 'run() beendet')){return true;}
	
	//Fertig
	return true;
	
	//Das hier wird nicht mehr gebraucht...
	/*
	//Kompletten Pfad mit Dateinamen zusammensetzen
	var full_filepath = query_vars['main_dir'] + file_name + '.' +  query_vars['file_type'];
	message(file_name + '.' +  query_vars['file_type'] + ' wird ge&ouml;ffnet');
	
	//Eingabefeld leeren
	set_query('');
	
	//Datei öffnen
	
	//window.open(full_filepath);
	open_file(full_filepath);
	
	if(debug_handler('run_end', 'run() beendet')){return true;}
	//*/
}