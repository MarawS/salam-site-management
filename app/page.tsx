'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import StatisticsCards from '@/components/StatisticsCards';

// Dynamic import for map to avoid SSR issues
const SiteMap = dynamic(() => import('@/components/SiteMap'), { ssr: false });

export default function Home() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    totalSites: 0,
  });
  const [sites, setSites] = useState([]);
  const [devicesByVendor, setDevicesByVendor] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [devicesRes, sitesRes] = await Promise.all([
        fetch('/api/devices?limit=1000'),
        fetch('/api/sites'),
      ]);

      const devicesData = await devicesRes.json();
      const sitesData = await sitesRes.json();

      const devices = devicesData.devices || [];
      const activeCount = devices.filter((d: any) => d.Status === 'Active').length;
      const inactiveCount = devices.filter((d: any) => d.Status !== 'Active').length;

      // Count devices by vendor
      const vendorCounts: Record<string, number> = {};
      devices.forEach((device: any) => {
        if (device.Vendor) {
          vendorCounts[device.Vendor] = (vendorCounts[device.Vendor] || 0) + 1;
        }
      });

      setStats({
        totalDevices: devices.length,
        activeDevices: activeCount,
        inactiveDevices: inactiveCount,
        totalSites: sitesData.length,
      });

      setSites(sitesData);
      setDevicesByVendor(vendorCounts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

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
              className="text-white font-medium hover:text-green-200 transition-colors"
            >
              Sites
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Network Inventory Management
          </h1>
          <p className="text-gray-600">To Manage and Store devices and sites</p>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards
          totalDevices={stats.totalDevices}
          activeDevices={stats.activeDevices}
          inactiveDevices={stats.inactiveDevices}
          totalSites={stats.totalSites}
        />

        {/* Vendor Distribution */}
        {Object.keys(devicesByVendor).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Devices by Vendor
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(devicesByVendor)
                .sort(([, a], [, b]) => b - a)
                .map(([vendor, count]) => (
                  <div
                    key={vendor}
                    className="bg-green-50 border-l-4 border-green-600 p-4"
                  >
                    <div className="text-2xl font-bold text-green-800">{count}</div>
                    <div className="text-sm text-gray-700">{vendor}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Sites Map */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Sites Map</h2>
          <SiteMap sites={sites} />
        </div>
      </main>
    </div>
  );
}