'use client';

import { useState, useEffect } from 'react';
import { Site } from '@/types/site';

interface UpdateSiteFormProps {
  onSuccess: () => void;
}

export default function UpdateSiteForm({ onSuccess }: UpdateSiteFormProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState({
    legacySiteId: '',
    newSiteId: '',
    status: '',
    technicianName: '',
    technicianEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const handleLegacySiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const legacyId = e.target.value;
    setFormData(prev => ({ ...prev, legacySiteId: legacyId }));
    
    const site = sites.find(s => s.legacyId === legacyId || s.siteId === legacyId);
    if (site) {
      setSelectedSite(site);
      setFormData(prev => ({
        ...prev,
        status: site.status,
        technicianName: site.technicianName,
        technicianEmail: site.technicianEmail,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.legacySiteId) {
      newErrors.legacySiteId = 'Please select a site to update';
    }

    if (!formData.technicianName.trim()) {
      newErrors.technicianName = 'Technician name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.technicianEmail.trim()) {
      newErrors.technicianEmail = 'Email is required';
    } else if (!emailRegex.test(formData.technicianEmail)) {
      newErrors.technicianEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('❌ Please fix all errors before submitting');
      return;
    }

    if (!selectedSite) {
      alert('❌ Please select a site to update');
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {
        technicianName: formData.technicianName,
        technicianEmail: formData.technicianEmail,
      };

      if (formData.status && formData.status !== selectedSite.status) {
        updateData.status = formData.status;
      }

      if (formData.newSiteId && formData.newSiteId !== selectedSite.siteId) {
        updateData.siteId = formData.newSiteId;
      }

      const response = await fetch(`/api/sites/${selectedSite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update site');
      }

      alert('✅ Site updated successfully!');
      setFormData({
        legacySiteId: '',
        newSiteId: '',
        status: '',
        technicianName: '',
        technicianEmail: '',
      });
      setSelectedSite(null);
      fetchSites();
      onSuccess();
    } catch (error: any) {
      console.error('Error updating site:', error);
      alert('❌ Failed to update site: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border-l-4 border-[#036B34] p-4 rounded">
        <p className="text-sm text-gray-700">
          <strong className="text-[#036B34]">Note:</strong> Select existing site by Legacy Site ID to update
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legacy Site ID - Dropdown */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Legacy Site ID (Select Existing) <span className="text-red-500">*</span>
          </label>
          <select
            name="legacySiteId"
            value={formData.legacySiteId}
            onChange={handleLegacySiteChange}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.legacySiteId ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select existing site</option>
            {sites.map(site => (
              <option key={site.id} value={site.legacyId || site.siteId}>
                {site.legacyId || site.siteId} - {site.siteId} ({site.city})
              </option>
            ))}
          </select>
          {errors.legacySiteId && <p className="text-red-500 text-sm mt-1">{errors.legacySiteId}</p>}
        </div>

        {/* New Site ID - Text Input */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            New Site ID (Optional)
          </label>
          <input
            type="text"
            name="newSiteId"
            value={formData.newSiteId}
            onChange={handleChange}
            placeholder="Enter new Site ID if renaming"
            disabled={!selectedSite}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">Leave empty to keep current: {selectedSite?.siteId}</p>
        </div>

        {/* Site Status */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Site Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!selectedSite}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Dismantled">Dismantled</option>
          </select>
        </div>

        {/* Current Info Display */}
        {selectedSite && (
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-[#036B34] mb-2">Current Site Information:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Site ID:</strong> {selectedSite.siteId}</div>
              <div><strong>Legacy ID:</strong> {selectedSite.legacyId}</div>
              <div><strong>Region:</strong> {selectedSite.region5}</div>
              <div><strong>City:</strong> {selectedSite.city}</div>
              <div><strong>Status:</strong> {selectedSite.status}</div>
              <div><strong>District:</strong> {selectedSite.district}</div>
            </div>
          </div>
        )}

        {/* Technician Name */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Technician Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="technicianName"
            value={formData.technicianName}
            onChange={handleChange}
            placeholder="Full name"
            disabled={!selectedSite}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.technicianName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.technicianName && <p className="text-red-500 text-sm mt-1">{errors.technicianName}</p>}
        </div>

        {/* Technician Email */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Technician Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="technicianEmail"
            value={formData.technicianEmail}
            onChange={handleChange}
            placeholder="email@example.com"
            disabled={!selectedSite}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.technicianEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.technicianEmail && <p className="text-red-500 text-sm mt-1">{errors.technicianEmail}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedSite}
        className="w-full bg-[#036B34] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#025228] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating Site...' : 'Update Site'}
      </button>
    </form>
  );
}