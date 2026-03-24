class GameReceiver {
    constructor() {
        this.socket;
    }

    start(roomId, user, setPlayerInit) {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.socket.send(JSON.stringify({type: "JOIN", roomId: roomId, user: user}));
        };
        this.socket.onmessage = async (msg) => {
            const init = JSON.parse(msg.data);
            setPlayerInit(init.playerInit);
            localStorage.setItem("you", init.you);
        };
        // Add these to catch exactly what is going wrong
        this.socket.onclose = (event) => {
            console.warn(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket encountered an error:", error);
        };
    }
}

const Receiver = new GameReceiver();
export { Receiver };
