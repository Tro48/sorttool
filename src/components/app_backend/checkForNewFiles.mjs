const { copyFile, GetCopyFileParam } = require('./components/app_backend/copyFile.mjs');
const fs = require('fs');
const chokidar = require('chokidar');
const { frontConfig } = require('./components/app_frontend/js/config/config.mjs');

export class CheckForNewFiles {
    settingsFileDir
    settingsApp
    rootFoldersPath
    watcherFolder
    constructor(settingsFile) {
        this.settingsFileDir = settingsFile
        this.settingsApp = JSON.parse(fs.readFileSync(settingsFile, 'utf8'))
    }
    #setRootFoldersPath() {
        this.rootFoldersPath = []
        const settingKeys = Object.keys(this.settingsApp)
        if (settingKeys.length) {
            settingKeys.forEach((key) => {
                this.rootFoldersPath.push(this.settingsApp[key].folderPath)
            })
        } else {
            console.log('Добавьте папку для отслеживания')
        }
    }
    #copyFileInit(path, param) {
        const fileName = path.split('\\').slice(-1)[0]
        const rootName = path.split('\\').slice(-2)[0]
        const copyFileParam = new GetCopyFileParam(fileName, this.settingsApp[rootName]);
        const date = new Date();
        const message = copyFileParam.messageResult.copyFileError + date.toLocaleDateString(copyFileParam.optionsDate.lang, copyFileParam.optionsDate.options);
        param.addLogMessage(frontConfig.dot, param.messageColor.notification);
        setTimeout(() => { copyFile(copyFileParam, param) }, 500);
    }
    watchPlay(param) {
        this.#setRootFoldersPath()
        this.watcherFolder = chokidar.watch(this.rootFoldersPath)
        this.watcherFolder
            .on('add', path => this.#copyFileInit(path, param))
            .on('change', path => this.#copyFileInit(path, param))

    }
    async watchStop() {
        await this.watcherFolder.unwatch(this.rootFoldersPath)
        await this.watcherFolder.close()
    }
}