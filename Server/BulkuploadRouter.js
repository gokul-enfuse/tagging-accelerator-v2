let express = require('express');
let multer = require('multer');
let unzipper = require('unzipper');
let fs = require('fs');

let routers = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: process.env.TAGGINGSERVERPATH });

// Handle file upload
routers.post('/zipextraction', upload.single('zipFile'), async (req, res) => {
  //console.log(req)
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Extract the uploaded zip file
  const extractPath = `${process.env.TAGGINGSERVERPATH}/${file.filename}_extracted`;
  fs.createReadStream(file.path)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on('close', () => {
      console.log('Zip file extracted successfully');
      res.send('File uploaded and extracted successfully');
    })
    .on('error', (err) => {
      console.error('Error extracting zip file:', err);
      res.status(500).send('Error extracting zip file');
    });
});


module.exports = routers;
