class GameReceiver {
    constructor() {
        this.socket;
    }

    start(roomId, user, setPlayerInit) {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.socket.send(JSON.stringify({ type: "JOIN", roomId: roomId, user: user }));
        };
        this.socket.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            const { type, playerInit } = data;

            switch (type) {
                case "JOIN":
                    const { you } = data;
                    setPlayerInit(playerInit);
                    localStorage.setItem("you", you);
                    break;
                case "ADD":
                    console.log(JSON.stringify(playerInit));
                    setPlayerInit(playerInit);
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
}

const Receiver = new GameReceiver();
export { Receiver };
