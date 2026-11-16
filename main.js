// Thước Đo – ứng dụng máy tính: mở trang index.html (Ma trận – Trộn đề – Chấm phiếu) trong cửa sổ riêng, chạy không cần mạng
const { app, BrowserWindow, session, shell } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1366, height: 860, minWidth: 900, minHeight: 600,
    autoHideMenuBar: true,
    title: 'Thước Đo – Ma trận, Trộn đề & Chấm phiếu',
    webPreferences: { contextIsolation: true, nodeIntegration: false, spellcheck: false }
  });
  win.maximize();
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // link trong trang: trang nội bộ (tab chấm riêng) mở cửa sổ mới trong app, link web mở bằng trình duyệt
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('file:')) return { action: 'allow', overrideBrowserWindowOptions: { autoHideMenuBar: true, width: 1366, height: 860 } };
    shell.openExternal(url); return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  // cho phép webcam, toàn màn hình, chép vào bộ nhớ tạm (không hỏi mỗi lần)
  const ok = ['media', 'fullscreen', 'clipboard-sanitized-write', 'clipboard-read'];
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(ok.includes(perm)));
  session.defaultSession.setPermissionCheckHandler((wc, perm) => ok.includes(perm));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
