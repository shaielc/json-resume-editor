import { ensureElement } from "./utils";
import { ResumeEditor } from "./editor";
import { RemoteResumeEngine, RenderMethods, themes } from "./engine";
import { ResumePreview } from "./preview";
import { ResumeBuilder } from "./builder";
import { Menu } from "./controls/menu";
import { PreviewControl } from "./controls/preview";
import { ThemeControl } from "./controls/theme_selector";

class BasicMenu extends Menu{
    constructor(el)
    {
        super(el,[
            new PreviewControl("button",RenderMethods.HTML),
            new PreviewControl("button",RenderMethods.PDF),
            new ThemeControl(null, themes)
        ])
    }
}

export class BasicApp extends ResumeBuilder {
    constructor(resumeEditorElement, resumePreviewElement, appMenuElement)
    {
        const resumeEngine = new RemoteResumeEngine()
        const resumePreview = new ResumePreview(ensureElement(resumePreviewElement))
        const initState = resumeEngine.loadState()
        super(resumeEngine,null,resumePreview, initState)
        resumeEngine.loadSchema().then( schema =>{
            const resumeEditor = new ResumeEditor(ensureElement(resumeEditorElement), schema)
            if (initState.resume)
            {
                resumeEditor.resumeEditor.setValue(this.state.resume)
            }
            this.resumeEditor = resumeEditor
        })
        new BasicMenu(appMenuElement).attach(this)
    }

    updateState(updateDict)
    {
        super.updateState(updateDict)
        this.resumeEngine.saveState(this.state)
    }

}