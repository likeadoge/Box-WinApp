import { app, protocol, BrowserWindow, Menu, ipcMain, Tray } from 'electron'
import address from 'address'
import path from 'path'
import fs from 'fs'

import {
    createProtocol,
    installVueDevtools // 无法连接 chrome 商店，需要梯子
} from 'vue-cli-plugin-electron-builder/lib'


// 静态文件地址
declare const __static: string


// 加载 config
const config = JSON.parse(fs.readFileSync(path.resolve(__static, './config.json')).toString()) as {
    baseURL: "string"
}

ipcMain.on('config', function (event, arg) {
    event.returnValue = config;
});

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null = null
//托盘对象
let appTray: Tray | null = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

console.log(address.ipv6())

function createWindow() {
    // Create the browser window.
    Menu.setApplicationMenu(null)

    appTray = new Tray(path.join(__static, './favicon.ico'));//app.ico是app目录下的ico文件

    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate([{
        label: '打开',
        click: function () {
            win && win.show()
        }
    }, {
        label: '隐藏',
        click: function () {
            win && win.hide()
        }
    }, {
        label: '退出',
        click: function () {
            win&&win.destroy()
        }
    }])
    appTray.setToolTip('交换中心')
    appTray.setContextMenu(contextMenu)
    appTray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        win && win.show()
    })

    win = new BrowserWindow({
        minWidth: 1080,
        minHeight: 600,
        width: 1080,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

    win.on('close', (event) => {
        win && win.hide();
        win && win.setSkipTaskbar(true);
        event.preventDefault();
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

app.on('ready', async () => {
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
