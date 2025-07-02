import fs from 'fs';

export class SettingsApi {
    #settingsFile
    #settingsTemplate
    #settingsData
    #settingsItems
    #foldersPath

    get settings() {
        return this.#settingsData
    }

    set settings(newSettings) {
        fs.writeFile(this.#settingsFile, JSON.stringify(newSettings), (err) => {
            if (err) {
                console.log(err)
            } else {
                this.#settingsData = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                this.#addSettingsItems();
                this.#addFoldersPath();
            }
        })
    }

    get settingsId() {
        return this.#settingsItems
    }

    get foldersPath() {
        return this.#foldersPath
    }

    constructor(settingsFile, settingsTemplate) {
        this.#settingsFile = settingsFile
        this.#settingsTemplate = settingsTemplate
        this.#readSettingsFile()
        this.#addSettingsItems();
        this.#addFoldersPath();
    }

    #readSettingsFile = () => {
        try {
            this.#settingsData = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
        } catch {
            fs.writeFile(this.#settingsFile, JSON.stringify(this.#settingsTemplate), (err) => {
                if (err) {
                    console.log(err)
                } else {
                    this.#settingsData = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                }
            })
        }
    }

    #addSettingsItems() {
        this.#settingsItems = [];
        Object.keys(this.#settingsData).forEach((id) => {
            this.#settingsItems.push(id)
        })
    }

    #addFoldersPath() {
        if (typeof this.#settingsData[this.#settingsItems[0]] === 'object') {
            this.#foldersPath = []
            this.#settingsItems.forEach((folderItem) => {
                this.#foldersPath.push(this.#settingsData[folderItem].folderPath)
            })
        } else {
            this.#foldersPath = []
        }
    }

    getSettings() {
        const settingsPromise = new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                    resolve(settings)
                } catch {
                    fs.writeFile(this.#settingsFile, JSON.stringify(this.#settingsTemplate), (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                            resolve(settings)
                        }
                    })
                }
            }, 1)
        })
        return settingsPromise
    }
    setSettings(newSettings) {
        const settingsPromise = new Promise((resolve) => {
            setTimeout(() => {
                fs.writeFile(this.#settingsFile, JSON.stringify(newSettings), (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                        resolve(settings)
                    }
                })
            }, 1)
        })
        return settingsPromise
    }
}