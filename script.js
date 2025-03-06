const fs = require('fs');
const settingsApp = require('./settings.json');
const { console } = require('inspector/promises');
let folderName = []

for(key in settingsApp) {
    folderName.push(key)
}

const checkForNewFiles = () => {
    folderName.forEach(function(key) {
        fs.readdir(settingsApp[key].directoryPath, (err, files) => {
            if (err) {
                return console.error('Ошибка при чтении директории:', err);
            }
            if (files.length !== 0) {
                parserFile (files, settingsApp[key]);
            }
        })
    })
}


function parserFile (files, settings) {   
    if (files.length) {
        files.forEach(function (item) {
            const fileNameArr = item.replace(/[.()-,]/g, '_').toLowerCase().split('_');
            additionalSettings(fileNameArr, settings)
            let arrTag =  fileNameArr.filter((item) => {return settings.listTeg.indexOf(item) >= 0;});
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
                    fs.copyFile(settings.directoryPath + item, settings.dirList[tag] + item.replaceAll(' ', '_'), err => {if(err) throw err;})
                    console.log(`Файл ${item} перемещён в ${settings.dirList[tag]}`)                    
                } else {
                    fs.copyFile(settings.directoryPath + item, settings.dirDefault + item.replaceAll(' ', '_'), err => {if(err) throw err;})
                    console.log(`ERROR: НЕ НАЙДЕНА ПАПКА С ИМЕНЕМ ${tag}! Файл ${item} перемещён в дефолтную папку ${settings.dirDefault}. Проверьте имя файла или создайте нужную папку.`)
                }
            } else {
                fs.copyFile(settings.directoryPath + item, settings.dirDefault + item.replaceAll(' ', '_'), err => {if(err) throw err;})
                console.log(`ERROR: НЕТ СОВПАДЕНИЙ! Файл ${item} перемещён в дефолтную папку ${settings.dirDefault}.`)
            }
            fs.unlink(settings.directoryPath + item, (err) => {if (err) throw err;})
        })
    }   
}

function addTagFile (arr, data) {
    
}

function additionalSettings (arr, settings) {
    if (settings.defaultTagSwitch) {
        if (arr.length == 2 && Number(arr[0])) {arr.push(settings.defaultTag)}
    }
    if (!settings.typeSortSwitch) {
        arr.pop()
    }
}

setInterval(checkForNewFiles, 2000);