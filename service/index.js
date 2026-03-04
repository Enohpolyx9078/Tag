const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
var apiRouter = express.Router();

app.use(express.json());
app.use(cookieMonster());
app.use(express.static('public'));
app.use(`/api`, apiRouter);

/*
    TODO: Set up the endpoints
    Login (PUT)
    Logout (DELETE)
    Create (POST)
    Change Skin (PUT)
    Join Game (GET)
    Create Game (POST)
    2 Player Game (POST)
    Start Game (GET)
    Leave Game (GET)
*/

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});