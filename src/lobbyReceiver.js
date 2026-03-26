class lobbyReceiver {
    constructor() {
        this.socket;
    }

    async start(roomId, user, setPlayerInit) {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.socket.send(JSON.stringify({ type: "JOIN", roomId: roomId, user: user }));
        };
        this.socket.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            const { type, playerInit, you } = data;

            switch (type) {
                case "UPDATE":
                    setPlayerInit(playerInit);
                    if (you != undefined) localStorage.setItem("you", you);
                    break;
                case "LEAVE":
                    this.socket.close();
                    break;
                case "STARTING":
                    console.log("Starting game");
                    break;
                case "TICK":
                    //TODO display updated movements
                    break;
                default:
                    alert("Something went wrong: " + data.message);
                    break;
            }
        };
        this.socket.onclose = (event) => {
            console.warn(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket encountered an error:", error);
        };
    }

    async leaveRoom() {
        this.socket.send(JSON.stringify({ type: "LEAVE" }));
    }

    async startGame() {
        this.socket.send(JSON.stringify({ type: "START" }));
    }

    async sendMove(desiredPosition) {
        this.socket.send(JSON.stringify({type: "MOVE", ...desiredPosition}));
    }
}

const Receiver = new lobbyReceiver();
export { Receiver };
