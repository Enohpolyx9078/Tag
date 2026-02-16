import React from 'react';
import { Timer } from './timers.jsx';

export function LocalLeft({ skin, it }) {
    return (
        <div>
            <div className="flex flex-col flex-row flex-wrap items-center mb-4">
                <svg className="skin-icon mr-4">
                    <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                </svg>
                <p>Guest</p>
            </div>
            <h3 className="text-xl">Stats</h3>
            <div className="flex flex-col gap-2 mb-2">
                <Timer label="Time it:" it={it} id={1} />
                <Timer label="Time not it:" it={it} id={1} />
                <p>Pickups Used: 9</p>
            </div>
        </div>
    )
}

export function OnlineLeft({ skin, roomCode }) {
    return (
        <div>
            <h2 className="centered text-2xl">Room: {roomCode}</h2>
            <h2 className="centered text-xl">Other Players</h2>
            <div className="flex flex-col flex-row flex-wrap items-center mb-4">
                <svg className="skin-icon mr-4">
                    <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                </svg>
                <p>Player 2</p>
            </div>
        </div>
    )
}