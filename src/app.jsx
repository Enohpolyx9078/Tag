import React from 'react';
import './app.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { CreateAccount } from './create-account/create-account';
import { Game } from './game/game';
import { Profile } from './profile/profile';
import { CreateGame } from './create-game/create-game';

export default function App() {
    function setSkins() {
        const skins = {
            skins: [
                { id: "Grape", fill: "#9922FF", outline: "#BBB" },
                { id: "Magma", fill: "#FF4500", outline: "#330000" },
                { id: "Bonsai", fill: "#4A5D23", outline: "#D2B48C" },
                { id: "Glacier", fill: "#E0FFFF", outline: "#4682B4" },
                { id: "Abyss", fill: "#000015", outline: "#00FFFF" },
                { id: "Marigold", fill: "#FFB800", outline: "#7B3F00" },
                { id: "Bubblegum", fill: "#FF85D1", outline: "#B02E82" },
                { id: "Minty", fill: "#AAF0D1", outline: "#16A085" },
                { id: "Voltage", fill: "#FFFF00", outline: "#000" },
                { id: "Titanium", fill: "#D1D1D1", outline: "#FFF" },
                { id: "Hazard", fill: "#FC0", outline: "#222" },
                { id: "Blueprint", fill: "#0047AB", outline: "#E0E0E0" },
                { id: "Carbon", fill: "#2B2B2B", outline: "#555" },
                { id: "Nebula", fill: "#2E0854", outline: "#F0F" },
                { id: "Supernova", fill: "#FFF", outline: "#FFA500" },
                { id: "Ghost", fill: "#FFF", outline: "#ABC123" },
            ]
        }
        localStorage.setItem("skins", JSON.stringify(skins));
        return skins
    }
    const skins = setSkins();
    const [userName, setUserName] = React.useState(localStorage.getItem("tagStartup-userName") || '');
    let currentSkin = JSON.parse(localStorage.getItem("currentSkin"));
    currentSkin = currentSkin != null ? currentSkin : skins.skins[0];
    let [skin, setSkin] = React.useState(currentSkin);
    const [playerInit, setPlayerInit] = React.useState([]);

    return (
        <BrowserRouter>
            <div className="body">
                <div className="mx-auto max-w-sm">
                    <img className="logo mx-auto" src="../img/go_play_tag.png" alt="Game logo" />
                </div>
                <Routes>
                    <Route path='/' element={<Login userName={userName} setUserName={setUserName} />} exact />
                    <Route path='/profile' element={<Profile userName={userName} skin={skin} setSkin={setSkin} />} />
                    <Route path='/createAccount' element={<CreateAccount userName={userName} setUserName={setUserName} />} />
                    <Route path='/game' element={<Game userName={userName} skin={skin}/>} />
                    <Route path='/createGame' element={<CreateGame userName={userName} skin={skin} playerInit={playerInit} setPlayerInit={setPlayerInit} />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <small>Authored by Howard Crawford</small>
                    <small><a href="https://github.com/Enohpolyx9078/Tag" target="_blank"> Github</a></small>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="flex-centered">404: Well that's awkward... We couldn't find what you're looking for!</main>;
}