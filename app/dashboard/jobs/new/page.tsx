'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  // Add other relevant property fields if needed for display
}

export default function NewJobPage() {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState('');
  const [title, setTitle] = useState(''); // Added title
  const [jobType, setJobType] = useState(''); // Renamed from type for clarity in form, maps to 'type' in API
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(''); // Renamed from scheduledDateTime
  const [estimatedHours, setEstimatedHours] = useState(''); // Added estimatedHours
  const [estimatedCost, setEstimatedCost] = useState(''); // Changed from budget
  // internalNotes removed
  const [status, setStatus] = useState('pending'); // Default status aligned with schema

  const [properties, setProperties] = useState<Property[]>([]); // For dynamic property list
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      setPropertiesError(null);
      try {
        const token = localStorage.getItem('authToken'); // Ensure this is how you get your token
        if (!token) {
          setPropertiesError('Authentication token not found. Cannot load properties.');
          setPropertiesLoading(false);
          return;
        }

        const response = await fetch('/api/properties', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data as Property[]); // Assuming API returns Property[]
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setPropertiesError(err.message || 'An error occurred while fetching properties.');
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const jobData = {
      propertyId,
      title, // Added title
      type: jobType, // Maps form's jobType to API's 'type'
      description,
      scheduledDate, // Renamed from scheduledDateTime
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined, // Added estimatedHours
      status,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined, // Changed from budget
      // internalNotes removed
    };

    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.message || 'Failed to create job.';
        setError(result.errors ? JSON.stringify(result.errors) : errorMsg);
        throw new Error(errorMsg);
      }

      setSuccessMessage('Job created successfully!');
      // Optionally reset form fields
      setPropertyId('');
      setTitle(''); // Added title
      setJobType('');
      setDescription('');
      setScheduledDate(''); // Renamed
      setEstimatedHours(''); // Added
      setEstimatedCost(''); // Changed
      // internalNotes removed
      setStatus('pending'); // Aligned default
      // Redirect after a short delay
      setTimeout(() => router.push('/dashboard/jobs'), 2000);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Failed to create job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New Job</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">Error: {error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700">
            Property <span className="text-red-500">*</span>
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
            disabled={propertiesLoading || !!propertiesError}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
          >
            <option value="">{propertiesLoading ? 'Loading properties...' : 'Select Property'}</option>
            {!propertiesLoading && !propertiesError && properties.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
          {propertiesError && <p className="mt-1 text-xs text-red-600">{propertiesError}</p>}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Weekly Cleaning for Unit 101"
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
            Job Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobType"
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="e.g., Cleaning, Maintenance, Check-in"
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the job"
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
            Scheduled Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local" // Keeps datetime-local for user convenience, API handles conversion
            name="scheduledDate"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
            Estimated Hours <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="estimatedHours"
            id="estimatedHours"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            placeholder="e.g., 2.5"
            step="0.1"
            min="0"
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="dispatched">Dispatched</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="problem">Problem</option>
          </select>
        </div>

        <div>
          <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
            Estimated Cost (Optional)
          </label>
          <input
            type="number"
            name="estimatedCost"
            id="estimatedCost"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="e.g., 100.00"
            step="0.01"
            min="0"
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* internalNotes field removed */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard/jobs')}
            disabled={isLoading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

