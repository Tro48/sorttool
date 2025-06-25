const config = window.preload.frontConfig();
const page = document.querySelector(config.dot + config.pageClasses.window);
const main = page.querySelector(config.dot + config.pageClasses.main);
const logSection = main.querySelector(config.dot + config.pageClasses.sectionLog);
const logTemplate = page.querySelector(config.dot + config.templatesClasses.logMessage).content
const tabTemplate = page.querySelector(config.dot + config.templatesClasses.tabItems).content;
const settingsTemplate = page.querySelector(config.dot + config.templatesClasses.contentSettingsItem).content;
const tagTemplate = page.querySelector(config.dot + config.templatesClasses.tagItem).content
const tabsSection = main.querySelector(config.dot + config.pageClasses.tabItemsBlock);
const settingsItemsSection = main.querySelector(config.dot + config.pageClasses.settingsContent);
const buttonAddRootFolder = main.querySelector(config.dot + config.pageClasses.addFolderButton);
const buttonPlay = main.querySelector(config.dot + config.pageClasses.buttonPlay);
const buttonSettings = main.querySelector(config.dot + config.pageClasses.settingsActiveButton);
const buttonContent = buttonPlay.children;
const buttonSettingsText = buttonSettings.children;
const settingsFile = './resources/settings.json';
const globalSettings = './resources/globalSettings.json';
const globalSettingsTemplate = {
    autoRunScript: false,
    startWithTheSystem: false,
    tray: false
};
const data = { folderKey: undefined, folderId: undefined };

const initialApp = () => {
    const getSettingsScript = window.preload.getSettings(settingsFile, {});
    const getSettingsApp = window.preload.getSettings(globalSettings, globalSettingsTemplate);
    Promise.all([getSettingsScript, getSettingsApp])
        .then(([settingsScript, settingsApp]) => {
            const settingsKeys = Object.keys(settingsScript);
            if (settingsKeys.length && settingsApp.autoRunScript) {
                renderSettings(settingsScript);
                settingsKeys.forEach((rootFolderId) => {
                    renderTagItem(settingsScript, rootFolderId);
                })
                document.location.href = document.querySelector('#n1').getAttribute('href');
                tabsSection.children[0].classList.add(config.activeClasses.tabActive);
                activeScriptButton();
            } else if (settingsKeys.length) {
                renderSettings(settingsScript);
                settingsKeys.forEach((rootFolderId) => {
                    renderTagItem(settingsScript, rootFolderId);
                })
                document.location.href = document.querySelector('#n1').getAttribute('href');
                tabsSection.children[0].classList.add(config.activeClasses.tabActive);
            }
        })
    getSettingsScript.then((res) => {
        const settingsKeys = Object.keys(res);
        if (settingsKeys.length) {

        }
    })
}

initialApp()

buttonPlay.addEventListener('click', activeScriptButton);
buttonSettings.addEventListener('click', openSettingsButton);
buttonAddRootFolder.addEventListener('click', () => {
    const addFolder = window.preload.addRootFolder(renderSettings);
    addFolder.then((res) => {
        const folderId = `#folder${res}`
        document.location.href = folderId;
        tabsSection.querySelector(`#n${res}`).classList.add(config.activeClasses.tabActive);
    })
})

function activeScriptButton() {
    if (!buttonPlay.classList.contains(config.pageClasses.spinerButton)) {
        buttonPlay.classList.add(config.pageClasses.spinerButton);
        buttonContent[0].classList.remove(config.pageClasses.playButtonIcon);
        buttonContent[0].classList.add(config.pageClasses.stopButtonIcon);
        window.preload.playScript(renderLogMessage);
    } else {
        buttonPlay.classList.remove(config.pageClasses.spinerButton);
        buttonContent[0].classList.remove(config.pageClasses.stopButtonIcon);
        buttonContent[0].classList.add(config.pageClasses.playButtonIcon);
        window.preload.stopScript(renderLogMessage);
    }
}

function openSettingsButton() {
    if (!main.classList.contains(config.activeClasses.settingsActive)) {
        main.classList.add(config.activeClasses.settingsActive);
        buttonSettingsText[0].textContent = '';
        buttonSettingsText[0].textContent = 'control';
    } else {
        main.classList.remove(config.activeClasses.settingsActive);
        buttonSettingsText[0].textContent = '';
        buttonSettingsText[0].textContent = 'settings';
    }
}

function renderLogMessage(message, messageColor) {
    const lastBlockNotification = logSection.lastElementChild;
    const time = new Date();
    if (lastBlockNotification) {
        if (!lastBlockNotification.classList.contains('message-notification') & message === config.dot) {
            const logItemBlock = logTemplate.querySelector(config.dot + config.pageClasses.logItemBlock).cloneNode(true);
            const logMessage = logItemBlock.querySelector(config.dot + config.pageClasses.logMessageItem);
            logMessage.textContent = 'Подготовка файлов к копированию . . .';
            logItemBlock.classList.add(messageColor);
            logSection.append(logItemBlock);
        } else if (message === config.dot & lastBlockNotification.classList.contains('message-notification')) {
            lastBlockNotification.lastElementChild.textContent = lastBlockNotification.textContent + message
        } else {
            const newMessageTime = document.createElement('span');
            newMessageTime.textContent = time.toLocaleTimeString("ru-RU");
            newMessageTime.style = 'color:red'
            const logItemBlock = logTemplate.querySelector(config.dot + config.pageClasses.logItemBlock).cloneNode(true);
            const logMessage = logItemBlock.querySelector(config.dot + config.pageClasses.logMessageItem);
            logMessage.append(newMessageTime)
            logMessage.append(' ' + message)
            logItemBlock.classList.add(messageColor);
            logSection.append(logItemBlock);
        }
    } else {
        const logItemBlock = logTemplate.querySelector(config.dot + config.pageClasses.logItemBlock).cloneNode(true);
        const logMessage = logItemBlock.querySelector(config.dot + config.pageClasses.logMessageItem);
        logMessage.textContent = message;
        logItemBlock.classList.add(messageColor);
        logSection.append(logItemBlock);
    }
}

function renderSettings(settings) {
    const settingsId = Object.keys(settings);
    if (settingsId.length) {
        tabsSection.textContent = '';
        settingsItemsSection.textContent = '';
        let counter = 1
        settingsId.forEach((id) => {

            //templates elements:

            const { folderPath, rootFolderName, rootFolderId, dirDefault, listTag, dirList } = settings[id];
            const tabItem = tabTemplate.querySelector(config.dot + config.pageClasses.tabItem).cloneNode(true);
            const settingsItem = settingsTemplate.querySelector(config.dot + config.pageClasses.tabItemContent).cloneNode(true);
            const tabItemText = tabItem.querySelector(config.dot + config.pageClasses.tabItemText);
            const inputNameFolder = tabItem.querySelector(config.dot + config.pageClasses.inputNameFolder);
            const rootFolderAdress = settingsItem.querySelector(config.dot + config.pageClasses.rootFolderAdress);
            const defaultFolderAdress = settingsItem.querySelector(config.dot + config.pageClasses.defaultFolderAdress);
            const updateRootFolderUrl = settingsItem.querySelector(config.dot + config.pageClasses.updateRootFolderUrl);
            const updateDefaultFolderUrl = settingsItem.querySelector(config.dot + config.pageClasses.updateDefaultFolderUrl);
            const newTagForm = settingsItem.querySelector(config.dot + config.pageClasses.formTagAdd);
            const addTagFolderPathButton = settingsItem.querySelector(config.dot + config.pageClasses.addTagFolderPathButton);
            const buttonDeleteFolder = tabItem.querySelector('.button-delete-folder-settings');
            const toolTip = document.createElement('div');



            //addeventlisteners:
            buttonDeleteFolder.addEventListener('click', openModalDelete);
            tabItem.addEventListener('click', pushTab);
            updateRootFolderUrl.addEventListener('click', (evt) => {
                renderFolderElement(evt, config.pageClasses.tabItemContent, config.pageClasses.rootFolderAdress, 'folderPath');
            });
            updateDefaultFolderUrl.addEventListener('click', (evt) => {
                renderFolderElement(evt, config.pageClasses.tabItemContent, config.pageClasses.defaultFolderAdress, 'dirDefault');
            });
            addTagFolderPathButton.addEventListener('click', (evt) => {
                data.folderKey = 'newFolder';
                data.folderId = rootFolderId;
                const newFolderDir = window.preload.addFolder(data);
                newFolderDir.then((newDir) => {
                    evt.target.closest(config.dot + config.pageClasses.inputTagLable).children[0].value = newDir;
                })
            })
            newTagForm.addEventListener('submit', (evt) => {
                evt.preventDefault();
                const submitData = Array.from(evt.target.elements).filter((item) => !!item.name).map((el) => {
                    const { name, value } = el;
                    return { name, value }
                });
                window.preload.addNewTag({ submitData, rootFolderId, renderTagItem })
                evt.target.reset();
            })
            tabItemText.addEventListener('dblclick', () => { editFolderName(tabItemText, inputNameFolder) });

            //logic:

            if (dirDefault) {
                defaultFolderAdress.textContent = dirDefault;
            } else {
                defaultFolderAdress.textContent = '(пусто)';
            }
            toolTip.classList.add('tooltip');
            toolTip.textContent = 'двойной клик для редактирования';
            tabItem.append(toolTip);


            rootFolderAdress.textContent = folderPath;
            settingsItem.setAttribute('id', rootFolderId);
            tabItemText.textContent = rootFolderName;
            tabItem.setAttribute('href', `#${rootFolderId}`);
            tabItem.setAttribute('id', 'n' + counter);
            tabsSection.append(tabItem);
            settingsItemsSection.append(settingsItem);
            counter += 1
        })
    }
}

function openModalDelete(evt) {
    const folderItem = evt.target.closest('.tab-item');
    deleteFolder(folderItem);
}

function deleteFolder(folderItem) {
    const folderId = folderItem.getAttribute('href').slice(1);
    const getSettings = window.preload.getSettings(settingsFile);
    getSettings.then((settings) => {
        delete settings[folderId];
        const setSettings = window.preload.setSettings(settings);
        setSettings.then((newSettings) => {
            if (Object.keys(newSettings).length === 1) {
                renderSettings(newSettings);
                document.location.href = document.querySelector('#n1').getAttribute('href');
                tabsSection.children[0].classList.add(config.activeClasses.tabActive);
            } else if (Object.keys(newSettings).length > 1) {
                renderSettings(newSettings);
                document.location.href = document.querySelector('#n1').getAttribute('href');
                tabsSection.children[0].classList.add(config.activeClasses.tabActive);
            } else {
                tabsSection.textContent = '';
                settingsItemsSection.textContent = '';
            }
        });
    })
}

function editFolderName(tabItemText, inputNameFolder) {
    const abortController = new AbortController();
    tabItemText.classList.add(config.activeClasses.tabTextDisable);
    inputNameFolder.classList.add(config.activeClasses.tabInputNameActive);
    inputNameFolder.value = tabItemText.textContent;
    inputNameFolder.focus();
    main.addEventListener('click', (evt) => { saveFolderName(evt, tabItemText, inputNameFolder, abortController) }, { signal: abortController.signal });
    inputNameFolder.addEventListener('keydown', (evt) => { saveFolderName(evt, tabItemText, inputNameFolder, abortController) }, { signal: abortController.signal });
}

function saveFolderName(evt, tabItemText, inputNameFolder, abortController) {
    const getSettings = window.preload.getSettings(settingsFile, {});
    const folderId = tabItemText.closest('.tab-item').getAttribute('href').slice(1);
    if (evt.key === 'Enter' || !document.querySelector(':focus')) {
        getSettings.then((settings) => {
            settings[folderId].rootFolderName = inputNameFolder.value;
            const setSettings = window.preload.setSettings(settings);
            setSettings.then((res) => {
                tabItemText.textContent = res[folderId].rootFolderName;
                tabItemText.classList.remove(config.activeClasses.tabTextDisable);
                inputNameFolder.classList.remove(config.activeClasses.tabInputNameActive);
                abortController.abort();
            })
        })
    }
}

function renderTagItem(settings, rootFolderId) {
    const settingsContent = page.querySelector(config.tag + rootFolderId);
    const tagSection = settingsContent.querySelector(config.dot + config.pageClasses.tagContainer);
    tagSection.textContent = '';

    Object.keys(settings[rootFolderId].dirList).forEach((tagFolder) => {
        const tagItem = tagTemplate.querySelector(config.dot + config.pageClasses.tagItem).cloneNode(true);
        tagItem.querySelector(config.dot + config.pageClasses.tagItemTagContent).textContent = tagFolder;
        tagItem.querySelector(config.dot + config.pageClasses.tagItemDirContent).textContent = settings[rootFolderId].dirList[tagFolder];
        tagItem.setAttribute('id', tagFolder);
        tagItem.querySelector(config.dot + config.pageClasses.button).addEventListener('click', deleteTagItem);
        tagSection.append(tagItem);
    })

}

function deleteTagItem(evt) {
    const getSettings = window.preload.getSettings(settingsFile, {});
    const itemElement = evt.target.closest(config.dot + config.pageClasses.tagItem);
    const rootFolderId = itemElement.closest(config.dot + config.pageClasses.tabItemContent).id;
    let itemId = itemElement.id;
    getSettings.then((settings) => {
        delete settings[rootFolderId].dirList[itemId];
        if (Object.keys(settings[rootFolderId].dirList).length) {
            const newDirListTags = Object.keys(settings[rootFolderId].dirList).join('_').split('_');
            settings[rootFolderId].listTag = Array.from(new Set(newDirListTags));
        } else {
            settings[rootFolderId].listTag = [];
        }
        const setSettings = window.preload.setSettings(settings);
        setSettings.then((newSettings) => {
            itemElement.remove();
        })
    })
}

function renderFolderElement(evt, parentClass, elementClass, settingsKey) {
    const parent = evt.target.closest(`.${parentClass}`);
    const element = parent.querySelector(`.${elementClass}`);
    data.folderKey = settingsKey;
    data.folderId = parent.id;
    const newFolderadres = window.preload.addFolder(data);
    newFolderadres.then((newAdres) => {
        element.textContent = newAdres;
    })
}

function pushTab(evt) {
    const tabsList = tabsSection.querySelectorAll(config.dot + config.pageClasses.tabItem);
    tabsList.forEach((tabItem) => {
        if (tabItem.classList.contains(config.activeClasses.tabActive)) {
            tabItem.classList.remove(config.activeClasses.tabActive);
        }
    })
    if (evt.target.classList.contains('.tag-item')) {
        evt.target.classList.add(config.activeClasses.tabActive);
    } else {
        evt.target.closest('.tab-item').classList.add(config.activeClasses.tabActive);
    }
}