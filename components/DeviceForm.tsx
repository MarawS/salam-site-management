'use client';

import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';
import {
  VENDORS,
  DEVICE_TYPES,
  EQUIPMENT_ROLES,
  TECHNOLOGIES,
  DOMAINS,
  SUB_DOMAINS,
  STATUSES,
} from '@/lib/constants';

interface Site {
  Site_ID: string;
  City?: string;
  Region5?: string;
  Status?: string;
}

interface DeviceFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isUpdate?: boolean;
}

export default function DeviceForm({
  onSubmit,
  initialData,
  isUpdate = false,
}: DeviceFormProps) {
  const [formData, setFormData] = useState({
    NE_Name: '',
    Site_ID: '',
    Serial_Number: '',
    Operator_ID: '',
    NE_IP_Address: '',
    NE_MAC_Address: '',
    Model_Number: '',
    Vendor: '',
    Device_Type: '',
    Equipment_Role: '',
    Technology: '',
    Domain: '',
    Sub_Domain: '',
    Status: 'Active',
    Installation_Date: '',
    technician_name: '',
    technician_email: '',
    ...initialData,
  });

  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (formData.Site_ID) {
      const site = sites.find((s) => s.Site_ID === formData.Site_ID);
      setSelectedSite(site || null);
    } else {
      setSelectedSite(null);
    }
  }, [formData.Site_ID, sites]);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
   setFormData((prev: any) => ({ ...prev, [field]: value }));
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
          <strong>Note:</strong> All fields marked with * are required to {isUpdate ? 'update' : 'create'} a device
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NE Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NE Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.NE_Name}
            onChange={(e) => handleChange('NE_Name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter NE Name"
          />
        </div>

        {/* Site ID */}
        <div>
          <SearchableSelect
            label="Site ID"
            required
            options={sites.map((s) => s.Site_ID)}
            value={formData.Site_ID}
            onChange={(value) => handleChange('Site_ID', value)}
            placeholder="Select Site ID"
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={formData.Serial_Number}
            onChange={(e) => handleChange('Serial_Number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Serial Number"
          />
        </div>

        {/* Operator ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operator ID
          </label>
          <input
            type="text"
            value={formData.Operator_ID}
            onChange={(e) => handleChange('Operator_ID', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Operator ID"
          />
        </div>

        {/* NE IP Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NE IP Address
          </label>
          <input
            type="text"
            value={formData.NE_IP_Address}
            onChange={(e) => handleChange('NE_IP_Address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="192.168.1.1"
          />
        </div>

        {/* NE MAC Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NE MAC Address
          </label>
          <input
            type="text"
            value={formData.NE_MAC_Address}
            onChange={(e) => handleChange('NE_MAC_Address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="00:00:00:00:00:00"
          />
        </div>

        {/* Model Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            value={formData.Model_Number}
            onChange={(e) => handleChange('Model_Number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Model Number"
          />
        </div>

        {/* Vendor */}
        <SearchableSelect
          label="Vendor"
          options={VENDORS}
          value={formData.Vendor}
          onChange={(value) => handleChange('Vendor', value)}
          placeholder="Select Vendor"
        />

        {/* Device Type */}
        <SearchableSelect
          label="Device Type"
          options={DEVICE_TYPES}
          value={formData.Device_Type}
          onChange={(value) => handleChange('Device_Type', value)}
          placeholder="Select Device Type"
        />

        {/* Equipment Role */}
        <SearchableSelect
          label="Equipment Role"
          options={EQUIPMENT_ROLES}
          value={formData.Equipment_Role}
          onChange={(value) => handleChange('Equipment_Role', value)}
          placeholder="Select Equipment Role"
        />

        {/* Technology */}
        <SearchableSelect
          label="Technology"
          options={TECHNOLOGIES}
          value={formData.Technology}
          onChange={(value) => handleChange('Technology', value)}
          placeholder="Select Technology"
        />

        {/* Domain */}
        <SearchableSelect
          label="Domain"
          options={DOMAINS}
          value={formData.Domain}
          onChange={(value) => handleChange('Domain', value)}
          placeholder="Select Domain"
        />

        {/* Sub Domain */}
        <SearchableSelect
          label="Sub Domain"
          options={SUB_DOMAINS}
          value={formData.Sub_Domain}
          onChange={(value) => handleChange('Sub_Domain', value)}
          placeholder="Select Sub Domain"
        />

        {/* Status */}
        <SearchableSelect
          label="Status"
          options={STATUSES}
          value={formData.Status}
          onChange={(value) => handleChange('Status', value)}
          placeholder="Select Status"
        />

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

      {/* Site Preview Panel */}
      {selectedSite && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Selected Site Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Site ID:</span>{' '}
              <span className="text-gray-900">{selectedSite.Site_ID}</span>
            </div>
            {selectedSite.City && (
              <div>
                <span className="font-medium text-gray-700">City:</span>{' '}
                <span className="text-gray-900">{selectedSite.City}</span>
              </div>
            )}
            {selectedSite.Region5 && (
              <div>
                <span className="font-medium text-gray-700">Region:</span>{' '}
                <span className="text-gray-900">{selectedSite.Region5}</span>
              </div>
            )}
            {selectedSite.Status && (
              <div>
                <span className="font-medium text-gray-700">Status:</span>{' '}
                <span className="text-gray-900">{selectedSite.Status}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : isUpdate ? 'Update Device' : 'Add Device'}
        </button>
      </div>
    </form>
  );
}