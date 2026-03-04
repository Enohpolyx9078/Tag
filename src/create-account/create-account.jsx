import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function CreateAccount({ userName, setUserName }) {
    const [password, setPassword] = React.useState('');
    const nav = useNavigate();

    async function onLogin() {
        const res = await fetch('api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password }),
        });
        await res.json();
        if (res.ok) {
            //TODO fetch the user info instead of localstorage
            localStorage.setItem("tagStartup-userName", userName);
            navigate('/profile');
        } else {
            alert('Authentication failed');
        }
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
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <div className="card md:w-100">
                <label htmlFor="username">Username</label>
                <input className="border-2 border-white" id="username" onChange={(e) => setUserName(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input className="border-2 border-white" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => onLogin()} className="main-button" to="profile" disabled={!userName || !password}>Create Account</button>
                <div className="centered">
                    <small>
                        Already have an account?
                        <NavLink to="/"> Login</NavLink>
                    </small>
                </div>
            </div>
        </main>
    );
}