export function ajax_request(url, body = null, method = "GET", type = null, download=false) {
    return new Promise((res, rej) => {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          res(xmlhttp);
        } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
          rej({ status: xmlhttp.status, text: xmlhttp.responseText });
        }
      };
  
      xmlhttp.open(method, url, true);
      if (type == "json") {
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
      }
  
      if (download)
      {
        xmlhttp.responseType = "blob"
      }
  
      if (body) {
        xmlhttp.send(body);
      } else {
        xmlhttp.send();
      }
    });
  }
  
  export function parse_json(xmlhttp) {
    return new Promise((res, rej) => {
      try {
        var data = JSON.parse(xmlhttp.responseText);
        res(data);
      } catch (err) {
        console.error("Error paring JSON from ", url);
        console.error(err.message + " in " + xmlhttp.responseText);
        rej();
      }
    });
  }
  
  export function ensureElement(el) {
    let element = null
    if (typeof el == "string") {
      element = document.getElementById(el);
      if (element == null)
      {
        element = document.createElement(el)
      }
    }
    return element;
  }