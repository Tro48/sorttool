import { app, BrowserWindow, dialog, ipcMain, nativeTheme, Tray } from 'electron';
import path from 'path';
import { SettingsApi } from './components/base/settingsApi';
import { GlobalSettings, SettingsScript } from './components/types/types';
let appIconTray: Tray | null = null;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let mainWindow: BrowserWindow | null;
let globalSettings: GlobalSettings;
let settingsScript: SettingsScript
const globalSettingsPath = './resources/globalSettings.json';
const settingsScriptPath = './resources/settings.json';
const appFolder = path.dirname(process.execPath)
const ourExeName = path.basename(process.execPath)
const stubLauncher = path.resolve(appFolder, '..', ourExeName)
const appIconPath = path.join(__dirname, "/img/app_icon.png");
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const globalSettingsTemplate = {
    autoRunScript: false,
    startWithTheSystem: false,
    tray: false,
    trayMessage: false,
    trayMessageSound: false,
    theme: 'system'
};

const getSettings = (fileSettingsPath:string, templateSettings:GlobalSettings | object, callback:(arg0: GlobalSettings | SettingsScript)=>void) => {
  const newSettings = new SettingsApi(fileSettingsPath, templateSettings);
  newSettings.getSettings().then((res)=>{
    callback(res)
  })
}
const readySettingsApp = (settings:GlobalSettings):void => {
    globalSettings = settings
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
  }
const readySettingsScript = (settings:SettingsScript): void => {
  settingsScript = settings
}

getSettings(settingsScriptPath, {}, readySettingsScript)

if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    icon: appIconPath,
    width: 1000,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null
  })
};

const appInTray = (): void => {
  appIconTray = new Tray(appIconPath)
  appIconTray.setToolTip('SortTool')
  appIconTray.setTitle('SortTool')
  appIconTray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  mainWindow.on('minimize', () => {
    !mainWindow.isVisible() && mainWindow.hide()
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
  getSettings(globalSettingsPath, globalSettingsTemplate, readySettingsApp);
  ipcMain.handle('settingsScript-load',() => settingsScript);
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
