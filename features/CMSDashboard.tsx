import React from 'react';
import { LayoutDashboard, Users, BookOpen, List, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CMSDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Simulations', value: '45', change: '+5%', isPositive: true, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Categories', value: '12', change: '0%', isPositive: true, icon: List, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Revenue', value: '$12,450', change: '-2%', isPositive: false, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-neutral-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-neutral-900 font-medium">New user registered</p>
                  <p className="text-xs text-neutral-500 mt-1">John Doe joined the platform</p>
                </div>
                <span className="text-xs text-neutral-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm group-hover:text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="font-semibold text-neutral-900 text-sm">Add Simulation</p>
              <p className="text-xs text-neutral-500 mt-1">Create new content</p>
            </button>
            <button className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm group-hover:text-indigo-600">
                <List className="w-5 h-5" />
              </div>
              <p className="font-semibold text-neutral-900 text-sm">Add Category</p>
              <p className="text-xs text-neutral-500 mt-1">Organize content</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
