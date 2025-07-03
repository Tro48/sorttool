import { contextBridge, ipcRenderer } from 'electron'
import { GlobalSettings, SettingsScript } from './components/types/types'

contextBridge.exposeInMainWorld('settings', {
	getGlobalSettings: () => {
		return ipcRenderer.invoke('getGlobalSettings')
	},
	setGlobalSettings: (newSettings: GlobalSettings) => {
		const settingsResult = ipcRenderer.send('setGlobalSettings', newSettings)
		return settingsResult
	},
	getScriptSettings: () => {
		return ipcRenderer.invoke('getScriptSettings')
	},
	setScriptSettings: (newSettings: SettingsScript) => {
		const settingsResult = ipcRenderer.send('setScriptSettings', newSettings)
		return settingsResult
	},
})
