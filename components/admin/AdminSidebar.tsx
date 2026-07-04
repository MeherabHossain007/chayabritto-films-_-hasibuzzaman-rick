'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Upload, Images, FolderOpen, LogOut, Camera, 
  ChevronLeft, ChevronRight, Settings, Share2 
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Upload', href: '/admin/upload', icon: Upload },
  { label: 'Photos', href: '/admin/photos', icon: Images },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Galleries', href: '/admin/galleries', icon: Share2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? 'w-20' : 'w-72'}
        bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900
        border-r border-stone-800/50`}
    >
      {/* Logo Section */}
      <div className="relative flex items-center gap-3 px-6 py-6 border-b border-stone-800/50">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/30">
          <Camera size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-stone-100 tracking-wide truncate">
              Chayabritto
            </h1>
            <p className="text-xs text-stone-500 tracking-wider uppercase">Admin Panel</p>
          </div>
        )}
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full 
            bg-stone-800 border border-stone-700 flex items-center justify-center
            text-stone-400 hover:text-stone-200 hover:bg-stone-700
            transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-primary-600/15 text-primary-400'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
              )}
              
              <Icon size={20} className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-stone-500 group-hover:text-stone-300'}`} />
              
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-stone-800 text-stone-200 text-xs font-medium 
                  rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap
                  shadow-lg border border-stone-700/50 z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-stone-800/50 pt-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full
            text-stone-500 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium tracking-wide">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
