'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import StatsDashboard from '@/components/StatsDashboard';
import SiteManagementForm from '@/components/SiteManagementForm';
import ExportButton from '@/components/ExportButton';
import BulkUploadModal from '@/components/BulkUploadModal';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const handleFormSuccess = () => {
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
            To Manage and Store sites
          </p>
        </div>

        <StatsDashboard key={refreshKey} />

        <SiteManagementForm onSuccess={handleFormSuccess} />

        {/* Export & Bulk Upload Buttons - After Forms */}
        <div className="flex justify-center gap-4 mt-6">
          <ExportButton />
          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-[#036B34] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#025228] transition-all"
          >
            Bulk Upload Sites
          </button>
        </div>
      </main>

      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}