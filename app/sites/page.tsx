'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SiteForm from '@/components/SiteForm';

export default function SitesPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'update'>('add');
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSites();
  }, [searchTerm]);

  const fetchSites = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/sites?${params}`);
      const data = await response.json();

      setSites(data || []);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const handleAddSite = async (formData: any) => {
    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 409) {
        setMessage(`⚠️ Site Already Exists: ${data.existingSite.Site_ID}`);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add site');
      }

      setMessage('✅ Site added successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchSites();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleUpdateSite = async (formData: any) => {
    if (!selectedSite) return;

    try {
      const response = await fetch(`/api/sites/${selectedSite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update site');
      }

      setMessage('✅ Site updated successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSelectedSite(null);
      fetchSites();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleDeleteSite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this site? This will also affect associated devices.')) return;

    try {
      const response = await fetch(`/api/sites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete site');
      }

      setMessage('✅ Site deleted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchSites();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/sites');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sites.csv';
      a.click();
    } catch (error) {
      alert('Failed to export sites');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/sites', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setMessage(
        `Import Complete: ${data.success} succeeded, ${data.failed} failed. ${
          data.errors.length > 0 ? 'Check console for errors.' : ''
        }`
      );
      if (data.errors.length > 0) {
        console.error('Import errors:', data.errors);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      fetchSites();
    } catch (error) {
      setMessage('❌ Failed to import sites');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }

    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold">salam</div>
          </div>
          <nav className="mt-4 flex space-x-6">
            <Link
              href="/"
              className="text-white font-medium hover:text-green-200 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/devices"
              className="text-white font-medium hover:text-green-200 transition-colors"
            >
              Devices
            </Link>
            <Link
              href="/sites"
              className="text-white font-medium border-b-2 border-white pb-1"
            >
              Sites
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        {showError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('add');
              setSelectedSite(null);
            }}
            className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
              activeTab === 'add'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700'
            }`}
          >
            Add New Site
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
              activeTab === 'update'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700'
            }`}
          >
            Update Existing Site
          </button>
        </div>

        {/* Add New Site Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Add New Site
            </h2>
            <SiteForm onSubmit={handleAddSite} />
          </div>
        )}

        {/* Update Existing Site Tab */}
        {activeTab === 'update' && (
          <div className="space-y-8">
            {/* Import/Export Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export CSV
              </button>
              <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search Sites
              </h3>
              <input
                type="text"
                placeholder="Search by Site ID, City, or Region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sites Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Site ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Site Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Devices
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sites.map((site: any) => (
                      <tr key={site.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {site.Site_ID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {site.City || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {site.Region5 || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {site.Site_Type || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              site.Status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {site.Status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {site._count?.devices || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedSite(site)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Form */}
            {selectedSite && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-green-800">
                    Update Site
                  </h2>
                  <button
                    onClick={() => setSelectedSite(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Close
                  </button>
                </div>
                <SiteForm
                  onSubmit={handleUpdateSite}
                  initialData={selectedSite}
                  isUpdate
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}