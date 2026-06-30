import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Attendance({ user }) {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  function load() {
    api.attendance.list().then(setRecords).catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
    api.members.list().then(setMembers).catch(() => {});
  }, []);

  async function handleCheckIn(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      await api.attendance.checkIn({ member_id: memberId, method: 'reception' });
      setInfo('Checked in successfully.');
      setMemberId('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const canCheckIn = ['super_admin', 'branch_manager', 'receptionist'].includes(user.role);

  return (
    <div>
      <h2>Attendance</h2>
      {error && <div className="error-banner">{error}</div>}
      {info && <div className="insight-list"><li style={{ listStyle: 'none' }}>{info}</li></div>}

      {canCheckIn && (
        <form className="form-row" onSubmit={handleCheckIn}>
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            <option value="">Select member to check in</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name} — {m.branch_name}</option>
            ))}
          </select>
          <button className="btn">Check In</button>
        </form>
      )}

      <table>
        <thead>
          <tr><th>Member</th><th>Check-in</th><th>Check-out</th><th>Method</th></tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.member_name}</td>
              <td>{r.check_in}</td>
              <td>{r.check_out || '—'}</td>
              <td>{r.method}</td>
            </tr>
          ))}
          {records.length === 0 && <tr><td colSpan={4}>No attendance records yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
