require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const url = require('url')
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}))

function validateUrl(urlString) {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
} 

const urls = []

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  if (validateUrl(req.body.url) &&
     (/^http:\/\//.test(req.body.url) ||
     /^https:\/\//.test(req.body.url))) {
    urls.push(req.body.url)
  } else {
    res.json({
      error: "invalid url"
    })
  }

  res.json({
    original_url: req.body.url,
    short_url: urls.indexOf(req.body.url)
  })
})

app.get('/api/shorturl/:short', (req, res) => {
  if (/^\d+$/.test(req.params.short) && req.params.short < urls.length) {
    res.redirect(urls[req.params.short])
  } else {
    res.json({
      error: "No short URL found for the given input"
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
