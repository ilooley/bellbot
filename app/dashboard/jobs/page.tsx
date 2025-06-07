import Link from 'next/link';

export default function JobsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Job Management</h1>
        <Link href="/dashboard/jobs/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Job
        </Link>
      </div>
      {/* Placeholder for jobs list/table */}
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">Jobs list will appear here.</p>
        {/* Example Job Item (static for now) */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Example Job: Clean Apartment A</h3>
          <p className="text-sm text-gray-500">Status: Pending</p>
          <p className="text-sm text-gray-500">Provider: Unassigned</p>
        </div>
      </div>
    </div>
  );
}
