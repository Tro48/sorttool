const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const { frontConfig, messageColor } = require('./components/app_frontend/js/config/config.mjs')
const { checkForNewFiles, CheckForNewFiles } = require('./components/app_backend/checkForNewFiles.mjs');
const { SettingsApi } = require('./components/app_backend/settingsApi.mjs');
const { NewRootFolder } = require('./components/app_backend/newRootFolder.mjs');
const { AddFolder } = require('./components/app_backend/addFolder.mjs');
const { addNewTag } = require('./components/app_backend/addNewTag.mjs');
let interevalId;

const settingsFile = './resources/settings.json';
const checkerFiles = new CheckForNewFiles(settingsFile);
contextBridge.exposeInMainWorld('preload', {
  frontConfig: ()=> {
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
  addNewTag: ({ submitData, rootFolderId, renderTagItem}) =>{
    addNewTag({ submitData, rootFolderId, renderTagItem, SettingsApi, settingsFile })
  },
  playScript: (addLogMessage) => {
    checkerFiles.watchPlay()
    // addLogMessage('start', messageColor.ok)
    // interevalId = setInterval(() => { checkForNewFiles({ settingsFile, addLogMessage, messageColor }) }, 2000)
  },
  stopScript: (addLogMessage) => {
    checkerFiles.watchStop()
    // clearInterval(interevalId);
    // addLogMessage('stop', messageColor.error)
  },
  getSettings: (settingsFile, settingsTemplate) => {
    const settingsApi = new SettingsApi(settingsFile, settingsTemplate);
    const getSettings = settingsApi.getSettings();
    return getSettings;
  },
  setSettings:(newSettings)=> {
    const settingsApi = new SettingsApi(settingsFile);
    const setSettings = settingsApi.setSettings(newSettings);
    return setSettings;
  }
});