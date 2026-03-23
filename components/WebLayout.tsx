import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Home, Search, ShoppingBag, User } from 'lucide-react';

const WebLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                <LayoutDashboard className="w-6 h-6" />
                <span>SimuLearn</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/" className="text-neutral-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link to="/simulations" className="text-neutral-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                  <Search className="w-4 h-4" />
                  <span>Explore</span>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10">
                Get Started
              </Link>
              <div className="h-6 w-px bg-neutral-200 mx-2 hidden sm:block"></div>
              <Link to="/cms" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                CMS Admin
              </Link>
              <button className="p-2 text-neutral-400 hover:text-indigo-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-indigo-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-4">
                <LayoutDashboard className="w-6 h-6" />
                <span>SimuLearn</span>
              </div>
              <p className="text-neutral-500 max-w-sm">
                Empowering learners through high-quality simulations and expert-led education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-neutral-500 text-sm">
                <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
                <li><Link to="/simulations" className="hover:text-indigo-600">Explore</Link></li>
                <li><Link to="/categories" className="hover:text-indigo-600">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-500 text-sm">
                <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-100 text-center text-neutral-400 text-sm">
            &copy; 2026 SimuLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebLayout;
