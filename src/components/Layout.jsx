import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/members', label: 'Members' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/payments', label: 'Payments' },
  { to: '/branches', label: 'Branches' }
];

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Cloud AI Gym</h1>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </aside>
      <main className="main">
        <div className="topbar">
          <div className="user-info">
            {user.name} · <strong>{user.role.replace('_', ' ')}</strong>
          </div>
          <button className="btn secondary" onClick={onLogout}>Log Out</button>
        </div>
        {children}
      </main>
    </div>
  );
}
