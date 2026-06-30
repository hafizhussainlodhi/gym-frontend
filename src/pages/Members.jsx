import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Members({ user }) {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', mobile: '', email: '', plan_id: '', branch_id: '' });

  const canEdit = ['super_admin', 'branch_manager', 'receptionist'].includes(user.role);
  const isGlobal = ['super_admin', 'accountant'].includes(user.role);

  function load() {
    api.members.list().then(setMembers).catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
    api.plans.list().then(setPlans).catch(() => {});
    if (isGlobal) api.branches.list().then(setBranches).catch(() => {});
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      await api.members.create(form);
      setForm({ full_name: '', mobile: '', email: '', plan_id: '', branch_id: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.members.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Members</h2>
      {error && <div className="error-banner">{error}</div>}

      {canEdit && (
        <form className="form-row" onSubmit={handleAdd}>
          <input
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })}>
            <option value="">No plan</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
            ))}
          </select>
          {isGlobal && (
            <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} required>
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}
          <button className="btn">Add Member</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Branch</th><th>Plan</th><th>Status</th><th>Ends</th>{canEdit && <th></th>}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.full_name}</td>
              <td>{m.branch_name || '—'}</td>
              <td>{m.plan_name || '—'}</td>
              <td><span className={`badge ${m.status}`}>{m.status}</span></td>
              <td>{m.end_date || '—'}</td>
              {canEdit && (
                <td>
                  <button className="btn secondary" onClick={() => handleDelete(m.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
          {members.length === 0 && (
            <tr><td colSpan={6}>No members yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
