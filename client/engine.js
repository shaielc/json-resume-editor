import themes from "./themes.json";
import { ajax_request, parse_json } from "./utils";

export { themes }

export const RenderMethods = Object.freeze({
    HTML: Symbol("html"),
    PDF: Symbol("PDF")
});

// TODO: Move saving and loading local-storage to a different part of the app.

export class ResumeEngine {
    //TODO: load scheme
    async loadScheme()
    {
        throw "Abstract class"
    }
    //TODO: render HTML
    async renderHTML(resume, theme)
    {
        throw "Abstract class"
    }
    //TODO: render PDF
    async renderPDF(resume, theme)
    {
        throw "Abstract class"
    }

    async render(resume, theme, method){
        switch (method) {
            case RenderMethods.HTML:
                return this.renderHTML(
                    resume,theme
                )
            case RenderMethods.PDF:
                return this.renderPDF(
                    resume,theme
                )        
            default:
                throw "Method not found"
        }
    }

    saveState({resume, theme})
    {
        localStorage.setItem("resume", JSON.stringify(resume))
        localStorage.setItem("theme", theme)
    }

    loadState()
    {
        return {
            "resume": JSON.parse(localStorage.getItem("resume")),
            "theme": localStorage.getItem("theme")
        }
    }
}

export class RemoteResumeEngine extends ResumeEngine {
    async loadSchema(){
        const xmlhttp = await ajax_request("schema.json");
        return await parse_json(xmlhttp);
    }

    static parseRenderRequestBody(resume, theme)
    {
        if (!theme)
        {
            theme = themes[0]
        }
        return JSON.stringify({
        "resume": resume,
        "theme": theme
        }
        )
    }

    renderHTML(resume, theme)
    {
        return ajax_request(
            "render",
            RemoteResumeEngine.parseRenderRequestBody(resume, theme),
            "POST",
            "json"
          ).then(xmlhttp => xmlhttp.responseText);
    }

    renderPDF(resume, theme)
    {
        return ajax_request(
            "render_pdf",
            RemoteResumeEngine.parseRenderRequestBody(resume, theme),
            "POST",
            "json",
            true
          ).then(xmlhttp => xmlhttp.response);
    }
}
