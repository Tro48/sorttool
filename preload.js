const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer, dialog } = require('electron');
const { console } = require('inspector');
const settingsApp = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
let dirFolder;
let folderName = []
let interevalId
let filesRootPage = []

for (key in settingsApp) {
  folderName.push(key)
}

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
  }, readNewJson: () => {
    let result = fs.readFileSync('settings.json', 'utf8');
    return result
  },
  readJson: () => {
    return settingsApp
  },
  playScript: () => {
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
  }
});

function checkForNewFiles() {
  console.log('start')
  console.log(filesRootPage)
  folderName.forEach((key) => {
    fs.readdir(settingsApp[key].folderPath, (err, files) => {
      if (err) {
        return console.error('Ошибка при чтении директории:', err);
      } else if (files.length) {
        files.forEach((file)=>{
          if (!filesRootPage.includes(file)){
            fs.readFile(settingsApp[key].folderPath + file, err => {
              if (err){
                console.log('Файл ещё не загружен');
                let newArr = filesRootPage.filter((item) => {
                  return item !== file
                })
                filesRootPage = newArr;
                return filesRootPage
              }else{
                console.log('go');
                parserFile(file, settingsApp[key]);
                return filesRootPage
              }
            })
            return filesRootPage
          }else{
            console.log('такой файл уже был');
          }
        })
        filesRootPage = files;
        return filesRootPage
      }
    })
    return filesRootPage
  })
  return filesRootPage

}

function parserFile(file, settings) {
  const fileNameArr = file.replace(/[.()-,]/g, '_').toUpperCase().split('_');
      additionalSettings(fileNameArr, settings)
      let arrTag = fileNameArr.filter((item) => { return settings.listTag.indexOf(item) >= 0; });
      if (arrTag.length) {
        let tag = arrTag.join('');
        if (arrTag.length > 1) {
          if (settings.dirList[arrTag.join('_')]) {
            tag = arrTag.join('_');
          } else {
            tag = arrTag.reverse().join('_');
          }
        }
        if (settings.dirList[tag]) {
          fs.copyFile(settings.folderPath + file, settings.dirList[tag] + file.replaceAll(' ', '_'), err =>{
            if (err){
              console.log('Ошибка копирования ' + err);
            }else{
              console.log(`Файл ${file} перемещён в ${settings.dirList[tag]}`);
              fs.unlink(settings.folderPath + file, (err) => {
                if (err) {
                  console.log('Ошибка удаления ' + err)
                } else {
                  if (filesRootPage.includes(file)) {
                    let newArr = filesRootPage.filter((item) => {
                      return item !== file
                    })
                    filesRootPage = newArr;
                    return filesRootPage
                  }
                }
                return filesRootPage
              });
              return filesRootPage
            }
            
          });
          return filesRootPage
          // try{
          //   fs.copyFileSync(settings.folderPath + item, settings.dirList[tag] + item.replaceAll(' ', '_'));
          //   console.log(`Файл ${item} перемещён в ${settings.dirList[tag]}`);
          // }catch(err){
          //   console.log('Ошибка копирования ' + err);
          // }
          
          // , err => {
          //   if (err) {
          //     console.log('Ошибка копирования ' + err)
          //   } else {
          //     console.log(`Файл ${item} перемещён в ${settings.dirList[tag]}`);
          //   }
          // });
          // fs.unlink(settings.folderPath + item, (err) => {
          //   if (err) {
          //     console.log('Ошибка удаления ' + err)
          //   }
          // });
        } else {
          fs.copyFile(settings.folderPath + file, settings.dirDefault + file.replaceAll(' ', '_'), err => {
            if (err) {
              console.log('Ошибка копирования в дефолтную папку ' + err)
            }else{
              console.log(`ERROR: НЕ НАЙДЕНА ПАПКА С ИМЕНЕМ ${tag}! Файл ${file} перемещён в дефолтную папку ${settings.dirDefault}. Проверьте имя файла или создайте нужную папку.`);
              fs.unlink(settings.folderPath + file, (err) => {
                if (err) {
                  console.log('Ошибка удаления ' + err)
                } else {
                  if (filesRootPage.includes(file)) {
                    let newArr = filesRootPage.filter((item) => {
                      return item !== file
                    })
                    filesRootPage = newArr;
                    return filesRootPage
                  }
                }
                return filesRootPage
              });
              return filesRootPage
            }
          });
        }
      } else {
        fs.copyFile(settings.folderPath + file, settings.dirDefault + file.replaceAll(' ', '_'), err => {
          if (err) {
            console.log('Ошибка копирования в дефолтную папку ' + err)
          }else{
            console.log(`ERROR: НЕТ СОВПАДЕНИЙ! Файл ${file} перемещён в дефолтную папку ${settings.dirDefault}.`);
            fs.unlink(settings.folderPath + file, (err) => {
              if (err) {
                console.log('Ошибка удаления ' + err)
              } else {
                if (filesRootPage.includes(file)) {
                  let newArr = filesRootPage.filter((item) => {
                    return item !== file
                  })
                  filesRootPage = newArr;
                  return filesRootPage
                }
              }
              return filesRootPage
            });
            return filesRootPage
          }
        });
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
