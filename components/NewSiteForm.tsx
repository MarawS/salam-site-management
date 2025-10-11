'use client';

import { useState, useEffect } from 'react';
import { regionData, cityData } from '@/lib/utils';

interface NewSiteFormProps {
  onSuccess: () => void;
}

export default function NewSiteForm({ onSuccess }: NewSiteFormProps) {
  const [formData, setFormData] = useState({
    siteId: '',
    region5: '',
    region13: '',
    city: '',
    district: '',
    latitude: '',
    longitude: '',
    installationDate: '',
    technicianName: '',
    technicianEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [region13Options, setRegion13Options] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  useEffect(() => {
    if (formData.region5) {
      setRegion13Options(regionData[formData.region5] || []);
      setFormData(prev => ({ ...prev, region13: '', city: '' }));
    }
  }, [formData.region5]);

  useEffect(() => {
    if (formData.region13) {
      setCityOptions(cityData[formData.region13] || []);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.region13]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siteId.trim()) newErrors.siteId = 'Site ID is required';
    if (!formData.region5) newErrors.region5 = 'Region5 is required';
    if (!formData.region13) newErrors.region13 = 'Region13 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    
    const lat = parseFloat(formData.latitude);
    if (!formData.latitude || isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Valid latitude required (-90 to 90)';
    }
    
    const lng = parseFloat(formData.longitude);
    if (!formData.longitude || isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Valid longitude required (-180 to 180)';
    }
    
    if (!formData.installationDate) {
      newErrors.installationDate = 'Installation date is required';
    } else if (new Date(formData.installationDate) > new Date()) {
      newErrors.installationDate = 'Future dates not allowed';
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

    setLoading(true);

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Site ID already exists') {
          setErrors({ siteId: 'This Site ID already exists' });
          alert('❌ Site ID already exists in database');
        } else {
          throw new Error(data.error || 'Failed to create site');
        }
        return;
      }

      alert('✅ Site created successfully!');
      setFormData({
        siteId: '',
        region5: '',
        region13: '',
        city: '',
        district: '',
        latitude: '',
        longitude: '',
        installationDate: '',
        technicianName: '',
        technicianEmail: '',
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error creating site:', error);
      alert('❌ Failed to create site: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border-l-4 border-[#036B34] p-4 rounded">
        <p className="text-sm text-gray-700">
          <strong className="text-[#036B34]">Note:</strong> All fields are required to create a new site
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site ID */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Site ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="siteId"
            value={formData.siteId}
            onChange={handleChange}
            placeholder="e.g., JDSD0001"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.siteId ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.siteId && <p className="text-red-500 text-sm mt-1">{errors.siteId}</p>}
        </div>

        {/* Region5 */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Region5 <span className="text-red-500">*</span>
          </label>
          <select
            name="region5"
            value={formData.region5}
            onChange={handleChange}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.region5 ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select Region</option>
            <option value="Central">Central</option>
            <option value="Northern">Northern</option>
            <option value="Eastern">Eastern</option>
            <option value="Western">Western</option>
            <option value="Southern">Southern</option>
          </select>
          {errors.region5 && <p className="text-red-500 text-sm mt-1">{errors.region5}</p>}
        </div>

        {/* Region13 */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Region13 <span className="text-red-500">*</span>
          </label>
          <select
            name="region13"
            value={formData.region13}
            onChange={handleChange}
            disabled={!formData.region5}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.region13 ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select Administrative Region</option>
            {region13Options.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {errors.region13 && <p className="text-red-500 text-sm mt-1">{errors.region13}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!formData.region13}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select City</option>
            {cityOptions.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* District */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District name"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Latitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.00000001"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="21.55881111"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.latitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Longitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.00000001"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="39.11936944"
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.longitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
        </div>

        {/* Installation Date */}
        <div>
          <label className="block text-[#036B34] font-semibold mb-2">
            Installation Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="installationDate"
            value={formData.installationDate}
            onChange={handleChange}
            max={today}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.installationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.installationDate && <p className="text-red-500 text-sm mt-1">{errors.installationDate}</p>}
        </div>

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
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
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
            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#036B34] ${
              errors.technicianEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.technicianEmail && <p className="text-red-500 text-sm mt-1">{errors.technicianEmail}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#036B34] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#025228] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Site...' : 'Create New Site'}
      </button>
    </form>
  );
}