import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { customAlphabet } from 'nanoid';

function formatTime(timeStamp) {
    let seconds = Math.floor(timeStamp / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const hourStr = hours < 10 ? "0" + hours : hours;
    const minuteStr = minutes < 10 ? "0" + minutes : minutes;
    const secondStr = seconds < 10 ? "0" + seconds : seconds;
    return hourStr + ":" + minuteStr + ":" + secondStr;
}

export function Profile({ userName, skin, setSkin }) {
    const times = localStorage.getItem("times") == null ? { it: 0, notIt: 0, wins: 0 } : JSON.parse(localStorage.getItem("times"));
    const skins = JSON.parse(localStorage.getItem("skins"));
    const roomCode = useRef(null);
    let [analysis, setAnalysis] = React.useState(<p className="m-7"></p>);

    const skinList = (() => {
        const list = [];
        for (const thing of skins.skins) {
            let { id, outline, fill } = thing;
            list.push(
                (
                    <div key={id} className="cursor-pointer skin-container mb-2" onClick={() => defineSkin(id)}>
                        <svg className="skin-icon mr-2">
                            <rect x="0" y="0" width="50" height="50" stroke={outline} strokeWidth="3" fill={fill} />
                        </svg>
                        <em>{id}</em>
                    </div>
                )
            )
        }
        return list;
    })();

    async function defineSkin(id) {
        let current;
        for (const thing of skins.skins) {
            if (id === thing.id) {
                setSkin(thing);
                current = thing;
                break;
            }
        }
        if (current) localStorage.setItem("currentSkin", JSON.stringify(current));
    }

    async function useCode() {
        let val = roomCode.current.value;
        localStorage.setItem("roomCode", val);
        const msg = (val == "" || val == null) ? "You forgot to enter the room code!" : 'Room "' + roomCode.current.value + '" does not exist.';
        //TODO use WebSocket to check the room code
        alert('Sorry, online functionality isn\'t yet fully operational.\n'+msg);
    }

    async function createCode() {
        //TODO use WebSocket to serve room codes
        // Room code logic generated with help from Gemini 3
        const alphabet = '23456789ABCDEFGHJKLMNPQRSTVWXYZ';
        const generateRoomCode = customAlphabet(alphabet, 6);
        localStorage.setItem("roomCode", generateRoomCode());
    }

    async function getAnalysis(setAnalysis) {
        setAnalysis(
            (<div class="animate-pulse m-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                </svg>
            </div>)
        );
        // Placeholder for API call later
        setTimeout(() => {
            setAnalysis(
                (<p>
                    <em>
                        During the last game, you spent 76% of the time as "It." Your average distance from "It" while not "It" was 10 units. Try to stay further away from "It" to avoing being caught.
                    </em>
                </p>)
            )
        }, 3000);
    }

    return (
        <main>
            <section className="md:grid md:grid-flow-col md:grid-cols-5 mb-4">
                <div className="col-span-4 grid grid-flow-col grid-cols-5 justify-around items-center mb-4">
                    <svg id="selected" className="skin-big col-span-1">
                        <rect x="0" y="0" width="100" height="100" stroke={skin.outline} strokeWidth="6" fill={skin.fill} />
                    </svg>
                    <h2 className="text-2xl md:text-5xl font-semibold col-span-4">{userName}</h2>
                </div>
                <div className="col-span-1 grid grid-flow-col grid-rows-5">
                    <input ref={roomCode} className="border-2 border-white" id="roomCode" placeholder="Room Code" />
                    <button type="button" onClick={() => useCode()} className="main-button" to="/game">Join Game</button>
                    <NavLink onClick={() => createCode()} className="main-button" to="/game">Create Game</NavLink>
                    <NavLink className="main-button" to="/game?twoPlayer=true">2 Player Game</NavLink>
                    <NavLink className="outline-button" to="/">Logout</NavLink>
                </div>
            </section>
            <section className="md:grid md:grid-flow-col md:grid-cols-3 gap-4">
                <div className="col-span-1 card mb-4 md:mb-0 half-screen">
                    <h3>Skins</h3>
                    <div className="overflow-x-auto">
                        {skinList}
                    </div>
                </div>
                <div className="col-span-1 card mb-4 md:mb-0 half-screen">
                    <h3>Stats</h3>
                    <p>Time It: {formatTime(times.it)}</p>
                    <p>Time Not It: {formatTime(times.notIt)}</p>
                    <p>Wins: {times.wins}</p>
                </div>
                <div className="col-span-1 card mb-4 md:mb-0 half-screen">
                    <h3>AI Analysis</h3>
                    <a className="outline-button cursor-pointer" onClick={() => getAnalysis(setAnalysis)}>Get Analysis</a>
                    {analysis}
                </div>
            </section>
        </main>
    );
}