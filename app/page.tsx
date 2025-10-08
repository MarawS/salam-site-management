import Header from '@/components/Header';
import StatsDashboard from '@/components/StatsDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#036B34] mb-2">
            Site Management System
          </h1>
          <p className="text-gray-600">
            Manage and track site installations
          </p>
        </div>

        <StatsDashboard />

        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="text-center text-gray-500">
            <p>Site form components will be added here</p>
            <p className="text-sm mt-2">Use the API endpoints to manage sites</p>
          </div>
        </div>
      </main>
    </div>
  );
}