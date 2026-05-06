import React, { useState } from 'react';
import { Save, Bell, Shield, User } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900">Admin Settings</h3>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center space-x-3 bg-gray-50/50">
          <User className="text-blue-500" size={24} />
          <h4 className="text-lg font-semibold text-gray-800">Profile Information</h4>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" defaultValue="Main St. Grocery" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input type="email" defaultValue="admin@shelfstock.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center space-x-3 bg-gray-50/50">
          <Bell className="text-emerald-500" size={24} />
          <h4 className="text-lg font-semibold text-gray-800">Alert Preferences</h4>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30">
            <div>
              <h5 className="font-medium text-gray-800">Empty Shelf Warnings</h5>
              <p className="text-sm text-gray-500">Send an email when a shelf is flagged as EMPTY.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30">
            <div>
              <h5 className="font-medium text-gray-800">Daily Digest Report</h5>
              <p className="text-sm text-gray-500">Receive a summary of all scans at 8:00 PM.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <div className="flex items-center space-x-4">
          {saved && <span className="text-emerald-600 font-medium animate-pulse">Changes saved successfully!</span>}
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
