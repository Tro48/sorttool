export const addNewTag = ({ submitData, rootFolderId, renderTagItem, SettingsApi, settingsFile }) => {
    const settingsApi = new SettingsApi(settingsFile, {});
    const newTag = submitData[0].value;
    const newDir = submitData[1].value;
    settingsApi.getSettings().then((settings) => {
        if (newTag && newDir) {
            let newArr = newTag.replace(/,/g, '_').replace(/\s/g, '').toUpperCase().split('_');
            let unikArr = Array.from(new Set(newArr))
            let tagsList = settings[rootFolderId].listTag;
            let newTagList;
            if (tagsList.length) {
                unikArr.forEach((newItem) => {
                    tagsList.push(newItem);
                })
                newTagList = new Set(tagsList);
                unikArr = Array.from(newTagList);
            }
            settings[rootFolderId].listTag = unikArr;
            newTag.toUpperCase().split(', ').forEach((tag) => {
                settings[rootFolderId].dirList[tag] = newDir + "\\";
            })
            settingsApi.setSettings(settings).then((res) => {
                renderTagItem(res, rootFolderId);
            });
        } else {
            console.log('введите данные');
        }
    })
}