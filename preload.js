const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer, dialog } = require('electron');
const { console } = require('inspector');
const { preloadCopyFile } = require('./components/copyFile.mjs');
let dirFolder;
let interevalId
let filesRootPage = new Set()
filesRootPage.add('cash')

contextBridge.exposeInMainWorld('preload', {
  addFolder: () => {
    dirFolder = ipcRenderer.sendSync('click-button', "");
    return dirFolder;
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
    interevalId = setInterval(checkForNewFiles, 2000)
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
  checkForFiles: (folderCache) => {
    try{
      fs.mkdirSync(folderCache);
    }catch{
      console.log('Папка cache уже создана')
    }
  }
});

function checkForNewFiles() {
  const settingsApp = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

  let folderName = []
  for (key in settingsApp) {
    folderName.push(key)
  }

  folderName.forEach((key) => {
    fs.readdir(settingsApp[key].folderPath, (err, files) => {
      if (err) {
        return console.error('Ошибка при чтении директории:', err);
      } else if (files.length) {
        files.forEach((file)=>{
          if (file !== 'cache'){
            if (!filesRootPage.has(file)) {
                  fs.copyFile(settingsApp[key].folderPath + file, settingsApp[key].folderCache + file.replaceAll(' ', '_'), err => {
                    if (err) {
                      console.log('Файл ещё не загружен...');
                    } else {
                      filesRootPage.add(file);
                      console.log('go');
                      preloadCopyFile(file, settingsApp[key], filesRootPage);
                    }
                  })
              }
          }
        })
      }
    })
  })
}