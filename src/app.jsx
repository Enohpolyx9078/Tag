import React from 'react';
import './app.css';
import { BrowserRouter } from 'react-router';

export default function App() {
    return (
        <div className="body">
            <div className="mx-auto max-w-sm">
                <img className="logo mx-auto" src="../img/go_play_tag.png" alt="Game logo" />
            </div>
            <main>App content</main>
            <footer>
                <small>Authored by Howard Crawford</small>
                <small><a href="https://github.com/Enohpolyx9078/Tag" target="_blank"> Github</a></small>
            </footer>
        </div>
    );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}