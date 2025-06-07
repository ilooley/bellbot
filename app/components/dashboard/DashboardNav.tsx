import Link from 'next/link';

const DashboardNav = () => {
  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4 space-y-2 flex-shrink-0">
      <div>
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Overview
        </Link>
      </div>
      <div>
        <Link href="/dashboard/jobs" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Jobs
        </Link>
      </div>
      <div>
        <Link href="/dashboard/providers" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Providers
        </Link>
      </div>
      <div>
        <Link href="/dashboard/properties" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Properties
        </Link>
      </div>
      <div>
        <Link href="/dashboard/communications" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Communications
        </Link>
      </div>
      <div>
        <Link href="/dashboard/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          Settings
        </Link>
      </div>
      {/* Add more navigation links as needed */}
    </nav>
  );
};

export default DashboardNav;
