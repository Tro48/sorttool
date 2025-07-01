export class NewRootFolder{
    dirFolder
    objSettings
    constructor(objectParam){

        this.dirFolder = objectParam.dirFolder;
        this.objSettings = objectParam.res;

    }

    returnFolderObj(){
        const settingsLengthObj = Object.keys(this.objSettings).length;
        // const folderId = `folder${settingsLengthObj+1}`;
        const folderId = this.dirFolder[0].split('\\').slice(-1)[0].toLowerCase();
        let adresFolderName = this.dirFolder[0].toLowerCase().split('\\');
        adresFolderName = adresFolderName[adresFolderName.length - 1];
        const newFolder = {
            [folderId]: {
                folderPath: this.dirFolder[0] + "\\",
                rootFolderName: adresFolderName,
                newFolder: undefined,
                rootFolderId: folderId,
                dirDefault: undefined,
                listTag: [],
                dirList: {},
            }
        }
        this.objSettings[folderId] = newFolder[folderId];
        return this.objSettings
    }
}