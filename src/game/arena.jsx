import React from 'react';
import './game-screen.css';

export function Arena({ skin }) {
    const [position, setPosition] = React.useState({ x: 10, y: 10 });
    const size = 50;

    const requestRef = React.useRef();
    const keysPressed = React.useRef({});

    // Made with some help from Gemini 3

    const animate = () => {
        setPosition((prev) => {
            let { x, y } = prev;
            const speed = 5;
            //TODO use delta Time for position change instead of move speed

            if (keysPressed.current['ArrowUp']) y -= speed;
            if (keysPressed.current['ArrowDown']) y += speed;
            if (keysPressed.current['ArrowLeft']) x -= speed;
            if (keysPressed.current['ArrowRight']) x += speed;

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