const { paths, io } = require('anchorsdk')
const sle = require('seele')

function networkCell(info){
  var cell = document.createElement('div')
  cell.classList = info.class
  
  var container = document.createElement('div')
  container.classList = 'container'
  cell.appendChild(container)
  
  var text = document.createElement('div')
  text.classList = 'text'
  text.innerText = info.text
  container.appendChild(text)
  
  return cell
}

function networkConvert(list){
  var network = []
  // each new node
  for ( var node of list ) {
    // check if the network exists
    var found = false;
    for ( var net of network ) {
      // if net work exists
      if ( net.name == node.net ) {
        // push back the backup or assigns the array
        switch (node.status) {
          case 0:
            net.back.push(node.ipport);
            break;
          default:
            net.used[node.status] = node.ipport;
        }
        found = true;
      }
    }
    if (!found) {
      var newNet = {
        name: node.net,
        used:[],
        back:[]
      }
      
      switch (node.status) {
        case 0:
          newNet.back.push(node.ipport);
          break;
        default:
          newNet.used[node.status] = node.ipport;
      }
      
      network.push(newNet)
    }
  }
  
  return network
}

function activate(icon){
  console.log(`activate ${icon.id}`);
  for ( var item of icon.parentNode.children ) {
    item.classList.remove('active')
  }
  for ( var item of document.getElementById('main').children ) {
    item.style['display'] = 'none';
  }
  
  icon.className += ' active';
  document.getElementsByClassName(icon.id)[0].style['display'] = 'block'
}

function makepage(menu){
  var page = document.getElementById('page')
  page.innerHTML  = ''
  page.classList  = 'page'
  page.id         = 'page'
   
  var main = document.createElement("div"); 
  main.classList  = 'main'
  main.id         = 'main'
  page.appendChild(main)
  
  var side = document.createElement("div");
  side.classList  = 'side'
  side.id         = 'side'
  page.appendChild(side)
  
  for ( var item of menu ) {
    var navicon       = document.createElement("div"); 
    navicon.classList = 'tooltip'
    navicon.id        = item.id
    navicon.onclick   = new Function("activate(this)")
    side.appendChild(navicon)
    
    var icon = document.createElement('img')
    icon.src = item.img
    navicon.appendChild(icon)
    
    var ttip        = document.createElement('div')
    ttip.classList  = 'tooltiptext right'
    ttip.innerText  = item.tag
    navicon.appendChild(ttip)
    
    var content = document.createElement("div"); 
    content.classList = 'content ' + item.id
    main.appendChild(content)
  }
  return page;
}

async function drawNetworkContent(activated){
  io.nodes.load().then( (data) => {
    var content = document.getElementsByClassName('networks')[0]
    
    var add = document.createElement('div')
    add.classList = 'add'
    content.appendChild(add)
    
    var img = document.createElement('img')
    img.src = './src/img/add.png'
    add.appendChild(img)
    
    var titleBar = document.createElement('div')
    titleBar.classList = 'titleBar'
    content.appendChild(titleBar)
    
    var title   = document.createElement('h1')
    title.innerText = 'Networks'
    titleBar.appendChild(title)
    
    var network = networkConvert(data)
    
    for ( var info of network ) {
      var net = document.createElement('div')
      net.classList = 'net'
      content.appendChild(net)
      
      var name = document.createElement('h2')
      name.innerText = info.name
      net.appendChild(name)
      for ( var i = 1; i < info.used.length; i++ ) {
        var row = document.createElement('div')
        row.classList = 'row used'
        net.appendChild(row)
        
        row.appendChild(networkCell({
          class: 'more',
          text : i
        }))
        
        row.appendChild(networkCell({
          class: 'address',
          text : info.used[i]
        }))
        
        row.appendChild(networkCell({
          class: 'height',
          text : ''
        }))
        
        row.appendChild(networkCell({
          class: 'version',
          text : ''
        }))
        
        row.appendChild(networkCell({
          class: 'peers',
          text : ''
        }))
        
      }
      
      for ( var back of info.back ) {
        var row = document.createElement('div')
        row.classList = 'row'
        net.appendChild(row)
        row.appendChild(networkCell({
          class: 'more',
          text : '.'
        }))
        
        row.appendChild(networkCell({
          class: 'address',
          text : back
        }))
        
        row.appendChild(networkCell({
          class: 'height',
          text : ''
        }))
        
        row.appendChild(networkCell({
          class: 'version',
          text : ''
        }))
        
        row.appendChild(networkCell({
          class: 'peers',
          text : ''
        }))
        
      }
    }
  }).catch((err) => {
    console.log(err);
  })
}

async function drawAccountContent(Accounts){
  // create keyfiles 
  // console.log(sle);
  console.log(sle.offline.keyfile);
  // var pri = '0x79cbf2f9cd3f055f7397dac76487638c11f56deaedee347e97e43ab80ea3a3f3'
  // var keyfile = await sle.offline.keyfile.lock(pri, '123')
  // console.log(keyfile);
  for ( var i of [1,2,3,4] ) {
    sle.offline.keyfile.lock(sle.offline.key.spawn(i).privateKey,'123').then( keyfile => {
      io.keyfile.make({
        name: 'key',
        net: 'Seele',
        file: keyfile
      })
    }).catch( err => {
      console.log(err);
    })
  }
}

async function drawContractContent(Contracts){
  var content = document.getElementsByClassName('contracts')[0]
  
  var title   = document.createElement('h1')
  title.innerText = 'Contracts'
  content.appendChild(title)
}

async function drawSettingsContent(Settings){
  var content = document.getElementsByClassName('settings')[0]
  
  var title   = document.createElement('h1')
  title.innerText = 'Settings'
  content.appendChild(title)
}

async function drawNetworkPage(network){
  console.log('drawNetwork Page:', network)
  // console.log(io.settings.);
  var settings = await io.settings.load()
  document.getElementsByTagName("body")[0].className = settings.theme

  var menu = [
    {
      img: "./src/img/mainchain.png", 
      tag: "Mainchain",
      id : "networks",
      av : true
    },
    {
      img: "./src/img/account.png",
      tag: "Accounts",
      id : "accounts",
      av : true
    },
    {
      img: "./src/img/contract.png",
      tag: "Contracts",
      id : "contracts",
      av : true
    },
    {
      img: "./src/img/setting.png",
      tag: "Settings",
      id : "settings",
      av : true
    }
  ]

  if ( network != 'Seele') {
    menu[0].img = "./src/img/subchain.png"
    menu[0].tag = network
    menu[2].av  = false
    menu[3].av  = false
  }
  
  makepage(menu);
  
  Promise.all([
    drawNetworkContent(network), 
    drawAccountContent(network), 
    drawContractContent(network),
    drawSettingsContent(settings)
  ]).then(function(values) {
    console.log(values);
  });
}

async function drawAccountPage(){}

async function drawSubchainPage(){}

// activate(document.getElementById('accounts'))
drawNetworkPage('Seele').then( ()=>{
  activate(document.getElementById('networks'))
})
// function draw main