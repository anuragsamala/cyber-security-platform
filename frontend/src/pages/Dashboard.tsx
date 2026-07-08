import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, TrendingUp, Activity, Download, X } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, icon, trend, colorClass }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20`}>{icon}</div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp size={16} className="text-emerald-400 mr-1" />
      <span className="text-emerald-400">{trend}%</span>
      <span className="text-slate-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

import api from '../api/axios';

const Dashboard = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('Full Security Summary');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  // Real stats state
  const [stats, setStats] = useState({
    securityScore: 0,
    activeThreats: 0,
    compliancePercent: 0,
    openIncidents: 0,
    trendData: [0, 0, 0, 0, 0, 0],
    monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    doughnutData: [0, 0, 0]
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  const barChartData = {
    labels: stats.monthLabels,
    datasets: [{ label: 'Security Score', data: stats.trendData, backgroundColor: 'rgba(14, 165, 233, 0.8)', borderRadius: 4 }],
  };

  const doughnutData = {
    labels: ['Passed', 'Failed', 'Missing'],
    datasets: [{
      data: stats.doughnutData,
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#cbd5e1' } } },
    cutout: '75%'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">Security Dashboard</h1>
        <button
          onClick={() => { setShowReportModal(true); setGenerated(false); }}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20"
        >
          <Download size={16} className="mr-2" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall Security Score" value={`${stats.securityScore}/100`} icon={<ShieldCheck size={24} className="text-sky-400" />} trend={stats.securityScore >= 80 ? "+5.2" : "-2.1"} colorClass="bg-sky-500" />
        <StatCard title="Active Threat Alerts" value={stats.activeThreats.toString()} icon={<AlertOctagon size={24} className="text-red-400" />} trend={stats.activeThreats > 0 ? "+1" : "0"} colorClass="bg-red-500" />
        <StatCard title="Compliance %" value={`${stats.compliancePercent}%`} icon={<Activity size={24} className="text-purple-400" />} trend={stats.compliancePercent >= 90 ? "+2.1" : "-1.4"} colorClass="bg-purple-500" />
        <StatCard title="Open Incidents" value={stats.openIncidents.toString()} icon={<TrendingUp size={24} className="text-amber-400" />} trend={stats.openIncidents > 5 ? "+3" : "-1"} colorClass="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Security Score Trend</h3>
          <div className="h-72"><Bar data={barChartData} options={chartOptions} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative">
          <h3 className="text-lg font-semibold text-white mb-4">ISO 27001 Compliance</h3>
          <div className="h-64 relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center -mt-6">
              <span className="text-3xl font-bold text-white">{stats.compliancePercent}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md z-10">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white">Generate Security Report</h2>
                <button onClick={() => setShowReportModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6">
                {!generated ? (
                  <form onSubmit={handleGenerateReport} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Report Type</label>
                      <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
                        <option>Full Security Summary</option>
                        <option>Compliance Report</option>
                        <option>Incident Report</option>
                        <option>Risk Assessment Report</option>
                        <option>Asset Inventory Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Date Range</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last 12 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Format</label>
                      <div className="flex gap-3">
                        {['PDF', 'CSV', 'JSON'].map(f => (
                          <label key={f} className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="format" value={f} defaultChecked={f === 'PDF'} className="accent-sky-500" />
                            <span className="text-slate-300 text-sm">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                      <button type="submit" disabled={generating} className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                        {generating ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Report Ready!</h3>
                    <p className="text-slate-400 text-sm mb-6">{reportType} has been generated successfully.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowReportModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors">
                        Close
                      </button>
                      <button onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob(["This is a generated demo report for " + reportType + "\n\nIn a full production environment, this would be a real PDF, CSV, or JSON file containing actual system data."], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `${reportType.replace(/\\s+/g, '_')}_Report.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                        <Download size={16} className="mr-2" />
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
