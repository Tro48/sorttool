const fs = require('fs/promises');

async function copyFile(file, settings, filesRootPage) {
    const date = new Date()
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
            try{
                await fs.copyFile(settings.folderCache + file, settings.dirList[tag] + file.replaceAll(' ', '_'));
                await fs.unlink(settings.folderCache + file);
                console.log(`Файл ${file} перемещён в ${settings.dirList[tag]}`, date);
                filesRootPage.delete(file);
            }catch(err){
                console.log('Ошибка копирования ' + err);
            }
        } else {
            try{
                await fs.copyFile(settings.folderCache + file, settings.dirDefault + file.replaceAll(' ', '_'));
                await fs.unlink(settings.folderCache + file);
                console.log(`ERROR: НЕ НАЙДЕНА ПАПКА С ИМЕНЕМ ${tag}! Файл ${file} перемещён в дефолтную папку ${settings.dirDefault}. Проверьте имя файла или создайте нужную папку.`, date);
                filesRootPage.delete(file);
            } catch (err) {
                console.log('Ошибка копирования в дефолтную папку ' + err)
            }
        }
    } else {
        try {
            await fs.copyFile(settings.folderCache + file, settings.dirDefault + file.replaceAll(' ', '_'));
            await fs.unlink(settings.folderCache + file);
            console.log(`ERROR: НЕТ СОВПАДЕНИЙ! Файл ${file} перемещён в дефолтную папку ${settings.dirDefault}.`, date);
            filesRootPage.delete(file);
        } catch (err) {
            console.log('Ошибка копирования в дефолтную папку ' + err)
        }
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

export async function preloadCopyFile(file, settings, filesRootPage){
    try{
        await fs.unlink(settings.folderPath + file);
        await copyFile(file, settings, filesRootPage);
    }catch(err){
        console.log(err)
    }
}