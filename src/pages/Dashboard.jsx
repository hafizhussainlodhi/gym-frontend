import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error-banner">{error}</div>;
  if (!data) return <p>Loading dashboard…</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card">
          <div className="label">Total Members</div>
          <div className="value">{data.totalMembers}</div>
        </div>
        <div className="card">
          <div className="label">Active Memberships</div>
          <div className="value">{data.activeMembers}</div>
        </div>
        <div className="card">
          <div className="label">Expiring Soon (7d)</div>
          <div className="value">{data.expiringSoon}</div>
        </div>
        <div className="card">
          <div className="label">Today's Attendance</div>
          <div className="value">{data.todaysAttendance}</div>
        </div>
        <div className="card">
          <div className="label">Monthly Revenue</div>
          <div className="value">${data.monthlyRevenue.toFixed(2)}</div>
        </div>
      </div>

      {data.branchPerformance.length > 0 && (
        <>
          <h2>Branch Performance</h2>
          <table style={{ marginBottom: 28 }}>
            <thead>
              <tr><th>Branch</th><th>Members</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {data.branchPerformance.map((b) => (
                <tr key={b.name}>
                  <td>{b.name}</td>
                  <td>{b.members}</td>
                  <td>${b.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>AI Business Insights</h2>
      <ul className="insight-list">
        {data.insights.map((insight, i) => (
          <li key={i}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}
