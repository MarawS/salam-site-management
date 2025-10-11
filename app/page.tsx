'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import StatsDashboard from '@/components/StatsDashboard';
import SiteManagementForm from '@/components/SiteManagementForm';
import ExportButton from '@/components/ExportButton';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    // Trigger refresh of statistics
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#036B34] mb-2">
            Site Management System
          </h1>
          <p className="text-gray-600">
            Manage and track site installations
          </p>
        </div>

        {/* Statistics Dashboard */}
        <StatsDashboard key={refreshKey} />

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <ExportButton />
        </div>

        {/* Site Management Form */}
        <SiteManagementForm onSuccess={handleFormSuccess} />
      </main>
    </div>
  );
}