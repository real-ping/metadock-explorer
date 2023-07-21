const path = require('path');
const Electron = require('electron');
const fs = require('fs')

Electron.app.whenReady().then(() => {

    const win = new Electron.BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "./app/preload.js")
        },
        darkTheme: true,
        frame: false,
        autoHideMenuBar: true
    })

    win.loadFile(path.join((__dirname, "./app/main/index.html")))

    win.once('ready-to-show', (() => {
        win.show()
    }))

    Electron.ipcMain.handle('getFileIcon', async (e, path) => {
        const NI = await Electron.app.getFileIcon(path);
        return NI.toDataURL()
    })
    Electron.ipcMain.handle('getCurrentDir', async (e, path) => {
        return "C:/Users/maxta/Desktop/.temp/icon"
    })

    Electron.ipcMain.handle('getDirFilesAndFolders', async (e, dir) => {
        let data = fs.readdirSync(dir, 'utf-8');
        await new Promise((res) => {
            data.forEach(async (x, i) => {
                let icon = (await Electron.app.getFileIcon(path.join(dir, x))).toDataURL();
                data[i] = {
                    filename: x,
                    isFolder: fs.lstatSync(path.join(dir, x)).isDirectory(),
                    icon
                };
                if (i == data.length - 1) res();
            })
        });
        console.log(data)
        return data;
    })


})