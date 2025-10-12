'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<any>(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error('Failed to load API spec:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#036B34] text-white py-6 px-8 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-full flex items-center justify-center">
              <span className="text-2xl">📡</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Salam Site Management API</h1>
              <p className="text-white/90 mt-1">Interactive API Documentation & Testing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-700 mb-1">🔵 GET</h3>
            <p className="text-sm text-gray-600">Retrieve sites</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-green-700 mb-1">🟢 POST</h3>
            <p className="text-sm text-gray-600">Create sites</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
            <h3 className="font-semibold text-orange-700 mb-1">🟠 PUT</h3>
            <p className="text-sm text-gray-600">Update sites</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="font-semibold text-red-700 mb-1">🔴 DELETE</h3>
            <p className="text-sm text-gray-600">Remove sites</p>
          </div>
        </div>

        {!spec && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036B34] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading API documentation...</p>
          </div>
        )}

        {spec && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={1} />
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        <p>© 2024 Salam Site Management. All rights reserved.</p>
      </div>
    </div>
  );
}