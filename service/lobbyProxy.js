const { WebSocketServer } = require('ws');

// Expects rooms to be a global Map
function lobbyProxy(httpServer, rooms) {
    // Create a websocket object
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (theClient) => {
        theClient.isAlive = true;

        theClient.on('message', function message(raw) {
            try {
                const data = JSON.parse(raw);
                const { type } = data;

                // Add player to the Room Map
                switch (type) {
                    case "JOIN":
                        const { roomId, user } = data;
                        const room = rooms.get(roomId);
                        if (room && room.playerInit.length < 4) {
                            //TODO prevent the same user from joining the room twice
                            room.playerInit.push({ name: user.userName, skin: user.skin });
                            room.clients.push(theClient);
                            const you = room.playerInit.length - 1;

                            // Send state back to the client
                            const { clients, ...state } = room;
                            theClient.send(JSON.stringify({ ...state, you: you, type: "JOIN" }));

                            // Tell the other clients someone has joined
                            room.clients.forEach((player) => {
                                if (player !== theClient) player.send(JSON.stringify({playerInit: room.playerInit, type: "ADD"}));
                            });
                        }
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

module.exports = { lobbyProxy };
