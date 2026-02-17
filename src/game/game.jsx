import React from 'react';
import './game-screen.css';
import { NavLink, useSearchParams } from 'react-router-dom';
import { LocalArena } from './local-arena.jsx';
import { Arena } from './arena.jsx';
import { Timer } from './timers.jsx';
import { LocalLeft, OnlineLeft } from './left-bar.jsx';
import { Controller } from './controller.jsx';

export function Game({ userName, skin }) {
    const [it, setIt] = React.useState(0);
    const [popping, setPopping] = React.useState(-1);
    const [itClass, setItClass] = React.useState("it");
    const [gameOver, setGameOver] = React.useState(false);
    const [request] = useSearchParams();
    const roomCode = localStorage.getItem("roomCode");
    const size = 50; // player size

    // placeholder for websocket features later
    const you = React.useRef(0);
    const [p1Position, setP1Position] = React.useState({ x: 10, y: 10, time: performance.now(), name: userName});
    const [p2Position, setP2Position] = React.useState({ x: 429, y: 429, time: performance.now(), name:"Guest"});
    const [winner, setWinner] = React.useState(-1);
    const skinList = JSON.parse(localStorage.getItem("skins"));
    const skin2 = React.useRef(skinList.skins[Math.floor(Math.random() * skinList.skins.length) - 1]);
    const players = [p1Position, p2Position];
    const setters = [setP1Position, setP2Position];
    const skins = [skin, skin2.current];

    return (
        <main className="md:flex md:flex-col md:flex-row md:justify-evenly gap-4">
            <Controller it={it} setIt={setIt} setPopping={setPopping} players={players} size={size} itClass={itClass} setItClass={setItClass} setGameOver={setGameOver} setWinner={setWinner}/>
            <section className="mb-2 md:mb-0 md:grow-1 sidebar-thin card-thin">
                {request.get('twoPlayer') == 'true' ? <LocalLeft you={you} skin={skin2.current} it={it} gameOver={gameOver} /> : <OnlineLeft skin={skin2.current} roomCode={roomCode} />}
            </section>
            <section>
                {request.get('twoPlayer') == 'true' ? <LocalArena you={you} players={players} setters={setters} skins={skins} it={it} setIt={setIt} popping={popping} size={size} itClass={itClass} gameOver={gameOver} winner={winner}/> : <Arena skin={skin} it={it} />}
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
                    <Timer label="Time it:" you={you} it={it} id={0} gameOver={gameOver} />
                    <Timer label="Time not it:" you={you} it={it} id={0} gameOver={gameOver} />
                </div>
                <NavLink className="outline-button" to="/profile">Leave Game</NavLink>
            </section>
        </main>
    );
}