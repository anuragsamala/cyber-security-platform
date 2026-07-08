import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Server, AlertTriangle, FileText, Settings, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Assets', path: '/assets', icon: <Server size={20} /> },
    { name: 'Incidents', path: '/incidents', icon: <AlertTriangle size={20} /> },
    { name: 'Risks', path: '/risks', icon: <Activity size={20} /> },
    { name: 'Compliance', path: '/compliance', icon: <FileText size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <Shield className="text-teal-400 mr-3" size={28} />
        <span className="text-xl font-bold text-white tracking-wide">CyberIQ</span>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`
            }
          >
            {item.icon}
            <span className="ml-3 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900 rounded-lg p-4 flex flex-col items-center border border-slate-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-16 h-16 bg-sky-500/20 blur-xl rounded-full"></div>
           <span className="text-sm font-semibold text-slate-300 relative z-10">AI Assistant</span>
           <Link to="/ai-assistant" className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-4 rounded-full transition-colors relative z-10 block text-center">
             Ask Gemini
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
