const { WebSocketServer } = require('ws');

const TICK_RATE = 30;
const SIZE = 50; // player size

function checkCollisions(players, out, canTag) {
    let it = null;
    if (canTag) {
        for (let i = 0; i < players.length - 1; i++) {
            if (out.has(i)) continue;
            let p1Position = players[i];
            for (let j = i + 1; j < players.length; j++) {
                if (out.has(j)) continue;
                let p2Position = players[j];
                // check if x overlaps
                let leftEdge = Math.max(p1Position.x, p2Position.x);
                let rightEdge = Math.min(p1Position.x + SIZE, p2Position.x + SIZE);
                let xOverlap = rightEdge - leftEdge >= 0;
                // check if y overlaps
                let topEdge = Math.max(p1Position.y, p2Position.y);
                let bottomEdge = Math.min(p1Position.y + SIZE, p2Position.y + SIZE);
                let yOverlap = bottomEdge - topEdge >= 0;
                // if both overlap, they collided
                if (xOverlap && yOverlap) {
                    if (it == j) it = i;
                    else if (it == i) it = j;
                    canTag = false;
                    itCooldown(canTag);
                }
            }
        }
    }
    return it;
}

function itCooldown(canTag) {
    canTag = false;
    setTimeout(() => canTag = true, 500);
}

function startRoomTick(rooms, roomId) {
    const room = rooms.get(roomId);
    if (!room || room.state == "ACTIVE") return;
    room.state = "ACTIVE";
    const numPlayers = room.clients.length;
    room.remoteUpdate = { 0: { x: 10, y: 10 }, 1: { x: 429, y: 429 } };
    if (numPlayers >= 3) room.remoteUpdate[2] = { x: 429, y: 10 };
    if (numPlayers >= 4) room.remoteUpdate[3] = { x: 10, y: 429 };
    room.tickInterval = setInterval(() => {
        // 1. kill the interval to save CPU
        if (room.clients.size === 0 || room.state === "FINISH") {
            clearInterval(room.tickInterval);
            rooms.delete(roomId);
            return;
        }

        // 2. Prepare the payload for ONLY this room
        //TODO handle collision logic
        //TODO broadcast "it" to all players
        const state = room.remoteUpdate;

        // 3. Broadcast only to players in THIS room
        room.clients.forEach(player => {
            player.send(JSON.stringify({ type: 'TICK', state }));
        });
    }, TICK_RATE);
}

// Expects rooms to be a global Map
function gameProxy(httpServer, rooms) {

    // Create a websocket object
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (theClient) => {
        theClient.isAlive = true;

        theClient.on('message', function message(raw) {
            try {
                const data = JSON.parse(raw);
                const { type } = data;
                let room;

                // Add player to the Room Map
                switch (type) {
                    case "JOIN":
                        const { roomId, user } = data;
                        room = rooms.get(roomId);
                        if (room && room.playerInit.length < 4) {
                            //TODO prevent the same user from joining the room twice
                            room.playerInit.push({ name: user.userName, skin: user.skin });
                            const you = room.playerInit.length - 1;
                            theClient.roomId = roomId;
                            theClient.userName = user.userName;
                            theClient.you = you;
                            room.clients.push(theClient);
                            // Send state back to the client
                            const { clients, ...state } = room;
                            theClient.send(JSON.stringify({ ...state, you: you, type: "UPDATE" }));

                            // Tell the other clients someone has joined
                            room.clients.forEach((player) => {
                                if (player !== theClient) player.send(JSON.stringify({ playerInit: room.playerInit, type: "UPDATE" }));
                            });
                        } else if (room && room.playerInit.length >= 4) {
                            //TODO handle rooms being full
                            theClient.send(JSON.stringify({ message: "Room is full", type: "ERROR" }));
                        } else {
                            //TODO handle the room not existing
                        }
                        break;
                    // Remove a player from the room
                    case "LEAVE":
                        room = rooms.get(theClient.roomId);
                        if (room) {
                            for (let i = 0; i < room.playerInit.length; i++) {
                                let current = room.playerInit[i];
                                if (current.name === theClient.userName) {
                                    room.playerInit.splice(i, 1);
                                    room.clients.splice(i, 1);
                                    break;
                                }
                            }
                        };
                        theClient.send(JSON.stringify({ type: "LEAVE", msg: "Left room" }));
                        for (var i = 0; i < room.clients.length; i++) {
                            let player = room.clients[i];
                            if (player !== theClient) {
                                player.you = i;
                                player.send(JSON.stringify({ playerInit: room.playerInit, type: "UPDATE", you: i }));
                            }
                        };
                        break;
                    // Start the game
                    case "START":
                        room = rooms.get(theClient.roomId);
                        room.clients.forEach(player => {
                            player.send(JSON.stringify({ type: 'STARTING' }));
                        });
                        startRoomTick(rooms, theClient.roomId);
                        break;
                    // Track movements
                    case "MOVE":
                        room = rooms.get(theClient.roomId);
                        const { x, y } = data
                        room.remoteUpdate[theClient.you] = { x, y };
                        break;
                    default:
                        theClient.send(JSON.stringify({ message: "Unknown action: " + type }));
                        break;
                }

            } catch (err) {
                console.error("Error:", err.message);
                theClient.close();
            }
        });
        // listen for on close so that empty rooms can be removed
        theClient.on('close', () => {
            const room = rooms.get(theClient.roomId);
            if (room) {
                for (let i = 0; i < room.playerInit.length; i++) {
                    let current = room.playerInit[i];
                    if (current.name === theClient.userName) {
                        room.playerInit.splice(i, 1);
                        room.clients.splice(i, 1);
                        break;
                    }
                }
            };
            theClient.send(JSON.stringify({ type: "LEAVE", msg: "Left room" }));
            for (var i = 0; i < room.clients.length; i++) {
                let player = room.clients[i];
                if (player !== theClient) {
                    player.you = i;
                    player.send(JSON.stringify({ playerInit: room.playerInit, type: "UPDATE", you: i }));
                }
            };
        });

        // Respond to pong messages by marking the connection alive
        theClient.on('pong', () => {
            theClient.isAlive = true;
        });
    });

    // Periodically send out a ping message to make sure clients are alive
    setInterval(() => {
        socketServer.clients.forEach(function each(client) {
            if (client.isAlive === false) {
                //TODO remove this client from their room
                return client.terminate();
            }

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

module.exports = { gameProxy };
