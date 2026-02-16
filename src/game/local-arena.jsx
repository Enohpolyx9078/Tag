import React from 'react';
import './game-screen.css';
import { Player } from './player.jsx';

export function LocalArena({ players, setters, skins, it, popping, size }) {
    // players will be a list of Position objects
    // [{x:1, y:1, time:1000}]
    // setters will be a list of methods that is 1:1 to players
    // [setter1, setter2]
    // setters will be a list of Skin objects that is 1:1 to players
    // [skin1, skin2]

    // set up two players
    const skin = skins[0];
    const skin2 = skins[1];
    const p1Position = players[0];
    const p2Position = players[1];
    const setP1Position = setters[0];
    const setP2Position = setters[1];

    // set up size constraints
    const fieldSize = 500;
    const padding = (3 * 2) + 5; // the border (3) of the character and the arena (5)
    const edge = fieldSize - size - padding;
    const speed = 0.4;

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    const p1Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const p2Keys = ['w', 's', 'a', 'd'];

    // Made with some help from Gemini 3
    const animate = async (updateFrame, keys) => {
        updateFrame((prev) => {
            let { x, y, time } = prev;
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

            return { x: x, y: y, time: performance.now() };
        });

        requestRef.current = requestAnimationFrame(() => animate(updateFrame, keys));
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(() => animate(setP1Position, p1Keys));
        requestRef.current = requestAnimationFrame(() => animate(setP2Position, p2Keys));
        const gameKeys = p1Keys.concat(p2Keys);
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

    return (
        <section className="arena relative mb-2 md:mb-0">
            <Player id={1} it={it} position={p1Position} skin={skin} size={size} popping={popping} />
            <Player id={2} it={it} position={p2Position} skin={skin2} size={size} popping={popping} />
        </section>
    );
}