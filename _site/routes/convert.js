const express = require('express');
const router = express.Router();
const downloader = require('../utils/downloader');

router.post('/', async (req, res) => {
  const videoUrl = req.body.link;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: 'YouTube link is required.' });
  }

  try {
    const downloadLink = await downloader.convertToMp3(videoUrl);
    res.json({ success: true, downloadLink });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).json({ success: false, message: 'Conversion failed.' });
  }
});

module.exports = router;
