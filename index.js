const express = require('express');
const { AzureKeyCredential, DocumentAnalysisClient } = require('@azure/ai-form-recognizer');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs = require('fs');

const app = express();
const port = 3000 | process.env.PORT;

// Azure service credentials
const key = "87f12764184d404788988cae1acac79f";
const endpoint = "https://homeetute.cognitiveservices.azure.com/";

app.use(bodyParser.json());

app.use(cors());

app.post('/analyzeDocument', async (req, res) => {
  try {
    const { documentUrl } = req.body;

    if (!documentUrl) {
      res.status(400).json({ error: 'Missing documentUrl in the request body.' });
      res.send('404 Not Found');
      return;
    }

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    // Download the image from the provided URL
    // const imageBuffer = fs.readFileSync(documentUrl);

    const poller = await client.beginAnalyzeDocument('prebuilt-idDocument', documentUrl);

    const { documents: [result] } = await poller.pollUntilDone();

    if (result) {
      res.status(200).json(result);
      res.send(result);
    } else {
      res.status(400).json({ error: 'No result found for document analysis.' });
      res.send('No result found for document analysis');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while processing the document.' });
    res.send('500 Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
