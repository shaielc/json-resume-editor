import { exec } from "child_process";
import fs from "fs";
import { hideBin } from 'yargs/helpers'
import yargs_init from "yargs";
const yargs = yargs_init(hideBin(process.argv))
const argv = yargs.command("installed","get current installed themes").option(
    'output_file',{
        alias: "o",
        type: "string",
        description: "Output list to file (json)"
    }
).argv

const re = /^jsonresume-theme-(?<theme>[a-z]*)/
exec("npm ls --json --depth=0 --only=production", (err, stdout, stdin) => {
    const out = JSON.parse(stdout)
    const themes = []
    for (const dep in out.dependencies)
    {
        const extraction = re.exec(dep)
        if (extraction !== null)
        {
            themes.push(extraction.groups.theme)
        }
    }
    console.log(themes)
    if (argv.output_file)
    {
        fs.writeFile(argv.output_file, JSON.stringify(themes),function (err) {
            if (err) return console.error(err);            
          }
        )
    }
})
