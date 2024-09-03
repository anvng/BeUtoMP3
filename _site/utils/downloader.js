const ytdlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

const convertToMp3 = async (videoUrl) => {
  try {
    const outputFileName = '%(title)s.%(ext)s'; // Customize output format here
    const outputFilePath = path.join(__dirname, '..', 'downloads');

    // Ensure downloads directory exists
    if (!fs.existsSync(outputFilePath)) {
      fs.mkdirSync(outputFilePath);
    }

    // Execute yt-dlp command to download and convert video to mp3
    const result = await ytdlp(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: path.join(outputFilePath, outputFileName),
    });

    console.log('Download successful:', result);

    // Return the path to the downloaded file
    return path.join(outputFilePath, result._filename);
  } catch (error) {
    console.error('Error during download:', error);
    throw new Error('Conversion failed.');
  }
};

module.exports = { convertToMp3 };
