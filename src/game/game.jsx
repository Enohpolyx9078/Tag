import React from 'react';
import './game-screen.css';
import { NavLink, useSearchParams } from 'react-router-dom';
import { LocalArena } from './local-arena.jsx';
import { Arena } from './arena.jsx';
import { Timer } from './timers.jsx';
import { LocalLeft, OnlineLeft } from './left-bar.jsx';
import { Controller } from './controller.jsx';

export function Game({ userName, skin }) {
  const [it, setIt] = React.useState(1);
  const roomCode = localStorage.getItem("roomCode");
  const skins = JSON.parse(localStorage.getItem("skins"));
  const skin2 = skins.skins[0];
  const [request] = useSearchParams();

  //TODO add a Controller component to watch the game state
  // make exploding tag (ie, if you're it at the wrong time, you're out)

  return (
    <main className="md:flex md:flex-col md:flex-row md:justify-evenly gap-4">
      <Controller it={ it } />
      <section className="mb-2 md:mb-0 md:grow-1 sidebar-thin card-thin">
        {request.get('twoPlayer') == 'true' ? <LocalLeft skin={ skin2 } it={ it }/> : <OnlineLeft skin={ skin2 } roomCode={ roomCode }/> }
      </section>
      {request.get('twoPlayer') == 'true' ? <LocalArena skin={skin} skin2={skin2} it={it} setIt={setIt} /> : <Arena skin={skin} it={it} />}
      <section className="md:grow-1 sidebar-thin card-thin">
        <div className="flex flex-col flex-row flex-wrap items-center mb-4">
          <svg className="skin-icon mr-4">
            <rect x="0" y="0" width="50" height="50" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
          </svg>
          <p>{userName}</p>
        </div>
        <h3 className="text-xl">Stats</h3>
        <div className="flex flex-col gap-2 mb-2">
          <Timer label="Time it:" it={it} id={1} />
          <Timer label="Time not it:" it={it} id={1} />
          <p>Pickups Used: 9</p>
        </div>
        <NavLink className="outline-button" to="/profile">Leave Game</NavLink>
      </section>
    </main>
  );
}