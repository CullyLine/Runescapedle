import { app, BrowserWindow } from 'electron'

const createWindow = () => {
    const win : BrowserWindow = new BrowserWindow({
      width: 800,
      height: 600,
    })
  
    win.loadFile('index.html')
}

// Create a new window when the app is ready
app.whenReady().then(() => {
    createWindow()
  
    // Something to do with macOS
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Close the app when all windows are closed
// Except on macOS, because it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
 })