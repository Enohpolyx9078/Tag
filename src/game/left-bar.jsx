import React from 'react';
import { Timer } from './timers.jsx';

export function LocalLeft({ you, skin, it, gameOver }) {
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
                <Timer label="Time it:" you={you} it={it} id={1} gameOver={gameOver} />
                <Timer label="Time not it:" you={you} it={it} id={1} gameOver={gameOver} />
            </div>
        </div>
    )
}

export function OnlineLeft({ players, skins, roomCode, it, itClass }) {

    const playerList = (() => {
        const list = [];
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            let skin = skins[i];
            list.push(
                (
                    <div key={i} className={"flex flex-col flex-row flex-wrap items-center mb-4 " + (it == i ? itClass + " p-1" : "")}>
                        <svg className="skin-icon mr-4">
                            <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                        </svg>
                        <p>{player.name}</p>
                    </div>
                )
            )
        }
        return list;
    })();

    return (
        <div>
            <h2 className="centered text-2xl">Room: {roomCode}</h2>
            <h2 className="centered text-xl">Players</h2>
            { playerList }
        </div>
    )
}