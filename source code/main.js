const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const axios = require('axios'); // Installeer eerst: npm install axios

let mainWindow;
const CURRENT_VERSION = app.getVersion();
const apiurl = "https://api.github.com/repos/navaro1234/nfc-desktop-app/releases/latest";
const weburl = "https://github.com/repos/navaro1234/nfc-desktop-app/releases/latest";

async function checkUpdates() {
    try {
        const res = await axios.get(apiurl);
        const latestVersion = res.data.tag_name.replace('v', '');

        if (latestVersion !== CURRENT_VERSION) {
            const { response } = await dialog.showMessageBox({
                type: 'info',
                buttons: ['Download Update', 'Later'],
                title: 'Update Beschikbaar',
                message: `Er is een nieuwe versie (${latestVersion}) beschikbaar. Wil je naar de downloadpagina?`
            });
            if (response === 0) {
                shell.openExternal(weburl);
            }
        }
    } catch (err) {
        console.log("Kon niet controleren op updates.");
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 950,
        height: 750,
	icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    checkUpdates();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
