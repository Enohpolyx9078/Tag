import React from 'react';
import './game-screen.css';
import { NavLink } from 'react-router-dom';

export function Game() {
  return (
    <main className="md:flex md:flex-col md:flex-row md:justify-evenly gap-4">
      <section className="mb-2 md:mb-0 md:grow-1 sidebar-thin card-thin">
        <h2 className="centered text-2xl">Other Players</h2>
        <div className="flex flex-col flex-row flex-wrap items-center mb-4">
          <svg className="skin-icon mr-4">
            <rect x="0" y="0" width="50" height="50" stroke="orange" stroke-width="3" fill="#db61e8" />
          </svg>
          <p>Player 1</p>
        </div>
        <div className="flex flex-col flex-row flex-wrap items-center mb-4">
          <svg className="skin-icon mr-4">
            <rect x="0" y="0" width="50" height="50" stroke="blue" stroke-width="3" fill="white" />
          </svg>
          <p>Player 2</p>
        </div>
        <div className="flex flex-col flex-row flex-wrap items-center mb-4">
          <svg className="skin-icon mr-4">
            <rect x="0" y="0" width="50" height="50" stroke="green" stroke-width="3" fill="yellow" />
          </svg>
          <p>Player 3</p>
        </div>
      </section>
      <section className="mb-2 md:mb-0">
        <table>
          <tr>
            <td>
              <svg className="skin-big">
                <rect x="0" y="0" width="100" height="100" stroke="orange" stroke-width="6"
                  fill="#db61e8" />
              </svg>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <svg className="skin-big">
                <rect x="0" y="0" width="100" height="100" stroke="blue" stroke-width="6" fill="white" />
              </svg>
            </td>
            <td></td>
            <td>
              <svg className="skin-big">
                <rect x="0" y="0" width="100" height="100" stroke="green" stroke-width="6" fill="yellow" />
              </svg>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <svg className="skin-big">
                <rect x="0" y="0" width="100" height="100" stroke="black" stroke-width="6" fill="#29e3d3" />
              </svg>
            </td>
          </tr>
        </table>
      </section>
      <section className="md:grow-1 sidebar-thin card-thin">
        <div className="flex flex-col flex-row flex-wrap items-center mb-4">
          <svg className="skin-icon mr-4">
            <rect x="0" y="0" width="50" height="50" stroke="black" stroke-width="3" fill="#29e3d3" />
          </svg>
          <p>Your Name</p>
        </div>
        <h3 className="text-xl">Stats</h3>
        <div className="flex flex-col gap-2 mb-2">
          <p>Time It: 00:03:22</p>
          <p>Time Not It: 00:13:32</p>
          <p>Pickups Used: 9</p>
        </div>
        <NavLink className="outline-button" to="/profile">Leave Game</NavLink>
      </section>
    </main>
  );
}