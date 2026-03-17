const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const nanoid = require('nanoid');
const app = express();
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

require('dotenv').config();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const apiRouter = express.Router();
const devMode = process.env.NODE_ENV;

// setup database
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('PlayTag');
const users = db.collection('users');
const skins = db.collection('skins');

const rooms = [];

async function fetchSkins() {
    const cursor = await skins.find({})
    const list = await cursor.toArray();
    return list[0];
}

async function createUser(userName, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const skinsList = await fetchSkins();
    const user = {
        password: passwordHash,
        userName: userName,
        skin: skinsList.list[0],
        times: { it: 0, notIt: 0, wins: 0, losses: 0 }
    };
    await users.insertOne(user);
    return user;
}

 async function getUser(field, value) {
    if (value) {
        const query = field === "userName" ? { userName: value } : { token: value };
        const cursor = users.find(query); // call with no params to get all records
        const result = await cursor.toArray();
        return result ? result[0] : null;
    }
    return null;
}

// Create a token for the user and send a cookie containing the token
async function setAuthCookie(res, user) {
    user.token = uuid.v4();
    await users.updateOne( { userName: user.userName }, { $set: user });
    res.cookie('token', user.token, {
        path: '/',
        secure: !devMode,
        httpOnly: true,
        sameSite: devMode ? 'lax' : 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    });
}

// Delete the current token from the user and the browser cookie
async function clearAuthCookie(res, user) {
    await users.updateOne( { userName: user.userName }, { $unset: {token : null} });
    res.clearCookie('token');
}

const protect = async (req, res, next) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) next();
    else res.status(401).send({ msg: 'Unauthorized' });
}

app.use(express.json());
app.use(cookieMonster());
app.use(express.static('public'));
app.use(`/api`, apiRouter);

// Create Account
app.post('/api/auth', async (req, res) => {
    if (await getUser('userName', req.body.userName)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.userName, req.body.password);
        await setAuthCookie(res, user);
        res.send({ userName: user.userName });
    }
});

// Login
app.put('/api/auth', async (req, res) => {
    const user = await getUser('userName', req.body.userName);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        await setAuthCookie(res, user);
        res.send({ userName: user.userName });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout
app.delete('/api/auth', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) await clearAuthCookie(res, user);
    res.send({});
});

// Get User
app.get('/api/user', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        const { password, token, ...data } = user;    // remove password and token from the response
        res.send(data);
    } else {
        res.status(400).send({ msg: 'Bad Request' });
    }
});

// Get Skins
app.get('/api/skins', protect, async (req, res) => {
    const thing = await fetchSkins();
    res.send(thing);
});

// Change Skin
app.put('/api/skins', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        const id = req.body.id;
        let current;
        const skinList = await fetchSkins();
        for (const thing of skinList.list) {
            if (id === thing.id) {
                current = thing;
                break;
            }
        }
        user.skin = current;
        await users.updateOne( { userName: user.userName }, { $set: user });
        res.send(current);
    } else {
        res.status(400).send({ msg: 'Bad Request' });
    }
});

// Create Room
app.post('/api/rooms', protect, async (req, res) => {
    const alphabet = '23456789ABCDEFGHJKNPQRSTVWXYZ';
    const generateRoomCode = nanoid.customAlphabet(alphabet, 6);
    const newCode = generateRoomCode();
    let codeUsed;
    do {
        codeUsed = false;
        if (rooms.find((room) => room['code'] === newCode)) {
            codeUsed = true;
            newCode = generateRoomCode();
        }
    } while (codeUsed);
    const newRoom = {
        code: newCode,
        playerInit: [],
        rain: req.body.rain
    }
    rooms.push(newRoom);
    res.send({ code: newCode });
});

// Get Room
app.get('/api/rooms/:code', protect, async (req, res) => {
    const room = rooms.find((r) => r['code'] === req.params.code);
    if (!room) res.status(404).send({ msg: "Could not find room" });
    else res.send(room);
});

// Join Room
app.put('/api/rooms', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    const room = rooms.find((r) => r['code'] === req.body.code);
    if (!room) res.status(404).send({ msg: "Could not find room " + req.body.code });
    else {
        if (room.playerInit.length < 4) {
            //TODO prevent the same user from joining the room twice
            room.playerInit.push({ name: user.userName, skin: user.skin });
            const you = room.playerInit.length - 1;
            res.send({ ...room, you: you });
        } else res.status(409).send({ msg: "Room is full" });
    };
});

// Leave Room
app.delete('/api/rooms', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    const room = rooms.find((r) => r['code'] === req.body.code);
    if (!room) res.status(404).send({ msg: "Could not find room " + req.body.code });
    else {
        for (let i = 0; i < room.playerInit.length; i++) {
            let current = room.playerInit[i];
            if (current.name === user.userName) {
                room.playerInit.splice(i, 1);
                break;
            }
        }
        res.send({ msg: "Left room" });
    };
});

// Save Stats
app.put('/api/stats', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    const time = req.body.time;
    const type = req.body.curType;
    let msg;
    let update;
    if (type != null) {
        if (type === 'it') update = { "times.it": user.times.it + time };
        else  update = { "times.notIt": user.times.notIt + time };
        msg = 'Saved times';
    } else {
        if (req.body.win === true) update = { "times.wins": user.times.wins + 1 };
        else update = { "times.losses": user.times.losses + 1 };
        msg = 'Saved win/loss';
    }
    await users.updateOne( { userName: user.userName }, { $set: update });
    res.send(JSON.stringify({msg}));
});

app.listen(port, () => {
    if (devMode) console.log(`Listening on port ${port}`);
});