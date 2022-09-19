const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('node:fs')
const path = require('path')

ipcMain.handle(
  'showSaveDialog',
  (event, options) => dialog.showSaveDialog(event.sender, options))

ipcMain.handle(
  'writeFile',
  (event, { path, content, encoding }) => fs.writeFileSync(path, content, encoding))

const isDev = process.env.DEV === 'true';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'dist', 'preload.js')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});