import React from 'react';

export function Player({ id, it, position, skin, size, popping }) {
    const [out, setOut] = React.useState(false);
    const [pop, setPop] = React.useState(false);
    const [particles, setParticles] = React.useState([]);

    React.useEffect(() => {
        if (popping == id) {
            setPop(true);
            createExplosion();
        }
    }, [popping]);

    const handlePop = async () => {
        setOut(true);
    }


    const createExplosion = async () => {
        // Get coordinates to center the explosion
        const centerX = size / 2;
        const centerY = size / 2;

        const newParticles = Array.from({ length: 20 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2; // Random direction (0 to 360)
            const velocity = 70 + Math.random() * 100; // Random distance

            return {
                id: Date.now() + i,
                originX: centerX,
                originY: centerY,
                x: Math.cos(angle) * velocity, // Trigonometry for X offset
                y: Math.sin(angle) * velocity, // Trigonometry for Y offset
                rotation: Math.random() * 360,
                size: Math.random() * 8 + 4,   // Random size between 4px and 12px
            };
        });

        setParticles(newParticles);
    };

    const removeParticle = async (id) => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
    };

    if (out) return null;
    return (
        <div style={{ transform: `translate(${position.x}px, ${position.y}px)`, position: `absolute` }}>
            <div className={((it == id && !pop) ? "it" : "") + " " + (pop ? "explode" : "")} onAnimationEnd={handlePop} style={{
                border: `solid 3px ${skin.outline}`,
                backgroundColor: `${skin.fill}`,
                height: `${size}px`,
                width: `${size}px`
            }}></div>
            {particles.map((p) => (
                <div
                    key={p.id}
                    onAnimationEnd={() => removeParticle(p.id)}
                    className="debris"
                    style={{
                        '--tx': `${p.x}px`,
                        '--ty': `${p.y}px`,
                        '--r': `${p.rotation}deg`,
                        position: `absolute`,
                        left: `${p.originX}px`,
                        top: `${p.originY}px`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                    }}
                />
            ))}
        </div>
    );
}