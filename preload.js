const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer, dialog } = require('electron');
const { console } = require('inspector');
const { checkForNewFiles } = require('./components/checkForNewFiles.mjs')
let interevalId

contextBridge.exposeInMainWorld('preload', {
  addFolder: () => {
    const dirFolder = ipcRenderer.sendSync('click-button', "");
    return dirFolder
  },
  addNewJson: (item) => {
    newArr = item;
    fs.readFile('settings.json', 'utf8', (err, data) => {
      if (err) throw err;
      let jsonData = JSON.parse(data);
      jsonData = newArr;
      fs.writeFile('settings.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) throw err;
      });
    });
  }, readJson: () => {
    let result = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    return result
  }, newSettingsFile:()=>{
    fs.writeFileSync('settings.json', JSON.stringify({}))
  },
  playScript: () => {
    console.log('start')
    interevalId = setInterval(checkForNewFiles, 1000)
  },
  stopScript: () => {
    clearInterval(interevalId)
    console.log('stop')
  },
  downloadSettings: () => {
    fs.readFileSync('settings.json', 'utf8', (err, data) => {
      if (err) throw err;
      let clearJson = {}
      fs.writeFileSync('settings.json', JSON.stringify(clearJson))
    })
    let result = JSON.parse(fs.readFileSync(ipcRenderer.sendSync('click-openFile', "")[0], 'utf8'));
    fs.writeFileSync('settings.json', JSON.stringify(result));
  },
  uploadSettings: (settings) => {
    let result = ipcRenderer.sendSync('click-upload', '');
    fs.writeFileSync(result, JSON.stringify(settings, null, 2));
  },
  // checkForFiles: (folderCache) => {
  //   try{
  //     fs.mkdirSync(folderCache);
  //   }catch{
  //     console.log('Папка cache уже создана')
  //   }
  // }
});