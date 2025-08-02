import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <DashboardSidebar />
      <main style={{ marginLeft: '250px', padding: '24px', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}






