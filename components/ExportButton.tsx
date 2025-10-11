'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
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
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-[#036B34] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#025228] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Exporting...' : 'Export All Data to CSV'}
    </button>
  );
}