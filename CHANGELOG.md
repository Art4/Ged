<!-- @@@title:Changelog@@@ -->

# Changelog

Alle signifikanten Änderungen zu diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [2.0.0-beta.4] - 2018-07-31

### Changed

- Autoupdate wird 5 Sekunden nach dem Download sofort installiert, da die Installation beim Herunterfahren von Windows nicht funktioniert
- Alle Bibliotheken wurden aktualisiert

## [2.0.0-beta.3] - 2018-07-31

### Added

- In der Konfiguration wird das Installations-Datum von Ged gespeichert

### Removed

- Eine nicht mehr benötigte Einstellung in der Konfiguration wurde entfernt

### Fixed

- Fehler behoben, durch den immer der Explorer geöffnet wurde, statt die Datei selber zu öffnen

## [2.0.0-beta.2] - 2018-07-30

### Added

- Der Kernel von Ged wurde zu einer modularen Console umgeschrieben

### Changed

- Bessere Trennung zwischen Eingabemaske und Verarbeitung der Suchanfrage zur Ermöglichung zukünftiger Features
- Ged ist robuster gegen Fehlkonfigurationen in den Einstellungen
- Interoperabilität mit Unix-Systemen verbessert
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Ged erkennt jetzt wieder Dateien mit großgeschriebenen Dateiendungen (z.B. 12345.TIF)

## [2.0.0-beta.1] - 2018-07-13

### Added

- Neuen Entwicklungsmodus eingeführt, in dem sich beim Start die DevTools automatisch öffnen

### Changed

- Asynchrone Dateisuche implementiert, wodurch Ged bei der Suche nicht mehr kurz einfriert
- Alle Bibliotheken wurden aktualisiert

### Fixed

- Das Ändern der Einstellungen wirkt sich wieder sofort auf die Suche aus, sodass kein Neustart mehr benötigt wird

## [2.0.0-alpha.3] - 2018-07-12

### Added

- Ged prüft jetzt automatisch nach Updates und kann sich selbständig aktualisieren
- Publish und Autoupdate werden in der README erklärt

### Changed

- Ged installiert sich jetzt sofort nach dem Doppelklick auf die exe-Datei

### Fixed

- In der Dokumentation wurde in einem Beispiel ein Fehler behoben
- Es wurde ein Fehler bei der Migration der Configuration behoben

## [2.0.0-alpha.2] - 2018-07-11

### Added

- Ged prüft, ob die Eingabe eine gültige Zeichnungsnummer enthält
- Das Finden von Dateien und das Öffnen des Explorers wurden beschleunigt
- Einzelne neue Komponenten sind jetzt durch Tests abgesichert
- Die Tests werden automatisiert durch [Travis-CI](https://travis-ci.org/Art4/Ged) ausgeführt

### Changed

- Alle Bibliotheken wurden aktualisiert

## [2.0.0-alpha.1] - 2018-07-03

### Changed

- Ged wurde umgeschrieben und läuft jetzt auf Basis von [Electron](https://electronjs.org) statt als Windows Gadget.
- Buttons zum Schließen oder Verschieben von Ged sind in ein Menü verschoben worden.

## [1.1.0] - 2016-03-03

### Changed

- **OpenDrafts** wurde in **Ged** umbenannt
- Wenn eine gesuchte Datei nicht existiert, wird sofort der Explorer geöffnet, womit man sich das zweite Absenden der Suche spart
- Die Standard-Dateiendung wurde von `dft` auf `pdf` gesetzt
- Ged steht jetzt unter [GPL-3.0](http://opensource.org/licenses/gpl-3.0.html)
- Der Changelog wurde zu Markdown konvertiert und folgt dem Empfehlungen von [keepachangelog.com](http://keepachangelog.com/)

## [1.0.8] - 2014-08-11

### Added

- OpenDrafts unterstützt Zeichnungen bis 39999.

## [1.0.7] - 2013-08-26

### Added

- OpenDrafts unterstützt Zeichnungen bis 30999.

## [1.0.6] - 2012-09-04

### Fixed

- Mit `12345 c` wurde nach dem Löschen der PDF der vorherigen Revision die Draft nicht schreibgeschützt

## [1.0.5] - 2012-06-20

### Added

- Mit `12345 c` wird die PDF der vorherigen Revision gelöscht und die Draft schreibgeschützt
- Beim Öffnen der Optionen wird geprüft und angezeigt, wenn ein Update bereitsteht

## [1.0.4] - 2012-05-29

### Added

- Mit `12345 s` wird der Schreibschutz einer Datei gesetzt
- Mit `12345 f` wird der Schreibschutz einer Datei aufgehoben
- In den Optionen gibt es eine schnelle Übersicht über die möglichen Befehle
- Beim Starten von OpenDrafts wird geprüft und angezeigt, wenn ein Update bereitsteht

### Changed

- OpenDrafts unterliegt jetzt der [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/de/)

## [1.0.3] - 2012-02-03

### Fixed

- Wird eine gesuchte Datei genau zwischen zwei Suchvorgängen angelegt, wird nicht mehr der Explorer geöffnet, sondern die Zeichnung selber.

## [1.0.2] - 2011-11-21

### Added

- Mit `12345 i` öffnet sich der Explorer und scrollt an die Stelle, an der die Zeichnung abliegt
- In den Optionen gibt es einen Link zur Changlog-Datei
- OpenDrafts unterliegt der [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/de/)

## [1.0.1] - 2011-06-22

### Added

- Mit `12345 +` oder `12345 a` wird auch im 3D-Ordner nach einer Zeichnung gesucht
- OpenDrafts liegt jetzt eine Changlog-Datei bei

## [1.0.0] - 2011-06-20

### Added

- Fehlermeldung, wenn der gesuchte 3D-Ordner nicht existiert

[Unreleased]: https://github.com/Art4/Ged/compare/v2.0.0-beta.4...HEAD
[2.0.0-beta.4]: https://github.com/Art4/Ged/compare/v2.0.0-beta.3...v2.0.0-beta.4
[2.0.0-beta.3]: https://github.com/Art4/Ged/compare/v2.0.0-beta.2...v2.0.0-beta.3
[2.0.0-beta.2]: https://github.com/Art4/Ged/compare/v2.0.0-beta.1...v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/Art4/Ged/compare/v2.0.0-alpha.3...v2.0.0-beta.1
[2.0.0-alpha.3]: https://github.com/Art4/Ged/compare/v2.0.0-alpha.2...v2.0.0-alpha.3
[2.0.0-alpha.2]: https://github.com/Art4/Ged/compare/v2.0.0-alpha.1...v2.0.0-alpha.2
[2.0.0-alpha.1]: https://github.com/Art4/Ged/compare/v1.1.0...v2.0.0-alpha.1
[1.1.0]: https://github.com/Art4/Ged/compare/v1.0.8...v1.1.0
[1.0.8]: https://github.com/Art4/Ged/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/Art4/Ged/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/Art4/Ged/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/Art4/Ged/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/Art4/Ged/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/Art4/Ged/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Art4/Ged/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Art4/Ged/compare/v1.0...v1.0.1
[1.0.0]: https://github.com/Art4/Ged/compare/v0.9.8...v1.0
