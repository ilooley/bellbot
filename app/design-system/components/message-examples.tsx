"use client";

import { useState, useEffect } from "react";
import { WhatsAppMessage } from "@/components/messages/whatsapp-message";
import { JobTimeline } from "@/components/job/job-timeline";
import { subDays, subHours, subMinutes } from "date-fns";

export function MessageExamples() {
  // Use state to avoid hydration mismatch with dates
  const [isClient, setIsClient] = useState(false);
  
  // Only render with actual dates after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Use a fixed reference date to avoid hydration mismatches
  const now = new Date("2025-01-01T12:00:00Z");
  
  const messages = [
    {
      id: "msg-1",
      content: "Hi there! I'm interested in scheduling a viewing for the apartment on Main Street.",
      timestamp: subMinutes(now, 30),
      isInbound: true,
      type: "text",
      sender: {
        name: "John Smith",
      },
    },
    {
      id: "msg-2",
      content: "Hello John! Thanks for your interest. I'd be happy to schedule a viewing for you. What day and time works best for you?",
      timestamp: subMinutes(now, 28),
      isInbound: false,
      status: "read",
      type: "text",
    },
    {
      id: "msg-3",
      content: "Would this Friday at 3pm work for you?",
      timestamp: subMinutes(now, 25),
      isInbound: true,
      type: "text",
      sender: {
        name: "John Smith",
      },
    },
    {
      id: "msg-4",
      content: "Here's a photo of the damage in the bathroom that needs repair.",
      timestamp: subMinutes(now, 20),
      isInbound: true,
      type: "image",
      sender: {
        name: "John Smith",
      },
      metadata: {
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      },
    },
    {
      id: "msg-5",
      content: "Thanks for sending the photo. I'll dispatch a plumber to fix this issue as soon as possible.",
      timestamp: subMinutes(now, 15),
      isInbound: false,
      status: "read",
      type: "text",
    },
  ];

  // Create proper Date objects for timeline events
  const twoDaysAgo = subDays(now, 2);
  const oneDayAgo = subDays(now, 1);
  
  const timelineEvents = [
    {
      id: "event-1",
      status: "pending",
      timestamp: new Date(twoDaysAgo),
      description: "Maintenance request submitted for leaking faucet in bathroom",
      actor: {
        name: "John Smith",
        role: "Tenant",
      },
    },
    {
      id: "event-2",
      status: "dispatched",
      timestamp: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 14, 30),
      description: "Job dispatched to Mike's Plumbing Services",
      actor: {
        name: "Sarah Johnson",
        role: "Property Manager",
      },
    },
    {
      id: "event-3",
      status: "accepted",
      timestamp: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 15, 15),
      description: "Job accepted by service provider",
      actor: {
        name: "Mike Wilson",
        role: "Plumber",
      },
    },
    {
      id: "event-4",
      status: "in-progress",
      timestamp: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 10, 0),
      description: "Plumber arrived on site and began work",
      actor: {
        name: "Mike Wilson",
        role: "Plumber",
      },
    },
    {
      id: "event-5",
      status: "completed",
      timestamp: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 11, 30),
      description: "Repair completed successfully. Replaced faucet washer and adjusted water pressure.",
      actor: {
        name: "Mike Wilson",
        role: "Plumber",
      },
    },
  ];

  // Return a loading placeholder if not yet client-side rendered
  if (!isClient) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold mb-6">Message & Timeline Examples</h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">WhatsApp Messages</h3>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading messages...</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Timeline</h3>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading timeline...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Render actual content after client-side hydration
  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-6">Message & Timeline Examples</h2>
      
      <div className="space-y-12">
        <div>
          <h3 className="text-lg font-semibold mb-4">WhatsApp Messages</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              {messages.map((message) => (
                <WhatsAppMessage
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  timestamp={message.timestamp}
                  isInbound={message.isInbound}
                  status={message.status as any}
                  type={message.type as any}
                  sender={message.sender}
                  metadata={message.metadata}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Job Timeline</h3>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <JobTimeline 
              events={timelineEvents as any} 
              currentStatus="completed" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
