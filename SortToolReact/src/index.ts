import { app, BrowserWindow, dialog, ipcMain, nativeTheme, Tray } from 'electron';
import path from 'path';
let appIconTray: Tray | null = null;
let win: BrowserWindow | null
let globalSettings: {
  autoRunScript?: boolean;
  theme?: string;
  startWithTheSystem?: boolean;
  tray?: boolean;
  trayMessage?: boolean;
  trayMessageSound?: boolean;
} = {};
const appFolder = path.dirname(process.execPath)
const ourExeName = path.basename(process.execPath)
const stubLauncher = path.resolve(appFolder, '..', ourExeName)
const appIconPath = path.join(__dirname, "/img/app_icon.png");
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = (): void => {
  win = new BrowserWindow({
    icon: appIconPath,
    width: 1000,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
};
const appInTray = (): void => {
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
// const createWindow = (): void => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     height: 600,
//     width: 800,
//     webPreferences: {
//       preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
//     },
//   });

//   // and load the index.html of the app.
//   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  ipcMain.on('settingsApp', (event, data) => {
    globalSettings = data
    if (globalSettings.theme === 'system' || globalSettings.theme === 'light' || globalSettings.theme === 'dark') {
      nativeTheme.themeSource = globalSettings.theme;
    }
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
