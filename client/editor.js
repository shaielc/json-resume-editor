import { JSONEditor } from "@json-editor/json-editor";
import { ensureElement } from "./utils";

// Set the default CSS theme and icon library globally
JSONEditor.defaults.theme = 'spectre';
JSONEditor.defaults.iconlib = 'spectre';

export class ResumeEditor {
  constructor(el, schema) {
    this.resumeEditor = null
    this.el = ensureElement(el);
    this.resumeEditor = new JSONEditor(el, {
      schema: schema,
      object_layout: "categories"
    });
  }
}
