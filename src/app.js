const { app, BrowserWindow, dialog, ipcMain, Tray, nativeTheme } = require('electron');
const path = require('path');
const url = require('url');
let appIconTray = null;
let win
const appIconPath = path.join(__dirname, "/components/app_frontend/img/app_icon.png");
let globalSettings
const appFolder = path.dirname(process.execPath)
const ourExeName = path.basename(process.execPath)
const stubLauncher = path.resolve(appFolder, '..', ourExeName)
ipcMain.on('click-button', (event) => {
  event.returnValue = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
});

ipcMain.on('click-openFile', (event) => {
  event.returnValue = dialog.showOpenDialogSync({
    filters: [{
      name: 'json Files',
      extensions: ['json']
    }], properties: ['openFile']
  });
});

ipcMain.on('click-upload', (event) => {
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

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
};
const appInTray = () => {
  appIconTray = new Tray(appIconPath)
  appIconTray.setToolTip('SortTool')
  appIconTray.setTitle('SortTool')
  appIconTray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })
  win.on('minimize', () => {
    !win.isVisible() && win.hide()
  })
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
});

app.whenReady().then(() => {
  ipcMain.on('settingsApp', (event, data) => {
    globalSettings = data
    nativeTheme.themeSource = globalSettings.theme;
    app.setLoginItemSettings({
      openAtLogin: globalSettings.startWithTheSystem,
      openAsHidden: globalSettings.tray,
      path: stubLauncher
    })
    if (globalSettings.tray) {
      appInTray()
    }
    if (globalSettings.trayMessage) {
      ipcMain.on('trayMessage', (event, message) => {
        appIconTray.displayBalloon({ title: 'Внимание!', content: message, noSound: globalSettings.trayMessageSound, largeIcon: false })
      })
    }
  })
})