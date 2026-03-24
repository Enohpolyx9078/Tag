class GameReceiver {
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
                    console.log("Left room");
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
}

const Receiver = new GameReceiver();
export { Receiver };
