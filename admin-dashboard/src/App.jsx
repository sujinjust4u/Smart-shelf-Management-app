import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings as SettingsIcon } from 'lucide-react';
import Overview from './pages/Overview';
import ShelfHistory from './pages/ShelfHistory';
import Settings from './pages/Settings';

const SidebarLink = ({ to, icon: Icon, children, colorClass }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
    >
      <Icon size={20} className={colorClass} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

const Sidebar = () => (
  <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
    <div className="p-6">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">ShelfStock Admin</h1>
    </div>
    <nav className="flex-1 px-4 space-y-2 mt-4">
      <SidebarLink to="/" icon={LayoutDashboard} colorClass="text-blue-400">Overview</SidebarLink>
      <SidebarLink to="/history" icon={History} colorClass="text-emerald-400">History Logs</SidebarLink>
      <div className="my-4 border-t border-slate-800"></div>
      <SidebarLink to="/settings" icon={SettingsIcon} colorClass="text-purple-400">Settings</SidebarLink>
    </nav>
    <div className="p-4 flex items-center bg-slate-950">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">A</div>
      <div className="ml-3">
        <p className="text-sm font-medium">Admin User</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/history" element={<ShelfHistory />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
