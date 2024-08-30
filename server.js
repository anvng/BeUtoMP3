const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration: Update origin if needed for deployment
app.use(cors({
    origin: '*', // Adjust this to the allowed origin(s) if deploying publicly
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

app.post('/convert', (req, res) => {
    const youtubeLink = req.body.link;

    if (!youtubeLink) {
        return res.status(400).json({ message: 'YouTube link is required' });
    }

    // Handle the output path to avoid file name issues
    const outputPath = path.join(downloadsDir, '%(title)s.%(ext)s');
    const command = `yt-dlp "${youtubeLink}" --extract-audio --audio-format mp3 --output "${outputPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Conversion failed', details: error.message });
        }
        if (stderr) {
            console.error('stderr:', stderr);
            return res.status(500).json({ message: 'Conversion failed', details: stderr });
        }

        // Extract the file name from the output if possible
        // Adjust this if yt-dlp provides the filename in stdout or use a known pattern
        const fileName = 'example.mp3'; // You'll need to dynamically determine this
        const fileUrl = `http://${req.headers.host}/downloads/${fileName}`;
        
        res.status(200).json({ message: 'Conversion successful!', file: fileUrl });
    });
});

app.use('/downloads', express.static(downloadsDir));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
