import { ensureElement } from "../utils";

export class Control {
    constructor(el, event)
    {
        this.el = ensureElement(el)
        this.event = event
        this.builder = null
    }

    attach(builer)
    {
        this.builder = builer
        this.el.addEventListener(this.event, () => this.callback())
    }

    callback()
    {
        throw "Call to abstract function Control.callback"
    }
}