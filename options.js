//Lädt die Einstellungen und packt sie in ein Array
function setup_options()
{
	var arr = new Array();
	
	/* Pfad bestimmen - base_dir */
	var base_dir = System.Gadget.Settings.read("base_dir");
	//Standard bestimmen
	if(base_dir == '')
	{
		base_dir = 'H:\\Zeichnungen\\';
	}
	arr['base_dir'] = base_dir;
	
	/* Datei-Typen bestimmen */
	var file_types_str = System.Gadget.Settings.read("file_types");
	arr['file_types_str'] = file_types_str;
	
	var types = filter_file_types(file_types_str);
	arr['file_types'] = types;
	
	//Der erste wird als Default gesetzt
	arr['default_file_type'] = types[0];
	
	//Config anhängen
	/*
	var i;
	for(i = 0; i < cfg.lenght; i++)
	{
		var cn = cfg[i][0];
		var cv = cfg[i][1];
		arr[cn] = cv;
	}
	//*/
	
	return arr;
}

function filter_file_types(str)
{
	//Standard definieren
	if(str == '')
	{
		str = "dft, dwg, pdf";
	}
	
	var arr = str.split(',');
	
	var i;
	for(i = 0; i < arr.length; i++)
	{
		arr[i] = trim(arr[i]);
	}
	
	return arr;
}

function save_options(event)
{
	if (event.closeAction == event.Action.commit) //Wenn die Einstellungen vom Nutzer gespeichert werden
	{
		System.Gadget.Settings.write("base_dir", document.getElementById("base_dir").value);
		System.Gadget.Settings.write("file_types", document.getElementById("file_types").value);
		
		System.Gadget.Settings.write("first_call", 'no');
		
		return true;
	}
}

function load_options() //Diese Funktion lädt die Einstellungen in die Textboxen
{
	first_call = System.Gadget.Settings.read("first_call");
	if(first_call != 'no')
	{
		document.getElementById("base_dir").value = 'H:\\Zeichnungen\\';
		document.getElementById("file_types").value = 'dft, dwg, pdf';
	}
	else
	{
		document.getElementById("base_dir").value = System.Gadget.Settings.read("base_dir");
		document.getElementById("file_types").value = System.Gadget.Settings.read("file_types");
	}
}

//Öffnet den Changelog; muss sich im selben Ordner wie die settings.html befinden
function open_changelog()
{
	/*
	ScriptName = WScript.ScriptName
	SourcePathName = fso.getAbsolutePathName(ScriptName)
	SourcePath = Replace(SourcePathName, ScriptName, "", 1, -1, 0)
	*/
	//document.getElementById("DataArea").innerHTML = "bla";
	//return true;
	/*
	var filename = WshShell.ScriptName;
	var sourcepath = FileSysObj.getAbsolutePathName(filename);
	sourcepath.replace(filename, "");
	*/
	
	//Datei öffnen lassen
	tempShell = new ActiveXObject("WScript.Shell");
	tempShell.Run("G:\Weigandt\OpenDrafts\changelog.html");
	
	return true;
}
