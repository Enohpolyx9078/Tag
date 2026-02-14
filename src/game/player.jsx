import React from 'react';

export function Player({ id, it, position, skin, size, popping }) {
    const [out, setOut] = React.useState(false);
    const [pop, setPop] = React.useState(false);

    React.useEffect(() => {
        if (popping == id) setPop(true);
    }, [popping]);

    const handlePop = async () => {
        setOut(true);
    }

    if (out) return null;
    return (
        <div className={(it && !pop == id ? "it" : "") + " " + (pop ? "explode" : "")} onAnimationEnd={ handlePop } style={{
            border: `solid 3px ${skin.outline}`,
            backgroundColor: `${skin.fill}`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            height: `${size}px`,
            width: `${size}px`,
            position: `absolute`
        }}></div>
    );
}