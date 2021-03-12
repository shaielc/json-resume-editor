import { ensureElement } from "../utils"

export class Menu {
    constructor(el, controls)
    {
        this.el = ensureElement(el)
        this.children = controls
        for (const control of controls)
        {
            this.appendChild(control)
        }
    }

    appendChild(control)
    {
        this.el.appendChild(control.el)
    }

    attach(builder)
    {
        for (const child of this.children)
        {
            child.attach(builder)
        }
    }
}