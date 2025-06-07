import { redirect } from 'next/navigation'
import DashboardNav from '@/app/components/dashboard/DashboardNav';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  // TODO: Add auth check
  
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
