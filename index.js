const path = require('path');
const Electron = require('electron');
const fs = require('fs')
const open = require("open");
const c = require('child_process');
const os = require('os');

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
        return os.homedir().replaceAll("\\", "/")
    })
    Electron.ipcMain.handle('startCMD', async (e, path) => {
        c.exec(`start`, {
            cwd: path
        })
    })
    Electron.ipcMain.handle('close', async (e) => {
        Electron.app.quit()
    })
    Electron.ipcMain.handle('openFile', async (e, path) => {
        console.log(`opening:`, path)
        open(path)
        return true;
    })
    Electron.ipcMain.handle('doesPathExist', async (e, path) => {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    })
    Electron.ipcMain.handle('getDirFilesAndFolders', async (e, dir) => {
        let data = fs.readdirSync(dir, 'utf-8');
        await new Promise((res) => {
            iterateFiles(0)
            async function iterateFiles(i) {
                let isFolder, icon;
                let x = data[i]
                icon = (await Electron.app.getFileIcon(path.join(dir, x))).toDataURL();
                fs.lstat(path.join(dir, x), ((err, stats) => {
                    if (err) {
                        // console.log(`file error at:`, x, err.code)
                        isFolder = false;
                    } else {
                        isFolder = stats.isDirectory()
                    }
                    data[i] = {
                        filename: x,
                        isFolder,
                        icon
                    };
                    if (i == data.length - 1) res();
                    else iterateFiles(i + 1)
                }))
            }

        });
        // console.log(data)
        return data;
    })


})