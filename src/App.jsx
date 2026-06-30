import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Members from './pages/Members.jsx';
import Attendance from './pages/Attendance.jsx';
import Payments from './pages/Payments.jsx';
import Branches from './pages/Branches.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gym_user');
    return stored ? JSON.parse(stored) : null;
  });

  function handleLogout() {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members user={user} />} />
        <Route path="/attendance" element={<Attendance user={user} />} />
        <Route path="/payments" element={<Payments user={user} />} />
        <Route path="/branches" element={<Branches user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
