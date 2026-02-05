import React from 'react';
import { NavLink } from 'react-router-dom';

export function CreateAccount() {
  const [userName, setUserName] = React.useState(localStorage.getItem("tagStartup-userName") || '');
      const [password, setPassword] = React.useState('');
  
      async function onLogin() {
          localStorage.setItem("tagStartup-userName", userName);
      }
  
      return (
          <main className="flex-centered">
              <h2 className="text-2xl font-semibold">Create Account</h2>
              <div className="card md:w-100">
                  <label htmlFor="username">Username</label>
                  <input className="border-2 border-white" id="username" onChange={(e) => setUserName(e.target.value)}/>
                  <label htmlFor="password">Password</label>
                  <input className="border-2 border-white" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                  <NavLink onClick={ () => onLogin() } className="main-button" to="profile" disabled={!userName || !password}>Create Account</NavLink>
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