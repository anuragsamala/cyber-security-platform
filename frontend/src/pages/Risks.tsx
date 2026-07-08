import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Modal from '../components/Modal';

const Risks = () => {
  const [risks, setRisks] = useState<any[]>([
    { id: 'RSK-001', title: 'Outdated Server OS', likelihood: 4, impact: 4, riskScore: 16, level: 'CRITICAL', mitigationPlan: 'Upgrade Ubuntu to 22.04 LTS' },
    { id: 'RSK-002', title: 'Weak Admin Passwords', likelihood: 3, impact: 5, riskScore: 15, level: 'HIGH', mitigationPlan: 'Enforce MFA and complex passwords' },
    { id: 'RSK-003', title: 'Unencrypted Backups', likelihood: 2, impact: 4, riskScore: 8, level: 'MEDIUM', mitigationPlan: 'Enable AES-256 on backup drives' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', likelihood: 3, impact: 3, mitigationPlan: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/risks').then(r => { if (r.data?.length) setRisks(r.data); }).catch(() => {});
  }, []);

  const getRiskLevel = (score: number) => {
    if (score >= 16) return 'CRITICAL';
    if (score >= 10) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    return 'LOW';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const score = form.likelihood * form.impact;
    const level = getRiskLevel(score);
    try {
      const response = await api.post('/risks', { ...form, riskScore: score, level });
      setRisks(prev => [response.data, ...prev]);
      setSuccess('Risk identified successfully!');
      setTimeout(() => { setShowModal(false); setSuccess(''); setForm({ title: '', description: '', likelihood: 3, impact: 3, mitigationPlan: '' }); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add risk');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-purple-500';
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const previewScore = form.likelihood * form.impact;
  const previewLevel = getRiskLevel(previewScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">Risk Assessment</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <Plus size={18} className="mr-2" />
          Identify New Risk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {risks.map((risk, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={risk.id}
              className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">{risk.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${getLevelColor(risk.level)}`}>{risk.level}</span>
              </div>
              {risk.mitigationPlan && <p className="text-sm text-slate-400 mb-4">Mitigation Plan: {risk.mitigationPlan}</p>}
              <div className="flex space-x-6 text-sm">
                <div className="flex items-center text-slate-300">
                  <span className="text-slate-500 mr-2">Likelihood:</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-4 rounded-sm ${i <= (risk.likelihood || 0) ? 'bg-sky-500' : 'bg-slate-700'}`}></div>)}
                  </div>
                </div>
                <div className="flex items-center text-slate-300">
                  <span className="text-slate-500 mr-2">Impact:</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-4 rounded-sm ${i <= (risk.impact || 0) ? 'bg-red-500' : 'bg-slate-700'}`}></div>)}
                  </div>
                </div>
                <div className="flex items-center text-slate-300 font-bold">
                  <span className="text-slate-500 mr-2 font-normal">Score:</span> {risk.riskScore}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Matrix</h3>
          <div className="grid grid-cols-5 grid-rows-5 gap-1 h-64 bg-slate-900 p-2 rounded-lg relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500 font-bold">LIKELIHOOD</div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-bold">IMPACT</div>
            {Array.from({ length: 25 }).map((_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const r = (5 - row) * (col + 1);
              let bg = 'bg-emerald-500/20 hover:bg-emerald-500/40';
              if (r > 15) bg = 'bg-purple-500/40 hover:bg-purple-500/60';
              else if (r > 10) bg = 'bg-red-500/40 hover:bg-red-500/60';
              else if (r > 5) bg = 'bg-amber-500/30 hover:bg-amber-500/50';
              return (
                <div key={i} className={`rounded-sm transition-colors cursor-pointer ${bg} flex items-center justify-center`}>
                  {risks.some(rk => rk.riskScore === r) ? <AlertTriangle size={10} className="text-white/70" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Identify New Risk">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-lg text-sm">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Risk Title *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Outdated Server OS" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Describe the risk..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Likelihood (1–5): <span className="text-sky-400">{form.likelihood}</span></label>
              <input type="range" min={1} max={5} value={form.likelihood} onChange={e => setForm({...form, likelihood: +e.target.value})} className="w-full accent-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Impact (1–5): <span className="text-red-400">{form.impact}</span></label>
              <input type="range" min={1} max={5} value={form.impact} onChange={e => setForm({...form, impact: +e.target.value})} className="w-full accent-red-500" />
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
            <span className="text-slate-400 text-sm">Risk Score: <span className="text-white font-bold">{previewScore}</span></span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${getLevelColor(previewLevel)}`}>{previewLevel}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mitigation Plan</label>
            <textarea value={form.mitigationPlan} onChange={e => setForm({...form, mitigationPlan: e.target.value})} rows={2} placeholder="How will this risk be mitigated?" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Saving...' : 'Add Risk'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Risks;
