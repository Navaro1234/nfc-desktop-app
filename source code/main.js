const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;
const CURRENT_VERSION = app.getVersion();
const apiurl = "https://api.github.com/repos/navaro1234/nfc-desktop-app/releases/latest";
const weburl = "https://github.com/navaro1234/nfc-desktop-app/releases/latest";

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
            if (response === 0) shell.openExternal(weburl);
        }
    } catch (err) {
        console.log('Kon niet controleren op updates.');
    }
}

function installAddonImporterCompatibility() {
    // Electron 32+ removed File.path. The Add-ons page also runs with
    // nodeIntegration enabled, so we can safely read the selected File as bytes.
    mainWindow.webContents.executeJavaScript(`
        (() => {
            window.importAddon = async function(input) {
                const file = input && input.files && input.files[0];
                if (!file) return;
                input.value = '';
                if (!file.name.toLowerCase().endsWith('.ndnfcaddon')) {
                    return setAddonStatus('Ongeldig bestand. Kies een .ndnfcaddon-bestand.', false);
                }
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const os = require('os');
                    const { execFileSync } = require('child_process');
                    const root = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'NFC Master System', 'addons');
                    fs.mkdirSync(root, { recursive: true });
                    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'nfc-addon-'));
                    const zipPath = path.join(temp, file.name);
                    const bytes = Buffer.from(await file.arrayBuffer());
                    fs.writeFileSync(zipPath, bytes);
                    const quote = p => "'" + String(p).replace(/'/g, "''") + "'";
                    execFileSync('powershell.exe', ['-NoProfile', '-Command', 'Expand-Archive -LiteralPath ' + quote(zipPath) + ' -DestinationPath ' + quote(temp) + ' -Force'], { stdio: 'pipe' });
                    const findConfig = dir => {
                        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                            const p = path.join(dir, entry.name);
                            if (entry.isFile() && entry.name.toLowerCase() === 'config.json') return p;
                            if (entry.isDirectory()) { const found = findConfig(p); if (found) return found; }
                        }
                        return null;
                    };
                    const configPath = findConfig(temp);
                    if (!configPath) throw new Error('config.json ontbreekt in deze add-on.');
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    const id = String(config.id || path.basename(file.name, '.ndnfcaddon')).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
                    config.name = config.name || id;
                    const dest = path.join(root, id);
                    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
                    fs.mkdirSync(dest, { recursive: true });
                    fs.cpSync(path.dirname(configPath), dest, { recursive: true });
                    fs.writeFileSync(path.join(dest, 'config.json'), JSON.stringify(config, null, 2));
                    fs.rmSync(temp, { recursive: true, force: true });
                    setAddonStatus((config.icon || '🧩') + ' ' + config.name + ' ' + (config.version || '') + ' is geïmporteerd.');
                    renderAddons();
                } catch (err) {
                    console.error(err);
                    setAddonStatus('Add-on importeren mislukt: ' + err.message, false);
                }
            };
        })();
    `).catch(err => console.error('Addon importer compatibility error:', err));
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
    mainWindow.webContents.on('did-finish-load', installAddonImporterCompatibility);
    checkUpdates();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
