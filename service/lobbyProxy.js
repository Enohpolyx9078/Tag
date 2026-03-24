const { WebSocketServer } = require('ws');

// Expects rooms to be a global Map
function lobbyProxy(httpServer) {
    // Create a websocket object
    console.log("Building websocket...");
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (theClient) => {
        console.log("Connection received");
        theClient.isAlive = true;

        try {
            // 1. message is a Buffer, so convert it to a string and parse it directly
            const data = JSON.parse(message.toString());
            const { roomId, user } = data;

            // Add player to the Room Map
            const room = rooms.get(roomId);
            if (room && room.playerInit.length < 4) {
                //TODO prevent the same user from joining the room twice
                room.playerInit.push({ name: user.userName, skin: user.skin });
                const you = room.playerInit.length - 1;

                // Send state back to the client
                theClient.send(JSON.stringify({ ...room, you: you }));
            }
            //TODO let other clients know someone has joined

        } catch (err) {
            // 2. Catch parse errors so your server doesn't crash!
            console.error("Received malformed JSON:", err.message);
        }

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
