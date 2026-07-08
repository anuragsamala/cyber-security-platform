import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

const Compliance = () => {
  const [frameworks] = useState([
    { name: 'ISO 27001', score: 85, controls: 114, passed: 97, failed: 17 },
    { name: 'NIST CSF', score: 92, controls: 108, passed: 100, failed: 8 },
    { name: 'CIS Controls', score: 78, controls: 153, passed: 120, failed: 33 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [auditForm, setAuditForm] = useState({ framework: 'ISO 27001', scope: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate audit run (can wire to backend audit endpoint later)
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(`Audit for ${auditForm.framework} initiated successfully! Results will appear in the Audit Log.`);
    setTimeout(() => { setShowModal(false); setSuccess(''); setAuditForm({ framework: 'ISO 27001', scope: '', notes: '' }); }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">Compliance Monitoring</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <Play size={16} className="mr-2" />
          Run Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frameworks.map((fw, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={fw.name}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 mr-3">
                  <FileText size={20} className="text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{fw.name}</h3>
              </div>
              <span className={`text-2xl font-bold ${fw.score >= 90 ? 'text-emerald-400' : fw.score >= 80 ? 'text-sky-400' : 'text-amber-400'}`}>
                {fw.score}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
              <div className={`h-full ${fw.score >= 90 ? 'bg-emerald-500' : fw.score >= 80 ? 'bg-sky-500' : 'bg-amber-500'}`} style={{ width: `${fw.score}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center text-emerald-400 mb-1"><CheckCircle size={14} className="mr-1" /> Passed</div>
                <span className="text-xl font-semibold text-white">{fw.passed}</span>
                <span className="text-slate-500 text-xs ml-1">controls</span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center text-red-400 mb-1"><XCircle size={14} className="mr-1" /> Failed</div>
                <span className="text-xl font-semibold text-white">{fw.failed}</span>
                <span className="text-slate-500 text-xs ml-1">controls</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSuccess(''); }} title="Run Compliance Audit">
        <form onSubmit={handleRunAudit} className="space-y-4">
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-lg text-sm">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Framework *</label>
            <select value={auditForm.framework} onChange={e => setAuditForm({...auditForm, framework: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
              <option>ISO 27001</option>
              <option>NIST CSF</option>
              <option>CIS Controls</option>
              <option>GDPR</option>
              <option>PCI DSS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Audit Scope</label>
            <input value={auditForm.scope} onChange={e => setAuditForm({...auditForm, scope: e.target.value})} placeholder="e.g. Network Infrastructure, HR Systems" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea value={auditForm.notes} onChange={e => setAuditForm({...auditForm, notes: e.target.value})} rows={3} placeholder="Any additional notes for the audit team..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Running Audit...' : 'Start Audit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Compliance;
