import React from 'react';
import './game-screen.css';
import { NavLink, useSearchParams } from 'react-router-dom';
import { LocalArena } from './local-arena.jsx';
import { Arena } from './arena.jsx';
import { Timer } from './timers.jsx';
import { LocalLeft, OnlineLeft } from './left-bar.jsx';
import { Controller } from './controller.jsx';

export function Game({ userName }) {
    const [it, setIt] = React.useState(0);
    const [popping, setPopping] = React.useState(-1);
    const [itClass, setItClass] = React.useState("it");
    const [gameOver, setGameOver] = React.useState(false);
    const [winner, setWinner] = React.useState(-1);
    const [request] = useSearchParams();
    const roomCode = localStorage.getItem("roomCode");
    const twoPlayer = React.useRef(request.get("twoPlayer") == 'true');
    const size = 50; // player size

    // placeholder stuff made with help from Gemini 3
    // placeholder for websocket features later

    const playerInit = JSON.parse(localStorage.getItem("playerInit"));
    const you = React.useRef(0);
    const numPlayers = React.useRef(playerInit.length);

    const [p1Position, setP1Position] = React.useState({ x: 10, y: 10, time: performance.now(), name: playerInit[you.current].name });
    const [p2Position, setP2Position] = React.useState({ x: 429, y: 429, time: performance.now(), name: playerInit[1]?.name });
    const [p3Position, setP3Position] = React.useState({ x: 429, y: 10, time: performance.now(), name: playerInit[2]?.name });
    const [p4Position, setP4Position] = React.useState({ x: 10, y: 429, time: performance.now(), name: playerInit[3]?.name });

    const skin = playerInit[you.current].skin;
    const skin2 = playerInit[1]?.skin;
    const skin3 = playerInit[2]?.skin;
    const skin4 = playerInit[3]?.skin;

    const players = [p1Position];
    const setters = [setP1Position];
    const skins = [skin];

    if (numPlayers.current >= 2) {
        players.push(p2Position);
        setters.push(setP2Position);
        skins.push(skin2);
    }
    if (numPlayers.current >= 3) {
        players.push(p3Position);
        setters.push(setP3Position);
        skins.push(skin3);
    }
    if (numPlayers.current >= 4) {
        players.push(p4Position);
        setters.push(setP4Position);
        skins.push(skin4);
    }

    return (
        <main className="md:flex md:flex-col md:flex-row md:justify-evenly gap-4">
            <Controller it={it} setIt={setIt} setPopping={setPopping} players={players} size={size} itClass={itClass} setItClass={setItClass} gameOver={gameOver} setGameOver={setGameOver} setWinner={setWinner} />
            <section className="mb-2 md:mb-0 md:grow-1 sidebar-thin card-thin">
                {twoPlayer.current ? <LocalLeft you={you} skin={skin2} it={it} gameOver={gameOver} /> : <OnlineLeft players={players} skins={skins} roomCode={roomCode} it={it} itClass={itClass} />}
            </section>
            <section>
                {twoPlayer.current ? <LocalArena you={you} players={players} setters={setters} skins={skins} it={it} setIt={setIt} popping={popping} size={size} itClass={itClass} gameOver={gameOver} winner={winner} /> : <Arena you={you} players={players} setters={setters} skins={skins} it={it} setIt={setIt} popping={popping} size={size} itClass={itClass} gameOver={gameOver} winner={winner} />}
            </section>
            <section className="md:grow-1 sidebar-thin card-thin">
                <div className="flex flex-col flex-row flex-wrap items-center mb-4">
                    <svg className="skin-icon mr-4">
                        <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                    </svg>
                    <p>{userName}</p>
                </div>
                <h3 className="text-xl">Stats</h3>
                <div className="flex flex-col gap-2 mb-2">
                    <Timer label="Time it:" you={you} it={it} id={0} gameOver={gameOver} popping={popping} />
                    <Timer label="Time not it:" you={you} it={it} id={0} gameOver={gameOver} popping={popping} />
                </div>
                <NavLink className="outline-button" to="/profile">Leave Game</NavLink>
            </section>
        </main>
    );
}