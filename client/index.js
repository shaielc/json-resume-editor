import {ResumeEditor} from './editor.js'
import './split.css'
import './spread.css'
import html from "./index.html";
import 'spectre.css'
import themes from "./themes.json";

const body = document.getElementsByTagName("BODY")[0]
const rootDiv = document.createElement("div")
rootDiv.id = "root"
rootDiv.innerHTML = html
body.append(rootDiv)
const elements = {
    "editor": document.getElementById("editor_holder"),
    "preview": document.getElementById("output_holder"),
    "preview_btn": document.getElementById("update"),
    "print_btn": document.getElementById("print"),
    "download_pdf": document.getElementById("download_pdf"),
    "theme_selector": document.getElementById("theme_selector")
}

function selectItemHTML(theme)
{
  return `<option value="${theme}">${theme}</option>`
}

for (const theme of themes)
{
  elements.theme_selector.innerHTML += selectItemHTML(theme)
}

var editor = new ResumeEditor(elements.editor)

function appendHTMLIframe(element, html)
{
  const iframe = document.createElement("iframe")
  element.append(iframe)
  iframe.style.height = "100%"
  iframe.style.width = "100%"
  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(html)
  doc.close()
  
}

function printHTML(html) {
  var mywindow = window.open("", "PRINT", "height=600,width=800");

  mywindow.document.write(html);

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  // mywindow.close();

  return true;
}

function GetPDF(xmlhttp) {
  var downloadUrl = URL.createObjectURL(xmlhttp.response)
  // data:application/pdf;base64,
  elements.preview.innerHTML = `<embed src="${downloadUrl}" width=100% height=100% />`
}

elements.preview_btn.addEventListener("click", function () {
  // Get the value from the editor
  editor.getHTML(elements.theme_selector.value).then((xmlhttp) => {
    elements.preview.innerHTML = "";
    appendHTMLIframe(elements.preview, xmlhttp.responseText)
  });
});

elements.print_btn.addEventListener("click", function () {
    editor.getHTML(elements.theme_selector.value).then((xmlhttp) => {
    elements.preview.innerHTML = ""
    printHTML(xmlhttp.responseText);
  });
});

elements.download_pdf.addEventListener("click", function () {
  editor.getPDF(elements.theme_selector.value).then((xmlhttp) => {
    elements.preview.innerHTML = ""
   GetPDF(xmlhttp)
  })
})
