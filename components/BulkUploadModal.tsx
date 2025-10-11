'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

interface BulkUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedSiteData {
  siteId?: string;
  site_id?: string;
  legacyId?: string;
  legacy_id?: string;
  region5?: string;
  region13?: string;
  city?: string;
  district?: string;
  latitude?: string | number;
  longitude?: string | number;
  installationDate?: string;
  installation_date?: string;
  status?: string;
  technicianName?: string;
  technician_name?: string;
  technicianEmail?: string;
  technician_email?: string;
  [key: string]: string | number | undefined;
}

export default function BulkUploadModal({ onClose, onSuccess }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ParsedSiteData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      Papa.parse<ParsedSiteData>(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data);
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);

    Papa.parse<ParsedSiteData>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let successCount = 0;
          let errorCount = 0;

          for (const row of results.data) {
            try {
              const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  siteId: row.siteId || row.site_id,
                  legacyId: row.legacyId || row.legacy_id,
                  region5: row.region5,
                  region13: row.region13,
                  city: row.city,
                  district: row.district,
                  latitude: parseFloat(String(row.latitude)),
                  longitude: parseFloat(String(row.longitude)),
                  installationDate: row.installationDate || row.installation_date,
                  status: row.status || 'Active',
                  technicianName: row.technicianName || row.technician_name,
                  technicianEmail: row.technicianEmail || row.technician_email,
                }),
              });

              if (response.ok) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch (err) {
              console.error('Error uploading row:', err);
              errorCount++;
            }
          }

          toast.success(`Upload complete! ${successCount} sites added, ${errorCount} failed`);
          onSuccess();
          onClose();
        } catch (err) {
          console.error('Upload error:', err);
          toast.error('Failed to upload sites');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const downloadTemplate = () => {
    const template = `siteId,region5,region13,city,district,latitude,longitude,installationDate,technicianName,technicianEmail
EXAMPLE001,Central,Ar Riyad,Ar Riyad,Downtown,24.7136,46.6753,2024-01-15,John Doe,john@example.com`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sites_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#036B34]">Bulk Upload Sites</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Step 1:</strong> Download the CSV template and fill in your site data
            </p>
            <button
              onClick={downloadTemplate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Download Template
            </button>
          </div>

          <div>
            <label className="block text-[#036B34] font-semibold mb-2">
              <strong>Step 2:</strong> Upload your filled CSV file
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#036B34] mb-2">Preview (First 5 rows):</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(preview[0]).map(key => (
                        <th key={key} className="p-2 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="p-2">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 bg-[#036B34] text-white py-3 rounded-lg font-bold hover:bg-[#025228] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Sites'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}