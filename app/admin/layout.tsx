import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '@/app/admin/admin.css';

// TODO: Заменить на реальную проверку авторизации через NextAuth
async function checkAdminAuth() {
  // Временная заглушка - в production заменить на проверку сессии
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== 'ADMIN') {
  //   redirect('/admin/login');
  // }
  return true;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdminAuth();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
