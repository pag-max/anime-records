const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('appfs', {
  native: true,
  pathname: 'records.json（与程序目录同级）',
  read: () => ipcRenderer.invoke('read-data'),
  write: (text) => ipcRenderer.invoke('write-data', text),
  saveBackup: (payload) => ipcRenderer.invoke('save-backup', typeof payload === 'string' ? payload : JSON.stringify(payload)),
  openBackup: () => ipcRenderer.invoke('open-backup')
});