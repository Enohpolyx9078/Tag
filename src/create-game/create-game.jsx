import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchRoom, joinRoom, leaveRoom } from '../lib/lib-requests';

export function CreateGame() {
    // playerInit will hold these objects {name: String, skin: skin}
    const [playerInit, setPlayerInit] = React.useState([]);
    const roomCode = React.useRef(localStorage.getItem("roomCode"));
    const nav = useNavigate();

    React.useEffect(() => {
        async function effectHelper() {
            const init = await joinRoom(roomCode.current);
            setPlayerInit(init.playerInit);
            localStorage.setItem("you", init.you);
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

    // made with help from Gemini 3
    /* React.useEffect(() => {
        const timeouts = [];

        const addPlayer = (name, delay) => {
            const id = setTimeout(() => {
                setPlayerInit((prev) => {
                    const newList = [
                        ...prev,
                        {
                            name: name,
                            skin: { id: "Bot", fill: "#000000", outline: "#ffffff" }
                        }
                    ]
                    localStorage.setItem("playerInit", JSON.stringify(newList));
                    return newList;
                });
            }, delay);
            timeouts.push(id);
        };

        addPlayer("Guest", 3000);
        addPlayer("BoweryMoney3250", 5000);
        addPlayer("MandyCandy", 7000);

        return () => timeouts.forEach(id => clearTimeout(id)); // Prevent memory leaks
    }, [setPlayerInit]); // Include setter in dependencies */

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