import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Branches({ user }) {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', address: '' });
  const [error, setError] = useState('');

  const canCreate = user.role === 'super_admin';

  function load() {
    api.branches.list().then(setBranches).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      await api.branches.create(form);
      setForm({ name: '', address: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Branches</h2>
      {error && <div className="error-banner">{error}</div>}

      {canCreate && (
        <form className="form-row" onSubmit={handleAdd}>
          <input
            placeholder="Branch name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button className="btn">Add Branch</button>
        </form>
      )}

      <table>
        <thead><tr><th>Name</th><th>Address</th></tr></thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id}><td>{b.name}</td><td>{b.address || '—'}</td></tr>
          ))}
          {branches.length === 0 && <tr><td colSpan={2}>No branches yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
