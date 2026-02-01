# FIVE LUX – Premium Website (DE) | Schwarz & Gold

## Was ich aus friseur-friseur.de übernommen habe (als Datenquelle)
- Adresse:Lautensackstraße 2, 80687 München, Deutschland
- Telefon: 089 57955764
- Öffnungszeiten: Mo–Sa 09:00–19:00
- Preisliste (Barber + Damen + Pakete/Kinder)
- Team-Namen (Rami, Aged, Rebin, Nawaf, Sam, Sarhang)

Hinweis: Den Google-Share-Link (share.google/...) kann ich hier technisch nicht öffnen. Wenn du mir den Inhalt als Text/Screenshot schickst, trage ich die Updates 1:1 ein.

## 1) Schnell bearbeiten
Öffne **config.json** und ändere:
- brand.name / brand.tagline
- contact.* (Adresse/Telefon/E-Mail/Links)
- whatsapp.number (echte Nummer!) + whatsapp.message
- Preise in "prices"
- Team/Reviews

## 2) Logo ersetzen
Ersetze `assets/logo.jpg` mit deinem Logo (das Bild, das du geschickt hast).

## 3) Lokal testen
Python:
`python -m http.server 8000`
Dann im Browser: http://localhost:8000

## 4) Online veröffentlichen
Netlify/Vercel: Ordner hochladen → fertig.


WICHTIG: Diese Version funktioniert auch, wenn du index.html direkt öffnest (file://), weil config.js eingebunden ist.
