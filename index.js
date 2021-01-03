import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import resume_schema from 'resume-schema'
import body_parser from 'body-parser'
import {render} from './client/renderer.js'


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonParser = body_parser.json()
const app = express()

app.use(express.static(__dirname + '/client'));

app.get('/',async (req,res)=>
{
   res.redirect('/index.html')
})

app.get("/schema.json", (req,res) =>
res.json(
    resume_schema.schema
))

app.post('/render', jsonParser, (req,res) => {

    resume_schema.validate(req.body,
        (err, valid) => 
        {
            if (err){
                console.error("Invalid json ", req.body, err);
                res.status(400).send("Invalid JSON-resume")
            }
            else{
                res.send(render(req.body,"flat"))
            }
        }
        )
    
})

app.listen(3000, ()=>
{
    console.log("listening on port 3000")
})