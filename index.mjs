import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import resume_schema from "resume-schema";
import body_parser from "body-parser";
import { render, renderPDF } from "./server/renderer.mjs";
import { test } from "./server/renderer.mjs";
import dotenv from "dotenv";


// read environment from .env - don't use in production, set directly on host.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonParser = body_parser.json();
const app = express();

app.use(express.static(__dirname + "/dist"));

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  res.redirect("/index.html");
});


app.get("/schema.json", (req, res) => res.json(resume_schema.schema));

function renderRequest(req, res, next) {
  if (!("resume" in req.body)) {
    console.log("Invalid render request JSON", req.body);
    res.status(400).send("Invalid render request");
    return;
  }
  req.body.theme = req.body.theme ? req.body.theme : "flat";

  next();
}

function validateResume(req, res, next) {
  resume_schema.validate(req.body.resume, (err, valid) => {
    if (err) {
      console.error("Invalid resume-json ", req.body.resume, err);
      res.status(400).send("Invalid JSON-resume");
    } else {
      next();
    }
  });
}

app.post(
  "/render",
  jsonParser,
  renderRequest,
  validateResume,
  async (req, res) => {
    res.send(await render(req.body.resume, req.body.theme));
  }
);

app.post(
  "/render_pdf",
  jsonParser,
  renderRequest,
  validateResume,
  async (req, res) => {
    const { pdf, title } = await renderPDF(req.body.resume, req.body.theme);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
      "Content-disposition": `attachement:filename=${title}.pdf`,
    });
    res.send(pdf);
  }
);

app.post(
  "/test",
  jsonParser,
  renderRequest,
  validateResume,
  async (req, res) => {
    test(req.body.resume, req.body.theme);
    res.sendStatus(200);
  }
);

app.listen(3000, () => {
  console.log("listening on port 3000");
  console.log("http://localhost:3000/");
});
