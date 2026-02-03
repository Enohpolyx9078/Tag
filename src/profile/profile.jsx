import React from 'react';
import { NavLink } from 'react-router-dom';

export function Profile() {
  return (
    <main>
        <section className="md:grid md:grid-flow-col md:grid-cols-5 mb-4">
            <div className="col-span-4 grid grid-flow-col grid-cols-5 justify-around items-center mb-4">
                <svg id="selected" className="skin-big col-span-1">
                    <rect x="0" y="0" width="100" height="100" stroke="black" stroke-width="6" fill="#29e3d3" />
                </svg>
                <h2 className="text-2xl md:text-5xl font-semibold col-span-4">Your Name</h2>
            </div>
            <div className="col-span-1 grid grid-flow-col grid-rows-3">
                <NavLink className="main-button" to="/game">Create Game</NavLink>
                <NavLink className="main-button" to="/game">Join Game</NavLink>
                <NavLink className="outline-button" to="/">Logout</NavLink>
            </div>
        </section>
        <section className="md:grid md:grid-flow-col md:grid-cols-3 gap-4">
            <div className="col-span-1 card mb-4 md:mb-0">
                <h3>Skins</h3>
                <div>
                    <svg className="skin-icon">
                        <rect x="0" y="0" width="50" height="50" stroke="orange" stroke-width="3" fill="#db61e8" />
                    </svg>
                    <svg className="skin-icon">
                        <rect x="0" y="0" width="50" height="50" stroke="blue" stroke-width="3" fill="white" />
                    </svg>
                    <svg className="skin-icon">
                        <rect x="0" y="0" width="50" height="50" stroke="green" stroke-width="3" fill="yellow" />
                    </svg>
                </div>
            </div>
            <div className="col-span-1 card mb-4 md:mb-0">
                <h3>Stats</h3>
                <p>Time It: 01:33:22</p>
                <p>Time Not It: 22:33:32</p>
                <p>Pickups Used: 223</p>
            </div>
            <div className="col-span-1 card mb-4 md:mb-0">
                <h3>AI Analysis</h3>
                <p>
                    <em>
                        During the last game, you spent 76% of the time as "It." Your average distance from "It"
                        while not "It" was 10 units. Try to stay further away from "It" to avoing being caught.
                    </em>
                </p>
                <a className="outline-button" href="#">Get Analysis</a>
            </div>
        </section>
    </main>
  );
}