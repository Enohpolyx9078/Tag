const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const tokenName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const apiRouter = express.Router();

const users = []; // eventually, this will be stored in a database, not in memory

async function createUser(userName, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        userName: userName,
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
    Change Skin (PUT)
    Join Game (GET)
    Create Game (POST)
    2 Player Game (POST)
    Start Game (GET)
    Leave Game (GET)
*/

// Create Account
app.post('/api/auth', async (req, res) => {
    if (await getUser('userName', req.body.userName)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.userName, req.body.password);
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    }
});

// Login
app.put('/api/auth', async (req, res) => {
    const user = await getUser('userName', req.body.userName);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        setAuthCookie(res, user);
        res.send({ userName: user.userName });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout
app.delete('/api/auth', async (req, res) => {
    const token = req.cookies[tokenName];
    const user = await getUser(tokenName, token);
    if (user) clearAuthCookie(res, user);
    res.send({});
});

// Get User
//TODO abscract securing this endpoint
app.get('/api/user', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ userName: user.userName });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});