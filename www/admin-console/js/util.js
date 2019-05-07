// setup our gloabl variables
var currentContent = "main";
var baseUrl = "http://127.0.0.1:9000";
var bAffiliates = false;

// used to map name to input (textbox)
var inputs = { 
  "_id" : "txtIDHidden",
  "id" : "txtID",
  "publicationid" : "txtPublicationID",
  "symbol" : "txtStock",
  "name" : "txtName",
  "buy" : "txtBuy",
  "stop" : "txtStop",
  "recommendation" : "txtRecommendation",
  "status" : "txtStatus",
};

var validation = {
  "email" : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "state" : /[0-9]/
}

var obj = {
  _id : function() { return "_id" },
  id : function() { return 'id' },
  publicationid: function() { return 'publicationid' },
  symbol : function() { return 'symbol' },
  name : function() { return 'name' },
  buy: function() { return 'buy' },
  stop: function() { return 'stop' },
  last: function() { return 'last' },
  change: function() { return 'change' },
  recommendation: function() { return 'recommendation' },
  status: function() { return 'status' }
}
     
/**
 *
 * @description : Function that checks if the stock is in update or insert mode
 * @params      : void
 * @return      : void
 *
 */
function checkStockMode() {
  var el = document.getElementById('chkMode');
  var cmb = document.getElementById('cmbStock');
  var txt = document.getElementById('txtStock');
  var lbl = document.getElementById('lblStockSubtitle');
  if (el.checked) {
    cmb.style.display = "none";
    txt.style.display = "block";
    lbl.innerHTML = "Insert stock data";
  } else {
    cmb.style.display = "block";
    txt.style.display = "none";
    lbl.innerHTML = "Update stock data";
  }
}


/**
 *
 * @description : Function that hi-lights the current side navigation item
 * @params      : id - the current item name
 * @return      : void
 *
 */
function updateNavigation(id) {
  if ((id === 'publications' || id === 'stocks') && bAffiliates === false) {
    getAffiliateData();
    bAffiliates = true;
  }
  var icon = document.getElementById('icon-'+id);
  var title = document.getElementById('title-'+id);
  var content = document.getElementById('content-'+id);
  if (id !== currentContent) {
    var oldContent = document.getElementById('content-'+currentContent);
    if (currentContent !== "main") {
      var oldIcon = document.getElementById('icon-'+currentContent);
      var oldTitle = document.getElementById('title-'+currentContent);
      oldIcon.style.opacity="0.2"; 
      oldTitle.style.color="#8a8a8a";
    }
    oldContent.style.display = "none";
  }
  icon.style.opacity="0.7"; 
  title.style.color="#4a4a4a";
  content.style.display = "block";
  currentContent = id;
}

/**
 *
 * @description : Function that gets the navigation html (html include)
 * @params      : id - the html to include
 * @return      : void
 *
 */
function includeHTML(id) {
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "navigate.html", true);
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var elmnt = document.getElementById(id);
      elmnt.innerHTML = this.responseText;
      if ( currentContent !== "main") {
        var icon = document.getElementById('icon-'+currentContent);
        var title = document.getElementById('title-'+currentContent);
        icon.style.opacity="0.7"; 
        title.style.color="#4a4a4a";
      }
    }
  }
  return;
}

/**
 *
 * @description : Function that gets affiliate data from the microservice via nginx
 * @params      : id - the client id (bson _id)
 * @return      : void
 *
 */
function getAffiliateData() {
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", baseUrl + "/api/v1/affiliates" , true);
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      var elA = document.getElementById('cmbAffiliatePublications');
      var elB = document.getElementById('cmbAffiliateStocks');
      for (var i = 0; i < Object.keys(obj.payload.affiliates).length; i++) {
        var optA = document.createElement('option');
        optA.value = obj.payload.affiliates[i].id;
        optA.innerHTML = obj.payload.affiliates[i].name;
        elA.appendChild(optA);
        var optB = document.createElement('option');
        optB.value = obj.payload.affiliates[i].id;
        optB.innerHTML = obj.payload.affiliates[i].name;
        elB.appendChild(optB);
      }
    }
    return;
  }
}

/**
 *
 * @description : Function that gets publications data from the microservice via nginx
 * @params      : id - the client id (bson _id)
 * @return      : void
 *
 */
function getPublicationData() {
  var el = document.getElementById('cmbAffiliateStocks');
  var x = el.selectedIndex;
  var y = el.options;
  var elA = document.getElementById('cmbPublications');
  elA.innerHTML="";
  
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", baseUrl + "/api/v1/publications/"+y[x].value, true);
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      console.log(obj);
      if (obj.payload.publications !== null) {
        for (var i = 0; i < Object.keys(obj.payload.publications).length; i++) {
          var optA = document.createElement('option');
          optA.value = obj.payload.publications[i].id;
          optA.innerHTML = obj.payload.publications[i].name;
          elA.appendChild(optA);
        }
      }
    }
    return;
  }
}

/**
 *
 * @description : Function that gets publications data from the microservice via nginx
 * @params      : id - the client id (bson _id)
 * @return      : void
 *
 */
function getStockData() {
  resetFields();
  var el = document.getElementById('cmbPublications');
  var x = el.selectedIndex;
  var y = el.options;
  var elA = document.getElementById('cmbStocks');
  elA.innerHTML = "";
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", baseUrl + "/api/v1/stocks/"+y[x].value, true);
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      for (var i = 0; i < Object.keys(obj.payload.stocks).length; i++) {
        var optA = document.createElement('option');
        optA.value = buildStockDataItems(obj.payload.stocks[i]);
        optA.innerHTML = obj.payload.stocks[i].symbol;
        elA.appendChild(optA);
      }
    }
    return;
  }
}

/**
 *
 * @description : Function that concats items in a string for later updates
 * @params      : item  - the data stock item
 * @return      : string
 *
 */

function buildStockDataItems(item) {
  return item._id + ":" + item.id +  ":" + item.publicationid + ":"+ item.symbol + ":" + item.name + ":" + item.buy + ":" + item.stop + ":" + item.recommendation;
}

/**
 *
 * @description : Function that gets publications data from the microservice via nginx
 * @params      : id - the client id (bson _id)
 * @return      : void
 *
 */
function updateStockData() {
  var el = document.getElementById('cmbStocks');
  var x = el.selectedIndex;
  var y = el.options;
  var tmp = y[x].value.split(":");
  for (let i = 0; i < Object.keys(inputs).length; i++) {
    var key = Object.keys(inputs)[i];
    var el = document.getElementById(inputs[key]);
    el.value = tmp[i];
  }
}



/**
 *
 * @description : Utility function that does simple templating
 * @params      : void 
 * @return      : void
 *
 */
var templateMaker = function (object) {
    return function (context) {
        var replacer = function (key, val) {
            if (typeof val === 'function') {
                return context[val()]
            }
            return val;
        }
        return JSON.parse(JSON.stringify(obj, replacer))
    }
}

/**
 *
 * @description : Utility Function that resets all fields and errors
 * @params      : void 
 * @return      : void
 *
 */
function resetFields() {
  // iterate through all controls
  for (let i = 0; i < Object.keys(inputs).length; i++) {
    var key = Object.keys(inputs)[i];
    var el = document.getElementById(inputs[key]);
    var e = document.getElementById("err" + inputs[key].substr(3));
    if (e !== null) { 
      e.style.display = "none";
      el.style.borderColor = "#cccccc";
    }
    if (inputs[key].indexOf("id") != -1) {
      el.value = "";
    }
  }
}


/**
 *
 * @description : Utility Function that validates the inputs
 * @params      : void 
 * @return      : void
 *
 */
function validateProfileData() {

  var bErr = false;
  var bRegex = true;
  // iterate through all controls
  
  for (let i = 0; i < Object.keys(inputs).length; i++) {
    var key = Object.keys(inputs)[i];
    var el = document.getElementById(inputs[key]);
    var e = document.getElementById("err" + inputs[key].substr(3)); 
    if (el.value === "") {
      e.style.display = "block";
      el.style.borderColor = "red";
      bErr = true;
    } else {
      // does the field have specific regex tests
      if (validation[key]) {
        re = validation[key]
        if (!re.test(el.value)) {
          e.style.display = "block";
          el.style.borderColor = "red";
          bErr = true;
        }
      }
    }
  }
  return bErr;
}


/**
 *
 * @description : Function that saves profile data to the microservice via nginx
 * @params      : id - the client id (bson _id)
 * @return      : void
 *
 */
function saveStockData() {

  // resetFields();
  for (let i = 0; i < Object.keys(inputs).length; i++) {
    var key = Object.keys(inputs)[i];
    var el = document.getElementById(inputs[key]);
    inputs[key] = el.value;
  }

  var template = templateMaker(obj);
  var rendered = template(inputs);

  // if (!validateProfileData()) {

    xhttp = new XMLHttpRequest();
    xhttp.open("PUT", baseUrl + "/api/v1/stocks/" + txtIDHidden.value , true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(rendered);

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(this.responseText);
        for (var i = 0; i < Object.keys(obj.payload.stocks).length; i++) {
          var key = Object.keys(obj.payload.stocks[i]);
          var el = document.getElementById(inputs[key]);
          el.value = obj.payload[0].stocks[key];
        }
      }
      return;
    }
  //}
 
}
