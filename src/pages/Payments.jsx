import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Payments({ user }) {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ member_id: '', amount: '', method: 'cash' });
  const [error, setError] = useState('');

  const canManage = ['super_admin', 'branch_manager', 'receptionist'].includes(user.role);
  const canView = ['super_admin', 'branch_manager', 'accountant', 'receptionist'].includes(user.role);

  function load() {
    api.payments.list().then(setPayments).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (canView) load();
    api.members.list().then(setMembers).catch(() => {});
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      await api.payments.create({ ...form, amount: parseFloat(form.amount) });
      setForm({ member_id: '', amount: '', method: 'cash' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!canView) return <p>You don't have permission to view payments.</p>;

  return (
    <div>
      <h2>Payments</h2>
      {error && <div className="error-banner">{error}</div>}

      {canManage && (
        <form className="form-row" onSubmit={handleAdd}>
          <select value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} required>
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="stripe">Stripe</option>
          </select>
          <button className="btn">Record Payment</button>
        </form>
      )}

      <table>
        <thead>
          <tr><th>Member</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.member_name}</td>
              <td>${p.amount.toFixed(2)}</td>
              <td>{p.method}</td>
              <td>{p.status}</td>
              <td>{p.created_at}</td>
            </tr>
          ))}
          {payments.length === 0 && <tr><td colSpan={5}>No payments recorded yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
