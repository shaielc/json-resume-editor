import { JSONEditor } from "@json-editor/json-editor";

  // Set the default CSS theme and icon library globally
  JSONEditor.defaults.theme = 'spectre';
  JSONEditor.defaults.iconlib = 'spectre';

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
  if (typeof el == "string") {
    el = document.getElementById(el);
  }
  return el;
}

export class ResumeEditor {
  constructor(el) {
    this.resumeEditor = null
    el = ensureElement(el);
    this.schema_promise = ajax_request("schema.json")
      .then((xmlhttp) => parse_json(xmlhttp))
      .then((schema) => {
        // editor holder
        this.resumeEditor = new JSONEditor(el, {
          schema: schema,
        });
      });
  }

  //TODO: move rendering to another module and class.
  parseRenderRequestBody(theme)
  {
    return JSON.stringify({
      "resume": this.resumeEditor.getValue(),
      "theme": theme
    }
      )
  }

  getHTML(theme) {
    if (this.resumeEditor === null)
    {
      console.error("Editor didn't load properly")
    }
    return ajax_request(
      "render",
      this.parseRenderRequestBody(theme),
      "POST",
      "json"
    );
  }

  getPDF(theme){
    if (this.resumeEditor === null)
    {
      console.error("Editor didn't load properly")
    }
    return ajax_request(
      "render_pdf",
      this.parseRenderRequestBody(theme),
      "POST",
      "json",
      true
    );
  }
}
