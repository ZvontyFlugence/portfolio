const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname, 'public'));

// Handle PRODUCTION
if (process.env.NODE_ENV === 'production') {
  // Static Folder
  app.use(express.static(__dirname + '/dist/'));

  //  Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/dist/index.html'));
}

app.listen(port, () => console.log(`Server started on port ${port}`));

