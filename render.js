
let newSettingsFolder = window.preload.readJson();
let valuesInput = {};
let interevalId
const page = document.querySelector('.window');
const sectionFolderSettings = page.querySelector('.folder_settings_section');
const templateFolderLink = page.querySelector('#folderLink_template').content;
const templateSettings = page.querySelector('#sectionSettingsFolder_template').content;
const templateListTagItem = page.querySelector('#template_tag_list_item').content;
const tabsList = page.querySelector('.tabs_folder');
const buttonAddFolder = page.querySelectorAll('.button_add_folder');
const activeTab = page.querySelectorAll('.main_section__content_folder_item');
const rootFolderNameInputButton = page.querySelector('#root_folder_name_button');
const folderSettingsSection = page.querySelector('.folder_settings_section');
const buttonPlay = page.querySelector('.play_program');
const buttonStop = page.querySelector('.stop_program');
const buttonDownloadSettings = page.querySelector('.download_settings');
const buttonUploadSettings = page.querySelector('.upload_settings');
const buttonsId = ['#addNewFolderRoot', '#button_save_name', '#refreshLinkRootFolder', '#otherFolderRefresh', '#otherFolderAdd',
  '#checkFiLeFormat', '#checkFileName', '#checkUndefDel', '#checkDefauldTag',
  '#defaulTtagButton', '#openModalButton', '#inputNewTagButtonEsc', '#inputNewTagButtonSave',
  '#inputNewTagFolderButton', '#rootFolderDelete', '#buttonCancel', '#rootFolderSave', '#buttonOk', '#play', '#stop'];

renderSettings(newSettingsFolder);

page.addEventListener('click', (evt) => {
  definesClickForButton(evt, pushForButton);
})

function definesClickForButton(evt, func) {
  buttonsId.forEach(id => {
    if (evt.target.closest(id)) {
      func(id, evt);
    };
  })
}

function pushForButton(id, evt) {
  const sectionParent = evt.target.closest('.folder_settings_section_form');
  const inputForm = evt.target.closest(id).previousElementSibling;
  if (id === '#addNewFolderRoot') {
    createNewRootFolder();
  } else if (id === '#button_save_name') {
    evt.preventDefault();
    newSettingsFolder[sectionParent.id].rootFolderName = inputForm.value;
    sectionParent.querySelector('.root_folder_settings_form').reset();
  } else if (id === '#refreshLinkRootFolder') {
    let newAdresFolder = window.preload.addFolder();
    newSettingsFolder[sectionParent.id].folderPath = newAdresFolder[0] + "\\";
  } else if (id === '#otherFolderRefresh' || id === '#otherFolderAdd') {
    let newAdresFolder = window.preload.addFolder();
    newSettingsFolder[sectionParent.id].dirDefault = newAdresFolder[0] + "\\";
  } else if (id === '#checkFiLeFormat') {
    newSettingsFolder[sectionParent.id].typeSortFormatFile = sectionParent.querySelector(id).checked;
  } else if (id === '#checkFileName') {
    newSettingsFolder[sectionParent.id].typeSortTagFile = sectionParent.querySelector(id).checked;
  } else if (id === '#checkUndefDel') {
    newSettingsFolder[sectionParent.id].deleteUndefinedFile = sectionParent.querySelector(id).checked;
  } else if (id === '#checkDefauldTag') {
    newSettingsFolder[sectionParent.id].defaultTagSwitch = sectionParent.querySelector(id).checked;
  } else if (id === '#defaulTtagButton') {
    evt.preventDefault();
    newSettingsFolder[sectionParent.id].defaultTag = inputForm.value;
    sectionParent.querySelector('.default_tag_form').reset();
  } else if (id === '#openModalButton') {
    sectionParent.querySelector('.modal_window_tag_input').classList.add('modal_window_active');
  } else if (id === '#inputNewTagButtonEsc') {
    sectionParent.querySelector('.modal_window_tag_input').classList.remove('modal_window_active');
  } else if (id === '#inputNewTagButtonSave') {
    evt.preventDefault();
    let newTag = sectionParent.querySelector('#inputNewTag').value;
    let newDir = sectionParent.querySelector('.input_folder_dir').textContent;
    if (newTag && newDir && newDir !== '../') {
      let newArr = newTag.toUpperCase().split(', ');
      let tagsList = newSettingsFolder[sectionParent.id].listTag;
      let newTagList;
      if (tagsList.length) {
        newArr.forEach((newItem) => {
          tagsList.push(newItem);
        })
        newTagList = new Set(tagsList);
        newArr = Array.from(newTagList);
      }
      newSettingsFolder[sectionParent.id].listTag = newArr;
      newTag.toUpperCase().split(', ').forEach((tag) => {
        newSettingsFolder[sectionParent.id].dirList[tag] = newDir + "\\";
      })
    } else {
      console.log('введите данные');
    }
    sectionParent.querySelector('.modal_window_tag_input').classList.remove('modal_window_active');
    sectionParent.querySelector('.modal_content_add_teg_form').reset();
  } else if (id === '#inputNewTagFolderButton') {
    let newAdresFolder = window.preload.addFolder();
    sectionParent.querySelector('.input_folder_dir').textContent = newAdresFolder[0];
  } else if (id === '#rootFolderDelete'){
    sectionParent.querySelector('.dialog_qestion').showModal();
  } else if (id === '#buttonCancel'){
    sectionParent.querySelector('.dialog_qestion').close();
  } else if (id === '#rootFolderSave') {
    window.preload.addNewJson(newSettingsFolder);
  } else if (id === '#buttonOk'){
    delete newSettingsFolder[sectionParent.id];
    sectionParent.remove();
    tabsList.querySelector(`[href='#${sectionParent.id}']`).remove();
    window.preload.addNewJson(newSettingsFolder);
  } else if (id === '#play') {
    window.preload.playScript();
  } else if (id === '#stop') {
    window.preload.stopScript();
  }
  renderSettings();
}

function createNewRootFolder() {
  const folderItemLink = templateFolderLink.querySelector('.main_section__content_folder_item').cloneNode(true);
  const itemSettings = templateSettings.querySelector('.folder_settings_section_form').cloneNode(true);
  let adresFolder = window.preload.addFolder();
  if (adresFolder) {
    //обработка адреса папки
    let adresFolderName = adresFolder[0].replace(/\\/g, '_').toLowerCase().split('_');
    adresFolderName = adresFolderName[adresFolderName.length - 1];

    let adresFolderId = crypto.randomUUID().replace(/-/g, '');
    folderItemLink.setAttribute('href', `#${adresFolderId}`);
    itemSettings.setAttribute('id', adresFolderId);
    const newFolder = {
      [adresFolderId]: {
        folderPath: adresFolder[0] + "\\",
        rootFolderName: adresFolderName,
        rootFolderId: adresFolderId,
        dirDefault: undefined,
        typeSortFormatFile: false,
        typeSortTagFile: false,
        deleteUndefinedFile: false,
        defaultTagSwitch: true,
        defaultTag: undefined,
        listTag: [],
        dirList: {},
      }
    }

    newSettingsFolder[adresFolderId] = newFolder[adresFolderId];

    tabsList.append(folderItemLink);
    folderSettingsSection.append(itemSettings);
    return newSettingsFolder
  } else { console.log('no folder') }
}

function renderAllFolder(){
  if (JSON.stringify(newSettingsFolder)){
    Object.keys(newSettingsFolder).forEach((item) => {
      const folderItemLink = templateFolderLink.querySelector('.main_section__content_folder_item').cloneNode(true);
      const itemSettings = templateSettings.querySelector('.folder_settings_section_form').cloneNode(true);
      folderItemLink.setAttribute('href', `#${item}`);
      itemSettings.setAttribute('id', item);
      tabsList.append(folderItemLink);
      folderSettingsSection.append(itemSettings);
    })
  }
  
}

function renderSettings() {
  if (!tabsList.children.length){
    renderAllFolder()
  }
  const allSectionSettings = sectionFolderSettings.querySelectorAll('.folder_settings_section_form');
    allSectionSettings.forEach((item) => {
      const inputDefaultTag = item.querySelector('#defaulTtagName');
      const inputDefaultTagButton = item.querySelector('#defaulTtagButton');
      tabsList.querySelector(`[href='#${item.id}']`).querySelector('.folder_item_title').textContent = newSettingsFolder[item.id].rootFolderName;
      item.querySelector('.root_folder_name').textContent = newSettingsFolder[item.id].rootFolderName;
      item.querySelector('.root_folder_link').textContent = newSettingsFolder[item.id].folderPath;
      item.querySelector('.other_folder_link').textContent = newSettingsFolder[item.id].dirDefault;
      item.querySelector('.default_tag_content').textContent = newSettingsFolder[item.id].defaultTag;
      //Скрываем лишние кнопки
      if (newSettingsFolder[item.id].dirDefault) {
        item.querySelector('#otherFolderAdd').classList.add('visually-hidden');
        item.querySelector('#otherFolderRefresh').classList.remove('visually-hidden');
      } else {
        item.querySelector('#otherFolderRefresh').classList.add('visually-hidden');
      }

      //Отображение чекбоксов в зависимости от данных бд
      addChecked(newSettingsFolder[item.id].typeSortFormatFile, item, '#checkFiLeFormat');
      addChecked(newSettingsFolder[item.id].typeSortTagFile, item, '#checkFileName');
      addChecked(newSettingsFolder[item.id].deleteUndefinedFile, item, '#checkUndefDel');
      addChecked(newSettingsFolder[item.id].defaultTagSwitch, item, '#checkDefauldTag');
      //Активация инпута дефолтного тега
      if (!newSettingsFolder[item.id].defaultTagSwitch) {
        inputDefaultTag.disabled = true;
        inputDefaultTagButton.disabled = true;
        inputDefaultTagButton.classList.add('disabled_button');
      } else {
        inputDefaultTag.disabled = false;
        inputDefaultTagButton.disabled = false;
        inputDefaultTagButton.classList.remove('disabled_button');
      }

      addFolderTagItem(newSettingsFolder[item.id], item);

    })
}

function addChecked(object, itemSection, idCheckbox) {
  if (object) {
    itemSection.querySelector(idCheckbox).setAttribute('checked', '');
  } else { itemSection.querySelector(idCheckbox).removeAttribute('checked', ''); }
}

function addFolderTagItem(obj, context) {
  const folderTagList = context.querySelector('.tag_list');
  Object.keys(obj.dirList).forEach((key) => {
    const folderTagItem = templateListTagItem.querySelector('.tag_list_item').cloneNode(true);
    folderTagItem.setAttribute('id', key);
    folderTagItem.querySelector('.list_value_tag').textContent = key;
    folderTagItem.querySelector('.tag_folder_link').textContent = obj.dirList[key];
    folderTagItem.querySelector('.delete_folder_tag').addEventListener('click', (evt) => {
      let itemId = evt.target.closest('.tag_list_item').id
      delete obj.dirList[itemId];
      obj.listTag = obj.listTag.filter((i) => { return i !== itemId })
      deleteItemTag(folderTagItem);
    })
    try {
      if (folderTagList.querySelector(`#${key}`).id !== key) {
        console.log(true)
      }
    } catch (err) {
      folderTagList.append(folderTagItem);
    }
  })
}

function deleteItemTag(item){
  item.remove();
}

buttonPlay.addEventListener('click', () => {
  buttonPlay.children[0].textContent = 'pause_circle'
})

buttonStop.addEventListener('click', () => {
  buttonPlay.children[0].textContent = 'play_circle_filled'
})

buttonDownloadSettings.addEventListener('click', () =>{
  window.preload.downloadSettings();
})
buttonUploadSettings.addEventListener('click', () => {
  console.log(window.preload.uploadSettings());
})