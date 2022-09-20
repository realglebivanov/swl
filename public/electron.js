const { BrowserWindow, Menu, app, dialog, ipcMain } = require('electron');
const fs = require('node:fs')
const path = require('path')

const isDev = process.env.DEV === 'true';
const isMac = process.platform === 'darwin';

ipcMain.handle(
  'showSaveDialog',
  (event, options) => dialog.showSaveDialog(event.sender, options))

ipcMain.handle(
  'writeFile',
  (event, { path, content, encoding }) => fs.writeFileSync(path, content, encoding))

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'index.html'));
  }
};

Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
]))

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});