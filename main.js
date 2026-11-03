const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

// 数据文件放在「项目根」：打包后取 exe 上一级，开发时取源码上一级，不再写死盘符
function resolveDataPath() {
  const cands = [];
  if (process.env.RECORDER_DATA_DIR) cands.push(process.env.RECORDER_DATA_DIR);
  cands.push(app.isPackaged ? path.resolve(path.dirname(app.getPath('exe')), '..') : path.resolve(__dirname, '..'));
  cands.push(app.getPath('userData'));
  for (const dir of cands) {
    try { fs.mkdirSync(dir, { recursive: true }); fs.accessSync(dir, fs.constants.W_OK); return path.join(dir, 'records.json'); } catch (e) { /* 换下一个候选目录 */ }
  }
  return path.join(app.getPath('userData'), 'records.json');
}
const DATA_PATH = resolveDataPath();

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 900,
    minHeight: 620,
    title: '娱乐记录本',
    backgroundColor: '#f4f6fb',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('page.html');
}

ipcMain.handle('read-data', async () => {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    return fs.readFileSync(DATA_PATH, 'utf8');
  } catch (e) { return null; }
});
ipcMain.handle('write-data', async (e, text) => {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, text, 'utf8');
    return true;
  } catch (e) { return false; }
});
ipcMain.handle('save-backup', async (e, text) => {
  const r = await dialog.showSaveDialog({ title: '导出备份', defaultPath: '番剧漫画备份-' + new Date().toISOString().slice(0, 10) + '.json', filters: [{ name: 'JSON', extensions: ['json'] }] });
  if (r.canceled || !r.filePath) return null;
  try { fs.writeFileSync(r.filePath, text, 'utf8'); return r.filePath; } catch (e) { return null; }
});
ipcMain.handle('open-backup', async () => {
  const r = await dialog.showOpenDialog({ title: '恢复备份', properties: ['openFile'], filters: [{ name: 'JSON', extensions: ['json'] }] });
  if (r.canceled || !r.filePaths || !r.filePaths[0]) return null;
  const fp = r.filePaths[0];
  try { return { name: path.basename(fp), text: fs.readFileSync(fp, 'utf8') }; } catch (e) { return null; }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { app.quit(); });