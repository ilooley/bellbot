"use client";

import { Header } from "./components/header";
import { ColorPalette } from "./components/color-palette";
import { Typography } from "./components/typography";
import { UIComponents } from "./components/ui-components";
import { MessageExamples } from "./components/message-examples";
import { AdvancedComponents } from "./components/advanced-components";
import { NotificationProvider } from "@/components/ui/notification-container";
import { ModalProvider } from "@/components/ui/modal";

export default function DesignSystemPage() {
  return (
    <NotificationProvider position="top-right">
      <ModalProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          
          <main className="container mx-auto px-4 pb-16">
            <div className="max-w-5xl mx-auto">
              <section className="py-8">
                <h1 className="text-3xl font-bold mb-4">BellBot Design System</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                  This design system showcases BellBot's UI components, color palette, typography, 
                  and interactive elements. Use this as a reference when building new features to 
                  maintain consistency across the application.
                </p>
              </section>
              
              <ColorPalette />
              <Typography />
              <UIComponents />
              <MessageExamples />
              <AdvancedComponents />
          
              <section className="py-8">
                <h2 className="text-xl font-bold mb-6">Accessibility Guidelines</h2>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ensure all interactive elements have visible focus states</li>
                    <li>Maintain a minimum color contrast ratio of 4.5:1 for normal text</li>
                    <li>Use semantic HTML elements appropriately</li>
                    <li>Provide text alternatives for non-text content</li>
                    <li>Ensure keyboard navigability for all interactive elements</li>
                    <li>Include ARIA attributes where appropriate</li>
                    <li>Announce dynamic content changes to screen readers</li>
                    <li>Clearly indicate loading states</li>
                  </ul>
                </div>
              </section>
            </div>
          </main>
        </div>
      </ModalProvider>
    </NotificationProvider>
  );
}
