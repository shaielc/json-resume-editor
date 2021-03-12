import { Control } from "./control";

class ThemeOption {
    constructor(theme)
    {
        const el = document.createElement("option")
        el.value = theme
        el.innerHTML = theme
        return el
    }
}

export class ThemeControl extends Control {
    constructor(el, themes)
    {
        if (el == null)
        {
            el = "select"
        }
        super(el, "change")
        for (const theme of themes)
        {
            this.el.appendChild(new ThemeOption(theme))
        }
        
    }

    callback()
    {
        this.builder.updateState({theme: this.el.value})
    }
}