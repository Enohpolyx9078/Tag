const { WebSocketServer } = require('ws');

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
                            theClient.roomId = roomId;
                            theClient.userName = user.userName;
                            //TODO prevent the same user from joining the room twice
                            room.playerInit.push({ name: user.userName, skin: user.skin });
                            room.clients.push(theClient);
                            const you = room.playerInit.length - 1;

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
                        }
                        break;
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
                            if (player !== theClient) player.send(JSON.stringify({ playerInit: room.playerInit, type: "UPDATE", you: i }));
                        };
                        break;
                    default:
                        theClient.send(JSON.stringify({ message: "Unknown action: " + type }));
                }

            } catch (err) {
                console.error("Error:", err.message);
                theClient.close();
            }
        });
        // Respond to pong messages by marking the connection alive
        theClient.on('pong', () => {
            theClient.isAlive = true;
        });
    });

    // Periodically send out a ping message to make sure clients are alive
    setInterval(() => {
        socketServer.clients.forEach(function each(client) {
            if (client.isAlive === false) return client.terminate();

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

module.exports = { gameProxy };
