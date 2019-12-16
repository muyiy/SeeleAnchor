var geoip         = require('geoip-lite');
const { io, sq }  = require('anchorsdk')
const sle         = require('seele')
const STEM        = require('./seele/stm')

function toclip(text) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(text).then(
        function() {
          showMessage("copied", 800)
        },
        function() {
          showMessage("copy failed", 800)
        }
      );
    }
  });
}

function showMessage(str, time){

  document.getElementById('message').className = ''
  var thisMsg = Date.now();
  document.getElementById('message').className += ` ${thisMsg}`
  document.getElementById('message').innerHTML = str
  document.getElementById('message').style.display = 'none'
  document.getElementById('message').style.display = 'block'
  setTimeout(function(){
    if (document.getElementById('message').classList.contains(thisMsg)){
      document.getElementsByClassName(`${thisMsg}`)[0].style.display = 'none'
      document.getElementById('message').className = ''
    }
  }, time)

}

function sortby(list, field){}

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

function activatePanel(icon){
  // console.log(`activate ${icon.id}`);
  for ( var item of icon.parentNode.children ) {
    item.classList.remove('active')
  }
  for ( var item of document.getElementById('main').children ) {
    item.style['display'] = 'none';
  }

  icon.className += ' active';
  document.getElementsByClassName(icon.id)[0].style['display'] = 'block'
}

function activateSheet(icon){
  var titles = document.querySelectorAll('.subchains .titleBar img')
  var sheets = document.querySelectorAll('.sheets .sheet')
  for ( var title of titles ) {
    title.classList.remove("active");
  }
  for ( var sheet of sheets ) {
    sheet.classList.remove("active");
  }

  var title = document.querySelectorAll(`.subchains .titleBar img.${icon}`)[0]
  var sheet = document.querySelectorAll(`.sheets .sheet.${icon}`)[0]
  title.classList += " active"
  sheet.classList += " active"
}

async function makecontrols(){
  var controls = document.createElement('div')
  controls.classList = 'controls'
  // var networks = document.querySelectorAll('div.table')
  // console.log(networks);
  // var network = document.createElement('div')
  var selectNet = document.createElement('select')
  selectNet.classList = 'focusedSubchain'
  selectNet.onchange = new Function('updateAddressInAllSheets()')
  controls.appendChild(selectNet)

  var networks = []
  try {
    var nodes = await io.nodes.load()
    for ( var node of nodes ) {
      if ( !networks.includes(node.network) ) networks.push(node.network)
    }
    for ( var net of networks) {
      var network = document.createElement('option')
      network.value = net
      network.innerText = net
      selectNet.appendChild(network)
    }

  } catch (e) {

  }


  var account = document.createElement('div')


  return controls
}

async function makesection(menu){
  var section = document.createElement('div')
  section.classList = 'section'

  var controls = await makecontrols()
  section.appendChild(controls)

  var sheets = document.createElement('div')
  sheets.classList = 'sheets'
  section.appendChild(sheets)

  return section
}

function maketitle(menu){
  var titleBar = document.createElement('div')
  titleBar.classList = 'titleBar'

  for ( var item of menu ) {
    var node = document.createElement('img')
    node.src = item.src
    node.onclick = new Function(`activateSheet("${item.classList}")`)
    node.classList = item.classList
    titleBar.appendChild(node)
  }

  return titleBar
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
    navicon.onclick   = new Function("activatePanel(this)")
    side.appendChild(navicon)

    var icon = document.createElement('img')
    icon.src = item.img
    navicon.appendChild(icon)

    var ttip        = document.createElement('div')
    ttip.classList  = 'tooltiptext right'
    ttip.innerText  = item.tag
    navicon.appendChild(ttip)

    var content = document.createElement("div");
    content.classList = 'panel ' + item.id
    main.appendChild(content)
  }
  return page;
}

function nodeMake(){

  var address = document.querySelectorAll('#form .field.Address .content .input input')[0].value
  var index = document.querySelectorAll('#form .field.Index .content .input input')[0].value
  var network = document.querySelectorAll('#form .field.Chain .content .input input')[0].value
  var parentNetwork = "null"
  if ( network != "Seele") parentNetwork = "Seele"
  var toSave = [[
    network,
    index,
    address,
    parentNetwork
  ]]



  console.log(toSave);

  io.nodes.save(toSave).then( a => {
      var panel =  document.querySelectorAll('.nodes.panel')[0];
      panel.innerHTML = ''
      drawNodesPanel()
    }
  ).catch( e=>{
    console.log(e);
    alert(e)
  })
}

function nodeMakeForm(){
  var form = document.getElementById('form')
  form.innerHTML = ''

  var display = document.createElement('div')
  display.classList = `display`
  display.innerHTML = `<br>`
  form.appendChild(display)

  var fields = [
    {
      label: 'Address',
      placeholder: '  127.0.0.1:8027',
      iconsrc: './src/img/ipport.png'
    },
    {
      label: 'Chain',
      placeholder: '  Seele',
      iconsrc: './src/img/chain.png'
    },
    {
      label: 'Index',
      placeholder:  '  1',
      iconsrc: './src/img/index.png'
    }
  ]

  for ( var item of fields ) {
    var field = document.createElement('div')
    field.classList = `field ${item.label}`
    form.appendChild(field)

    var content = document.createElement('div')
    content.classList =  `content`
    field.appendChild(content)

    var label = document.createElement('div')
    label.classList = `label`
    label.innerText = `${item.label}`
    content.appendChild(label)

    var input = document.createElement('div')
    input.classList = `input`
    input.innerHTML = `
      <img src="${item.iconsrc}">
      <input class="contract" type="text" placeholder="${item.placeholder}">
      `
    content.appendChild(input)

    var err = document.createElement('div')
    err.classList = 'err'
    err.innerHTML = `<br>`
    field.appendChild(err)
  }

  var bottomBottunGroup = document.createElement('div')
  bottomBottunGroup.classList = 'bottom buttongroup'
  form.appendChild(bottomBottunGroup)

  var cancelbutton = document.createElement('div')
  cancelbutton.innerText = 'Cancel'
  cancelbutton.classList = 'cancel button'
  cancelbutton.onclick = new Function(`formLess()`)
  bottomBottunGroup.appendChild(cancelbutton)

  var addbutton = document.createElement('div')
  addbutton.innerText = 'Add'
  addbutton.classList = 'sure button'
  addbutton.onclick = new Function(`nodeMake()`)
  bottomBottunGroup.appendChild(addbutton)

  document.getElementById('form').style.display = 'block'
  document.getElementById('dask').style.display = 'block'
}

function nodeDrop(node){
  var row = document.getElementById(`${node.address}`)
  console.log(row);
  if ( row.children[1].innerText == node.address ) {
    if ( !row.classList.contains('applied') ){
      row.parentNode.removeChild(row)
      io.nodes.drop([[
        node.network,
        node.number,
        node.address,
        node.parentNetwork
      ]])
    } else {
      alert('This node is applied')
    }
  }

  formLess();
}

function nodeMoreForm(node){
  var form = document.getElementById('form')
  form.innerHTML = ''

  var display = document.createElement('div')
  display.classList = `display`
  display.innerText = `Are you sure you want to delete ${node.address} ?`
  form.appendChild(display)

  var bottomBottunGroup = document.createElement('div')
  bottomBottunGroup.classList = 'bottom buttongroup'
  form.appendChild(bottomBottunGroup)

  var cancelbutton = document.createElement('div')
  cancelbutton.innerText = 'Cancel'
  cancelbutton.classList = 'cancel button'
  cancelbutton.onclick = new Function(`formLess()`)
  bottomBottunGroup.appendChild(cancelbutton)

  var deletebutton = document.createElement('div')
  deletebutton.innerText = 'Delete'
  deletebutton.classList = 'sure button'
  deletebutton.onclick = new Function(`nodeDrop(${JSON.stringify(node)})`)
  bottomBottunGroup.appendChild(deletebutton)

  document.getElementById('form').style.display = 'block'
  document.getElementById('dask').style.display = 'block'
}

function formLess(){
  document.getElementById('form').style.display = 'none'
  document.getElementById('dask').style.display = 'none'
  document.getElementById('form').innerHTML = ''
}

function doubleclick(el, onsingle, ondouble) {
  if (el.getAttribute("data-dblclick") == null) {
    el.setAttribute("data-dblclick", 1);
    setTimeout(function () {
      if (el.getAttribute("data-dblclick") == 1) {
        onsingle();
      }
      el.removeAttribute("data-dblclick");
    }, 200);
  } else {
    el.removeAttribute("data-dblclick");
    ondouble();
  }
}

async function drawSendSheet(){
  return new Promise( (resolve, reject) => {
    var sheet = document.createElement('div')
    sheet.classList = `sheet send`

    var infoSection = document.createElement('div')
    infoSection.classList = 'info'
    sheet.appendChild(infoSection)

    var actionSection = document.createElement('div')
    actionSection.classList = 'action'
    sheet.appendChild(actionSection)

    var inputs = document.createElement('div')
    inputs.classList = 'inputs'
    actionSection.appendChild(inputs)

    var icons = document.createElement('div')
    icons.classList = 'icons'
    inputs.appendChild(icons)

    var setting = document.createElement('img')
    setting.src = './src/img/setting.png'
    // setting.onclick =
    icons.appendChild(setting)

    var amountline = document.createElement('div')
    amountline.classList = 'amount input'
    inputs.appendChild(amountline)

    var amount = document.createElement('input')
    amount.placeholder = '  amount'
    amountline.appendChild(amount)

    var toline = document.createElement('div')
    toline.classList = 'to input'
    inputs.appendChild(toline)

    var to = document.createElement('input')
    to.placeholder = '  to'
    toline.appendChild(to)


    var buttons = document.createElement('div')
    buttons.classList = 'buttons'
    actionSection.appendChild(buttons)

    var send = document.createElement('div')
    send.classList = 'send'
    send.innerText = 'Send'
    send.onclick = new Function('alert("send!")')
    buttons.appendChild(send)

    var sheets = document.querySelectorAll(".subchains .section .sheets")[0]
    sheets.appendChild(sheet)
    resolve()
  })
}

async function drawRequestSheet(){
  return new Promise( (resolve, reject) => {

    var sheet = document.createElement('div')
    sheet.classList = `sheet request`

    var infoSection = document.createElement('div')
    infoSection.classList = 'info'
    infoSection.id = 'requestinfo'
    sheet.appendChild(infoSection)

    var actionSection = document.createElement('div')
    actionSection.classList = 'action'
    sheet.appendChild(actionSection)

    var inputs = document.createElement('div')
    inputs.classList = 'inputs'
    actionSection.appendChild(inputs)

    var icons = document.createElement('div')
    icons.classList = 'icons'
    inputs.appendChild(icons)

    var minus = document.createElement('img')
    minus.src = './src/img/minus.png'
    // minus.onclick =
    icons.appendChild(minus)

    var add = document.createElement('img')
    add.src = './src/img/add.png'
    // add.onclick =
    icons.appendChild(add)


    var inputline = document.createElement('div')
    inputline.classList = 'input'
    inputs.appendChild(inputline)

    var input = document.createElement('input')
    input.placeholder = '  amount'
    inputline.appendChild(input)

    var buttons = document.createElement('div')
    buttons.classList = 'buttons'
    actionSection.appendChild(buttons)

    var leave = document.createElement('div')
    leave.classList = 'leave'
    leave.innerText = 'Leave'
    leave.onclick = new Function('alert("leave!")')
    buttons.appendChild(leave)

    var enter = document.createElement('div')
    enter.classList = 'enter'
    enter.innerText = 'Enter'
    enter.onclick = new Function('alert("enter!")')
    buttons.appendChild(enter)

    var sheets = document.querySelectorAll(".subchains .section .sheets")[0]
    sheets.appendChild(sheet)
    resolve()
  })
}

async function drawRelaySheet(){
  return new Promise( (resolve, reject) => {
    var sheet = document.createElement('div')
    sheet.classList = `sheet relay`

    var infoSection = document.createElement('div')
    infoSection.classList = 'info'
    sheet.appendChild(infoSection)

    var actionSection = document.createElement('div')
    actionSection.classList = 'action'
    sheet.appendChild(actionSection)

    var inputs = document.createElement('div')
    inputs.classList = 'inputs'
    actionSection.appendChild(inputs)

    var icons = document.createElement('div')
    icons.classList = 'icons'
    inputs.appendChild(icons)

    var refresh = document.createElement('img')
    refresh.src = './src/img/refresh.png'
    // refresh.onclick =
    icons.appendChild(refresh)

    // var inputline = document.createElement('div')
    // inputline.classList = 'input'
    // inputs.appendChild(inputline)
    //
    // var input = document.createElement('input')
    // input.placeholder = '  amount'
    // inputline.appendChild(input)

    var buttons = document.createElement('div')
    buttons.classList = 'buttons'
    actionSection.appendChild(buttons)



    var challenge = document.createElement('div')
    challenge.classList = 'challenge'
    challenge.innerText = 'Challenge'
    challenge.onclick = new Function('alert("challenge!")')
    buttons.appendChild(challenge)

    var relay = document.createElement('div')
    relay.classList = 'relay'
    relay.innerText = 'Relay'
    relay.onclick = new Function('alert("relay!")')
    buttons.appendChild(relay)

    var sheets = document.querySelectorAll(".subchains .section .sheets")[0]
    sheets.appendChild(sheet)
    resolve()
  })
}

async function drawPrivilegeSheet(){
  return new Promise( async (resolve, reject) => {

    var network = document.getElementsByClassName('focusedSubchain')[0].value
    var address = await sq.subchain.load(`network = "${network}"`)
    // alert(network)
    // console.log('network is', network);network
    // console.log('address at', address);

    var sheets = document.querySelectorAll(".subchains .section .sheets")[0]

    var sheet = document.createElement('div')
    sheet.classList = `sheet privilege`
    sheets.appendChild(sheet)

    var section = document.createElement('div')
    section.classList =  `section`
    sheet.appendChild(section)

    var header = document.createElement('h1')
    header.innerText = network
    section.appendChild(header)

    var contractAddress = document.createElement('div')
    contractAddress.classList = 'input'
    section.appendChild(contractAddress)

    var img = document.createElement('img')
    img.src = './src/img/ipport.png'
    contractAddress.appendChild(img)
    // var address = await sq.

    var input = document.createElement('input')
    input.type = 'text'
    input.id = 'contractAddressValue'
    input.value = address[0].address
    input.placeholder = '   0x...'
    input.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        updatePrivilegeSheet()
      }
    });
    contractAddress.appendChild(input)

    var contractInfo = document.createElement('div')
    contractInfo.id = 'privilegeSheetContent'
    section.appendChild(contractInfo)

    resolve()
  })
}

async function updatePrivilegeSheet(){
  var address = document.getElementById('contractAddressValue').value
  var network = document.getElementsByClassName('focusedSubchain')[0].value

  await sq.subchain.drop(`network = "${network}"`)
  await sq.subchain.save([`("${network}", "${address}")`])

  // console.log(address.value);
  // console.log('update privilege', address.value)

  var content = document.getElementById('privilegeSheetContent')
  content.innerText = ''
  var stm = new STEM(address)
  console.log(stm);
  // let node     = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
  // var rpc      = new sle.rpcjson(node[1], 3000)
  // var info     = await rpc.getInfo()
  // console.log(info);
  //0xcc6ac33adcf86be4bf4576d8dd7ea6678c270022

  Promise.all([
    stm.getOwner(),
    stm.getOps(),
    stm.getTotalDeposit(),
    stm.getTotalBalance(),
    stm.isFrozen()
  ]).then( results =>{
    var owner = results[0]
    var operators = results[1]
    var deposit = results[2]
    var balance = results[3]
    var active = results[4]
    console.log(operators[0]);
    var ops = operators[0].join('<br>')


    var contractSpecs = [
      {
        title: 'Owner',
        content: owner[0]
      },
      {
        title: 'Operators',
        content: ops
      },
      {
        title: 'Total Deposit',
        content: deposit[0]
      },
      {
        title: 'Contract Balance',
        content: balance[0]
      },
      {
        title: 'Frozen',
        content: active[0]
      }
    ]

    for ( var spec of contractSpecs ) {
      var title = document.createElement('div')
      title.classList = 'title'
      title.innerText = spec.title
      content.appendChild(title)

      var row = document.createElement('div')
      row.classList = 'row'
      row.innerHTML = spec.content
      content.appendChild(row)
    }
  })
}

async function updateRequestSheet(){
  var info = document.getElementById('requestinfo');

  var entry = document.createElement('div')

  info.appendChild(entry)
}

async function updateAddressInAllSheets(){
  var network = document.getElementsByClassName('focusedSubchain')[0].value
  var address = await sq.subchain.load(`network = "${network}"`)
  var title = document.querySelector("#main > div.panel.subchains > div.section > div.sheets > div.sheet.privilege.active > div > h1")
  var contractadd = document.querySelector("#contractAddressValue")
  contractadd.value = address[0].address
  title.innerText = network
}

async function drawNodesPanel(){
  return new Promise( async function(resolve, reject) {
    var panel =  document.querySelectorAll('.nodes.panel')[0];

    var titleBar = document.createElement('div')
    titleBar.classList = 'titleBar'
    panel.appendChild(titleBar)

    var add = document.createElement('img')
    add.src = './src/img/add.png'
    add.classList = 'add'
    add.onclick = new Function('nodeMakeForm()')
    titleBar.appendChild(add)

    // var refresh = document.createElement('img')

    io.nodes.load().then( unsortedNodes => {
      var nodes = unsortedNodes.sort((a, b) => {return b.number - a.number});
      for ( var node of nodes ) {
        var nodeTable = document.querySelectorAll(`.nodes.table.${node.network}`)
        if ( nodeTable.length <= 0 ) {
          var table = document.createElement('div')
          table.classList = `nodes table ${node.network}`
          panel.appendChild(table)
          var tableTitle = document.createElement('div')
          tableTitle.classList = `title`
          tableTitle.innerText = `${node.network}`
          table.appendChild(tableTitle)
        }
        // console.log(node);
        nodeTable = document.querySelectorAll(`.nodes.table.${node.network}`)[0]


        var row = document.createElement('div')
        row.classList = `row`
        row.id = node.address
        row.onclick = new Function(`doubleclick(this, ()=>{toclip("${node.address}")}, ()=>{nodeMoreForm(${JSON.stringify(node)})})`)
        if ( node.number != 0) {
          row.classList += ` applied`
          //using 1 to avoid inserting even before the title
          nodeTable.insertBefore(row, nodeTable.childNodes[1]);
          var number = node.number
        } else {
          nodeTable.appendChild(row)
          var number = `\n`
        }

        var index = document.createElement('div')
        index.classList = `cell indx`
        index.innerText = number
        row.appendChild(index)

        var address = document.createElement('div')
        address.classList = `cell addr`
        address.innerText = node.address
        row.appendChild(address)

        var sum = document.createElement('div')
        sum.classList = `cell summ good`
        sum.innerHTML = "&#8226"
        row.appendChild(sum)

        var info = document.createElement('div')
        info.classList = `cell info`
        info.innerText = ""
        row.appendChild(info)
        // console.log(node);
      }
    }).catch( e => {
      console.log(new Error(e));
    })
  });
}

async function drawAccountsPanel(){
  return new Promise( async function(resolve, reject) {
    var panel =  document.querySelectorAll('.accounts.panel')[0];

    var titleBar = document.createElement('div')
    titleBar.classList = 'titleBar'
    panel.appendChild(titleBar)

    var add = document.createElement('img')
    add.src = './src/img/add.png'
    add.classList = 'add'
    // add.onclick = new Function('nodeMakeForm()')
    titleBar.appendChild(add)

    io.keyfile.load().then( unsortedKeyfiles => {

    }).catch( e => {
      console.log(new Error(e));
    })
  });
}

async function drawSubchainsPanel(){
  return new Promise( async function(resolve, reject) {
    var panel =  document.querySelectorAll('.subchains.panel')[0];
    var titleOBJ = [
      {
        src: './src/img/privilege.png',
        classList: 'privilege'
      },
      {
        src: './src/img/relay.png',
        classList: 'relay'
      },
      {
        src: './src/img/request.png',
        classList: 'request'
      },
      {
        src: './src/img/send.png',
        classList: 'send'
      }
    ]
    var titleBar = maketitle(titleOBJ)
    panel.appendChild(titleBar)

    var section = await makesection(titleOBJ)
    panel.appendChild(section)

    Promise.all([
      drawSendSheet(),
      drawRequestSheet(),
      drawRelaySheet(),
      drawPrivilegeSheet()
    ]).then( values => {
      activateSheet('request')
      // activateSheet('privilege')
      resolve('sheets drawn')
    }).catch( e=>{
      reject(e)
    })
  })
}

async function drawMainPage(network){
  console.log('Draw Page:', network)
  // console.log(io.settings.);
  var settings = await io.settings.load()
  document.getElementsByTagName("body")[0].className = settings.theme

  var menu = [
    {
      img: "./src/img/node.png",
      tag: "Nodes",
      id : "nodes",
      av : true
    },
    {
      img: "./src/img/account.png",
      tag: "Accounts",
      id : "accounts",
      av : true
    },
    {
      img: "./src/img/subchain.png",
      tag: "Subchains",
      id : "subchains",
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

  makepage(menu);

  Promise.all([
    drawNodesPanel(),
    drawAccountsPanel(),
    drawSubchainsPanel()
    // drawContractContent(network),
    // drawSettingsContent(settings)
  ]).then( values => {
    console.log(values);
  });
}

drawMainPage('Seele').then( ()=>{
  activatePanel(document.getElementById('subchains'))
})
