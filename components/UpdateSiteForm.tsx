'use client';

import { useState, useEffect } from 'react';
import { Site } from '@/types/site';
import toast from 'react-hot-toast';

interface UpdateSiteFormProps {
  onSuccess: () => void;
}

interface UpdateData {
  technicianName: string;
  technicianEmail: string;
  status: string;
  siteId?: string;
  legacyId?: string;
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

  // Live preview of current site info
  const [livePreview, setLivePreview] = useState<Site | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  // Update live preview when form data changes
  useEffect(() => {
    if (selectedSite) {
      setLivePreview({
        ...selectedSite,
        siteId: formData.newSiteId || selectedSite.siteId,
        status: formData.status || selectedSite.status,
        technicianName: formData.technicianName,
        technicianEmail: formData.technicianEmail,
      });
    }
  }, [formData, selectedSite]);

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
        newSiteId: '',
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

    if (!formData.newSiteId.trim()) {
      newErrors.newSiteId = 'New Site ID is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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
      toast.error('Please fix all errors before submitting');
      return;
    }

    if (!selectedSite) {
      toast.error('Please select a site to update');
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateData = {
        technicianName: formData.technicianName,
        technicianEmail: formData.technicianEmail,
        status: formData.status,
      };

      // Set the new siteId and keep legacyId as the old siteId
      if (formData.newSiteId && formData.newSiteId !== selectedSite.siteId) {
        updateData.siteId = formData.newSiteId;
        updateData.legacyId = formData.legacySiteId;
      }

      const response = await fetch(`/api/sites/${selectedSite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Site ID already exists') {
          setErrors({ newSiteId: 'This Site ID already exists in the database' });
          toast.error('Site ID already exists. Please use a different ID.');
        } else {
          throw new Error(data.error || 'Failed to update site');
        }
        setLoading(false);
        return;
      }

      toast.success('Site updated successfully!');
      setFormData({
        legacySiteId: '',
        newSiteId: '',
        status: '',
        technicianName: '',
        technicianEmail: '',
      });
      setSelectedSite(null);
      setLivePreview(null);
      fetchSites();
      onSuccess();
    } catch (error: unknown) {
      console.error('Error updating site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update site: ' + errorMessage);
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
                {site.legacyId || site.siteId}
              </option>
            ))}
          </select>
          {errors.legacySiteId && <p className="text-red-500 text-sm mt-1">{errors.legacySiteId}</p>}
        </div>

        {/* New Site ID - Required */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            New Site ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="newSiteId"
            value={formData.newSiteId}
            onChange={handleChange}
            placeholder="Enter new Site ID"
            disabled={!selectedSite}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.newSiteId ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.newSiteId && <p className="text-red-500 text-sm mt-1">{errors.newSiteId}</p>}
        </div>

        {/* Site Status - Required */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Site Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!selectedSite}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        {/* Live Preview - Current Info Display */}
        {livePreview && (
          <div className="col-span-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
            <h4 className="font-semibold text-[#036B34] mb-3 flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Preview - Current Site Information:
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">Legacy Site ID:</strong> 
                <span className="ml-2 text-gray-900">{livePreview.legacyId || selectedSite?.siteId}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">New Site ID:</strong> 
                <span className="ml-2 text-blue-600 font-semibold">{livePreview.siteId}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">Region:</strong> 
                <span className="ml-2 text-gray-900">{livePreview.region5}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">City:</strong> 
                <span className="ml-2 text-gray-900">{livePreview.city}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">Status:</strong> 
                <span className={`ml-2 font-semibold ${livePreview.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  {livePreview.status}
                </span>
              </div>
              <div className="bg-white p-2 rounded">
                <strong className="text-gray-600">District:</strong> 
                <span className="ml-2 text-gray-900">{livePreview.district}</span>
              </div>
              <div className="bg-white p-2 rounded col-span-2">
                <strong className="text-gray-600">Technician:</strong> 
                <span className="ml-2 text-gray-900">{livePreview.technicianName}</span>
                <span className="ml-2 text-gray-500">({livePreview.technicianEmail})</span>
              </div>
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