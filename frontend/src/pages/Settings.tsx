import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-white tracking-wide">Platform Settings</h1>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Institution Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Institution Name</label>
              <input type="text" defaultValue="CyberIQ University" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Contact Email</label>
              <input type="email" defaultValue="admin@cyberiq.edu" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 text-slate-300">
              <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-sky-500 rounded border-slate-600 bg-slate-900" />
              <span>Email alerts for Critical Incidents</span>
            </label>
            <label className="flex items-center space-x-3 text-slate-300">
              <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-sky-500 rounded border-slate-600 bg-slate-900" />
              <span>Weekly Compliance Reports</span>
            </label>
            <label className="flex items-center space-x-3 text-slate-300">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-sky-500 rounded border-slate-600 bg-slate-900" />
              <span>SMS alerts for High Risks</span>
            </label>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 flex justify-end">
           <button className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-sky-500/20">
             <Save size={18} className="mr-2" />
             Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
