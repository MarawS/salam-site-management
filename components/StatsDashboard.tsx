'use client';

import { useEffect, useState } from 'react';
import { SiteStats, Site } from '@/types/site';
import SitesTable from './SitesTable';

export default function StatsDashboard() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<Site[]>([]);
  const [tableTitle, setTableTitle] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/sites/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatClick = async (type: 'total' | 'active' | 'inactive') => {
    try {
      const response = await fetch('/api/sites');
      let sites = await response.json();

      if (type === 'active') {
        sites = sites.filter((s: Site) => s.status === 'Active');
        setTableTitle('Active Sites');
      } else if (type === 'inactive') {
        sites = sites.filter((s: Site) => s.status === 'Inactive');
        setTableTitle('Inactive Sites');
      } else {
        setTableTitle('All Sites');
      }

      setTableData(sites);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading statistics...</div>;

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-md mb-8">
        <h2 className="text-[#036B34] text-2xl font-bold mb-6 border-b-4 border-[#036B34] pb-3">
          Site Statistics Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div 
            onClick={() => handleStatClick('total')}
            className="bg-gradient-to-br from-[#036B34] to-[#025228] p-6 rounded-lg text-white text-center shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="text-5xl font-bold mb-2">{stats?.total || 0}</div>
            <div className="text-sm uppercase tracking-wide opacity-90">Total Sites</div>
          </div>
          
          <div 
            onClick={() => handleStatClick('active')}
            className="bg-gradient-to-br from-[#036B34] to-[#025228] p-6 rounded-lg text-white text-center shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="text-5xl font-bold mb-2">{stats?.active || 0}</div>
            <div className="text-sm uppercase tracking-wide opacity-90">Active Sites</div>
          </div>
          
          <div 
            onClick={() => handleStatClick('inactive')}
            className="bg-gradient-to-br from-[#036B34] to-[#025228] p-6 rounded-lg text-white text-center shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="text-5xl font-bold mb-2">{stats?.inactive || 0}</div>
            <div className="text-sm uppercase tracking-wide opacity-90">Inactive Sites</div>
          </div>
        </div>

        <h3 className="text-[#036B34] text-xl font-semibold mb-4">Sites by Region</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats?.byRegion && Object.entries(stats.byRegion).sort().map(([region, count]) => (
            <div key={region} className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#036B34]">
              <div className="font-semibold text-[#036B34] mb-2">{region}</div>
              <div className="text-3xl font-bold text-gray-800">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {showTable && (
        <SitesTable
          sites={tableData}
          title={tableTitle}
          onClose={() => setShowTable(false)}
        />
      )}
    </>
  );
}