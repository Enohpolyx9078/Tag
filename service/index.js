const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});