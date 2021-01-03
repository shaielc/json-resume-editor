import paper from 'jsonresume-theme-paper'
import flat from 'jsonresume-theme-flat'

const themes = {paper, flat}

export function render(resume_object, theme)
{
    return themes[theme].render(resume_object)
}