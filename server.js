const express = require('express');
const cors = require('cors');
const scrapeGoogle = require('./server/scraper');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.post('/search', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const results = await scrapeGoogle(query);
        res.json(results);

        
        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("Chyba při analýze:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`✅ http://localhost:${PORT}`));
