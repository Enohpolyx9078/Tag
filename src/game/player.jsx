import React from 'react';

export function Player({ id, it, position, skin, size }) {
    return (
        <div className={it == id ? "it" : ""} style={{
            border: `solid 3px ${skin.outline}`,
            backgroundColor: `${skin.fill}`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            height: `${size}px`,
            width: `${size}px`,
            position: `absolute`
        }}></div>
    );
}