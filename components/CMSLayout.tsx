import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  Bell, 
  Search,
  BookOpen,
  Users
} from 'lucide-react';
import { clsx } from 'clsx';

const CMSLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/cms' },
    { icon: List, label: 'Categories', path: '/cms/categories' },
    { icon: BookOpen, label: 'Simulations', path: '/cms/simulations' },
    { icon: Users, label: 'Users', path: '/cms/users' },
    { icon: Settings, label: 'Settings', path: '/cms/settings' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-indigo-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-indigo-800/50">
          <Link to="/" className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-400" />
            <span className={clsx("font-bold text-xl transition-opacity", !isSidebarOpen && "opacity-0 hidden")}>
              SimuCMS
            </span>
          </Link>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                location.pathname === item.path 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-indigo-300 hover:bg-indigo-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={clsx("font-medium transition-opacity whitespace-nowrap", !isSidebarOpen && "opacity-0 hidden")}>
                {item.label}
              </span>
              {location.pathname === item.path && isSidebarOpen && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800/50">
          <button className="flex items-center gap-4 px-4 py-3 w-full text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-xl transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={clsx("font-medium transition-opacity", !isSidebarOpen && "opacity-0 hidden")}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={clsx(
        "flex-grow flex flex-col transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-neutral-400 hover:text-indigo-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-900 leading-none">Admin User</p>
                <p className="text-xs text-neutral-500 mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CMSLayout;
