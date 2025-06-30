const { app, BrowserWindow, dialog, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
let appIconTray = null;
let win
const appIconPath = path.join(__dirname, "/components/app_frontend/img/app_icon.png");

ipcMain.on('click-button', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
});

ipcMain.on('click-openFile', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({
    filters: [{
      name: 'json Files',
      extensions: ['json']
    }], properties: ['openFile']
  });
});

ipcMain.on('click-upload', (event, arg) => {
  event.returnValue = dialog.showSaveDialogSync({
    defaultPath: 'settings.json', filters: [{
      name: 'json Files',
      extensions: ['json']
    }], properties: []
  });

})

const createWindow = () => {
  win = new BrowserWindow({
    icon: __dirname + "/components/app_frontend/img/app_icon.png",
    width: 1000,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
});

app.whenReady().then(()=>{
  if (appIconTray) {
    return app.hide();
  } else {
    appIconTray = new Tray(appIconPath)
    appIconTray.setToolTip('SortTool')
    appIconTray.on('click', event => {
      event.preventDefault
      win.isVisible() ? win.hide() : win.show()
    })
  }
})