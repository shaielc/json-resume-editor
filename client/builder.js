export class ResumeBuilder {
    constructor(resumeEngine, resumeEditor, resumePreview, state)
    {
        this.resumeEngine = resumeEngine
        this.resumePreview = resumePreview
        this.resumeEditor = resumeEditor
        this.state = state 
        
    }
    updateState(updateDict)
    {
        this.state = {...this.state, ...updateDict}
    }

    render(method, theme=null)
    {
        if (theme == null)
        {
            theme = this.state.theme
        }
        const resume = this.resumeEditor.resumeEditor.getValue()
        this.updateState({resume: resume})
        return this.resumeEngine.render(resume, theme, method)
    }

    preview(method, theme=null) {
        this.render(method, theme).then((obj) => {
            this.resumePreview.preview(obj, method)
        })
    }
}