import {Control} from './control'
import { RenderMethods } from "../engine";
const default_text = {
    [RenderMethods.HTML]: "Preview",
    [RenderMethods.PDF]: "PDF"
}

export class PreviewControl extends Control {
    constructor(el, method, event="click")
    {
        super(el, event)
        this.method = method
        this.event = event
        if (this.el.innerHTML == "")
        {
            this.el.innerHTML = default_text[method]
        }
        
    }

    callback()
    {
        this.builder.preview(this.method, this.builder.state.theme)
    }
}