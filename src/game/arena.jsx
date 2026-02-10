import React from 'react';
import './game-screen.css';

export function Arena({ skin, skin2 }) {
    const [p1Position, setP1Position] = React.useState({ x: 10, y: 10, time: performance.now() });
    const [p2Position, setP2Position] = React.useState({ x: 430, y: 10, time: performance.now() });
    const size = 50;
    const fieldSize = 500;
    const padding = (3 * 2) + 5; // the border (3) of the character and the arena (5)
    const edge = fieldSize - size - padding;

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    const p1Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const p2Keys = ['w', 's', 'a', 'd'];

    // Made with some help from Gemini 3

    const animate = async (updateFrame, keys) => {
        updateFrame((prev) => {
            let { x, y, time } = prev;
            // use delta Time for p1Position change instead of move speed
            const deltaT = performance.now() - time;
            const speed = 0.4;
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
            <div style={{
                border: `solid 3px ${skin.outline}`,
                backgroundColor: `${skin.fill}`,
                transform: `translate(${p1Position.x}px, ${p1Position.y}px)`,
                height: `${size}px`,
                width: `${size}px`,
                position: `absolute`
            }}></div>
            <div style={{
                border: `solid 3px ${skin2.outline}`,
                backgroundColor: `${skin2.fill}`,
                transform: `translate(${p2Position.x}px, ${p2Position.y}px)`,
                height: `${size}px`,
                width: `${size}px`,
                position: `absolute`
            }}></div>
        </section>
    );
}