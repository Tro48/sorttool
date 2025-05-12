
export class AddFolder{
    dirFolder
    settingsApp
    NewRootFolder
    renderSettings
    data
    constructor({ dirFolder, settingsApp, NewRootFolder, renderSettings, data}){
             this.dirFolder = dirFolder
           this.settingsApp = settingsApp
         this.NewRootFolder = NewRootFolder
        this.renderSettings = renderSettings
        this.data = data
    }

    addRootFolder(){
        const dirFolder = this.dirFolder
        const addRootFolderProm = new Promise((resolve) => {
            setTimeout(() => {
                this.settingsApp.getSettings()
                    .then((res) => {
                        const newRootFolder = new this.NewRootFolder({ dirFolder, res });
                        this.settingsApp.setSettings(newRootFolder.returnFolderObj())
                            .then((res) => {
                                this.renderSettings(res);
                                const length = Object.keys(res).length;
                                resolve(length);
                            });
                    });
            }, 50)
        })
        return addRootFolderProm
    }
    addFolder(){
        const addFolderPromise = new Promise((resolve)=>{
            setTimeout(()=>{
                this.settingsApp.getSettings()
                .then((res)=>{
                    res[this.data.folderId][this.data.folderKey] = this.dirFolder[0] + "\\";
                    this.settingsApp.setSettings(res)
                        .then((res) => { resolve(res[this.data.folderId][this.data.folderKey]) })
                })
            }, 50)
        })
        return addFolderPromise
    }

}
