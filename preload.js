const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const { console } = require('inspector');
const settingsApp = require('./settings.json');
const jsonObj = require('./settings.json');
let dirFolder;
let folderName = []
let interevalId

for (key in settingsApp) {
  folderName.push(key)
}

// fs.readFile('settings.json', 'utf8', (err, data) => { 
//   if (err){
//     fs.writeFileSync('settings.json', JSON.stringify({}, null, 2));
//     fs.readFile('settings.json', 'utf8', (err, data) => {
//       if (err) throw err;
//       jsonObj = JSON.parse(data);
//      })
//   } try {
//     jsonObj = JSON.parse(data);
//   } catch {}
// })

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
  },
  readJson: () => {
    return jsonObj;
  }, 
  playScript: () => {
    interevalId = setInterval(checkForNewFiles, 2000)
  },
  stopScript: () => { 
    clearInterval(interevalId)
    console.log('stop')
  },
  downloadSettings: () => {
    let result
    // console.log(ipcRenderer.sendSync('click-openFile', "")[0])
    fs.readFile(ipcRenderer.sendSync('click-openFile', "")[0], 'utf8', (err, data) => {
      if (err) throw err;
      result = JSON.parse(data);
      fs.readFile('settings.json', 'utf8', (err, data) => {
        if (err) throw err;
        let jsonData = JSON.parse(data);
        jsonData = result;
        fs.writeFile('settings.json', JSON.stringify(jsonData, null, 2), (err) => {
          if (err) throw err;
        });
      });
    })
    
  },
  uploadSettings: () => {
    ipcRenderer.sendSync('click-upload', "");
  }
});

function checkForNewFiles(){
  console.log('start')
  folderName.forEach((key) => {
    fs.readdir(settingsApp[key].folderPath, (err, files) => {
      if (err) {
        return console.error('Ошибка при чтении директории:', err);
      }
      if (files.length !== 0) {
        console.log('go')
        parserFile(files, settingsApp[key]);
      }
    })
  })
}

function parserFile(files, settings) {
  if (files.length) {
    files.forEach((item) => {
      const fileNameArr = item.replace(/[.()-,]/g, '_').toUpperCase().split('_');
      additionalSettings(fileNameArr, settings)
      let arrTag = fileNameArr.filter((item) => { return settings.listTag.indexOf(item) >= 0; });
      if (arrTag.length) {
        let tag = arrTag.join('');
        if (arrTag.length > 1) {
          if (settings.dirList[arrTag.join('')]) {
            tag = arrTag.join('');
          } else {
            tag = arrTag.reverse().join('');
          }
        }
        if (settings.dirList[tag]) {
          console.log(settings.folderPath + item, settings.dirList[tag] + item.replaceAll(' ', '_'))
          fs.renameSync(settings.folderPath + item, settings.dirList[tag] + item.replaceAll(' ', '_'))
          console.log(`Файл ${item} перемещён в ${settings.dirList[tag]}`)
        } else {
          fs.copyFile(settings.folderPath + item, settings.dirDefault + item.replaceAll(' ', '_'), err => { if (err) throw err; })
          console.log(`ERROR: НЕ НАЙДЕНА ПАПКА С ИМЕНЕМ ${tag}! Файл ${item} перемещён в дефолтную папку ${settings.dirDefault}. Проверьте имя файла или создайте нужную папку.`)
        }
      } else {
        fs.copyFile(settings.folderPath + item, settings.dirDefault + item.replaceAll(' ', '_'), err => { if (err) throw err; })
        console.log(`ERROR: НЕТ СОВПАДЕНИЙ! Файл ${item} перемещён в дефолтную папку ${settings.dirDefault}.`)
      }
      // fs.unlink(settings.folderPath + item, (err) => { if (err) throw err; })
    })
  }
}

function additionalSettings(arr, settings) {
  if (settings.defaultTagSwitch) {
    if (arr.length == 2 && Number(arr[0])) { arr.push(settings.defaultTag) }
  }
  if (!settings.typeSortFormatFile) {
    arr.pop()
  }
}

