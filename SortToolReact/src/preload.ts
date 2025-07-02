import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('preload', {
    getSettingsScript:  () => {
        return ipcRenderer.invoke('settingsScript-load') 
    }
})