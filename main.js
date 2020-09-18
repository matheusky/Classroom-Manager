const { app, BrowserWindow } = require('electron')
const path = require('path')

let splash;
let mainWindow;

app.on('ready', () => {
  // create main browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon:path.join(__dirname, 'src/img/icon.png'),
    autoHideMenuBar:'true',
    center:'true',
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setResizable(false);
  // create a new `splash`-Window 
  splash = new BrowserWindow({width: 400, height: 600, center: true, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadFile(path.join(__dirname, 'src/pages/load.html'));
  mainWindow.loadFile(path.join(__dirname, 'src/pages/index.html'));

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.webContents.once('dom-ready', () => {
     setTimeout(function(){splash.close()}, 1000);
     mainWindow.show();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // No macOS é comum para aplicativos e sua barra de menu 
  // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.