const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Secure Vault Pro",
    backgroundColor: '#008080', // Цвет фона при загрузке
    webPreferences: {
      nodeIntegration: true,    // РАЗРЕШАЕМ Node.js в HTML
      contextIsolation: false,  // УПРОЩАЕМ доступ
      backgroundThrottling: false,
      webSecurity: false        // Разрешаем локальные файлы
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
  
  // Максимальная память (8 ГБ)
  app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8192');
}

// --- IPC HANDLERS (Мост между HTML и Windows) ---

// Открыть диалог сохранения
ipcMain.handle('dialog:save', async () => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Backup',
    defaultPath: `Backup_${Date.now()}.zip`,
    filters: [{ name: 'ZIP Archive', extensions: ['zip', 'vault'] }]
  });
  return filePath;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });