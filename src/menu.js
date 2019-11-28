const { Menu, app } = require('electron')

function createMenu(mainWindow) {
  const i18n = new(require('./lang/i18n'))
  const deve = {
    label: "deve",
    submenu: [
      {
        label: 'startload',
        accelerator: "CmdOrCtrl+A",
        click: function () {
          mainWindow.webContents.executeJavaScript('loading()')
        }
      },
      {
        label: 'stopload',
        accelerator: "CmdOrCtrl+B",
        click: function () {
          mainWindow.webContents.executeJavaScript('stopload()')
        }
      },
      {
        label: 'darktheme',
        accelerator: "CmdOrCtrl+1",
        click: function () {
          mainWindow.webContents.executeJavaScript('themeSwitch("dark")')
        }
      },
      {
        label: 'dusktheme',
        accelerator: "CmdOrCtrl+2",
        click: function () {
          mainWindow.webContents.executeJavaScript('themeSwitch("dusk")')
        }
      },
      {
        label: 'lighttheme',
        accelerator: "CmdOrCtrl+3",
        click: function () {
          mainWindow.webContents.executeJavaScript('themeSwitch("light")')
        }
      }
      
    ]
  }
  
  const edit = {
    label: i18n.__("Edit"),
    submenu: [
      {
        label: i18n.__("Copy"),
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: i18n.__("Paste"),
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: i18n.__("Select All"),
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }
  
  const file = {
    label: i18n.__("File"),
    submenu: [
      {
        label: i18n.__("add node"),
        accelerator: "CmdOrCtrl+shift+A",
        click: function () {
          mainWindow.webContents.executeJavaScript('toggleAddNodeForm()')
        }
      },
      {
        type: "separator"
      },
      {
        label: i18n.__("import account"),
        accelerator: "CmdOrCtrl+shift+I",
        click: function () {
          mainWindow.webContents.executeJavaScript('importAccounts()')
        }
      },
      {
        label: i18n.__("create account")
      },
      {
        type: "separator"
      },
      {
        label: i18n.__("import contract")
      },
      {
        label: i18n.__("create contract")
      }
    ]
  }
  
  const anchor = {
    label: i18n.__("SeeleAnchor"),
    submenu: [
      {
        label: i18n.__("Toggle Developer Options"),
        accelerator: "CmdOrCtrl+Alt+I",
        role: 'toggledevtools'
      },
      {
        label: i18n.__("Version")+ " " + app.getVersion(),
        enabled: false
      },
      {
        type: "separator"
      },
      file,
      {
        type: "separator"
      },
      edit,
      {
        type: "separator"
      },
      {
        label: i18n.__("Minimize"),
        accelerator: "CmdOrCtrl+M",
        role: "minimize"
      },
      {
        label: i18n.__("Refresh"),
        accelerator: "CmdOrCtrl+R",
        click: function () {
          mainWindow.reload();
        }
      },
      {
        label: i18n.__("Toggle Fullscreen"),
        accelerator: "CmdOrCtrl+shift+F",
        role: 'togglefullscreen'
      },
      {
        label: i18n.__("Close"),
        accelerator: "CmdOrCtrl+W",
        role: "close"
      },
      {
        label: i18n.__("Quit"),
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }
  
  const language = {
    label:"Aa",
    submenu: [
      {
        label: "English",
        type: "radio",
        id:"EN",
        click: function () {
          refreshApp(mainWindow,"EN");
        }
      },
      {
        label: "中文",
        type: "radio",
        id:"CN",
        click: function () {
          refreshApp(mainWindow,"CN");
        },
      }
    ]
  }
  
  const langused = i18n.lang()

  for (var item of language.submenu) {
    if ( item.id == langused) {
      item.checked = true;
    }
  }
  
  const template = [anchor, language, deve]
  
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  
}

function refreshApp(win, lang) {
  var i18n = new(require('./lang/i18n'));
  
  i18n.langChange(lang);
  createMenu(win);
  win.webContents.executeJavaScript('rewriteHtml()');
  // win.webContents.executeJavaScript('location.reload()');
}

module.exports.createMenu = createMenu