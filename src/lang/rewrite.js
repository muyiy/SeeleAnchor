



function rewriteHtml(){
  const i18n = new(require('./src/lang/i18n'))
  var byid = document.getElementsByClassName("lit")
  for (var i = 0 ; i < byid.length ; i++ ) {
    byid[i].innerHTML = i18n.__(byid[i].id)
  }
}

// window.onload = rewriteHtml
