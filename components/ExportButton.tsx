'use client';

import { useState } from 'react';
import { downloadCSV } from '@/lib/utils';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sites');
      if (!response.ok) throw new Error('Failed to fetch sites');
      
      const sites = await response.json();
      downloadCSV(sites, 'salam_sites_export');
      
      alert('✅ Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-[#036B34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#025228] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <span>📥</span>
      <span>{loading ? 'Exporting...' : 'Export All Data to CSV'}</span>
    </button>
  );
}