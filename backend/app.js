const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const urlDatabase = {};

app.use(cors());
app.use(express.json());

app.post('/api/shorten', (req, res) => {
    const { originalUrl, shortUrl } = req.body;
    if (originalUrl.trim() === '') {
      return res.status(400).json({ error: 'Original URL cannot be empty' });
    }
  
    let finalShortUrl = shortUrl;
    if (!shortUrl.trim()) {
      const randomString = generateRandomString(6);
      finalShortUrl = randomString.toLowerCase();
    }
  
    if (urlDatabase[finalShortUrl]) {
      return res.status(400).json({ error: 'Short URL already exists' });
    }
  
    urlDatabase[finalShortUrl] = originalUrl;
    res.status(200).json({ shortUrl: finalShortUrl });
});

app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
