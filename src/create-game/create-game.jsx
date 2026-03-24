import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRoom, fetchUser, joinRoom, leaveRoom } from '../lib/lib-requests';
import { Receiver } from '../gameReceiver';

export function CreateGame() {
    // playerInit will hold these objects {name: String, skin: skin}
    const [playerInit, setPlayerInit] = React.useState([]);
    const roomCode = React.useRef(localStorage.getItem("roomCode"));
    const nav = useNavigate();

    React.useEffect(() => {
        async function effectHelper() {
            //const init = await joinRoom(roomCode.current);
            const user = await fetchUser();
            Receiver.start(roomCode.current, user, setPlayerInit);
        }
        effectHelper();
    }, []);

    async function leave() {
        await leaveRoom(roomCode.current);
        nav('/profile');
    }

    async function start() {
        localStorage.setItem("playerInit", JSON.stringify(playerInit));
        nav('/game');
    }

    // placeholder stuff for WebSocket features later
    async function refresh() {
        const init = await fetchRoom(roomCode.current);
        setPlayerInit(init.playerInit);
    }

    return (
        <section className="flex-centered">
            <h2 className="centered text-2xl">Room: {roomCode.current}</h2>
            <div className="card md:w-100">
                <h2 className="centered text-xl">Players: {playerInit.length}/4</h2>
                <button onClick={() => refresh()} className="outline-button">Refresh</button>
                {/* Map loop made with help from Gemini 3 */}
                {playerInit.map((player, index) => (
                    <div key={index} className="flex flex-col flex-row flex-wrap items-center mb-4">
                        <svg className="skin-icon mr-4">
                            <rect
                                x="0" y="0" width="50" height="50"
                                stroke={player.skin.outline}
                                strokeWidth="6"
                                fill={player.skin.fill}
                            />
                        </svg>
                        <p>{player.name}</p>
                    </div>
                ))}
                <button onClick={() => start()} className="main-button" disabled={playerInit.length < 2}>Start Game</button>
                <button onClick={() => leave()} className="outline-button">Leave</button>
            </div>
        </section>
    );
}