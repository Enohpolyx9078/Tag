const { WebSocketServer } = require('ws');

// Expects rooms to be a global Map
function gameProxy(httpServer) {
    // Create a websocket object
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (theClient) => {
        theClient.isAlive = true;

        theClient.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'JOIN') {
                const { roomId, playerId } = data;

                // Attach metadata to the socket itself
                theClient.roomId = roomId;
                theClient.playerId = playerId;

                // Add player to the Room Map
                const room = rooms.get(roomId);
                if (room && room.playerInit.length < 4) {
                    //TODO prevent the same user from joining the room twice
                    room.playerInit.push({ name: user.userName, skin: user.skin });
                    const you = room.playerInit.length - 1;
                    theClient.send({ ...room, you: you });
                }
            }

            if (data.type === 'MOVE') {
                const room = rooms.get(theClient.roomId);
                if (room) {
                    //TODO movement and collision logic
                    // updatePlayerPosition(room, theClient.playerId, data.coords);
                }
            }
        });

        // Respond to pong messages by marking the connection alive
        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    // Periodically send out a ping message to make sure clients are alive
    //TODO improve this so that every client doesn't ping every other client
    setInterval(() => {
        socketServer.clients.forEach(function each(client) {
            if (client.isAlive === false) return client.terminate();

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

module.exports = { gameProxy };
