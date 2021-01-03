function ajax_request(url,body=null,method="GET", type=null) {
  return new Promise((res, rej) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        res(xmlhttp)
      }
      else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
        rej({ status: xmlhttp.status, text: xmlhttp.responseText })
      }
    };

    xmlhttp.open(method, url, true);
    if (type == "json")
    {
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    }
    
    if (body)
    {
      xmlhttp.send(body)
    }
    else
    {
      xmlhttp.send();
    }
  })
}

function parse_json(xmlhttp) {
  return new Promise((res, rej) => {
    try {
      var data = JSON.parse(xmlhttp.responseText);
      res(data);
    } catch (err) {
      console.error("Error paring JSON from ", url)
      console.error(err.message + " in " + xmlhttp.responseText);
      rej()
    }
  })
}

var resumeEditor = null

ajax_request("schema.json").then((xmlhttp) => parse_json(xmlhttp)).then((schema) => {

  resumeEditor = new JSONEditor(document.getElementById('editor_holder'), {
    schema: schema
  });
});

function renderResumeJSON()
{
  return ajax_request("render",JSON.stringify(resumeEditor.getValue()),method="POST",type="json")
}

// Hook up the submit button to log to the console
document.getElementById('update').addEventListener('click', function () {
  // Get the value from the editor
  renderResumeJSON().then(
    (xmlhttp) => {
      const out_element = document.getElementById('output_holder')
      out_element.innerHTML = xmlhttp.responseText
    }
  );
});

function PrintHTML(html)
{
    var mywindow = window.open('', 'PRINT', 'height=600,width=800');

    mywindow.document.write(html)

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    // mywindow.close();

    return true;
}

document.getElementById('print').addEventListener('click', function () {
  renderResumeJSON().then(
    (xmlhttp) => {PrintHTML(xmlhttp.responseText)})
})
