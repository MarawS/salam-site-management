'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DeviceForm from '@/components/DeviceForm';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'update'>('add');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterDeviceType, setFilterDeviceType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDevices();
  }, [currentPage, searchTerm, filterVendor, filterDeviceType]);

  const fetchDevices = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterVendor && { vendor: filterVendor }),
        ...(filterDeviceType && { deviceType: filterDeviceType }),
      });

      const response = await fetch(`/api/devices?${params}`);
      const data = await response.json();

      setDevices(data.devices || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const handleAddDevice = async (formData: any) => {
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Duplicate found
        setMessage(
          `⚠️ Device Already Exists: ${data.existingDevice.NE_Name} at Site ${data.existingDevice.Site_ID}`
        );
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add device');
      }

      setMessage('✅ Device added successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchDevices();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleUpdateDevice = async (formData: any) => {
    if (!selectedDevice) return;

    try {
      const response = await fetch(`/api/devices/${selectedDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 409) {
        setMessage(`⚠️ Update Conflict: ${data.message}`);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update device');
      }

      setMessage('✅ Device updated successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSelectedDevice(null);
      fetchDevices();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete device');
      }

      setMessage('✅ Device deleted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchDevices();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/devices');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devices.csv';
      a.click();
    } catch (error) {
      alert('Failed to export devices');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/devices', {
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
      fetchDevices();
    } catch (error) {
      setMessage('❌ Failed to import devices');
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
              className="text-white font-medium border-b-2 border-white pb-1"
            >
              Devices
            </Link>
            <Link
              href="/sites"
              className="text-white font-medium hover:text-green-200 transition-colors"
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
              setSelectedDevice(null);
            }}
            className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
              activeTab === 'add'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700'
            }`}
          >
            Add New Device
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
              activeTab === 'update'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700'
            }`}
          >
            Update Existing Device
          </button>
        </div>

        {/* Add New Device Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Add New Device
            </h2>
            <DeviceForm onSubmit={handleAddDevice} />
          </div>
        )}

        {/* Update Existing Device Tab */}
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

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search & Filter
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search by NE Name, Site ID, Serial..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter by Vendor"
                  value={filterVendor}
                  onChange={(e) => {
                    setFilterVendor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Filter by Device Type"
                  value={filterDeviceType}
                  onChange={(e) => {
                    setFilterDeviceType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Devices Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        NE Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Site ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Device Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devices.map((device: any) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {device.NE_Name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {device.Site_ID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {device.Vendor || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {device.Device_Type || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              device.Status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {device.Status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedDevice(device)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDevice(device.id)}
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

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Form */}
            {selectedDevice && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-green-800">
                    Update Device
                  </h2>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Close
                  </button>
                </div>
                <DeviceForm
                  onSubmit={handleUpdateDevice}
                  initialData={selectedDevice}
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