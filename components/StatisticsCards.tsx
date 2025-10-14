'use client';

interface StatisticsCardsProps {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  totalSites: number;
}

export default function StatisticsCards({
  totalDevices,
  activeDevices,
  inactiveDevices,
  totalSites,
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-green-700 text-white rounded-lg p-6 shadow-lg">
        <div className="text-5xl font-bold mb-2">{totalDevices}</div>
        <div className="text-lg font-medium">TOTAL DEVICES</div>
      </div>

      <div className="bg-green-700 text-white rounded-lg p-6 shadow-lg">
        <div className="text-5xl font-bold mb-2">{activeDevices}</div>
        <div className="text-lg font-medium">ACTIVE DEVICES</div>
      </div>

      <div className="bg-green-700 text-white rounded-lg p-6 shadow-lg">
        <div className="text-5xl font-bold mb-2">{inactiveDevices}</div>
        <div className="text-lg font-medium">INACTIVE DEVICES</div>
      </div>

      <div className="bg-green-700 text-white rounded-lg p-6 shadow-lg">
        <div className="text-5xl font-bold mb-2">{totalSites}</div>
        <div className="text-lg font-medium">TOTAL SITES</div>
      </div>
    </div>
  );
}