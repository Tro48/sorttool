import {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	nativeTheme,
	Tray,
} from 'electron';
import fs from 'fs';
import path from 'path';
import { SettingsApi } from './components/base/settingsApi';
import { GlobalSettings } from './components/types/types';
import appImg from './img/app.png';

let appIconTray: Tray | null = null;
let mainWindow: BrowserWindow | null;
let globalSettings: GlobalSettings;

const globalSettingsPath = './resources/globalSettings.json';
const settingsScriptPath = './resources/settings.json';
const appFolder = path.dirname(process.execPath);
const ourExeName = path.basename(process.execPath);
const stubLauncher = path.resolve(appFolder, '..', ourExeName);
const appIconPath = path.join(__dirname, appImg);
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const globalSettingsTemplate = {
	autoRunScript: false,
	startWithTheSystem: false,
	tray: true,
	trayMessage: false,
	trayMessageSound: false,
	theme: 'system',
};
const settingsinit = (settingsPath: string, settingsTemplate: object) => {
	try {
		fs.readFileSync(settingsPath, 'utf8');
	} catch {
		fs.writeFileSync(
			settingsPath,
			JSON.stringify(settingsTemplate, null, 2),
			'utf8'
		);
	}
};
settingsinit(globalSettingsPath, globalSettingsTemplate);
settingsinit(settingsScriptPath, {});

const settingsApi = new SettingsApi(globalSettingsPath, globalSettingsTemplate);
const settingsScriptApi = new SettingsApi(settingsScriptPath, {});

settingsApi
	.getSettings()
	.then((res: GlobalSettings) => {
		globalSettings = res;
	})
	.catch((err: Error) => {
		console.error('Error loading global settings:', err);
	});

// if (require('electron-squirrel-startup')) {
//   app.quit();
// }
const createWindow = (): void => {
	mainWindow = new BrowserWindow({
		icon: appIconPath,
		width: 1000,
		height: 1000,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

const appInTray = (): void => {
	appIconTray = new Tray(appIconPath);
	appIconTray.setToolTip('SortTool');
	appIconTray.setTitle('SortTool');
	appIconTray.on('click', () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});
	mainWindow.on('minimize', () => {
		!mainWindow.isVisible() && mainWindow.hide();
	});
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

app.whenReady().then(() => {
	ipcMain.handle('getGlobalSettings', () => globalSettings);
	ipcMain.on('setGlobalSettings', (event, newSettings) => {
		return settingsApi.setSettings(newSettings);
	});
	ipcMain.handle('getScriptSettings', () => {
		return settingsScriptApi.getSettings();
	});
	ipcMain.on('setScriptSettings', (event, newSettings) => {
		return settingsScriptApi.setSettings(newSettings);
	});
	nativeTheme.themeSource = (
		['system', 'light', 'dark'].includes(globalSettings.theme)
			? globalSettings.theme
			: 'system'
	) as 'system' | 'light' | 'dark';
	app.setLoginItemSettings({
		openAtLogin: globalSettings.startWithTheSystem,
		openAsHidden: globalSettings.tray,
		path: stubLauncher,
	});
	if (globalSettings.tray) {
		appInTray();
	}
	if (globalSettings.trayMessage) {
		ipcMain.on('trayMessage', (event, message) => {
			appIconTray.displayBalloon({
				title: 'Внимание!',
				content: message,
				noSound: globalSettings.trayMessageSound,
				largeIcon: false,
			});
		});
	}
});

ipcMain.on('click-button', (event) => {
	event.returnValue = dialog.showOpenDialogSync({
		properties: ['openDirectory'],
	});
});

ipcMain.on('click-openFile', (event) => {
	event.returnValue = dialog.showOpenDialogSync({
		filters: [
			{
				name: 'json Files',
				extensions: ['json'],
			},
		],
		properties: ['openFile'],
	});
});

ipcMain.on('click-upload', (event) => {
	event.returnValue = dialog.showSaveDialogSync({
		defaultPath: 'settings.json',
		filters: [
			{
				name: 'json Files',
				extensions: ['json'],
			},
		],
		properties: [],
	});
});
