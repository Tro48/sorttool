export type GlobalSettings = {
  autoRunScript?: boolean;
  theme?: string;
  startWithTheSystem?: boolean;
  tray?: boolean;
  trayMessage?: boolean;
  trayMessageSound?: boolean;
}

export type SettingsScript = {
  [key: string]: SettingsScriptItem
}

export type SettingsScriptItem = {
  folderPath: string | null
  rootFolderName: string | null
  newFolder: string | null
  rootFolderId: string | null
  dirDefault: string | null
  listTag: string[]
  dirList: {
    [key: string]:string | null
  }
}