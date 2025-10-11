'use client';

import { useState } from 'react';
import { Site } from '@/types/site';

interface SitesTableProps {
  sites: Site[];
  onClose: () => void;
  title: string;
}

export default function SitesTable({ sites, onClose, title }: SitesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site =>
    site.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.region5.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-[#036B34] text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search by Site ID, City, or Region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#036B34]"
          />
        </div>

        <div className="overflow-auto flex-1 p-4">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 text-left font-semibold text-[#036B34]">Site ID</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">Legacy ID</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">Region</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">City</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">District</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">Status</th>
                <th className="p-3 text-left font-semibold text-[#036B34]">Technician</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No sites found
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr key={site.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{site.siteId}</td>
                    <td className="p-3">{site.legacyId || '-'}</td>
                    <td className="p-3">{site.region5}</td>
                    <td className="p-3">{site.city}</td>
                    <td className="p-3">{site.district}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        site.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {site.status === 'Active' ? 'Active Site' : 'Inactive Site'}
                      </span>
                    </td>
                    <td className="p-3">{site.technicianName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <p className="text-gray-600">
            Showing {filteredSites.length} of {sites.length} sites
          </p>
        </div>
      </div>
    </div>
  );
}