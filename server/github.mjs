
// need to figure out how to implement
import axios from "axios";

function getGithubToken(req, res, next)
{
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET_ID,
    code: req.query.code
  };
  const opts = { headers: { accept: 'application/json' } };
  axios.post(`https://github.com/login/oauth/access_token`, body, opts).
    then(result => 
      {
        req.token = result.data
        req.axios_opts = { headers: { Authorization: `token ${req.token.access_token}`, accept: 'aapplication/vnd.github.v3+json' } }
        next()
      }).
    catch(err => res.status(500).json({ message: err.message }));

}

function createResumeJsonGist(resumeObject = null,opts)
{
  if (resumeObject === null)
  {
    resumeObject = resume_schema
  }
  const payload = {"files":{"resume.json": {"content":JSON.stringify(resumeObject, null, 2)}}}
  axios.post("https://api.github.com/gists", payload, opts)
}

app.get("/github/action", (req,res) =>{
  if (req.query.action === undefined)
  {
    res.status(400)
    res.redirect("/index.html")
    return
  }
  if (req.query.token === undefined)
  {
    res.send(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=gist&redirect_uri=${process.env.GITHUB_REDIRECT_URL}/${req.query.action}`)
  }

})

function getResumeJson(opts)
{
  return (await axios.get("https://api.github.com/gists", opts)).data.filter(gist => gist.files["resume.json"]? true : false)
}

app.get("/github/load" , getGithubToken, async (req,res) =>{
  const resume_gists = getResumeJson(req.axios_opts)
  if ( resume_gists.length == 0)
  {
    createResumeJsonGist(null, req.axios_opts)
    res.redirect("/index.html")
    return
  }
  const resume_json = (await axios.get(resume_gists[0].files["resume.json"].raw_url, req.axios_opts)).data
  res.render("loadResume.ejs",{resume: resume_json})
})

app.get("/github/save", async (req, res) => {
  const resume_gists = getResumeJson(req.axios_opts)
  if ( resume_gists.length == 0)
  {
    createResumeJsonGist()
  }
})