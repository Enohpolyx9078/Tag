const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const tokenName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const apiRouter = express.Router();

const users = []; // eventually, this will be stored in a database, not in memory

async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
    };
    users.push(user);
    return user;
}

function getUser(field, value) {
    if (value) {
        return users.find((user) => user[field] === value);
    }
    return null;
}

// Create a token for the user and send a cookie containing the token
function setAuthCookie(res, user) {
    user.token = uuid.v4();
    res.cookie(tokenName, user.token, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // one month
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

// Delete the current token from the user and the browser cookie
function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie(tokenName);
}

app.use(express.json());
app.use(cookieMonster());
app.use(express.static('public'));
app.use(`/api`, apiRouter);

/*
    TODO: Set up the endpoints
    Login (PUT)
    Logout (DELETE)
    Create Account(POST)
    Change Skin (PUT)
    Join Game (GET)
    Create Game (POST)
    2 Player Game (POST)
    Start Game (GET)
    Leave Game (GET)
*/

// Create Account
app.post('/api/auth', async (req, res) => {
  if (await getUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user);
    res.send({ email: user.email });
  }
});

// Login
app.put('/api/auth', async (req, res) => {
  const user = await getUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Logout
app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }
  res.send({});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});