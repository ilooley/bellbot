"use client";

import { useState } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PropertyCard } from "@/components/property/property-card";
import { Home, Users, Calendar, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

export function UIComponents() {
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">UI Components</h2>
      
      <div className="space-y-12">
        {/* Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Buttons</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
              <button className="btn btn-ghost">Ghost Button</button>
              <button className="btn btn-primary" disabled>Disabled</button>
            </div>
          </div>
        </div>
        
        {/* Form Elements */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
            <div>
              <label htmlFor="regular-input" className="label">Regular Input</label>
              <input 
                id="regular-input"
                type="text" 
                className="input" 
                placeholder="Enter some text"
              />
            </div>
            
            <div>
              <label htmlFor="error-input" className="label">Input with Error</label>
              <input 
                id="error-input"
                type="text" 
                className="input input-error" 
                placeholder="This input has an error"
              />
              <p className="text-sm text-error mt-1">This field is required</p>
            </div>
            
            <div>
              <label htmlFor="demo-select" className="label">Select Input</label>
              <select id="demo-select" className="input">
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                id="demo-checkbox" 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="demo-checkbox" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Badges</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-success">Success</span>
              <span className="badge badge-warning">Warning</span>
              <span className="badge badge-error">Error</span>
            </div>
          </div>
        </div>
        
        {/* Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Cards</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-3">Basic Card</h4>
              <div className="card">
                <h3 className="text-lg font-semibold mb-2">Card Title</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This is a basic card component with a title and content.
                  Cards can contain various elements and are used to group related information.
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3">Dashboard Metric Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Properties" 
                  value="24" 
                  icon={<Home className="h-5 w-5 text-primary-500" />} 
                  change={{ value: 12, isPositive: true }}
                  variant="primary"
                />
                <MetricCard 
                  title="Active Tenants" 
                  value="86" 
                  icon={<Users className="h-5 w-5 text-secondary-500" />} 
                  change={{ value: 5, isPositive: true }}
                  variant="secondary"
                />
                <MetricCard 
                  title="Jobs This Month" 
                  value="42" 
                  icon={<Calendar className="h-5 w-5 text-accent-500" />} 
                  description="12 pending, 30 completed"
                  variant="accent"
                />
                <MetricCard 
                  title="Revenue" 
                  value="$12,450" 
                  icon={<DollarSign className="h-5 w-5 text-gray-500" />} 
                  change={{ value: 3, isPositive: false }}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3">Property Card</h4>
              <div className="max-w-sm">
                <PropertyCard 
                  id="prop-1"
                  title="Modern Downtown Apartment"
                  address="123 Main St, San Francisco, CA 94105"
                  price="$2,400/mo"
                  imageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  beds={2}
                  baths={2}
                  sqft={950}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
