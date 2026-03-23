import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/api';
import { Category } from '../types';
import { Plus, Search, MoreVertical, Edit2, Trash2, Loader2, List, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryService.list({ size: 100 });
        setCategories(res.data.content);
      } catch (err) {
        setError('Failed to load categories. Please check your API configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-neutral-500 font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Category Management</h1>
          <p className="text-neutral-500 text-sm">Organize and manage your simulation categories.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            Showing <span className="text-neutral-900 font-bold">{filteredCategories.length}</span> categories
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4 border-b border-neutral-100">ID</th>
                <th className="px-8 py-4 border-b border-neutral-100">Category Name</th>
                <th className="px-8 py-4 border-b border-neutral-100">Status</th>
                <th className="px-8 py-4 border-b border-neutral-100">Created Date</th>
                <th className="px-8 py-4 border-b border-neutral-100">Modified Date</th>
                <th className="px-8 py-4 border-b border-neutral-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-mono text-neutral-400">#{cat.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {cat.name.charAt(0)}
                      </div>
                      <span className="font-bold text-neutral-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {cat.status === 1 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-bold border border-neutral-200">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-sm text-neutral-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 opacity-40" />
                    {new Date(cat.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-sm text-neutral-500">
                    {new Date(cat.modifiedDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white hover:text-indigo-600 rounded-lg border border-transparent hover:border-neutral-200 transition-all text-neutral-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white hover:text-red-600 rounded-lg border border-transparent hover:border-neutral-200 transition-all text-neutral-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-neutral-500 italic">
                    No categories found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
