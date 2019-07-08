const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 600,
        height: 480,
    });
    mainWindow.webContents.openDevTools();
    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    mainWindow.on('close', function() {
        mainWindow = null;
    });
}

app.on('ready', createWindow);
