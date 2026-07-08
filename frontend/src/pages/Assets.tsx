import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Server, Laptop, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Modal from '../components/Modal';

const Assets = () => {
  const [assets, setAssets] = useState<any[]>([
    { id: '1', name: 'Core Firewall', type: 'Network', os: 'Cisco IOS', riskScore: 8.5, status: 'Critical' },
    { id: '2', name: 'Student Database', type: 'Server', os: 'Ubuntu 22.04', riskScore: 3.2, status: 'Healthy' },
    { id: '3', name: 'Library WiFi AP', type: 'Wireless', os: 'ArubaOS', riskScore: 5.1, status: 'Warning' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Server', os: '', location: '', owner: '', riskScore: 0, patchStatus: 'Healthy' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        if (response.data && response.data.length > 0) setAssets(response.data);
      } catch {}
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/assets', { ...form, institutionId: JSON.parse(localStorage.getItem('user') || '{}').institutionId });
      setAssets(prev => [...prev, response.data]);
      setSuccess('Asset added successfully!');
      setTimeout(() => { setShowModal(false); setSuccess(''); setForm({ name: '', type: 'Server', os: '', location: '', owner: '', riskScore: 0, patchStatus: 'Healthy' }); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Server': return <Server size={18} className="text-sky-400" />;
      case 'Wireless': return <Wifi size={18} className="text-purple-400" />;
      default: return <Shield size={18} className="text-emerald-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">IT Asset Inventory</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <Plus size={18} className="mr-2" />
          Add Asset
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-600 w-80">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search assets by name or OS..." className="bg-transparent border-none outline-none text-sm text-slate-200 ml-2 w-full placeholder-slate-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-medium">Asset Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">OS / Firmware</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={asset.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 mr-3">{getIcon(asset.type)}</div>
                      <span className="text-slate-200 font-medium">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{asset.type}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{asset.os || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
                        <div className={`h-full ${asset.riskScore > 7 ? 'bg-red-500' : asset.riskScore > 4 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${((asset.riskScore || 0) / 10) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 text-sm">{asset.riskScore || 0}/10</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.patchStatus || 'Healthy')}`}>
                      {asset.patchStatus || 'Healthy'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add New Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-lg text-sm">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Asset Name *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Core Firewall" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
                {['Server', 'Network', 'Wireless', 'Computer', 'Storage', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">OS / Firmware</label>
              <input value={form.os} onChange={e => setForm({...form, os: e.target.value})} placeholder="e.g. Ubuntu 22.04" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Server Room B" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Owner</label>
              <input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} placeholder="e.g. IT Department" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Risk Score (0-10)</label>
              <input type="number" min="0" max="10" step="0.1" value={form.riskScore} onChange={e => setForm({...form, riskScore: parseFloat(e.target.value)})} placeholder="e.g. 5.5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select value={form.patchStatus} onChange={e => setForm({...form, patchStatus: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assets;
