import React from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search assets, incidents, policies..." 
          className="bg-transparent border-none outline-none text-sm text-slate-200 ml-2 w-full placeholder-slate-500"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
          <UserCircle size={28} className="text-slate-300" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">
              {user.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
            </span>
            <span className="text-xs text-slate-500">
              {user.role?.replace('_', ' ') || 'Guest'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-2 p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
