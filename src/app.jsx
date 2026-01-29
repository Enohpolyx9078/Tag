import React from 'react';
import './app.css';
import { BrowserRouter } from 'react-router';

export default function App() {
    return (
        <div className="body">
            <div className="mx-auto max-w-sm">
                <img className="logo mx-auto" src="../img/go_play_tag.png" alt="Game logo" />
            </div>
            <BrowserRouter>
            </BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/play' element={<Play />} />
                <Route path='/scores' element={<Scores />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
                <small>Authored by Howard Crawford</small>
                <small><a href="https://github.com/Enohpolyx9078/Tag" target="_blank"> Github</a></small>
            </footer>
        </div>
    );
}