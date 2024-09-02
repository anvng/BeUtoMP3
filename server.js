import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: '*', // Adjust this to allowed origin(s) if deploying publicly
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the downloads directory exists
const downloadsDir = path.join(process.cwd(), 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Define a route for converting YouTube to MP3
app.post('/convert', (req, res) => {
    const youtubeLink = req.body.link;

    if (!youtubeLink) {
        return res.status(400).json({ message: 'YouTube link is required' });
    }

    // Generate a unique output file name
    const outputPath = path.join(downloadsDir, '%(title)s.%(ext)s');
    const command = `yt-dlp "${youtubeLink}" --extract-audio --audio-format mp3 --output "${outputPath}"`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Conversion failed', details: error.message });
        }

        // Attempt to find the downloaded file name in the output
        const match = stderr.match(/Destination: (.+)/);
        if (match && match[1]) {
            const filePath = match[1].trim();
            const fileName = path.basename(filePath);
            const fileUrl = `http://${req.headers.host}/downloads/${fileName}`;
            return res.status(200).json({ message: 'Conversion successful!', file: fileUrl });
        }

        // If no file found, return an error
        res.status(500).json({ message: 'Conversion failed: File not found in output.' });
    });
});

// Serve the downloaded files
app.use('/downloads', express.static(downloadsDir));

// Add a route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube to MP3 Converter API!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
