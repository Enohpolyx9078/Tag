import React from 'react';
import './game-screen.css';
import { Player } from './player.jsx';
import { GameOver } from './game-over.jsx';

export function Arena({ you, players, setters, skins, it, popping, size, itClass, gameOver, winner }) {
    // players will be a list of Position objects                    -> [{x:1, y:1, time:1000}]
    // setters will be a list of methods that is 1:1 to players      -> [setter1, setter2]
    // setters will be a list of Skin objects that is 1:1 to players -> [skin1, skin2]

    const [finalScreen, setFinalScreen] = React.useState(false);

    // set up players
    const [setP1Position, setP2Position, setP3Position, setP4Position] = setters;

    const playerList = (() => {
        const list = [];
        for (var i = 0; i < players.length; i++) {
            list.push(
                <Player key={i} id={i} it={it} position={players[i]} skin={skins[i]} size={size} popping={popping} itClass={itClass} />
            )
        }
        return list;
    })();

    // set up size constraints
    const fieldSize = 500;
    const padding = (3 * 2) + 5; // the border (3) of the character and the arena (5)
    const edge = fieldSize - size - padding;
    const speed = 0.4;

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    const p1Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    // Made with some help from Gemini 3
    const animate = async (updateFrame, keys) => {
        updateFrame((prev) => {
            let { x, y, time, name } = prev;
            // use delta Time for position change instead of move speed
            const deltaT = performance.now() - time;
            const distance = speed * deltaT;

            const moveUp = () => {
                if (y - distance < 0) y = 0;
                else y -= distance;
            }

            const moveDown = () => {
                if (y + distance > edge) y = edge;
                else y += distance;
            }

            const moveLeft = () => {
                if (x - distance < 0) x = 0;
                else x -= distance;
            }

            const moveRight = () => {
                if (x + distance > edge) x = edge;
                else x += distance;
            }

            if (keysPressed.current[keys[0]]) moveUp();
            if (keysPressed.current[keys[1]]) moveDown();
            if (keysPressed.current[keys[2]]) moveLeft();
            if (keysPressed.current[keys[3]]) moveRight();

            return { x: x, y: y, time: performance.now(), name: name };
        });

        requestRef.current = requestAnimationFrame(() => animate(updateFrame, keys));
    }

    // placeholder movement code for Websocket stuff later
    const animateBot = async (updateFrame, count, dir, wait) => {
        updateFrame((prev) => {
            let { x, y, time, name } = prev;
            // use delta Time for position change instead of move speed
            const deltaT = performance.now() - time;
            const distance = speed * deltaT;

            const moveUp = () => {
                if (y - distance < 0) y = 0;
                else y -= distance;
            }

            const moveDown = () => {
                if (y + distance > edge) y = edge;
                else y += distance;
            }

            const moveLeft = () => {
                if (x - distance < 0) x = 0;
                else x -= distance;
            }

            const moveRight = () => {
                if (x + distance > edge) x = edge;
                else x += distance;
            }

            if (count % wait == 0) {
                dir = Math.floor(Math.random() * 4);
                wait = Math.round(Math.random() * 120);
            }

            if (dir == 0) moveUp();
            if (dir == 1) moveDown();
            if (dir == 2) moveLeft();
            if (dir == 3) moveRight();

            return { x: x, y: y, time: performance.now(), name: name };
        });

        requestRef.current = requestAnimationFrame(() => animateBot(updateFrame, count + 1, dir, wait));
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(() => animate(setP1Position, p1Keys));
        if (players.length >= 2) requestRef.current = requestAnimationFrame(() => animateBot(setP2Position, 0, 0, 60));
        if (players.length >= 3) requestRef.current = requestAnimationFrame(() => animateBot(setP3Position, 0, 0, 120));
        if (players.length >= 4) requestRef.current = requestAnimationFrame(() => animateBot(setP4Position, 0, 0, 30));
        const gameKeys = p1Keys;
        const down = (e) => {
            if (gameKeys.includes(e.key)) e.preventDefault();
            keysPressed.current[e.key] = true;
        };
        const up = (e) => {
            if (gameKeys.includes(e.key)) e.preventDefault();
            keysPressed.current[e.key] = false;
        };

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        }
    }, []);

    React.useEffect(() => {
        if (gameOver) {
            setTimeout(() => {
                setFinalScreen(true);
                let times = localStorage.getItem("times");
                times = times == null ? { it: 0, notIt: 0, wins: 0, losses: 0 } : JSON.parse(times);
                if (winner == you.current) times.wins = (times.wins == null) ? 1 : (times.wins + 1);
                else times.losses = (times.losses == null) ? 1 : (times.losses + 1);
                localStorage.setItem("times", JSON.stringify(times));
            }, 2000);
        }
    }, [gameOver]);

    async function buttonDown(btn) {
        for (let i = 0; i < btn.length; i++) keysPressed.current[btn[i]] = true;
    }

    async function buttonUp(btn) {
        for (let i = 0; i < btn.length; i++) keysPressed.current[btn[i]] = false;
    }

    return (
        <div id="arena" className="flex flex-row items-center">
            <div className="arena-wrapper grow-0 mb-2 md:mb-0">
                <div className="arena relative mb-2 md:mb-0">
                    {finalScreen ? <GameOver players={players} skins={skins} winner={winner} /> : playerList}
                </div>
            </div>
            <div className="grow-1 touch-controls m-2 card">
                <div className="flex justify-center">
                    <div className="flex flex-row items-end">
                        <div className="touch-button touch-button-small main-button" onPointerDown={() => buttonDown(['ArrowUp', 'ArrowLeft'])} onPointerUp={() => buttonUp(['ArrowUp', 'ArrowLeft'])} onPointerLeave={() => buttonUp(['ArrowUp', 'ArrowLeft'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-315" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                        <div className="touch-button main-button" onPointerDown={() => buttonDown(['ArrowUp'])} onPointerUp={() => buttonUp(['ArrowUp'])} onPointerLeave={() => buttonUp(['ArrowUp'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                        <div className="touch-button touch-button-small main-button" onPointerDown={() => buttonDown(['ArrowUp', 'ArrowRight'])} onPointerUp={() => buttonUp(['ArrowUp', 'ArrowRight'])} onPointerLeave={() => buttonUp(['ArrowUp', 'ArrowRight'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-45" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="touch-button main-button" onPointerDown={() => buttonDown(['ArrowLeft'])} onPointerUp={() => buttonUp(['ArrowLeft'])} onPointerLeave={() => buttonUp(['ArrowLeft'])}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-270" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                    </div>
                    <div className="touch-spacer"></div>
                    <div className="touch-button main-button" onPointerDown={() => buttonDown(['ArrowRight'])} onPointerUp={() => buttonUp(['ArrowRight'])} onPointerLeave={() => buttonUp(['ArrowRight'])}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-90" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                    </div>
                </div>
                <div className="flex justify-around">
                    <div className="flex flex-row items-start">
                        <div className="touch-button touch-button-small main-button" onPointerDown={() => buttonDown(['ArrowDown', 'ArrowLeft'])} onPointerUp={() => buttonUp(['ArrowDown', 'ArrowLeft'])} onPointerLeave={() => buttonUp(['ArrowDown', 'ArrowLeft'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-225" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                        <div className="touch-button main-button" onPointerDown={() => buttonDown(['ArrowDown'])} onPointerUp={() => buttonUp(['ArrowDown'])} onPointerLeave={() => buttonUp(['ArrowDown'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-180" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                        <div className="touch-button touch-button-small main-button" onPointerDown={() => buttonDown(['ArrowDown', 'ArrowRight'])} onPointerUp={() => buttonUp(['ArrowDown', 'ArrowRight'])} onPointerLeave={() => buttonUp(['ArrowDown', 'ArrowRight'])}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-caret-up-fill rotate-135" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}