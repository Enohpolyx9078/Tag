import React from 'react';
import './game-screen.css';

export function Arena({ skin }) {
    const [position, setPosition] = React.useState({ x: 10, y: 10 });
    const size = 50;
    const fieldSize = 500;
    const padding = (3 * 2) + 5; // the border (3) of the character and the arena (5)

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    // Made with some help from Gemini 3

    const animate = () => {
        setPosition((prev) => {
            let { x, y } = prev;
            const speed = 5;
            //TODO use delta Time for position change instead of move speed
            const moveUp = () => {
                if (y - speed < 0) y = 0;
                else y -= speed;
            }

            const moveDown = () => {
                if (y + speed > fieldSize - size - padding) y = fieldSize - size - padding;
                else y += speed;
            }

            const moveLeft = () => {
                if (x - speed < 0) x = 0;
                else x -= speed;
            }

            const moveRight = () => {
                if (x + speed > fieldSize - size - padding) x = fieldSize - size - padding;
                else x += speed;
            }

            if (keysPressed.current['ArrowUp']) moveUp();
            if (keysPressed.current['ArrowDown']) moveDown();
            if (keysPressed.current['ArrowLeft']) moveLeft();
            if (keysPressed.current['ArrowRight']) moveRight();

            return { x, y };
        });

        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        const down = (e) => {
            const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            if (gameKeys.includes(e.key)) e.preventDefault();
            keysPressed.current[e.key] = true;
        };
        const up = (e) => {
            const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
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
    });

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