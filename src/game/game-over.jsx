import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConfettiRain } from './confetti.jsx';

export function GameOver({ players, skins, winner }) {
    return (
        <div className="relative flex items-center justify-center">
            <ConfettiRain />
            <div className="absolute max-w-[500px]">
                <div className="flex flex-row items-center">
                    <svg id="selected" className="skin-big">
                        <rect x="0" y="0" width="100" height="100" stroke={skins[winner].outline} strokeWidth="12" fill={skins[winner].fill} />
                    </svg>
                    <h2 className="text-2xl md:text-5xl font-semibold size-min">{players[winner].name} won!</h2>
                </div>
            </div>
        </div>
    );
}