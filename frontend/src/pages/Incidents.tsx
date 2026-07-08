import React, { useState, useEffect } from 'react';
import { Plus, AlertOctagon, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Modal from '../components/Modal';

const Incidents = () => {
  const [incidents, setIncidents] = useState<any[]>([
    { id: 'INC-001', title: 'Unauthorized Login Attempt', severity: 'HIGH', status: 'OPEN', createdAt: new Date().toISOString(), assignedOfficerId: null },
    { id: 'INC-002', title: 'Malware Detected on Staff PC', severity: 'CRITICAL', status: 'UNDER_INVESTIGATION', createdAt: new Date().toISOString(), assignedOfficerId: 'jdoe' },
    { id: 'INC-003', title: 'Firewall Policy Violation', severity: 'MEDIUM', status: 'RESOLVED', createdAt: new Date().toISOString(), assignedOfficerId: 'jsmith' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'MEDIUM' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/incidents').then(r => { if (r.data?.length) setIncidents(r.data); }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/incidents', form);
      setIncidents(prev => [response.data, ...prev]);
      setSuccess('Incident reported successfully!');
      setTimeout(() => { setShowModal(false); setSuccess(''); setForm({ title: '', description: '', severity: 'MEDIUM' }); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertOctagon size={16} className="text-red-400 mr-2" />;
      case 'UNDER_INVESTIGATION': return <Clock size={16} className="text-amber-400 mr-2" />;
      case 'RESOLVED': return <CheckCircle size={16} className="text-emerald-400 mr-2" />;
      default: return null;
    }
  };

  const displayStatus = (s: string) => s.replace('_', ' ');
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  const columns = ['OPEN', 'UNDER_INVESTIGATION', 'RESOLVED'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">Incident Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <Plus size={18} className="mr-2" />
          Report Incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((colStatus) => (
          <div key={colStatus} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 h-[calc(100vh-200px)] overflow-y-auto">
            <h3 className="text-slate-300 font-semibold mb-4 px-2 flex items-center justify-between">
              {displayStatus(colStatus)}
              <span className="bg-slate-700 text-slate-300 text-xs py-1 px-2 rounded-full">
                {incidents.filter(i => i.status === colStatus).length}
              </span>
            </h3>
            <div className="space-y-4">
              {incidents.filter(i => i.status === colStatus).map((incident, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={incident.id}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md hover:border-sky-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-500">{String(incident.id).substring(0, 8).toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <h4 className="text-slate-200 font-medium mb-3 line-clamp-2">{incident.title}</h4>
                  {incident.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{incident.description}</p>}
                  <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                    <div className="flex items-center">
                      {getStatusIcon(incident.status)}
                      <span>{timeAgo(incident.createdAt || new Date().toISOString())}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {incidents.filter(i => i.status === colStatus).length === 0 && (
                <p className="text-slate-600 text-sm text-center py-8">No incidents</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Report New Incident">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-lg text-sm">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Incident Title *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Unauthorized Login Attempt" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} placeholder="Describe the incident in detail..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Severity *</label>
            <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Reporting...' : 'Report Incident'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Incidents;
