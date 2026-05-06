import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ShelfHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/history`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const exportToCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['ID', 'Date & Time', 'Status', 'Items Count', 'Image Ref'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    history.forEach(log => {
      const values = [
        log.id,
        `"${new Date(log.timestamp).toLocaleString()}"`,
        log.status,
        log.item_count,
        `"${log.image_url || 'N/A'}"`
      ];
      csvRows.push(values.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `shelf_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Detection History</h3>
        <button 
          onClick={exportToCSV}
          disabled={history.length === 0}
          className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium transition-colors ${history.length === 0 ? 'text-gray-400 opacity-50 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading history logs...</div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Camera className="text-gray-300 w-16 h-16 mb-4" />
            <h4 className="text-lg font-medium text-gray-900">No detection logs yet</h4>
            <p className="text-gray-500 mt-2 text-sm max-w-sm">Use the mobile app to scan a shelf and it will appear here.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items Count</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image Ref</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {history.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      log.status === 'EMPTY' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {log.status === 'EMPTY' && <AlertCircle size={12} className="mr-1.5 inline" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.item_count} <span className="text-gray-400 font-normal">items</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    {log.image_url || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
