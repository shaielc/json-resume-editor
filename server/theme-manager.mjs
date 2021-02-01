
class ThemeManager {
    constructor()
    {
        this.themes = {}
    }
    
    async get(theme_name)
    {
        if (!(theme_name in this.themes))
        {
            this.themes[theme_name] = await import(`jsonresume-theme-${theme_name}`);
        }
        return this.themes[theme_name]
    }
}
const themeManager = new ThemeManager()
export {themeManager}