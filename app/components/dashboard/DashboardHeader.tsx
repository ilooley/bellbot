import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">BellBot Dashboard</h1>
        <div>
          {/* Placeholder for user menu, notifications, etc. */}
          <span className="text-gray-600">User Profile</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
