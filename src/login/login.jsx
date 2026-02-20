import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function Login({ userName, setUserName }) {
    const [password, setPassword] = React.useState('');
    const nav = useNavigate();

    async function onLogin() {
        localStorage.setItem("tagStartup-userName", userName);
    }

    React.useEffect(() => {
        const submit = (e) => {
            if (e.key == "Enter" && (userName && password)) {
                onLogin();
                nav('/profile');
            }
        }

        window.addEventListener('keydown', submit);
    });

    return (
        <main className="flex-centered">
            <h2 className="text-2xl font-semibold">Login</h2>
            <div className="card md:w-100">
                <label htmlFor="username">Username</label>
                <input className="border-2 border-white" id="username" defaultValue={userName} onChange={(e) => setUserName(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input className="border-2 border-white" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <NavLink onClick={() => onLogin()} className="main-button" to="profile" disabled={!userName || !password}>Login</NavLink>
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