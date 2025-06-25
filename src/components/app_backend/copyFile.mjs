const fs = require('fs/promises');

export class GetCopyFileParam{
    // cache
    oldDir
    newDir
    file
    dirDefault
    searchResult
    messageResult
    settings
    optionsDate = { lang: 'ru-RU',
        options: {
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        timeZoneName: 'short'
    }}
    #calc = (settings, file) => {
        const fileInfo = {
            searchResult: false,
        }
        const fileNameArr = file.replace(/[.()\-,]/g, '_').toUpperCase().split('_')
        let arrTag = fileNameArr.filter((item) => { return settings.listTag.indexOf(item) >= 0; })
        let tag
        if (arrTag.length === 1) {
            tag = arrTag.join('')
            fileInfo.searchResult = tag;
            fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
            return fileInfo
        } else if (arrTag.length > 1) {
            if (settings.dirList[arrTag.join('_')]) {
                tag = arrTag.join('_')
                fileInfo.searchResult = tag
                fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
                return fileInfo
            } else {
                tag = arrTag.reverse().join('_')
                fileInfo.searchResult = tag;
                fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_')
                return fileInfo
            }
        }else{
            fileInfo.searchResult = false
            fileInfo.newDir = false
            return fileInfo
        }
    }

    constructor(file, settings ){
        this.settings = settings
        // this.cache = cache
        this.oldDir = settings.folderPath + file
        this.newDir = this.#calc(settings, file).newDir
        this.file = file
        this.dirDefault = settings.dirDefault
        this.searchResult = this.#calc(settings, file).searchResult
        this.messageResult = {
            copyFileOk: `Файл ${this.file} перемещён в ${this.newDir} `,
            copyFileOther: `ERROR: Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}. Проверьте имя файла или создайте нужную папку. `,
            copyFileDefaultFolder: `ERROR: НЕТ СОВПАДЕНИЙ! Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}. `,
            copyFileError: `Ожидание файла ${this.file} ... ` ,
            noDirdefault: `Нет папки для неизвестных файлов. ${this.file} удалён! `
        }
    }
}

export async function copyFile(param, paramMessage) {
    const newParam = param;
    if (newParam.settings.dirList[newParam.searchResult]) {
        if (newParam.newDir) {
            try{
                await fs.copyFile(newParam.oldDir, newParam.newDir);
                await fs.unlink(newParam.oldDir);
                // newParam.cache.delete(newParam.file);
                const date = new Date();
                const messageResult = (newParam.messageResult.copyFileOk + date.toLocaleDateString(newParam.optionsDate.lang, newParam.optionsDate.options));
                paramMessage.addLogMessage(messageResult, paramMessage.messageColor.ok);
            }catch(err){
                console.error(err);
                // setTimeout(() => { copyFile(newParam, paramMessage) }, 2000);
            }
        } else {
            try{
                if (newParam.dirDefault) {
                    await fs.copyFile(newParam.oldDir, newParam.dirDefault + newParam.file.replaceAll(' ', '_'));
                    await fs.unlink(newParam.oldDir);
                    // newParam.cache.delete(newParam.file);
                    const date = new Date();
                    paramMessage.addLogMessage((newParam.messageResult.copyFileOther, date.toLocaleDateString(newParam.optionsDate.lang, newParam.optionsDate.options)), paramMessage.messageColor.notification);
                } else {
                    await fs.unlink(newParam.oldDir);
                    // newParam.cache.delete(newParam.file);
                    paramMessage.addLogMessage(newParam.messageResult.noDirdefault, paramMessage.messageColor.error);
                }
            } catch (err) {
                console.error(err);
                paramMessage.addLogMessage(newParam.messageResult.copyFileError, paramMessage.messageColor.notification)
                // setTimeout(() => { copyFile(newParam, paramMessage) }, 2000);
            }
        }
    } else {
        try {
            if (newParam.dirDefault){
                await fs.copyFile(newParam.oldDir, newParam.dirDefault + newParam.file.replaceAll(' ', '_'));
                await fs.unlink(newParam.oldDir)
                // newParam.cache.delete(newParam.file);
                const date = new Date();
                const messageResult = newParam.messageResult.copyFileDefaultFolder + date.toLocaleDateString(newParam.optionsDate.lang, newParam.optionsDate.options);
                paramMessage.addLogMessage(messageResult, paramMessage.messageColor.notification);
            }else{
                await fs.unlink(newParam.oldDir);
                // newParam.cache.delete(newParam.file);
                paramMessage.addLogMessage(newParam.messageResult.noDirdefault, paramMessage.messageColor.error);
            }
            
        } catch (err) {
            await fs.unlink(newParam.oldDir);
            // newParam.cache.delete(newParam.file);
            console.error(err);
            paramMessage.addLogMessage(newParam.messageResult.noDirdefault, paramMessage.messageColor.error);
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