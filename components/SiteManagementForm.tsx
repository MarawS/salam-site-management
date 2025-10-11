'use client';

import { useState } from 'react';
import NewSiteForm from './NewSiteForm';
import UpdateSiteForm from './UpdateSiteForm';

interface SiteManagementFormProps {
  onSuccess: () => void;
}

export default function SiteManagementForm({ onSuccess }: SiteManagementFormProps) {
  const [activeTab, setActiveTab] = useState<'update' | 'new'>('update');

  return (
    <div className="bg-white rounded-xl p-8 shadow-md">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <button
          onClick={() => setActiveTab('update')}
          className={`p-6 border-2 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            activeTab === 'update'
              ? 'bg-[#036B34] text-white border-[#036B34]'
              : 'bg-white text-[#036B34] border-[#036B34] hover:bg-[#036B34] hover:text-white'
          }`}
        >
          <span className="text-2xl">📝</span>
          <span>Update Existing Site</span>
        </button>
        
        <button
          onClick={() => setActiveTab('new')}
          className={`p-6 border-2 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            activeTab === 'new'
              ? 'bg-[#036B34] text-white border-[#036B34]'
              : 'bg-white text-[#036B34] border-[#036B34] hover:bg-[#036B34] hover:text-white'
          }`}
        >
          <span className="text-2xl">➕</span>
          <span>Create New Site</span>
        </button>
      </div>

      {/* Form Title */}
      <h2 className="text-[#036B34] text-2xl font-bold mb-6 pb-3 border-b-4 border-[#036B34]">
        {activeTab === 'update' ? 'Update Existing Site' : 'Create New Site'}
      </h2>

      {/* Forms */}
      {activeTab === 'update' ? (
        <UpdateSiteForm onSuccess={onSuccess} />
      ) : (
        <NewSiteForm onSuccess={onSuccess} />
      )}
    </div>
  );
}