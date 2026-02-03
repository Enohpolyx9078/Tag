import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
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
                <NavLink to="">Login</NavLink>
                <Routes>
                    <Route path='/' element={<Login />} exact />
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
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}