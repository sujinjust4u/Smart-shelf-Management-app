import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Overview() {
  const [stats, setStats] = useState({ total_checks: 0, empty_shelves: 0, stocked: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-500 flex items-center justify-center p-12">Loading overview...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900">Live Store Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Checks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_checks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-50 flex items-start space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Empty Shelves</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.empty_shelves}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 flex items-start space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Stocked Shelves</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.stocked}</p>
          </div>
        </div>
      </div>

      {/* Decorative Mock Heatmap Section */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Store Layout Heatmap (Mock)</h4>
        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`h-24 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-inner transition-colors duration-500 ${
                i === 2 || i === 5 ? 'bg-red-500/80 animate-pulse' : 'bg-emerald-400/80'
              }`}
            >
              Aisle {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
