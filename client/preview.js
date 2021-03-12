import { RenderMethods } from "./engine";

function appendHTMLIframe(element, html) {
  const iframe = document.createElement("iframe");
  element.append(iframe);
  iframe.style.height = "100%";
  iframe.style.width = "100%";
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

function embedPDF(element, text) {
  let downloadUrl = URL.createObjectURL(text);
  element.innerHTML = `<embed src="${downloadUrl}" width=100% height=100% />`;
}

export class ResumePreview {
  constructor(el) {
    this.el = el;
  }

  clear() {
    this.el.innerHTML = "";
  }

  previewHTML(html) {
    this.clear();
    appendHTMLIframe(this.el, html);
  }

  previewPDF(pdfResponse) {
    this.clear();
    embedPDF(this.el, pdfResponse);
  }

  preview(object, method) {
    switch (method) {
      case RenderMethods.HTML:
        this.previewHTML(object);
        break;

      case RenderMethods.PDF:
        this.previewPDF(object);
        break;

      default:
        break;
    }
  }
}
