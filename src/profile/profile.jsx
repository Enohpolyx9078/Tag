import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUser, fetchSkins, fetchRoom } from '../lib/lib-requests';

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

export function Profile() {
    const [user, setUser] = React.useState('');
    const [skin, setSkin] = React.useState({});
    const [skins, setSkins] = React.useState({ list: [] });
    const [times, setTimes] = React.useState({});
    const roomCode = useRef(null);
    const nav = useNavigate();

    React.useEffect(() => {
        async function effectHelper() {
            const user = await fetchUser();
            setUser(user);
            setSkin(user.skin);
            setTimes(user.times);
            const skins = await fetchSkins();
            setSkins(skins);
        }
        effectHelper();
    }, []);

    const skinList = (() => {
        const list = [];
        for (const thing of skins.list) {
            let { id, outline, fill } = thing;
            list.push(
                (
                    <div key={id} className="cursor-pointer skin-container mb-2" onClick={() => defineSkin(id)}>
                        <svg className="skin-icon mr-2">
                            <rect x="0" y="0" width="50" height="50" stroke={outline} strokeWidth="6" fill={fill} />
                        </svg>
                        <em>{id}</em>
                    </div>
                )
            )
        }
        return list;
    });

    async function defineSkin(id) {
        const res = await fetch('api/skins', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log(data);
            setSkin(data);
        } else {
            alert('Authentication failed');
        }
    }

    async function joinRoom() {
        let val = roomCode.current.value;
        if (!val || val === '') val = "empty";
        const data = await fetchRoom(val);
        if (data) {
            localStorage.setItem("roomCode", data.code);
            localStorage.setItem("rain", data.rain);
            nav('/createGame');
        }
    }

    async function createRoom() {
        // get the weather in Chile to determine map conditions
        const resp = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-52.95215&longitude=-74.09155&current=precipitation&forecast_days=1');
        const conditions = await resp.json();
        const rain = conditions.current.precipitation > 0;
        
        localStorage.removeItem("roomCode");
        const res = await fetch('api/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({rain})
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("roomCode", data.code);
            localStorage.setItem("rain", rain);
            nav('/createGame');
        } else {
            alert('Authentication failed');
        }
    }

    async function prepTwoPlayer() {
        const player1 = { name: user.userName, skin: skin }
        const player2 = { name: "Guest", skin: skins.list[Math.floor(Math.random() * skins.list.length)] }
        const playerInit = [player1, player2];
        localStorage.setItem("playerInit", JSON.stringify(playerInit));
        localStorage.setItem("you", 0);
    }

    async function onLogout() {
        const res = await fetch('api/auth', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        await res.json();
        if (res.ok) {
            nav('/');
        } else {
            alert('Something went wrong. Logout was NOT successful');
        }
    }

    return (
        <main>
            <section className="md:grid md:grid-flow-col md:grid-cols-5 mb-4">
                <div className="col-span-4 grid grid-flow-col grid-cols-5 justify-around items-center mb-4">
                    <svg id="selected" className="skin-big col-span-1">
                        <rect x="0" y="0" width="100" height="100" stroke={skin.outline} strokeWidth="12" fill={skin.fill} />
                    </svg>
                    <h2 className="text-2xl md:text-5xl font-semibold col-span-4">{user.userName}</h2>
                </div>
                <div className="col-span-1 grid grid-flow-col grid-rows-5">
                    <input ref={roomCode} className="border-2 border-white" id="roomCode" placeholder="Room Code" />
                    <button type="button" onClick={() => joinRoom()} className="main-button" to="/game">Join Game</button>
                    <button onClick={() => createRoom()} className="main-button">Create Game</button>
                    <NavLink onClick={() => prepTwoPlayer()} className="main-button" to="/game?twoPlayer=true">2 Player Game</NavLink>
                    <button onClick={() => onLogout()} className="outline-button">Logout</button>
                </div>
            </section>
            <section className="md:grid md:grid-flow-col md:grid-cols-2 gap-4">
                <div className="col-span-1 card mb-4 md:mb-0 half-screen">
                    <h3>Skins</h3>
                    <div className="overflow-x-auto">
                        {skinList()}
                    </div>
                </div>
                <div className="col-span-1 card mb-4 md:mb-0 half-screen">
                    <h3>Stats</h3>
                    <p>Time It: {formatTime(times.it)}</p>
                    <p>Time Not It: {formatTime(times.notIt)}</p>
                    <p>Win to Loss: {times.wins} - {times.losses}</p>
                </div>
            </section>
        </main>
    );
}