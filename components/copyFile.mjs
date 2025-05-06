const fs = require('fs/promises');

export class GetCopyFileParam{
    cache
    oldDir
    newDir
    file
    dirDefault
    searchResult
    messageResult
    #calc = (settings, file) => {
        const fileInfo = {
            searchResult: false,
        }
        const fileNameArr = file.replace(/[.()-,]/g, '_').toUpperCase().split('_')
        let arrTag = fileNameArr.filter((item) => { return settings.listTag.indexOf(item) >= 0; })
        if (arrTag.length === 1) {
            let tag = arrTag.join('')
            fileInfo.searchResult = true;
            fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
            return fileInfo
        } else if (arrTag.length > 1) {
            if (settings.dirList[arrTag.join('_')]) {
                tag = arrTag.join('_')
                fileInfo.searchResult = true
                fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
                return fileInfo
            } else {
                tag = arrTag.reverse().join('_')
                fileInfo.searchResult = true;
                fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
                return fileInfo
            }
        }else{
            fileInfo.searchResult = false
            fileInfo.newDir = false
            return fileInfo
        }
    }

    constructor(file, settings, cache){
        this.cache = cache
        this.oldDir = settings.folderPath + file
        this.newDir = this.#calc(settings, file).newDir
        this.file = file
        this.dirDefault = settings.dirDefault
        this.searchResult = this.#calc(settings, file).searchResult
        this.messageResult = {
            copyFileOk: `Файл ${this.file} перемещён в ${this.newDir}`,
            copyFileOther: `ERROR: Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}. Проверьте имя файла или создайте нужную папку.`,
            copyFileDefaultFolder: `ERROR: НЕТ СОВПАДЕНИЙ! Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}.`,
            copyFileError: `Ожидание файла ${this.file} ...` ,
            noDirdefault: `Нет папки для неизвестных файлов. ${this.file} удалён!`
        }
    }
}

export async function copyFile(param) {
    const newParam = param;
    const optionsDate = {
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        timeZoneName: 'short'
    }
    if (newParam.searchResult) {
        if (newParam.newDir) {
            try{
                await fs.copyFile(newParam.oldDir, newParam.newDir);
                await fs.unlink(param.oldDir);
                newParam.cache.delete(param.file);
                const date = new Date();
                console.log(newParam.messageResult.copyFileOk, date.toLocaleDateString('ru-RU', optionsDate));
            }catch(err){
                const date = new Date();
                console.log(newParam.messageResult.copyFileError, date.toLocaleDateString('ru-RU', optionsDate));
                setTimeout(() => { copyFile(newParam) }, 2000);
            }
        } else {
            try{
                if (newParam.dirDefault) {
                    await fs.copyFile(newParam.oldDir, newParam.dirDefault);
                    await fs.unlink(param.oldDir);
                    newParam.cache.delete(param.file);
                    const date = new Date();
                    console.log(newParam.messageResult.copyFileOther, date.toLocaleDateString('ru-RU', optionsDate));
                } else {
                    await fs.unlink(param.oldDir);
                    newParam.cache.delete(param.file);
                    console.log(newParam.messageResult.noDirdefault);
                }
            } catch (err) {
                console.log(newParam.messageResult.copyFileError, err);
                setTimeout(() => { copyFile(newParam) }, 2000);
            }
        }
    } else {
        try {
            if (newParam.dirDefault){
                await fs.copyFile(newParam.oldDir, newParam.dirDefault);
                await fs.unlink(param.oldDir);
                newParam.cache.delete(param.file);
                console.log(newParam.messageResult.copyFileDefaultFolder, date.toLocaleDateString('ru-RU', optionsDate));
            }else{
                await fs.unlink(param.oldDir);
                newParam.cache.delete(param.file);
                console.log(newParam.messageResult.noDirdefault);
            }
            
        } catch (err) {
            console.log(newParam.messageResult.copyFileError, err);
            setTimeout(() => { copyFile(newParam) }, 2000);
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