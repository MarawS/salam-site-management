'use client';

import { useState } from 'react';
import SearchableSelect from './SearchableSelect';
import { SITE_TYPES, STATUSES, REGIONS_5, REGIONS_13 } from '@/lib/constants';

interface SiteFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isUpdate?: boolean;
}

type SiteFormData = {
  Site_ID: string;
  Legacy_Site_ID?: string;
  Site_Group?: string;
  Site_Type?: string;
  Region13?: string;
  Region5?: string;
  City?: string;
  District?: string;
  Latitude?: number;
  Longitude?: number;
  Status?: string;
  Operator?: string;
  Owner?: string;
  Installation_Date?: Date;
  technician_name: string;
  technician_email: string;
};
export default function SiteForm({
  onSubmit,
  initialData,
  isUpdate = false,
}: SiteFormProps) {
  const [formData, setFormData] = useState({
    Site_ID: '',
    Legacy_Site_ID: '',
    Site_Group: '',
    Site_Type: '',
    Region13: '',
    Region5: '',
    City: '',
    District: '',
    Latitude: '',
    Longitude: '',
    Status: 'Active',
    Operator: '',
    Owner: '',
    Installation_Date: '',
    technician_name: '',
    technician_email: '',
    ...initialData,
  });

  const [loading, setLoading] = useState(false);

const handleChange = (field: string, value: any) => {
  setFormData((prev: SiteFormData) => ({ ...prev, [field]: value }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> All fields marked with * are required to {isUpdate ? 'update' : 'create'} a site
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.Site_ID}
            onChange={(e) => handleChange('Site_ID', e.target.value)}
            disabled={isUpdate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Enter Site ID"
          />
        </div>

        {/* Legacy Site ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Legacy Site ID
          </label>
          <input
            type="text"
            value={formData.Legacy_Site_ID}
            onChange={(e) => handleChange('Legacy_Site_ID', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Legacy Site ID"
          />
        </div>

        {/* Site Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Group
          </label>
          <input
            type="text"
            value={formData.Site_Group}
            onChange={(e) => handleChange('Site_Group', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Site Group"
          />
        </div>

        {/* Site Type */}
        <SearchableSelect
          label="Site Type"
          options={SITE_TYPES}
          value={formData.Site_Type}
          onChange={(value) => handleChange('Site_Type', value)}
          placeholder="Select Site Type"
        />

        {/* Region 13 */}
        <SearchableSelect
          label="Region (13)"
          options={REGIONS_13}
          value={formData.Region13}
          onChange={(value) => handleChange('Region13', value)}
          placeholder="Select Region"
        />

        {/* Region 5 */}
        <SearchableSelect
          label="Region (5)"
          options={REGIONS_5}
          value={formData.Region5}
          onChange={(value) => handleChange('Region5', value)}
          placeholder="Select Region"
        />

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.City}
            onChange={(e) => handleChange('City', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter City"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <input
            type="text"
            value={formData.District}
            onChange={(e) => handleChange('District', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter District"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.Latitude}
            onChange={(e) => handleChange('Latitude', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="24.7136"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.Longitude}
            onChange={(e) => handleChange('Longitude', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="46.6753"
          />
        </div>

        {/* Status */}
        <SearchableSelect
          label="Status"
          options={STATUSES}
          value={formData.Status}
          onChange={(value) => handleChange('Status', value)}
          placeholder="Select Status"
        />

        {/* Operator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operator
          </label>
          <input
            type="text"
            value={formData.Operator}
            onChange={(e) => handleChange('Operator', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Operator"
          />
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <input
            type="text"
            value={formData.Owner}
            onChange={(e) => handleChange('Owner', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Owner"
          />
        </div>

        {/* Installation Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Installation Date
          </label>
          <input
            type="date"
            value={formData.Installation_Date}
            onChange={(e) => handleChange('Installation_Date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Technician Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technician Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.technician_name}
            onChange={(e) => handleChange('technician_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Technician Name"
          />
        </div>

        {/* Technician Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technician Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.technician_email}
            onChange={(e) => handleChange('technician_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="technician@example.com"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : isUpdate ? 'Update Site' : 'Add Site'}
        </button>
      </div>
    </form>
  );
}