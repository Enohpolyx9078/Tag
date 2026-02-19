import React from 'react';
import { NavLink } from 'react-router-dom';

export function CreateGame({ userName, skin, playerInit, setPlayerInit }) {

    // playerInit will hold these objects {name: String, skin: skin}
    const roomCode = localStorage.getItem("roomCode");
    const skins = JSON.parse(localStorage.getItem("skins"));

    // placeholder stuff for WebSocket features later
    // made with help from Gemini 3
    React.useEffect(() => {
        const timeouts = [];
        setPlayerInit([]);

        const addPlayer = (name, delay) => {
            const id = setTimeout(() => {
                setPlayerInit(prev => [
                    ...prev,
                    {
                        name: name,
                        skin: skins.skins[Math.floor(Math.random() * skins.skins.length)]
                    }
                ]);
            }, delay);
            timeouts.push(id);
        };

        addPlayer("Guest", 1000);
        addPlayer("BoweryMoney3250", 3000);
        addPlayer("MandyCandy", 7000);

        return () => timeouts.forEach(id => clearTimeout(id)); // Prevent memory leaks
    }, [setPlayerInit]); // Include setter in dependencies

    return (
        <section className="flex-centered">
            <h2 className="centered text-2xl">Room: {roomCode}</h2>
            <div className="card md:w-100">
                <h2 className="centered text-xl">Players</h2>
                <div className={"flex flex-col flex-row flex-wrap items-center mb-4 "}>
                    <svg className="skin-icon mr-4">
                        <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                    </svg>
                    <p>{userName}</p>
                </div>
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
                <NavLink className="main-button" to="/game">Start Game</NavLink>
                <NavLink className="outline-button" to="/profile">Leave</NavLink>
            </div>
        </section>
    );
}