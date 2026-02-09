import React from 'react';
import './game-screen.css';

export function Arena({ skin }) {
    const [position, setPosition] = React.useState({ x: 10, y: 10 });
    const moveSpeed = 10;
    const size = 50;

    // Made with some help from Gemini 3
    React.useEffect(() => {
        const handleKeyPress = (e) => {
            const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            if (gameKeys.includes(e.key)) e.preventDefault();
            setPosition((prev) => {
                switch (e.key) {
                    case 'ArrowUp': return { ...prev, y: prev.y - moveSpeed };
                    case 'ArrowDown': return { ...prev, y: prev.y + moveSpeed };
                    case 'ArrowLeft': return { ...prev, x: prev.x - moveSpeed };
                    case 'ArrowRight': return { ...prev, x: prev.x + moveSpeed };
                    default: return prev;
                }
            });
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
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