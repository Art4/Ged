<!-- @@@title:Readme@@@ -->

# Ged

![Icon](pages/assets/img/icon.png)

[![Latest Version](https://img.shields.io/github/release/Art4/Ged.svg)](https://github.com/Art4/Ged/releases)
[![Software License](pages/assets/img/license-GPL3-brightgreen.png)](LICENSE)
[![Source Code](pages/assets/img/source-Art4_Ged-blue.png)](https://github.com/Art4/Ged)
[![Build Status](https://travis-ci.org/Art4/Ged.svg?branch=master)](https://travis-ci.org/Art4/Ged)

Ged ist ein Gadget für Windows, das Zeichnugen schnell öffnen lassen kann und weitere Funktionen zur Verwaltung von Zeichnungen bereitstellt.

Die Änderungen des Projekts können im [Changelog](CHANGELOG.md) nachverfolgt werden.

Der Quellcode ist auf [Github](https://github.com/Art4/Ged) zu finden und unterliegt der [GPL3](LICENSE). Alles Notwendige für das Deployment ist unter [Ged-Deployment](https://github.com/Art4/Ged-Deployment) zu finden.

## Überarbeitung als Electron App

Windows Gadgets werden von Microsoft nicht mehr unterstützt. Daher wird Ged auf Basis von Electron komplett neu geschrieben.

Die folgenden Informationen beziehen sich auf die Installation und Anwendung mit Electron.

### Anforderungen

- node.js
- npm

### Installation

```shell
npm install
npm run webpack
```

### Starten

```shell
npm start
```

### Deployment

```shell
npm run deploy
```

## Anwendung

Ged erwartet eine Eingabe in dieser Form:

```
<Zeichnungsnummer>[-r<Revision>][.<Endung>] [<Befehl>]
```

Um die Eingabe abzusenden, kann die `Enter`-Taste gedrückt werden oder auf die Lupe rechts neben dem Eingabefeld geklickt werden.

### Zeichnungsnummer

Die Angabe eine Zeichnungsnummer ist immer erforderlich und muss eine 5-stellige Zahl sein.

#### Beispiel

```
12345
```

### Revision

Ged versucht immer die letzte Revision einer Zeichnung zu finden. Mit der Angabe der Revision kann nach einer expliziten Revision gesucht werden.

Die Revision ist eine einstellige Zahl zwischen `0` und `9` oder ein Großbuchstabe von `A` bis `Z`. Die Angabe der Revision erfolgt nach der Zeichnungsnummer und wird mit `-r` abgetrennt.

#### Beispiele

```
12345-r1
12345-rB
```

### Endung

In den Optionen von Ged ist definiert, nach welcher Dateiendung gesucht werden soll. Soll von dieser Einstellung abgewichen werden, kann die Dateiendung mit `.<Dateiendung>` explizit angegeben werden.

Die Dateiendung ist eine Zeichenkette mit mindestens einem Zeichen. Die am häufigsten verwendeten Dateiendungen sind `pdf` für PDF-Dateien, `dft` für Solid Edge Zeichnugen oder `dwg` für AutoCAD-Dateien.

#### Beispiele

```
12345.pdf
12345.tiff
```

Soll zusätzlich zur Dateiendung eine bestimmte Revision gesucht werden, so muss die Revision vor der Dateiendung angegeben werden.

#### Beispiele

```
12345-r1.pdf
12345-r0.tiff
```

### Befehl

Mit einem Befehl kann bestimmt werden, welche Aktion mit der Zeichnung ausgeführt werden soll. Wird kein Befehl angegeben, wird der Standardbefehl `o` (für 'open') angenommen.

Der Befehl ist eine Zeichenkette von meist einem Zeichen. Er wird mit einem ` ` (Leerzeichen) getrennt nach der Angabe der Zeichnungsnummer angegeben. Eine Liste möglicher Befehle ist weiter unten zu finden.

#### Beispiel

```
12345 o
```

Sollen zusätzlich noch die Dateiendung und/oder Revision bestimmt werden, müssen diese wie oben beschrieben nach der Zeichnungsnummer angegeben werden.

#### Beispiele

```
12345.pdf o
12345-r1 o
12345-r1.pdf o
```

## Befehle

### `o` - open

Sucht nach der neusten Revison einer Zeichnung und öffnet diese. Wenn die Datei nicht gefunden wurde, wird der Explorer an der Stelle geöffnet, an der die eingegebene Zeichnungsnummer erwartet wird und selektiert die am besten passenste Datei.

Der Befehl open ist der Standard. Wird kein Befehl angegeben, wird die gefundene Zeichnung automatisch geöffnet.

#### Beispiel

```
12345 o
12345
```

Wird zweimal nacheinander versucht, eine Zeichnung zu öffnen, die es nicht gibt, wird er Explorer geöffnet, damit sich der Anwender eine Übersicht über die verfügbaren Zeichnungen erhält. Siehe auch den Befehl `i`.

### `e` oder `3d` - 3D-Ordner öffnen

Dieser Befehl öffnet den 3D-Ordner einer Zeichnung. Wenn der Ordner nicht existiert, wird die Meldung `Der Ordner <Zeichnungsnummer>_3D existiert nicht` ausgegeben.

#### Beispiel

```
12345 e
12345 3d
```

### `i` - index

Dieser Befehl öffnet den Windows Explorer an der Stelle, an der die eingegebene Zeichnungsnummer erwartet wird und selektiert die am besten passenste Datei. So kann man sich einen schnellen Überblick über die vorhandenen Dateien im Zeichnungs-Archiv verschaffen.

#### Beispiel

```
12345 e
12345 3d
```

### `+` oder `a` - erweiterte Suche

Sucht nach wie `o` der neusten Revison einer Zeichnung und öffnet diese. Wenn die Datei nicht gefunden wurde, wird zusätzlich im dazugehörigen 3D-Ordner nach der Datei gesucht. Wenn sich die Datei im 3D-Ordner befindet, wird die Meldung `<Zeichnungsnummer>_3D\<Zeichnungsnummer>-R0.dft wird geöffnet` ausgegeben.

#### Beispiel

```
12345 +
12345 a
```

### `s` - Scheibschutz setzen

Setzt den Schreibschutz bei der gefundenen Datei und gibt die Meldung `<Zeichnungsnummer>.dft ist schreibgeschützt` aus.

#### Beispiel

```
12345 s
```

### `f` - Scheibschutz aufheben

Hebt den Schreibschutz bei der gefundenen Datei und gibt die Meldung `<Zeichnungsnummer>.dft ist beschreibbar` aus.

#### Beispiel

```
12345 f
```

### `c` - Dateien bereinigen

Setzt bei der vorherige Revision der gesuchten Zeichnung die DFT-Datei auf Schreibschutz und löscht die dazugehörige PDF-Datei. Vor dem Löschen der PDF erscheint ein Warnhinweis mit dem zu löschenden Dateinamen, der erst vom Anwender bestätigt werden muss. Bricht der Anwender das Löschen ab, wird nur der Schreibschutz bei der DFT-Datei gesetzt.

#### Beispiel

Angenommen, es existieren die folgenden Dateien:

- 12345-R0.dft
- 12345-R0.pdf
- 12345-R1.dft
- 12345-R1.pdf
- 12345-R2.dft

Der Aufruf von

```
12345 c
```

löscht nach Rückfrage die Datei `12345-R1.pdf` und aktiviert bei der Datei `12345-R1.dft` den Schreibschutz. Die vorhergehenden Revisionen werden nicht verändert. Die Dateien sehen jetzt so aus:

- 12345-R0.dft
- 12345-R0.pdf
- 12345-R1.dft (schreibgeschützt)
- 12345-R2.dft

Sollen jetzt auch die Dateien der Revision 0 bereinigt werden, muss der Befehl mit der Revision 1 aufgerufen werden.

```
12345-r1 c
```

Die Dateien sehen dann so aus:

- 12345-R0.dft (schreibgeschützt)
- 12345-R1.dft (schreibgeschützt)
- 12345-R2.dft
