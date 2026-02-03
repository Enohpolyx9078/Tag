import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

export function CreateAccount() {
  return (
    <main className="flex-centered">
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <div className="card md:w-100">
            <label for="username">Username</label>
            <input className="border-2 border-white" id="username" />
            <label for="password">Password</label>
            <input className="border-2 border-white" id="password" type="password" />
            <a className="main-button" href="profile.html">Create Account</a>
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