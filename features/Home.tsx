import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { simulationService, categoryService } from '../services/api';
import { Category, SimulationSummary } from '../types';
import { Star, Users, Clock, ChevronRight, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [simulations, setSimulations] = useState<SimulationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, simRes] = await Promise.all([
          categoryService.list({ size: 100 }),
          simulationService.guestList({ size: 12 }),
        ]);
        setCategories(catRes.data.content);
        setSimulations(simRes.data.content);
      } catch (err) {
        setError('Failed to fetch data. Please check your API configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-neutral-500 font-medium">Loading simulations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm">
        <h2 className="text-red-800 font-bold text-xl mb-2">Error Occurred</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 rounded-3xl overflow-hidden bg-indigo-900 flex items-center px-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent z-10" />
        <img 
          src="https://picsum.photos/seed/education/1920/1080" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-20 max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Master New Skills with <span className="text-indigo-400">Interactive Simulations</span>
          </h1>
          <p className="text-lg text-indigo-100/90 leading-relaxed">
            Join thousands of students learning through high-fidelity simulations guided by expert educators.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-bold transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Explore Categories</h2>
            <p className="text-neutral-500 mt-1">Find the right path for your learning journey.</p>
          </div>
          <div className="text-indigo-600 font-semibold flex items-center gap-1">
            Explore Path <ChevronRight className="w-4 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white border border-neutral-200 p-6 rounded-2xl text-center hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
                <span className="text-indigo-600 font-bold text-xl">{cat.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-neutral-800 truncate">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Simulations Grid */}
      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Popular Simulations</h2>
          <p className="text-neutral-500 mt-1">Our most engaging and highly-rated learning experiences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {simulations.map((sim) => (
            <Link 
              to={`/simulation/${sim.id}`} 
              key={sim.id} 
              className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={sim.thumbnail || `https://picsum.photos/seed/sim-${sim.id}/640/360`} 
                  alt={sim.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-neutral-800 shadow-sm">
                  Level {sim.level}
                </div>
                <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                  {sim.duration}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-xl text-neutral-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {sim.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-neutral-700">{sim.avgStar.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{sim.totalParticipant}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{sim.duration}</span>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center gap-3">
                  <img 
                    src={sim.educator.profileAccountDto.avatar || `https://i.pravatar.cc/150?u=${sim.educator.profileAccountDto.username}`} 
                    alt={sim.educator.profileAccountDto.fullName} 
                    className="w-8 h-8 rounded-full border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs">
                    <p className="text-neutral-400">Educator</p>
                    <p className="font-bold text-neutral-800">{sim.educator.profileAccountDto.fullName}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
