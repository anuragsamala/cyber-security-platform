import React, { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Modal from '../components/Modal';

const Users = () => {
  const [users, setUsers] = useState<any[]>([
    { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@cyberiq.edu', role: 'SUPER_ADMIN', isActive: true },
    { id: '2', firstName: 'John', lastName: 'Doe', email: 'jdoe@cyberiq.edu', role: 'SECURITY_OFFICER', isActive: true },
    { id: '3', firstName: 'Jane', lastName: 'Smith', email: 'jsmith@cyberiq.edu', role: 'FACULTY', isActive: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'FACULTY' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/users').then(r => { if (r.data?.length) setUsers(r.data); }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', form);
      // Refresh users list
      const updatedUsers = await api.get('/users');
      if (updatedUsers.data?.length) setUsers(updatedUsers.data);
      setSuccess('User added successfully!');
      setTimeout(() => { setShowModal(false); setSuccess(''); setForm({ firstName: '', lastName: '', email: '', password: '', role: 'FACULTY' }); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'text-purple-400 border-purple-900 bg-purple-900/20',
    INSTITUTION_ADMIN: 'text-sky-400 border-sky-900 bg-sky-900/20',
    SECURITY_OFFICER: 'text-red-400 border-red-900 bg-red-900/20',
    FACULTY: 'text-emerald-400 border-emerald-900 bg-emerald-900/20',
    AUDITOR: 'text-amber-400 border-amber-900 bg-amber-900/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">User Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <UserPlus size={18} className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <motion.tr
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={user.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {(user.firstName || user.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-200 font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 border rounded text-xs font-mono ${roleColors[user.role] || 'text-slate-400 border-slate-700'}`}>
                    {user.role?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center text-sm ${user.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`}></div>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-lg text-sm">{success}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">First Name *</label>
              <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="John" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Doe" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@university.edu" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password *</label>
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min. 6 characters" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role *</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
              <option value="FACULTY">Faculty</option>
              <option value="SECURITY_OFFICER">Security Officer</option>
              <option value="AUDITOR">Auditor</option>
              <option value="INSTITUTION_ADMIN">Institution Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
