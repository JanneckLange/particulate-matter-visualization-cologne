![FeinstaubKoeln_Hauptbild](/images/FeinstaubKoeln_Hauptbild.jpg)

# Feinstaub Köln

JANNECK LANGE, RICHARD MUSEBRINK & BENJAMIN SCHÖNKE

Dokumentation über das Projekt 'Feinstaub Köln' zum Thema 'Urbanität und Smart Cities' des Kurses 'Grundlagen der Datenvisualisierung' von Herrn Prof. Dr. Till Nagel im Wintersemester 2019/2020 der Hochschule Mannheim.

In den Medien wurde häufig von Feinstaubbelastungen in Großstädten gesprochen, da es im Verdacht steht, für zahlreiche Krankheiten mitverantwortlich zu sein. Im Projekt Feinstaub Köln wird untersucht, welchen Einfluss der Verkehr, insbesondere Veranstaltungen (z. B. Karneval) und das Wetter auf die Feinstaubbelastung in der Smart City Köln haben. Für die Analyse wurden öffentlich zugängliche Daten zur Feinstaubkonzentration, Daten des Kölner Veranstaltungskalenders sowie Wetterdaten diverser Quellen erhoben, aufbereitet und visualisiert. Es konnte festgestellt werden, dass sich die Feinstaubbelastungen durch besondere Events und Niederschlagsmengen oft erklären lassen.

## Einführung / Konzept

Das Projekt Feinstaub Köln wurde durch das Team DusterBusters ins Leben gerufen. Vom 21. November 2019 bis zum 15. Januar 2020 hatte das Team Zeit, um sich mit der [Stadt Köln](#smart-city-köln) und dem [Thema Feinstaub](#thema-feinstaub) genau auseinanderzusetzen, Quellen zu recherchieren, [Daten](#daten) auszuwerten, [Hypothesen](#hypothesen) zu untersuchen und eine [Software](#software) zu entwicklen, um die Sachverhalte anschaulich zu visualisieren.

### Smart City Köln

Für die Untersuchung haben wir uns für die 1,1-Millionen-Einwohner-Stadt Köln in Nordrhein-Westfalen entschieden. Köln (englisch cologne) führt seit 2011 eine Smart City Kampagne mit diversen Entwicklungskonzepten durch (siehe [Köln auf dem Weg zur SmartCity](http://klima-log.de/_database/_data/datainfopool/Koeln%20auf%20dem%20Weg%20zur%20SmartCity.pdf)). Ziel ist es unter anderem, eine moderne Metropole zu entwickeln, die technologische Innovationen anwendet, um wirtschaftliche Aspekte effizienter zu gestalten und zusätzlich ein attraktiveres Stadtbild zu schaffen. Zur Steigerung der Attraktivität bemüht sich die Stadt Köln unter anderem die Luftqualität zu erhöhen. Um die Luftqualität zu überwachen, betreiben die Stadt Köln sowie zahlreiche Einwohner eigene Messstationen, um den Feinstaubgehalt der Luft zu messen. Das Engagement der Stadt Köln ist der Grund, weshalb die Untersuchung für diese Metropole betrieben wird.

### Thema Feinstaub

Feinstaub ist ein Faktor, der die Luftqualität mitbestimmt, zur Umweltverschmutzung beiträgt sowie für zahlreiche Krankheiten mitverantwortlich sein soll. Unter anderem entsteht Feinstaub durch Abgase, Abreibung von Gummireifen, Bremsstaub sowie durch chemische Prozesse, die vom Wetter beeinflusst werden. Die Feinstaubkonzentration durch Abgase ist zudem dafür verantwortlich, dass bestimmte Fahrzeuge teilweise Fahrverbote in diversen Städten erhalten, um die lokale Feinstaubkonzentration zu begrenzen. In diesem Projekt werden Daten aus verschiedenen Quellen gesammelt, aggregiert und grafisch aufbereitet, um folgende Fragen zu klären:

* Inwiefern beeinflussen besondere Veranstaltungen (z. B. Karnevalsumzug) in einem bestimmten Gebiet die lokale Feinstaubkonzentration?
* Welchen Einfluss hat das Wetter auf die gemessenen Feinstaubwerte?

## Daten / Auswertung

Nachfolgend wird beschrieben, welche Daten wir recherchiert und untersucht haben.

### Daten

Um zu untersuchen, welche Faktoren aus den Bereichen Verkehr und Wetter besonders die Feinstaubbelastung beeinflussen, müssen verschiedenste Daten gesammelt, zusammengeführt und auf Zusammenhang hin überprüft werden. Um eine entsprechende Aussagekraft und Regelmäßigkeit festzustellen, benötigten wir die jeweiligen Daten für einen Zeitraum von zwei Jahren (von Januar 2018 bis Januar 2020).

Nachfolgend wird aufgeführt, welche Daten wir ursprünglich dazu betrachtet haben, warum wir diese nicht mehr verwenden und welche Daten nun tatsächlich im Projekt “Feinstaub Köln” verwendet werden.

### Ursprünglich betrachtete Daten

Ursprünglich hatten wir die Absicht, noch weitere Hypothesen und Fragen zu beantworten. Diesbezüglich wollten wir zusätzlich Daten zum Fahrverhalten der Autofahrer analysieren sowie Wetterdaten, wie Temperatur, Windstärke und Windrichtung von Wetterstationen untersuchen. Nachfolgend wird daher beschrieben, welche Daten wir betrachtet hatten und aus welchen Gründen wir diese Daten nicht weiter verwendeten.

#### Blitzerdaten

Die ursprünglich erste Fragestellung lautete, ob eine geringere Feinstaubbelastung vorliegt, wenn Verkehrskontrollen durch das Aufstellen und Betreiben von Blitzern durchgeführt werden. Um diese Frage zu beantworten, wurden Daten über aufgestellte Blitzer gesammelt: Standort, Überschreitung der Höchstgeschwindigkeit sowie weitere Daten. Diese Werte wurden dann ausgewertet und mit den Daten des Feinstaubes der Messstationen verglichen. Leider waren für uns keine bemerkenswerten Schwankungen beim Feinstaub festzustellen, um eine Verbindung mit den geblitzten Fahrzeugen herzustellen. Daher haben wir uns dazu entschieden auf die Blitzerdaten zu verzichten.

#### Verkehrsdaten

Um herauszufinden, welchen direkten Einfluss der Verkehr auf die Luftqualität hat, wollten wir Faktoren wie die Verkehrsdichte, den Verkehrsfluss usw. untersuchen. Eine Möglichkeit dazu wäre zum Beispiel gewesen, bei verschiedenen Quellen Daten für den Verkehr zu sammeln:

* [here](https://www.here.com/)
* [www.offeneDaten-Koeln.de](https://www.offenedaten-koeln.de/dataset/verkehrsaufkommen-stadt-köln) sowie
* [www.Stadt-Koeln.de](https://www.stadt-koeln.de/externe-dienste/open-data/traffic.php).

Da uns aber bei den genannten Quellen keine historischen Daten zur Verfügung gestellt wurden, sondern immer nur Daten zur aktuellen Zeit, war es damit nur möglich den Zeitraum des Projekts abzudecken - also knapp zwei Monate. Dennoch sammelten wir für mehrere Wochen Daten und führten diese zusammen, um mögliche Zusammenhänge zur Luftverschmutzung durch Feinstaub festzustellen. Leider konnten wir dadurch weder unsere Eingangsfrage beantworten noch aussagekräftige Hypothesen diesbezüglich aufstellen. Daher haben wir uns auch hier dafür entschieden, die Verkehrsdaten für die Untersuchung nicht weiter zu betrachten.

### Tatsächlich ausgewählte Daten

Um nun die Problemlösung zu konkretisieren, wird in diesem Abschnitt erläutert, welche Daten wir für das Projekt gesammelt und wie wir diese aufbereitet haben.

#### Feinstaubdaten

Für die Beschreibung der Luftverschmutzung nutzen wir die sogenannten P2-Feinstaubdaten, auch PM2,5 genannt. Gemäß dem [Umweltbundesamt](https://www.umweltbundesamt.at/pm25) bestehen 50% dieser Feinstaubteilchen aus 2,5 Mikrometer großen Partikeln, einem höheren Anteil noch kleinerer Partikel sowie einem niedrigeren Anteil noch größerer Partikel als 2,5 Mikrometer. PM2,5 sind Partikel, die auch in PM10 bzw. P1 Feinstaub vorkommen, die einen Teilchendurchmesser von 10 Mikrometern besitzen. Interessant sind die P2 Feinstaubdaten für uns besonders, da diese Partikel bis in die Lungenbläschen eingeatmet werden können und eine hohe Belastung somit z. B. zu Herz-Kreislauferkrankungen führen kann (gemäß Weltgesundheitsorganisation (WHO)).

Die Smart City Köln betreibt mehrere Messstationen, die die Feinstaubkonzentration in der Stadt messen (siehe Abbildung 1, [Landesamt für Natur, Umwelt und Verbraucherschutz Nordrhein-Westfalen](https://www.lanuv.nrw.de/umwelt/luft/immissionen/aktuelle-luftqualitaet/) sowie [Luft jetzt](https://luft.jetzt/koeln)).

![Messstationen der Stadt Köln](/images/Daten_Feinstaub_Messstationen.png)
Abbildung 1: Messstationen der Stadt Köln

Zusätzlich existiert eine Initiative, in der Mitbürger eigene Messstationen betreiben und diese Daten öffentlich zur Verfügung stellen. Die Masse an privaten Messstationen erlaubt allerdings eine feinere und genauere Darstellung über die Verteilung der Feinstaubkonzentration. Diesbezüglich haben wir uns dafür entschieden, diese offene Datenquelle zu nutzen. Das Portal [luftdaten.info](https://luftdaten.info/) bietet neben einer interaktiven Karte auch ein Archiv mit historischen Daten an.

Die Sensordaten lagen jeweils tageweise vor und wurden dann per Skript heruntergeladen und jeweils pro Sensor zu einer Datei zusammengefasst und aufbereitet. So wurden überflüssige Attribute entfernt und die Datumsangabe zum Timestamp (siehe unten) umgewandelt. Desweiteren wurde, in Vorbereitung auf die spätere Verwaltung der Daten, eine Umwandlung des Dateiformats von comma-seperated values (CSV) zur JavaScript Object Notation (JSON) vorgenommen. Da kein gefundener Dateikonverter in der Lage war, die vorherrschende Datenmenge zu verarbeiten, wurde auch dieser Schritt über ein Python-Skript gelöst.

Ein Feinstaub-Datensatz hat die folgenden quantitativen Attribute:

![Attribute der Feinstaubdaten](/images/Daten_Feinstaub_Attribute.png)
Abbildung 2: Attribute der Feinstaubdaten

Die umgewandelten Daten wurden anschließend in eine dokumentenorientierte NoSQL-Datenbank (MongoDB) importiert und in einer eigenen Collection mit den jeweiligen Durchschnittswerten der jeweiligen Tage und Stunden kalkuliert. Das Ergebnis ist eine Collection pro Sensor und zusätzlich eine für den Stunden- und eine für den Tagesdurchschnitt.

#### Kartendaten

Um zu sehen, wo welche Feinstaubwerte gemessen wurden und um die örtliche Verbindung zu Wetter und Veranstaltungen zu schaffen, ist es praktisch, eine Karte abzubilden, die die Stadt Köln detailliert zeigt.

Als Kartenanbieter kam, aufgrund der freien Lizenz und der guten Integration in Leaflet (siehe [Implementierung](https://infovis-mannheim.de//gdvws19/projects/feinstaub-koeln/#implementierung)), [OpenStreetMap](https://www.openstreetmap.de/) zum Einsatz.

#### Veranstaltungsdaten

Um die Frage zu beantworten, inwiefern Veranstaltungen die Feinstaubwerte beeinflussen, haben wir mehrere Quellen in Betracht gezogen, um Veranstaltungsdaten der Smart City Köln zu erhalten:

* [Virtual Nights](https://www.virtualnights.com/koeln),
* [Köln Veranstaltungen](https://termine.koeln.de/koeln) sowie
* [Verkehrskalender Köln](https://www.stadt-koeln.de/leben-in-koeln/verkehr/verkehrskalender/).

Die Wahl fiel hierbei auf den Kölner Verkehrskalender, da dieser nur solche Veranstaltungen auflistet, welche auch einen Einfluss auf den Verkehr in der Stadt haben. Auf diese Weise konnten wir von vornherein viele Events ausschließen, welche uns in anderen Veranstaltungsquellen angezeigt wurden.

Besonders praktisch war hier auch die angebotene API-Verbindung, über welche die Events der Webseite gesammelt werden konnten. Die Events lagen dabei in 17 Kategorien vor (nominaler Merkmalstyp):

![Eventkategorien vom Verkehrskalender](/images/Daten_Events_Kategorien.png)
Abbildung 3: Eventkategorien vom Verkehrskalender

Für das Projekt haben wir uns für die folgenden drei Kategorien entschieden, da die übrigen keine Ergebnisse für den Betrachtungszeitraum geliefert haben:

* 12: Lauf,
* 13: Karneval und
* 14: Festivall.

Die dazugehörigen quantitativen Datumsangaben haben wir dann genutzt, um diese für uns interessanten Veranstaltungen mit ihrem Namen (nominal) für das Projekt auszuwählen.

#### Wetterdaten

In den vorherigen Beobachtungen der Feinstaubdaten haben wir festgestellt, dass es einen zeitlichen Zusammenhang zwischen der Feinstaubkonzentration und der Tageszeit gibt:

![Durchschnitttliche Feinstaubkonzentration am Tag (24 Stunden)](/images/Daten_Feinstaub_Verlauf.jpg)
Abbildung 4: Durchschnitttliche Feinstaubkonzentration am Tag (24 Stunden)

Über Nacht ist die Feinstaubkonzentration signifikant höher als am Tage. Unsere Recherchen haben ergeben, dass die Temperatur und die Sonneneinstrahlung den Feinstaub chemisch beeinflussen (näheres dazu im [Statuspapier Feinstaub von der Gesellschaft Deutscher Chemiker](https://www.gdch.de/fileadmin/downloads/Publikationen/Weitere_Publikationen/PDF/feinstaub.pdf)). Dies hat uns dazu veranlasst auch die Wetterdaten für den gewählten Zeitraum zu erfassen. Darunter waren Daten wie:

* Sonnenscheindauer,
* Temperatur,
* Luftdruck und Luftfeuchte sowie
* Windstärke und Windrichtung.

Aufgrund der vorangeschrittenen Zeit haben wir diese Faktoren allerdings nicht weiter betrachtet. Deshalb haben wir uns für das Projekt letztendlich nur noch für das folgende Wetter-Attribut entschieden:

* Niederschlag

Nach langer Recherche konnten wir vom Deutschen Wetterdienst ([DWD](https://www.dwd.de/)) Daten ausfindig machen, die als CSV-Datei vorliegen, Quelle:

* [Deutscher Wetterdienst](https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/)

![Optisch aufbereitete Originaldaten vom Deutschen Wetterdienst](/images/Daten_Niederschlag_Quelle_DWD.png)
Abbildung 5: Optisch aufbereitete Originaldaten vom Deutschen Wetterdienst

Wie in der Abbildung zu sehen ist, liegen die Daten drei-spaltig quantitativ vor. 106.560 Datensätze waren unterteilt in ein ganzzahliges Messdatum für einen 10-minütigen Messzeitraum. Jeder Datensatz gibt an, wie viele Minuten und welche Menge in Liter es pro Kubikmeter davon geregnet hat.

Die Daten mussten auch hier aufbereitet werden, um das Messdatum zum Datumsformat nach ISO-Norm zu konvertieren. Sobald dies geschehen ist, wurden die Daten ebenso in die MongoDB importiert.

## Prozess
Um sich über die Feinstaubdaten einen ersten Überblick zu verschaffen, haben wir in [Tableau](https://www.tableau.com/de-de) ein Dashboard erstellt, welches zum einen die einzelnen Positionen der Sensoren auf einer Karte visualisiert und zum anderen, den Verlauf der PM2,5 Werte jedes Sensors als ein Liniendiagramm darstellt. Dadurch wurde schnell bewusst, dass der zuvor vermutete Zusammenhang zwischen Berufsverkehr und Feinstaubbelastung wesentlich geringer ausfällt als gedacht und die Feinstaubkonzentration über den Tag, unabhängig von Wochentagen, Wochenenden und Feiertagen meist sehr ähnlich verläuft. Das Muster erinnerte dabei an eine Sinuskurve, wobei das Tal der Tag und die Nacht der Berg gewesen ist (siehe [Abbildung 4](#abb4)). Im Verlauf eines Jahres erfuhr dieses Muster, von kleinen Ausnahmen abgesehen, lediglich eine zeitliche Verschiebung, was uns auf eine Abhängigkeit von Luftfeuchte und Sonnenstunden schließen ließ. Nach dieser neuen Vermutung mussten wir unseren eigentlichen Plan, einen direkten Zusammenhang zwischen Verkehr und Feinstaubbelastung herzustellen, überdenken. Aus diesem Grund entschlossen wir uns, dass auch die Niederschlagsdaten eine große Rolle spielen, um die Werte der einzelnen Sensoren zu einem bestimmten Zeitpunkt, z. B. bei einem besonderen Ereignis, besser bewerten zu können. Für die spätere Umsetzung sahen wir hierfür eine Darstellung der Niederschlagsdaten und PM2,5 Werte in einem Zwei-Achsen-Diagramm vor (siehe Abschnitt [Prototyp](#prototyp--ergebnisse)).

Für den Vergleich der jeweiligen Daten und der Gegenüberstellung, inwiefern besondere Ereignisse im Raum Köln die Feinstaubwerte beeinflussen, haben wir den Top-Down-Ansatz gewählt. Das heißt, wir haben explizit nach unregelmäßigen Spitzen und Tiefen in den Feinstaubwerten gesucht und haben dann nach Veranstaltungen geschaut, die zu dieser Zeit in Köln stattgefunden haben. Diese Art der Vorgehensweise war für uns effektiver, als die Masse an Veranstaltungen, die wöchentlich in Köln stattfinden, mit den Feinstaubwerten zu vergleichen. Denn das hatten wir auch versucht, konnten aber nur minimale Auswirkungen bei der Feinstaubkonzentration beobachten. Wir erklären uns das damit, dass viele Veranstaltungen den Verkehr zu gering beeinflussen oder an Standorten stattfanden, wo keine Feinstaubmessungen durchgeführt wurden.

## Prototyp / Ergebnisse

Impressionen der ersten Entwürfe:

![Prototyp 1](/images/Gallery_Prototyp_0-thumb.jpg)
![Prototyp 2](/images/Gallery_Prototyp_1-thumb.jpg)
![Prototyp 3](/images/Gallery_Prototyp_2-thumb.jpg)

### Visualisierung

Für die möglichen Visualisierungen des Projekts “Feinstaub Köln” haben wir Ideen aus der bisherigen Vorlesung gesammelt, sowie externe visuelle Projekte angeschaut, z. B. bei:

* Tableau Gallery

Die Visualisierung basiert hauptsächlich auf einer grafischen Oberfläche, die die Stadt Köln als große Karte anzeigt. Dies ermöglicht es auf sehr einfache Art und Weise für den Benutzer örtliche Zusammenhänge darzustellen. Auf die Darstellungsvariante einer Choroplethenkarte haben wir bewusst verzichtet, da diese nicht fein genug die Standorte der Messstationen abbildet. Um den möglichen Verkehrsfluss nachzuvollziehen, ist es außerdem wichtig, dass die Karte Straßenzüge abbildet.

Die Standorte der einzelnen Feinstaubsensoren haben wir als Marker auf einer Karte eingeblendet, welche den Hintergrund unserer Darstellung bildet. Die Marker haben hierbei die gleiche Farbe wie ihre zugehörigen Graphen. Dies ermöglichte es uns auf eine zusätzliche Legende zu verzichten. Die Marker dienen darüber hinaus als Schalter um die Darstellung der dem Sensor entsprechenden Graphen ein- und auszublenden.

Um möglichst viele quantitativen Feinstaubwerte mehrerer Sensoren gleichzeitig anzuzeigen, werden die Werte in einem Liniendiagramm abgebildet. Ein Liniendiagramm hat den Vorteil, dass durch die Auswahl mehrerer Sensoren mehrere Linien mit unterschiedlichen Farben äquivalent zu den Sensoren angezeigt werden können. Dadurch können die Werteverläufe einzelner Sensoren optisch klar voneinander getrennt werden, aber auch Gemeinsamkeiten besser dargestellt werden.

Die quantitativen Niederschlagsdaten werden als Balkendiagramm angezeigt und mit dem Liniendiagramm kombiniert. Das Balkendiagramm zu nutzen war für uns von Anfang an klar, da sich diese Darstellungsvariante für den Niederschlag in vielen Medien etabliert hat. Der Nutzer ist daher mit dieser Ansichtsart vertraut und es unterscheidet sich ausreichend von den Feinstaubdaten im Liniendiagramm.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=IxyS-8Vjee8
" target="_blank"><img src="http://img.youtube.com/vi/IxyS-8Vjee8/0.jpg" 
alt="DusterBusters - Sensoren auswählen, Daten betrachten" width="240" height="180" border="1" /></a>

Die Darstellung der Veranstaltungen wurde in Form einer Zeitleiste in Serpentinenform am rechten Bildschirmrand gelöst. Durch die Serpentinen werden die Events entzerrt und überlagern sich weniger. Zusätzlich besteht aber auch hier die Möglichkeit, den sichtbaren Bereich der Zeitachse zu ändern. Wählt man ein bestimmtes Event aus, dann werden die betroffenen Sensoren angewählt und der Zeitraum des Events wird auf der Zeitleiste der Feinstaubdaten hervorgehoben.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=U8XKmzGYzvM
" target="_blank"><img src="http://img.youtube.com/vi/U8XKmzGYzvM/0.jpg" 
alt="DusterBusters - Veranstaltungen genauer betrachten" width="240" height="180" border="1" /></a>

## Erkenntnisse

Wir hatten vermutet, dass Niederschlag oder Luftfeuchtigkeit einen großen Einfluss auf die Konzentration von Feinstaub in der Luft haben. Wie exemplarisch in Abbildung 6 zu sehen ist, wird, meist wenn es regnet, eine niedrigere Feinstaubbelastung gemessen:

![Kombiniertes Balken- (Niederschlag) und Liniendiagramm](/images/Vergleich_Feinstaub_Niederschlag.png)
Abbildung 9: Kombiniertes Balken- (Niederschlag) und Liniendiagramm (Feinstaub)

Da sich dieses Phänomen auch noch an vielen anderen Stellen widerspiegelt, sehen wir unsere Vermutung als bestätigt.

Auch unsere Hauptforschungsfrage, ob Veranstaltungen einen Einfluss auf die Feinstaubbelastung haben, sehen wir als bestätigt. Zu zahlreichen Veranstaltungen weist die Feinstaubbelastung untypische Muster auf. Wie hier am Beispiel des Straßenfestes auf der Venloher Straße sehr gut zu sehen ist:

![Strassenfest 1](/images/Gallery_Strassenfest_0_Auswahl-thumb.jpg)
![Strassenfest 2](/images/Gallery_Strassenfest_1_Tagesansicht-thumb.jpg)
![Strassenfest 3](/images/Gallery_Strassenfest_2_Wertevergleich-thumb.jpg)


Auch auf mehreren anderen Veranstaltung kommt es immer wieder zu vereinzelten starken Ausschlägen der Feinstaubbelastung. An den beiden Referenzsensoren in der Nähe erkennt man, dass es sich bei den Ausschlägen nicht um natürliche, sondern um künstliche Belastungen des Straßenfestes handelt.

Wir mussten aber auch feststellen, dass wir nicht alle Feinstaubausschläge erklären können. Am 09.06.2018 hat jeder Sensor im gesamten Kölner Stadtgebiet Werte weit über dem normalen Mittel gemessen:

![Feinstaubausschläge vom 09.06.2018](/images/Erkenntnisse_unerklaerliche-ausschlaege.png)
Abbildung 13: Feinstaubausschläge vom 09.06.2018

Zu dem Zeitpunkt fanden zwar verschiedene Veranstaltungen statt, jedoch erklärt keines davon “silvesterähnliche” Ausschläge.

## Implementierung

Die technische Umsetzung unseres Projekts bereitete uns gleich zu Beginn eine Menge Kopfschmerzen, da bereits die Darstellung einfacher Graphen durch die Daten zweier Feinstaubsensoren in keinem von uns getesteten JavaScript Framework vernünftig funktionierte, gestestet wurden: Vega Lite und amCharts. Das Laden einer solchen Menge von Daten brauchte auch mit angewendeten Performanceoptimierungen entweder mindestens eine Minute oder brachte sogar die Website zum Absturz. Um sicherzustellen, dass immer nur eine minimale Datenmenge geladen werden muss, implementierten wir darum eine Datenbank, welche über eine REST-API nur benötigte Daten liefert. Da wir von den 7,5 Millionen Datensätzen für die Feinstaubsensoren auf diese Weise immer nur einen Bruchteil laden mussten, stand einer Verwendung der oben genannten Frameworks nichts mehr im Wege. Wir entschieden uns für amCharts, da dies alle von uns angedachten Features unterstützte. Zu diesen gehörte unteranderem eine Karte, eine Timeline und eine große Auswahl an Datenvisualisierungen. Darüber hinaus stellt die Dokumentation von amCharts eine große Auswahl an [Beispielanwendungen](https://www.amcharts.com/demos/) zur Verfügung, was uns den Einstieg erleichterte. Im weiteren Verlauf stellte sich heraus, dass die angebotene Mapintegration für uns nicht ausreichend ist, weswegen wir für die Darstellung der Karte zu [Leaflet](https://leafletjs.com/) als Framework wechselten. Diese Wahl fiel uns leicht, da zwei Teammitglieder in einem gemeinsamen privaten Projekt bereits mit dem Framework gearbeitet hatten und es auch darüber hinaus leicht einzubinden und flexibel anpassbar war. Als Datendatenbank nutzten wir [MongoDB](https://www.mongodb.com/), da hier bereits Erfahrungen vorhanden waren und uns die Speicherung der Daten im JSON Format eine weitere Konvertierung erübrigte, da auch unser Frontend Framework JSON erwartete.

### Tools

Als IDEs nutzten wir, für alle HTML und JavaSkript bezogenen Themen, Webstorm von Jetbrains, da dieses für Studenten kostenlos ist und wir uns in der Jetbrains Produktpalette heimisch fühlen und für alle JSON und Python bezogenen Anwendungsfälle Visual Studio Code von Microsoft. Dieser Editor ist dank seiner flexiblen Erweiterungen für beinahe alles die richtige Wahl. Unsere Versionierung verwalteten wir über GitHub. Damit unsere beiden Entwickler auf dieselbe Datenbank zugreifen konnten und wir kein Interesse daran hatten, diese auf einem Server zu hosten, griffen wir auf [ngrok](https://ngrok.com/) zurück. Dies ermöglichte es uns die Datenbank lokal auf dem Laptop laufen zu lassen, der auch für die spätere Präsentation genutzt werden sollte, während gleichzeitig ein Zugang für die vorherige Entwicklung auch für entfernte Teammitglieder möglich war.

### Datenabfrage

Beim initialen Laden der Daten fragt das Frontend die Feinstaubdaten an (Abbildung 14):

![Frontend: Update der Daten](/images/Implementierung_Frontend_Update-Data.png)
Abbildung 14: Frontend: Update der Daten

Je nach dem, welcher Zeitraum in der Ansicht gewählt wurde (siehe Video), werden entsprechend einer festgelegten Granularität Daten vom Backend angefragt (siehe Abbildung 15):

* Wird der Zeitraum nicht eingeschränkt oder beträgt der gewählte Zeitraum mindestens eine Woche, werden nur die durchschnittlichen Tageswerte geladen.
* Liegt der Zeitraum innerhalb einer Woche und länger als 10 Stunden, werden die Durchschnittswerte stundenweise ausgegeben.
* Bei einem gewählten Zeitraum von unter 10 Stunden, werden alle Daten gesendet.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=bQA3U_Hw76A
" target="_blank"><img src="http://img.youtube.com/vi/bQA3U_Hw76A/0.jpg" 
alt="DusterBusters - Kleiner Bereiche, genauere Daten" width="240" height="180" border="1" /></a>

![Backend: Abfrage der Feinstaubdaten](/images/Implementierung_Backend_Abfrage-der-Feinstaubdaten.png)
Abbildung 15: Backend: Abfrage der Feinstaubdaten

Auch im Frontend wird überprüft, ob für den gewählten Zeitausschnitt neue Daten angefragt werden müssten, um unnötige Anfragen an das Backend zu vermeiden. Darüber hinaus werden nur die Sensordaten angefragt, die wirklich notwendig sind.

![Frontend: Darstellung der Diagramme](/images/Implementierung_Frontend_Diagramm-Darstellung.png)
Abbildung 16: Frontend: Darstellung der Diagramme

## Fazit

Mithilfe unserer Visualisierung konnten wir feststellen, dass Veranstaltungen, die den Stadtverkehr beeinflussen, die lokale Feinstaubbelastung häufig markant verändern. Meist erhöht sich die Feinstaubbelastung im Zeitraum eines Events, manchmal fällt sie aber auch geringer aus .
Ebenso interessant war für uns, wie sehr scheinbar der Niederschlag den Feinstaub in der Luft bindet und die Messwerte dadurch temporär verringert werden.

Diese Ergebnisse tragen ungemein für das allgemeine Verständnis bei, dass der Mensch einen massiven Teil Feinstaub produziert, der gerade bei großen Veranstaltungen erzeugt wird. Das hat zur Folge, dass beispielsweise Menschen, die sensibel auf Feinstaub reagieren, bewusst solche Veranstaltungen meiden oder persönliche Schutzmaßnahmen ergreifen können. Zudem wird einem bewusst, dass Niederschlag eine natürliche Reinigungsfunktion besitzt und die Luft von schädlichen Feinstäuben befreien kann. Dies hat zur Folge, dass die Erderwärmung, ob natürlich oder durch den Menschen geschaffen, die Feinstaubbelastung begünstigt, wenn dadurch der Niederschlag verringert wird. Somit kann der Mensch entscheiden, wie er sein eigenes Handeln steuert, um die Feinstaubbelastung zu beeinflussen.

Wenn man zu den Niederschlagsdaten noch weitere Wetterdaten hinzuzieht und weitere Faktoren des Bereiches Verkehr betrachtet, wird es bestimmt möglich sein, noch genauere Aussagen zu treffen, wie der Feinstaub erzeugt und beeinflusst wird. Damit könnten womöglich Vorhersagen angestellt werden, wo und zu welcher Zeit welche Feinstaubkonzentration vorherschen könnte. Dies könnte politisch dazu genutzt werden, um weitere Optimierungen im urbanen Raum durchzuführen und Maßnahmen zu ergreifen, um die Lebensqualität in der Smart City zu steigern.
