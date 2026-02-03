import React from 'react';
import './app.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { CreateAccount } from './create-account/create-account';
import { Game } from './game/game';
import { Profile } from './profile/profile';

export default function App() {
    return (
        <BrowserRouter>
            <div className="body">
                <div className="mx-auto max-w-sm">
                    <img className="logo mx-auto" src="../img/go_play_tag.png" alt="Game logo" />
                </div>
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/profile' element={<Profile />}/>
                    <Route path='/createAccount' element={<CreateAccount />}/>
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