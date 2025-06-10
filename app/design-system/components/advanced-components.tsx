"use client";

import { useState, useEffect } from "react";
import { Notification, NotificationType } from "@/components/ui/notification";
import { useNotification } from "@/components/ui/notification-container";
import { Modal, useModal } from "@/components/ui/modal";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  FormActions,
  FormDivider
} from "@/components/ui/form";
import { AlertCircle, Bell, Check, Info, Mail, Phone, Search, User, X } from "lucide-react";

export function AdvancedComponents() {
  // State for client-side rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  
  // Get notification functions
  const { showNotification } = useNotification();

  // Only render interactive components after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sample data for DataTable
  const tableData = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "Tenant", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Property Manager", status: "Active" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "Service Provider", status: "Inactive" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", role: "Tenant", status: "Active" },
    { id: 5, name: "Robert Brown", email: "robert@example.com", role: "Owner", status: "Active" },
  ];

  const tableColumns = [
    { header: "ID", accessorKey: "id", sortable: true },
    { header: "Name", accessorKey: "name", sortable: true },
    { header: "Email", accessorKey: "email", sortable: true },
    { header: "Role", accessorKey: "role", sortable: true },
    { 
      header: "Status", 
      accessorKey: "status", 
      sortable: true,
      cell: ({ value }: { value: string }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === "Active" 
            ? "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300" 
            : "bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300"
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    alert("Form submitted!");
    setIsFormModalOpen(false);
  };

  // Return a loading placeholder if not yet client-side rendered
  if (!isClient) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold mb-6">Advanced Components</h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Components...</h3>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Components will appear after hydration</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">Advanced Components</h2>
      
      <div className="space-y-12">
        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Notifications provide feedback to users about actions or system events.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => showNotification({
                  type: 'success',
                  title: 'Success!',
                  message: 'Operation completed successfully.',
                  autoClose: true
                })}
                className="px-4 py-2 bg-success text-white rounded hover:bg-success-600 transition-colors"
              >
                Show Success Notification
              </button>
              <button
                onClick={() => showNotification({
                  type: 'error',
                  title: 'Error!',
                  message: 'Something went wrong. Please try again.',
                  autoClose: false
                })}
                className="px-4 py-2 bg-error text-white rounded hover:bg-error-600 transition-colors"
              >
                Show Error Notification
              </button>
              <button
                onClick={() => showNotification({
                  type: 'warning',
                  title: 'Warning!',
                  message: 'This action cannot be undone.',
                  autoClose: false
                })}
                className="px-4 py-2 bg-warning text-white rounded hover:bg-warning-600 transition-colors"
              >
                Show Warning Notification
              </button>
              <button
                onClick={() => showNotification({
                  type: 'info',
                  title: 'Information',
                  message: 'Your session will expire in 5 minutes.',
                  autoClose: false
                })}
                className="px-4 py-2 bg-info text-white rounded hover:bg-info-600 transition-colors"
              >
                Show Info Notification
              </button>
            </div>
            
            <h4 className="text-md font-semibold mb-4">Notification Examples</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Notification
                type="success"
                title="Success Notification"
                message="Operation completed successfully!"
                autoClose={true}
              />
              
              <Notification
                type="error"
                title="Error Notification"
                message="Something went wrong. Please try again."
                autoClose={false}
              />
              
              <Notification
                type="warning"
                title="Warning Notification"
                message="This action cannot be undone."
                autoClose={false}
              />
              
              <Notification
                type="info"
                title="Information Notification"
                message="A new feature is available. Check it out!"
                autoClose={false}
              />
            </div>
          </div>
        </div>
        
        {/* Modals */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Modals</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Modals are dialog boxes/popups that focus the user's attention on specific content or actions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
              >
                Open Basic Modal
              </button>
              
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md"
              >
                Open Form Modal
              </button>
            </div>
            
            {/* Basic Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="md"
              footer={
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                  >
                    Confirm
                  </button>
                </div>
              }
            >
              <p className="text-gray-600 dark:text-gray-300">
                This is a basic modal example. Modals are useful for displaying content that requires user interaction.
              </p>
            </Modal>
            
            {/* Form Modal */}
            <Modal
              isOpen={isFormModalOpen}
              onClose={() => setIsFormModalOpen(false)}
              title="Contact Form"
              size="lg"
            >
              <Form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="name" label="Name" required>
                  <Input placeholder="Enter your name" />
                </FormField>
                
                <FormField name="email" label="Email" required>
                  <Input type="email" placeholder="Enter your email" />
                </FormField>
                
                <FormField name="message" label="Message" required>
                  <Textarea placeholder="Enter your message" rows={4} />
                </FormField>
                
                <FormActions>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                  >
                    Submit
                  </button>
                </FormActions>
              </Form>
            </Modal>
          </div>
        </div>
        
        {/* Data Tables */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Data Tables</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Data tables display information in a grid-like format of rows and columns, with features like sorting, searching, and pagination.
            </p>
            
            <DataTable
              data={tableData}
              columns={tableColumns}
              pagination={true}
              pageSize={3}
              searchable={true}
              searchPlaceholder="Search users..."
              striped={true}
              hoverable={true}
              bordered={false}
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </div>
        </div>
        
        {/* Forms */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Form Components</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Form components provide consistent styling and behavior for collecting user input.
            </p>
            
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="text" label="Text Input" required>
                  <Input placeholder="Enter text" />
                </FormField>
                
                <FormField name="email" label="Email Input with Icon">
                  <Input 
                    type="email" 
                    placeholder="Enter email" 
                    icon={<Mail className="h-4 w-4" />} 
                  />
                </FormField>
                
                <FormField 
                  name="password" 
                  label="Password Input" 
                  description="Password must be at least 8 characters"
                >
                  <Input type="password" placeholder="Enter password" />
                </FormField>
                
                <FormField name="search" label="Search Input">
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    icon={<Search className="h-4 w-4" />} 
                  />
                </FormField>
              </div>
              
              <FormDivider label="Additional Information" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="textarea" label="Textarea">
                  <Textarea placeholder="Enter long text" rows={3} />
                </FormField>
                
                <FormField name="select" label="Select">
                  <Select 
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ]}
                    placeholder="Select an option"
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField name="checkbox" label="Checkbox Options">
                  <div className="space-y-2">
                    <Checkbox label="Option 1" />
                    <Checkbox label="Option 2" />
                    <Checkbox label="Option 3" />
                  </div>
                </FormField>
                
                <FormField name="radio" label="Radio Options">
                  <div className="space-y-2">
                    <Radio name="radioGroup" label="Option A" value="a" />
                    <Radio name="radioGroup" label="Option B" value="b" />
                    <Radio name="radioGroup" label="Option C" value="c" />
                  </div>
                </FormField>
                
                <FormField name="switches" label="Toggle Switches">
                  <div className="space-y-3">
                    <Switch 
                      label="Email notifications" 
                      description="Receive email updates" 
                    />
                    <Switch 
                      label="SMS notifications" 
                      description="Receive text messages" 
                    />
                  </div>
                </FormField>
              </div>
              
              <FormActions>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  Submit
                </button>
              </FormActions>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
