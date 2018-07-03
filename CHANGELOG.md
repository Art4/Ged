<!-- @@@title:Changelog@@@ -->

# Changelog
Alle signifikanten Änderungen zu diesem Projekt werden in dieser Datei dokumentiert.

## [Unreleased]

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

[Unreleased]: https://github.com/Art4/Ged/compare/v2.0.0-alpha.1...HEAD
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
