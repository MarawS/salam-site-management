'use client';

import { useState } from 'react';
import NewSiteForm from './NewSiteForm';
import UpdateSiteForm from './UpdateSiteForm';

interface SiteManagementFormProps {
  onSuccess: () => void;
}

export default function SiteManagementForm({ onSuccess }: SiteManagementFormProps) {
  const [activeTab, setActiveTab] = useState<'update' | 'new'>('new');

  return (
    <div className="bg-white rounded-xl p-8 shadow-md">
      {/* Action Buttons - Add New Site LEFT, Update RIGHT */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <button
          onClick={() => setActiveTab('new')}
          className={`p-6 border-2 rounded-lg font-semibold text-lg transition-all ${
            activeTab === 'new'
              ? 'bg-[#036B34] text-white border-[#036B34]'
              : 'bg-white text-[#036B34] border-[#036B34] hover:bg-[#036B34] hover:text-white'
          }`}
        >
          Add New Site
        </button>
        
        <button
          onClick={() => setActiveTab('update')}
          className={`p-6 border-2 rounded-lg font-semibold text-lg transition-all ${
            activeTab === 'update'
              ? 'bg-[#036B34] text-white border-[#036B34]'
              : 'bg-white text-[#036B34] border-[#036B34] hover:bg-[#036B34] hover:text-white'
          }`}
        >
          Update Existing Site
        </button>
      </div>

      <h2 className="text-[#036B34] text-2xl font-bold mb-6 pb-3 border-b-4 border-[#036B34]">
        {activeTab === 'update' ? 'Update Existing Site' : 'Add New Site'}
      </h2>

      {activeTab === 'update' ? (
        <UpdateSiteForm onSuccess={onSuccess} />
      ) : (
        <NewSiteForm onSuccess={onSuccess} />
      )}
    </div>
  );
}