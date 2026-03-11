const cookieMonster = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const nanoid = require('nanoid');
const app = express();
require('dotenv').config();

const port = process.env.PORT;
const apiRouter = express.Router();
const devMode = process.env.NODE_ENV;

// eventually, these will be stored in a database, not in memory
const users = [];
const rooms = [];
const skins = {
    list: [
        { id: "Grape", fill: "#9922FF", outline: "#BBB" },
        { id: "Magma", fill: "#FF4500", outline: "#330000" },
        { id: "Bonsai", fill: "#4A5D23", outline: "#D2B48C" },
        { id: "Glacier", fill: "#E0FFFF", outline: "#4682B4" },
        { id: "Abyss", fill: "#000015", outline: "#00FFFF" },
        { id: "Marigold", fill: "#FFB800", outline: "#7B3F00" },
        { id: "Bubblegum", fill: "#FF85D1", outline: "#B02E82" },
        { id: "Minty", fill: "#AAF0D1", outline: "#16A085" },
        { id: "Voltage", fill: "#FFFF00", outline: "#000" },
        { id: "Titanium", fill: "#D1D1D1", outline: "#FFF" },
        { id: "Hazard", fill: "#FC0", outline: "#222" },
        { id: "Blueprint", fill: "#0047AB", outline: "#E0E0E0" },
        { id: "Carbon", fill: "#2B2B2B", outline: "#555" },
        { id: "Nebula", fill: "#2E0854", outline: "#F0F" },
        { id: "Supernova", fill: "#FFF", outline: "#FFA500" },
        { id: "Ghost", fill: "#FFF", outline: "#ABC123" },
    ]
}

async function createUser(userName, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        password: passwordHash,
        userName: userName,
        skin: skins.list[0],
        times: { it: 0, notIt: 0, wins: 0, losses: 0 }
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
    res.cookie('token', user.token, {
        path: '/',
        secure: !devMode,
        httpOnly: true,
        sameSite: devMode ? 'lax' : 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    });
}

// Delete the current token from the user and the browser cookie
function clearAuthCookie(res, user) {
    delete user.token;
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
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) clearAuthCookie(res, user);
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
    res.send(skins);
});

// Change Skin
app.put('/api/skins', protect, async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        const id = req.body.id;
        let current;
        for (const thing of skins.list) {
            if (id === thing.id) {
                current = thing;
                break;
            }
        }
        user.skin = current;
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
        playerInit: []
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
    if (type != null) {
        if (type === 'it') user.times.it += time;
        else user.times.notIt += time;
        msg = 'Saved times';
    } else {
        if (req.body.win === true) user.times.wins += 1;
        else user.times.losses += 1;
        msg = 'Saved win/loss';
    }
    res.send(JSON.stringify({msg}));
});

app.listen(port, () => {
    if (devMode) console.log(`Listening on port ${port}`);
});