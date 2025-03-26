const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

let win 

ipcMain.on('click-button', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
});

ipcMain.on('click-openFile', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({
    filters: [{
      name: 'json Files',
      extensions: ['json']
    }], properties: ['openFile'] });
});

ipcMain.on('click-upload', (event, arg) => {
  event.returnValue = dialog.showSaveDialogSync({filters: [{
    name: 'json Files',
    extensions: ['json'] 
  }], properties: [] });
})

const createWindow = () => {
  
  win = new BrowserWindow({
    icon: __dirname + "/app_icon.png",
    width: 1000,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
});
