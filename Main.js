"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
    });
    win.loadFile('index.html');
};
// Create a new window when the app is ready
electron_1.app.whenReady().then(function () {
    createWindow();
    // Something to do with macOS
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Close the app when all windows are closed
// Except on macOS, because it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
