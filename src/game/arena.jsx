import React from 'react';
import './game-screen.css';

export function Arena({ skin }) {
    const [position, setPosition] = React.useState({ x: 10, y: 10, time: performance.now() });
    const size = 50;
    const fieldSize = 500;
    const padding = (3 * 2) + 5; // the border (3) of the character and the arena (5)
    const edge = fieldSize - size - padding;

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    // Made with some help from Gemini 3

    const animate = async () => {
        setPosition((prev) => {
            let { x, y, time } = prev;
            // use delta Time for position change instead of move speed
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

            if (keysPressed.current['ArrowUp']) moveUp();
            if (keysPressed.current['ArrowDown']) moveDown();
            if (keysPressed.current['ArrowLeft']) moveLeft();
            if (keysPressed.current['ArrowRight']) moveRight();

            return { x: x, y: y, time: performance.now() };
        });

        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
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
                transform: `translate(${position.x}px, ${position.y}px)`,
                height: `${size}px`,
                width: `${size}px`
            }}></div>
        </section>
    );
}