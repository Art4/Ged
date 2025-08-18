# Changelog

Alle signifikanten Änderungen zu diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [Unreleased](https://github.com/Art4/Ged/compare/v2.14.0...HEAD)

Noch nichts.

## [2.14.0 - 2025-05-28](https://github.com/Art4/Ged/compare/v2.13.0...v2.14.0)

### Added

- Im Suchfeld kann mit den Tasten `Pfeil-oben` und `Pfeil-unten` durch die vorangegangenen Einträge gewechselt werden.
- Unter `%APPDATA%\Ged\logs` werden Log-Dateien abgelegt, um im Fehlerfall die Ursache zu finden.

### Changed

- Wenn Ged nicht mehr weiterentwickelt wird, wird ein Beenden-Dialog gezeigt, der die Verwendung von Ged nicht mehr empfielt.
- Upgrade Electron von v22.0.1 auf v35.4.0
- Alle Bibliotheken wurden aktualisiert

## [2.13.0 - 2023-01-11](https://github.com/Art4/Ged/compare/v2.12.0...v2.13.0)

### Changed

- Upgrade Electron von v18.0.4 auf v22.0.1
- Alle Bibliotheken wurden aktualisiert

## [2.12.0 - 2022-04-21](https://github.com/Art4/Ged/compare/v2.11.0...v2.12.0)

### Changed

- Schönere Icons durch Upgrade auf Fontawesome v6
- Upgrade Electron von v16.0.7 auf v18.0.4
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Wenn sich Ged beim Starten außerhalb des sichtbaren Bereichs des Displays befindet, wird es automatisch wieder in den sichtbaren Bereich verschoben

## [2.11.0 - 2022-01-19](https://github.com/Art4/Ged/compare/v2.10.1...v2.11.0)

### Added

- Einführung von TypeScript zur Verbesserung der Type-Sicherheit

### Changed

- Das Ermitteln der passendsten Zeichnungsrevision zu einer Zeichnung wurde beschleunigt
- Upgrade Electron von v15.1.2 auf v16.0.7
- Alle Bibliotheken wurden aktualisiert

## [2.10.1 - 2021-10-11](https://github.com/Art4/Ged/compare/v2.10.0...v2.10.1)

### Changed

- Update Electron von v15.1.1 auf v15.1.2
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Mit dem Update von Electron wurde gefixt, dass Ged nicht mehr verschoben werden konnte

## [2.10.0 - 2021-10-08](https://github.com/Art4/Ged/compare/v2.9.0...v2.10.0)

### Added

- Neue Einstellung, die die Standardaktion nach Eingabe einer Zeichnungsnummer von `Datei öffnen` zu `Datei in Windows Explorer anzeigen` ändern kann.

### Changed

- Upgrade Electron von v13.5.1 auf v15.1.1
- Alle Bibliotheken wurden aktualisiert
- Die Tests werden automatisiert durch Github Actions](https://github.com/Art4/Ged/actions) statt travis-ci.org ausgeführt

## [2.9.0 - 2021-08-25](https://github.com/Art4/Ged/compare/v2.8.0...v2.9.0)

### Added

- Schon während etwas im Suchfeld eingegeben wird, wird im Hintergrund eine Validierung durchgeführt, um schon vor dem Absenden auf eine fehlerhafte Eingabe hinzuweisen

### Changed

- Das Einstellungsfester wurde optisch überarbeitet
- Das Hauptfenster wurde etwas verschönert
- Upgrade Electron von v11.4.12 auf v13.2.2
- Upgrade Bootstrap von v4.6.0 auf v5.1.0
- Upgrade Webpack von v4.46.0 auf v5.51.1
- Alle Bibliotheken wurden aktualisiert

### Removed

- jQuery und Popper.js werden nicht mehr benötigt und wurden entfernt

## [2.8.0 - 2021-01-15](https://github.com/Art4/Ged/compare/v2.7.0...v2.8.0)

### Changed

- Upgrade von Electron v7.3.2 auf v11.2.0
- Alle Bibliotheken wurden aktualisiert

### Removed

- Der Verschieben-Button im aufklappbaren Menü wurden entfernt. Ged kann nur noch mithilfe des Bereichs links vom Menübutton verschoben werden.

## [2.7.0 - 2020-07-20](https://github.com/Art4/Ged/compare/v2.6.0...v2.7.0)

### Added

- Neues Eingabeformat für Zeichnungen `12345[/0][/3][.dft]` eingeführt

### Changed

- Der Clean-Mechanismus wurde verbessert und löscht auch andere Dateiformate der vorherigen Revision
- Upgrade von Electron v4.2.12 auf v7.3.2
- Upgrade von Webpack v3.12.0 auf v4.43.0
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Mittleklick auf Buttons öffnet nicht mehr eine Browserinstanz

## [2.6.0 - 2019-09-03](https://github.com/Art4/Ged/compare/v2.5.0...v2.6.0)

### Added

- Ged kann einfacher verschoben werden, indem man am Bereich links vom Menübutton zieht
- In das Eingabefeld kann sofort etwas eingetippt werden, wenn Ged den Fokus bekommt

### Changed

- Ged wird nur transparent, wenn Ged nicht im Fokus liegt und die Maus darüber gefahren wird
- Ged wird nicht mehr transparent, wenn es im Fokus liegt und die Maus nicht mehr über Ged liegt
- Update von Electron v3.1.13 auf v4.2.10
- Alle Bibliotheken wurden aktualisiert

### Removed

- Die Ged-Version wird nicht mehr unter dem aufgeklappten Menü angezeigt (die Versionsnummer findet sich weiterhin in den Einstellungen)

## [2.5.0 - 2019-06-13](https://github.com/Art4/Ged/compare/v2.4.0...v2.5.0)

### Added

- In Textfeldern kann mit Rechtsklick ein Kontextmenü zum `Einfügen`, `Kopieren`, `Ausschneiden` und `Alle auswählen` von Text geöffnet werden

### Changed

- Alle Bibliotheken wurden aktualisiert

## [2.4.0 - 2019-03-28](https://github.com/Art4/Ged/compare/v2.3.0...v2.4.0)

### Added

- Einstellung ergänzt, um Ged optional in der Taskleiste anzeigen zu lassen

### Changed

- Ged startet nur noch in einer Instanz; ein erneutes Starten holt die laufende Instanz in den Vordergrund
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Benachrichtigungen zeigen das Ged-Icon an

## [2.3.0 - 2019-03-26](https://github.com/Art4/Ged/compare/v2.2.1...v2.3.0)

### Changed

- Alle Bibliotheken wurden aktualisiert

### Fixed

- Beim Setzen/Aufheben des Schreibschutzes einer Zeichnung wird eine angegebene Revision wieder berücksichtigt

## [2.2.1 - 2019-02-06](https://github.com/Art4/Ged/compare/v2.2.0...v2.2.1)

### Fixed

- Es wurde eine falsche Meldung beim Öffnen eines 3D-Ordners korrigiert

## [2.2.0 - 2019-02-05](https://github.com/Art4/Ged/compare/v2.1.0...v2.2.0)

### Added

- Beim Öffnen wird geprüft, ob Zeichnungen mit der Nummer 36251 oder größer mit der neusten Vorlage erstellt wurden. Wenn nicht, wird in Ged ein kleines Warndreieck angezeigt.

### Changed

- Alle Bibliotheken wurden aktualisiert

## [2.1.0 - 2019-01-04](https://github.com/Art4/Ged/compare/v2.0.0...v2.1.0)

### Changed

- Der Code zum Cleanen und Schreibschützen einer Datei wurde aus dem veralteten Kernel in eigene Consolen-Module verschoben
- Alle Bibliotheken wurden aktualisiert

## [2.0.0 - 2018-12-06](https://github.com/Art4/Ged/compare/v2.0.0-beta.7...v2.0.0)

### Changed

- Wenn das Einstellungs-Fenster geschlossen wird, wird auch das Menü eingeklappt
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Wenn die älteste Revision einer Zeichnung noch keinen -R0 Suffix hat, wurde für die Anzeige im Explorer nicht die letzte Datei selektiert
- Wenn die älteste Revision einer Zeichnung noch keinen -R0 Suffix hat, konnte die clean-Aktion nicht ausgeführt werden

## [2.0.0-beta.7 - 2018-10-23](https://github.com/Art4/Ged/compare/v2.0.0-beta.6...v2.0.0-beta.7)

### Changed

- Das Menü wird automatisch geschlossen, wenn das Suchfeld angeklickt wird
- JS-Code von Bootstrap entfernt, der nicht im Einsatz ist
- Alle Bibliotheken wurden aktualisiert

## [2.0.0-beta.6 - 2018-10-17](https://github.com/Art4/Ged/compare/v2.0.0-beta.5...v2.0.0-beta.6)

### Added

- Aktionen in der Eingabemaske können auch groß geschrieben werden, z.B. `12345 3D` statt `12345 3d`

### Changed

- Alle Bibliotheken wurden aktualisiert
- [Eslint](https://eslint.org) wird eingesetzt, um den Source Code automatisch zu bereinigen

### Fixed

- Fehler behoben, durch den in einigen Fällen der Explorer statt der Zeichnung geöffnet wurde

## [2.0.0-beta.5 - 2018-09-26](https://github.com/Art4/Ged/compare/v2.0.0-beta.4...v2.0.0-beta.5)

### Added

- Über die Einstellungen kann bestimmt werden, ob Ged bei Windows-Anmeldung automatisch starten soll

### Changed

- Alle Bibliotheken wurden aktualisiert

## [2.0.0-beta.4 - 2018-07-31](https://github.com/Art4/Ged/compare/v2.0.0-beta.3...v2.0.0-beta.4)

### Changed

- Autoupdate wird 5 Sekunden nach dem Download sofort installiert, da die Installation beim Herunterfahren von Windows nicht funktioniert
- Alle Bibliotheken wurden aktualisiert

## [2.0.0-beta.3 - 2018-07-31](https://github.com/Art4/Ged/compare/v2.0.0-beta.2...v2.0.0-beta.3)

### Added

- In der Konfiguration wird das Installations-Datum von Ged gespeichert

### Removed

- Eine nicht mehr benötigte Einstellung in der Konfiguration wurde entfernt

### Fixed

- Fehler behoben, durch den immer der Explorer geöffnet wurde, statt die Datei selber zu öffnen

## [2.0.0-beta.2 - 2018-07-30](https://github.com/Art4/Ged/compare/v2.0.0-beta.1...v2.0.0-beta.2)

### Added

- Der Kernel von Ged wurde zu einer modularen Console umgeschrieben

### Changed

- Bessere Trennung zwischen Eingabemaske und Verarbeitung der Suchanfrage zur Ermöglichung zukünftiger Features
- Ged ist robuster gegen Fehlkonfigurationen in den Einstellungen
- Interoperabilität mit Unix-Systemen verbessert
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Ged erkennt jetzt wieder Dateien mit großgeschriebenen Dateiendungen (z.B. 12345.TIF)

## [2.0.0-beta.1 - 2018-07-13](https://github.com/Art4/Ged/compare/v2.0.0-alpha.3...v2.0.0-beta.1)

### Added

- Neuen Entwicklungsmodus eingeführt, in dem sich beim Start die DevTools automatisch öffnen

### Changed

- Asynchrone Dateisuche implementiert, wodurch Ged bei der Suche nicht mehr kurz einfriert
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Das Ändern der Einstellungen wirkt sich wieder sofort auf die Suche aus, sodass kein Neustart mehr benötigt wird

## [2.0.0-alpha.3 - 2018-07-12](https://github.com/Art4/Ged/compare/v2.0.0-alpha.2...v2.0.0-alpha.3)

### Added

- Ged prüft jetzt automatisch nach Updates und kann sich selbständig aktualisieren
- Publish und Autoupdate werden in der README erklärt

### Changed

- Ged installiert sich jetzt sofort nach dem Doppelklick auf die exe-Datei

### Fixed

- In der Dokumentation wurde in einem Beispiel ein Fehler behoben
- Es wurde ein Fehler bei der Migration der Configuration behoben

## [2.0.0-alpha.2 - 2018-07-11](https://github.com/Art4/Ged/compare/v2.0.0-alpha.1...v2.0.0-alpha.2)

### Added

- Ged prüft, ob die Eingabe eine gültige Zeichnungsnummer enthält
- Das Finden von Dateien und das Öffnen des Explorers wurden beschleunigt
- Einzelne neue Komponenten sind jetzt durch Tests abgesichert
- Die Tests werden automatisiert durch [Travis-CI](https://travis-ci.org/Art4/Ged) ausgeführt

### Changed

- Alle Bibliotheken wurden aktualisiert

## [2.0.0-alpha.1 - 2018-07-03](https://github.com/Art4/Ged/compare/v1.1.0...v2.0.0-alpha.1)

### Changed

- Ged wurde umgeschrieben und läuft jetzt auf Basis von [Electron](https://electronjs.org) statt als Windows Gadget.
- Buttons zum Schließen oder Verschieben von Ged sind in ein Menü verschoben worden.

## [1.1.0 - 2016-03-03](https://github.com/Art4/Ged/compare/v1.0.8...v1.1.0)

### Changed

- **OpenDrafts** wurde in **Ged** umbenannt
- Wenn eine gesuchte Datei nicht existiert, wird sofort der Explorer geöffnet, womit man sich das zweite Absenden der Suche spart
- Die Standard-Dateiendung wurde von `dft` auf `pdf` gesetzt
- Ged steht jetzt unter [GPL-3.0](http://opensource.org/licenses/gpl-3.0.html)
- Der Changelog wurde zu Markdown konvertiert und folgt den Empfehlungen von [keepachangelog.com](http://keepachangelog.com/)

## [1.0.8 - 2014-08-11](https://github.com/Art4/Ged/compare/v1.0.7...v1.0.8)

### Added

- OpenDrafts unterstützt Zeichnungen bis 39999.

## [1.0.7 - 2013-08-26](https://github.com/Art4/Ged/compare/v1.0.6...v1.0.7)

### Added

- OpenDrafts unterstützt Zeichnungen bis 30999.

## [1.0.6 - 2012-09-04](https://github.com/Art4/Ged/compare/v1.0.5...v1.0.6)

### Fixed

- Mit `12345 c` wurde nach dem Löschen der PDF der vorherigen Revision die Draft nicht schreibgeschützt

## [1.0.5 - 2012-06-20](https://github.com/Art4/Ged/compare/v1.0.4...v1.0.5)

### Added

- Mit `12345 c` wird die PDF der vorherigen Revision gelöscht und die Draft schreibgeschützt
- Beim Öffnen der Optionen wird geprüft und angezeigt, wenn ein Update bereitsteht

## [1.0.4 - 2012-05-29](https://github.com/Art4/Ged/compare/v1.0.3...v1.0.4)

### Added

- Mit `12345 s` wird der Schreibschutz einer Datei gesetzt
- Mit `12345 f` wird der Schreibschutz einer Datei aufgehoben
- In den Optionen gibt es eine schnelle Übersicht über die möglichen Aktionen
- Beim Starten von OpenDrafts wird geprüft und angezeigt, wenn ein Update bereitsteht

### Changed

- OpenDrafts unterliegt jetzt der [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/de/)

## [1.0.3 - 2012-02-03](https://github.com/Art4/Ged/compare/v1.0.2...v1.0.3)

### Fixed

- Wird eine gesuchte Datei genau zwischen zwei Suchvorgängen angelegt, wird nicht mehr der Explorer geöffnet, sondern die Zeichnung selber.

## [1.0.2 - 2011-11-21](https://github.com/Art4/Ged/compare/v1.0.1...v1.0.2)

### Added

- Mit `12345 i` öffnet sich der Explorer und scrollt an die Stelle, an der die Zeichnung abliegt
- In den Optionen gibt es einen Link zur Changelog-Datei
- OpenDrafts unterliegt der [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/de/)

## [1.0.1 - 2011-06-22](https://github.com/Art4/Ged/compare/v1.0...v1.0.1)

### Added

- Mit `12345 +` oder `12345 a` wird auch im 3D-Ordner nach einer Zeichnung gesucht
- OpenDrafts liegt jetzt eine Changelog-Datei bei

## [1.0.0 - 2011-06-20](https://github.com/Art4/Ged/compare/v0.9.8...v1.0)

### Added

- Fehlermeldung, wenn der gesuchte 3D-Ordner nicht existiert
