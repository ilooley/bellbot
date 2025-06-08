'use client';

import React from 'react';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <p className="text-gray-700 mb-4">This is a test page with explicit Tailwind classes.</p>
      <div className="bg-green-200 p-4 rounded-lg shadow-md">
        <p className="font-medium">If you can see this with green background and styling, Tailwind is working!</p>
      </div>
      <div className="mt-4 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Blue Button
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Red Button
        </button>
      </div>
    </div>
  );
}
