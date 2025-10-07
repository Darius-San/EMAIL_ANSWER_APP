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

Frontend: http://localhost:5467
Backend:  http://localhost:4410 (Auto-Fallback auf 4411..4414 falls belegt – Logs beachten)

## Implementierte Funktionen (Stand)
- Profile anlegen / bearbeiten / löschen (lokal gespeichert)
- Theme Switching (mehrere visuelle Themes)
- Auto-Port-Fallback für Backend bei Konflikten
- EmailList (erste Anzeige, IMAP Platzhalter / leere Ergebnisse)
- Health Polling Banner (BackendStatusBanner) mit Retry
- Tests: Profile CRUD, Theme, Email-Liste (Mock), Backend Offline Banner, Smoke Test

## Nächste Schritte (Roadmap)
- Dynamische IMAP Credentials Übergabe (POST Endpoint)
- Mail Detail Ansicht + Reply Draft
- Outlook (Graph) OAuth Flow
- Thunderbird lokale Mbox Analyse
- Persistente Provider-spezifische Settings pro Profil
- LLM Antwort-Generierung

## Environment Variablen
Backend (.env):
```
PORT=4410
IMAP_HOST=
IMAP_PORT=993
IMAP_USER=
IMAP_PASSWORD=
```

Frontend (Vite – optional):
```
VITE_API_BASE=http://localhost:4410
```
Falls der Backend-Port wegen Konflikt hochgezählt wurde (z.B. 4412), Frontend neu starten mit angepasster `VITE_API_BASE`.

## Tests
Ausführen:
```
npm test
```
Alle Tests laufen headless (Vitest + React Testing Library). Ergänzte Smoke- und Offline-Health-Tests verhindern “weiße Seite” Regressionen.

## Troubleshooting
| Problem | Ursache | Lösung |
|---------|---------|-------|
| Weißer Bildschirm / keine Daten | Backend Port blockiert, Emails-Fetch schlägt fehl | Konsole prüfen, BackendStatusBanner beobachten, ggf. freien Port übernehmen & `VITE_API_BASE` setzen |
| Port 4410 in use | anderer Prozess belegt Port | Auto-Fallback nutzt nächsten Port; im Log steht neuer Port |
| Keine E-Mails | IMAP Credentials fehlen oder leerer Posteingang | .env setzen oder Mock-Daten implementieren |
| BackendStatusBanner dauerhaft “Backend nicht erreichbar” | Backend nicht gestartet oder falsche API Base | Server starten oder `VITE_API_BASE` anpassen |

## Sicherheit
Keine Passwörter committen. `.env` lokal halten. Später: Secrets über Secret Manager / Vault integrieren.

## License
MIT (optional anpassen)
