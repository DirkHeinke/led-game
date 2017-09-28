const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let gameWindow

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  win.setMenu(null);


  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

ipcMain.on('ui', (event, arg, arg2) => {
    switch (arg) {
        case 'startGame':
            console.log("New Game");
            startNewGame();
            break;
        case 'setup':
            console.log(arg, arg2);
            setupNewGame(arg2);
            break;
        default:
            console.error("No UI arg");
            console.error(arg);
    }
})


// function startNewGame() {
//     gameWindow = new BrowserWindow({ width: 800, height: 600 , fullscreen: true});
//     gameWindow.loadURL(url.format({
//       pathname: path.join(__dirname, 'game.html'),
//       protocol: 'file:',
//       slashes: true
//     }))
//     // gameWindow.setMenu(null);
//     gameWindow.webContents.openDevTools()
// 
//     
//     gameWindow.webContents.executeJavaScript('run(' + 5 + ')')
// }

function setupNewGame(args) {
    console.log(args);
    const playerCount = args.number;
    const port = args.port;
    gameWindow = new BrowserWindow({ width: 800, height: 600 , fullscreen: true});
    gameWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'game.html'),
      protocol: 'file:',
      slashes: true
    }))
    gameWindow.setMenu(null);
    gameWindow.webContents.openDevTools()

    
    gameWindow.webContents.executeJavaScript(`init('${playerCount}', '${port}')`);
}












// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
