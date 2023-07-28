import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generateRandomUrl, setGenerateRandomUrl] = useState(true);

  const handleRedirect = () => {
    if (shortUrl) {
      window.location.href = `http://localhost:4000/${shortUrl}`;
    }
  };

  const handleShortenUrl = async () => {
    setErrorMessage('');
    try {
      if (!originalUrl) {
        setErrorMessage('Please enter the original URL.');
        return;
      }

      let urlToShorten = originalUrl;
      if (!generateRandomUrl && !shortUrl) {
        setErrorMessage('Please enter the custom short URL.');
        return;
      } else if (generateRandomUrl) {
        const randomString = generateRandomString(6);
        urlToShorten = randomString;
        setShortUrl(randomString);
      } else {
        urlToShorten = shortUrl;
      }

      const response = await axios.post('/api/shorten', { originalUrl, shortUrl: urlToShorten });

      setShortUrl(response.data.shortUrl);
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };
  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <input
        type="text"
        placeholder="Enter original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter custom short URL (optional)"
        value={shortUrl}
        onChange={(e) => setShortUrl(e.target.value)}
      />
      <label>
        Generate Random URL:
        <input
          type="checkbox"
          checked={generateRandomUrl}
          onChange={() => setGenerateRandomUrl(!generateRandomUrl)}
        />
      </label>
      <button onClick={handleShortenUrl}>Shorten URL</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {shortUrl && (
        <p className="shortened-url">
          Shortened URL:{' '}
          <span onClick={handleRedirect} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {`http://localhost:4000/${shortUrl}`}
          </span>
        </p>
      )}
    </div>
  );
}

export default App;