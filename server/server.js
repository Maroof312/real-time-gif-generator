const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-gif', async (req, res) => {
    const { imageUrl } = req.body;

    try {
        const response = await fetch('https://api.segmind.com/live-portrait', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SG_${process.env.SEGMENT_API_KEY}`
            },
            body: JSON.stringify({
                image_url: imageUrl,
                model: 'live-portrait'
            })
        });
        const data = await response.json();

        res.json({ gifUrl: data.gif_url });
    } catch (error) {
        console.error("Error generating GIF:", error);
        res.status(500).json({ message: "Error generating GIF" });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
