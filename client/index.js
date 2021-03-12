import { BasicApp } from "./app";
import './split.css'
import './spread.css'
import html from "./index.html";
import 'spectre.css'

// why not just body.innerHTML?
const body = document.getElementsByTagName("BODY")[0]
const rootDiv = document.createElement("div")
rootDiv.id = "root"
rootDiv.innerHTML = html
body.append(rootDiv)

new BasicApp("editor_holder", "output_holder", "menu")