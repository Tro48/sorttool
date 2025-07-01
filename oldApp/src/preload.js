
const { contextBridge, ipcRenderer } = require('electron');
const { frontConfig, messageColor } = require('./components/app_frontend/js/config/config.mjs')
const { CheckForNewFiles } = require('./components/app_backend/checkForNewFiles.mjs');
const { SettingsApi } = require('./components/app_backend/settingsApi.mjs');
const { NewRootFolder } = require('./components/app_backend/newRootFolder.mjs');
const { AddFolder } = require('./components/app_backend/addFolder.mjs');
const { addNewTag } = require('./components/app_backend/addNewTag.mjs');


const settingsFile = './resources/settings.json';
const checkerFiles = new CheckForNewFiles(settingsFile);

contextBridge.exposeInMainWorld('preload', {
  frontConfig: () => {
    return frontConfig
  },
  addFolder: (data, renderSettings) => {
    const dirFolder = ipcRenderer.sendSync('click-button', "");
    const settingsApp = new SettingsApi(settingsFile, {});
    const addRootFolder = new AddFolder({ dirFolder, settingsApp, NewRootFolder, renderSettings, data });
    return addRootFolder.addFolder();
  },
  addRootFolder: (renderSettings) => {
    const dirFolder = ipcRenderer.sendSync('click-button', "");
    const settingsApp = new SettingsApi(settingsFile, {});
    const addRootFolder = new AddFolder({ dirFolder, settingsApp, NewRootFolder, renderSettings });
    return addRootFolder.addRootFolder();
  },
  addNewTag: ({ submitData, rootFolderId, renderTagItem }) => {
    addNewTag({ submitData, rootFolderId, renderTagItem, SettingsApi, settingsFile })
  },
  playScript: (addLogMessage) => {
    checkerFiles.watchPlay({ settingsFile, addLogMessage, messageColor })
    addLogMessage({ message: 'start', error: false }, messageColor.ok)
  },
  stopScript: (addLogMessage) => {
    checkerFiles.watchStop()
    addLogMessage({ message: 'stop', error: false }, messageColor.error)
  },
  getSettings: (settingsFile, settingsTemplate) => {
    const settingsApi = new SettingsApi(settingsFile, settingsTemplate);
    const getSettings = settingsApi.getSettings();
    return getSettings;
  },
  setSettings: (newSettings) => {
    const settingsApi = new SettingsApi(settingsFile);
    const setSettings = settingsApi.setSettings(newSettings);
    return setSettings;
  },
  setGlobalSettings: (data) => {
    ipcRenderer.send('settingsApp', data)
  },
  setTrayMessage: (messageData) => {
    ipcRenderer.send('trayMessage', messageData)
  }
});