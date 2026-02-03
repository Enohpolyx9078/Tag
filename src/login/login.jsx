import React from 'react';
import { NavLink } from 'react-router-dom';

export function Login() {
  return (
    <main className="flex-centered">
        <h2 className="text-2xl font-semibold">Login</h2>
        <div className="card md:w-100">
            <label for="username">Username</label>
            <input className="border-2 border-white" id="username" />
            <label for="password">Password</label>
            <input className="border-2 border-white" id="password" type="password" />
            <NavLink className="main-button" to="profile">Login</NavLink>
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