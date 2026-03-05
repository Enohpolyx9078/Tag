import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function Login({ userName, setUserName }) {
    const [password, setPassword] = React.useState('');
    const nav = useNavigate();

    async function onLogin() {
        const res = await fetch('api/auth', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password }),
        });
        await res.json();
        if (res.ok) {
            //TODO fetch the user info instead of localstorage
            nav('/profile');
        } else {
            alert('Authentication failed');
        }
    }

    return (
        <main className="flex-centered">
            <h2 className="text-2xl font-semibold">Login</h2>
            <div className="card md:w-100">
                <label htmlFor="username">Username</label>
                <input className="border-2 border-white" id="username" defaultValue={userName} onChange={(e) => setUserName(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input className="border-2 border-white" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => onLogin()} className="main-button" to="profile" disabled={!userName || !password}>Login</button>
                <div className="centered">
                    <small>
                        New here?
                        <NavLink to="createAccount"> Create account</NavLink>
                    </small>
                </div>
            </div>
        </main>
    );
}