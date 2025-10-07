# Email Responder App

React + TypeScript + Vite Frontend & Express Backend.

## Ziel
E-Mails aus verschiedenen Quellen (IMAP, Outlook, Thunderbird lokal) einlesen und später automatische Antworten mittels LLM generieren.

## Ordnerstruktur (aktuell)
```
/ (Root)
  package.json (Root Scripts: Frontend + Server Dev)
  /src (Frontend Code)
  /public (Static Files)
  /server (Backend Express API)
```

## Entwicklung starten
Installiere Dependencies und starte beide Dev-Server:

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend:  http://localhost:4000

## Nächste Schritte
- IMAP Verbindung implementieren (imapflow)
- Outlook Integration (Microsoft Graph OAuth Flow) vorbereiten
- Thunderbird: Lokale Profil- oder Mbox-Datei Analyse (später evaluieren)
- E-Mail Parsing & Normalisierung
- LLM Antwort-Service Stub

## Environment Variablen (geplant)
```
IMAP_HOST=
IMAP_PORT=
IMAP_USER=
IMAP_PASSWORD=
GRAPH_CLIENT_ID=
GRAPH_TENANT_ID=
GRAPH_CLIENT_SECRET= (falls client credentials)
``` 

## Sicherheit
NIEMALS echte Passwörter committen. `.env` Datei nutzen (kommt noch in .gitignore).

## License
MIT (optional anpassen)
