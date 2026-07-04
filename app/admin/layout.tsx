'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  const pathname = usePathname();
  // const [checking, setChecking] = useState(true);

  // AUTH DISABLED — no auth check currently
  // useEffect(() => {
  //   if (pathname === '/admin/login') {
  //     setChecking(false);
  //     return;
  //   }
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch('/api/admin/categories', { method: 'GET' });
  //       if (res.status === 401) {
  //         router.push('/admin/login');
  //         return;
  //       }
  //     } catch {
  //       router.push('/admin/login');
  //       return;
  //     }
  //     setChecking(false);
  //   };
  //   checkAuth();
  // }, [pathname, router]);

  // Login page - no sidebar, just dark background
  if (pathname === '/admin/login') {
    return (
      <>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1917',
              border: '1px solid rgba(120, 113, 108, 0.2)',
              color: '#e7e5e4',
            },
          }}
        />
        <div className="min-h-screen bg-stone-950 text-stone-100">
          {children}
        </div>
      </>
    );
  }

  // AUTH DISABLED — skip loading state
  // if (checking) {
  //   return (
  //     <div className="min-h-screen bg-stone-950 flex items-center justify-center">
  //       <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1917',
            border: '1px solid rgba(120, 113, 108, 0.2)',
            color: '#e7e5e4',
          },
        }}
      />
      <div className="flex min-h-screen bg-stone-950 text-stone-100">
        <AdminSidebar />
        <main className="flex-1 ml-72 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
