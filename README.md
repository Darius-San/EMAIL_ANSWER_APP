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

## Dynamische IMAP Konfiguration (Neu)
Ab sofort kann pro Profil ein IMAP Zugang direkt über die UI konfiguriert werden:

1. Neues Profil anlegen (Provider = IMAP) – die IMAP Felder erscheinen direkt im Formular.
2. Host, Port (Standard 993), SSL/TLS, Benutzer, optional Passwort eingeben.
3. Optional: Häkchen "Passwort lokal speichern" legt das Passwort im LocalStorage (Zustand Persist) ab. Ohne Häkchen muss es bei jedem Abruf eingegeben werden.
4. Speichern – Profil ist sofort `imapConfigured`.
5. Im Bearbeiten-Dialog können IMAP Felder angepasst, neues Passwort gespeichert oder das gespeicherte Passwort entfernt werden.

Sicherheits-Hinweis:
- Lokal gespeicherte Passwörter können von jeder Person mit Zugriff auf den Browser-Profil-Speicher ausgelesen werden.
- Auf gemeinsam genutzten oder unsicheren Rechnern NICHT aktivieren.
- Für Accounts mit 2FA besser App-Passwort verwenden statt Primär-Passwort.

Technik Backend:
- Endpoint: `POST /api/imap/list` Body `{ host, port, secure, user, pass, limit }`.
- Baut temporär eine Verbindung (ImapFlow), liest ungelesene Mails (Default Limit 10) und schließt die Session.
- Keine Server-seitige Persistenz der Zugangsdaten.

Fallback / Legacy:
- Der alte GET `/api/emails?provider=imap` existiert weiter für `.env` basierte Credentials.

TODO (später):
- Rate Limiting, Maskierung sensibler Felder im Log, optionaler verschlüsselter Storage.

## Debug Mode
Ein simpler Umschalter (Button "Debug" in der Top Bar) aktiviert einen sichtbaren Banner und erlaubt künftig zusätzliche Entwicklungs-Features.

Aktuell liefert der Debug Mode:
- Sichtbarer Banner "DEBUG MODE" (optische Warnung)
- Persistierter Zustand (LocalStorage Key `email-responder-debug`)

Geplante Ideen:
- Live Store Inspector (Zustand diff)
- IMAP Roh-Metadaten Anzeige
- Netzwerk-Request Log Overlay
- Manuelles Triggern von Test-Fehlern / künstlichen Latenzen

Hinweis: Debug Mode nicht im Produktionsbuild aktiv lassen.


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

### Whitescreen Debug Quicklist
1. DevTools öffnen (F12) ⇒ Console Errors? GlobalErrorOverlay sollte erscheinen, falls JS-Fehler.
2. Network Tab ⇒ Lädt `/src/main.tsx` und CSS? Falls nicht: falscher Pfad / dev server gestoppt.
3. Element `#root` vorhanden? Wenn nicht: Prüfe `index.html`.
4. BackendStatusBanner sichtbar? Wenn nicht und keine UI: Möglicher fataler Script Error ⇒ Overlay oder Console.
5. Port-Konflikt Logs im Terminal (Server hat neueren Port genommen) ⇒ `VITE_API_BASE` anpassen.
6. Test lokal ausführen: `npm test --run AppSmoke` zur Sofort-Prüfung Render-Basis.

## Sicherheit
Keine Passwörter committen. `.env` lokal halten. Später: Secrets über Secret Manager / Vault integrieren.
Bei aktivierter Passwort-Speicherung wird das Passwort unverschlüsselt (aktuell Base LocalStorage via zustand/persist) abgelegt – Feature nur für Entwicklung gedacht.

## License
MIT (optional anpassen)
