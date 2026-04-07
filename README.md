# 📲 NFC Master Cloud Control System
Dit project is een volledig draadloos NFC-beheersysteem waarmee je NFC-kaarten kunt scannen en schrijven via een smartphone (Android) en de data direct synchroniseert met een Windows Dashboard.
## 🚀 Functies- **Cloud Database**: Alle scans worden veilig opgeslagen in Supabase.- **Remote Control**: Stuur scan- of schrijfverzoeken vanaf je laptop naar je GSM.- **Multi-User**: Inlog- en registratiesysteem; gebruikers zien alleen hun eigen data.- **Auto-Update**: De Windows-app controleert automatisch op nieuwe releases via GitHub.- **Real-time**: Communicatie via ntfy.sh (geen kabels nodig).
## 🛠️ Installatie (Windows App)1. **Clone de repository**:
   ```powershell
   git clone https://github.com/navaro1234/nfc-desktop-app.git


   1. Installeer de benodigdheden:
   
   npm install
   
   2. Start de app:
   
   npm start
   
   3. Maak een Installer (.exe):
   
   npm run dist
   
   
## 📱 Mobiele Scanner
De scanner is toegankelijk via de browser (Chrome op Android):
netlify.app
## ⚙️ Configuratie

* Supabase: Gebruikt voor authenticatie en database opslag.
* ntfy.sh: Gebruikt voor de live bridge tussen laptop en mobiel.
* GitHub API: Gebruikt voor versiebeheer en automatische updates.

## 📝 Gebruik

   1. Log in op de Windows App.
   2. Stel je persoonlijke ntfy-kanaal in bij 'Instellingen'.
   3. Open de mobiele scanner op je GSM en typ hetzelfde kanaal in.
   4. Klik op de laptop op Scan Verzoek en houd de kaart bij je telefoon.

------------------------------
Gemaakt door Navaro - 2026



