const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const axios = require('axios'); // Installeer eerst: npm install axios

let mainWindow;
const CURRENT_VERSION = app.getVersion();
const REPO = "Navaro1234/nfc-master-system";

async function checkUpdates() {
    try {
        const res = await axios.get(`https://github.com/{REPO}/releases/latest`);
        const latestVersion = res.data.tag_name.replace('v', '');

        if (latestVersion !== CURRENT_VERSION) {
            const { response } = await dialog.showMessageBox({
                type: 'info',
                buttons: ['Download Update', 'Later'],
                title: 'Update Beschikbaar',
                message: `Er is een nieuwe versie (${latestVersion}) beschikbaar. Wil je naar de downloadpagina?`
            });
            if (response === 0) {
                shell.openExternal(`https://github.com/{REPO}/releases/latest`);
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
