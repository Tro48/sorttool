

const { SettingsApi } = require('./components/app_backend/settingsApi.mjs');
const globalSettings = './resources/globalSettings.json';
const settingsTemplate = {
  autoRunScript: false,
  startWithTheSystem: false,
  tray: false
};



const appSettingsInit = (globalSettings, settingsTemplate) => {
  const settingsApi = new SettingsApi(globalSettings, settingsTemplate);
  settingsApi.getSettings().then((res)=>{
    console.log(res)
  })
}