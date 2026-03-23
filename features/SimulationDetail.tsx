import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { simulationService } from '../services/api';
import { SimulationDetail as SimulationDetailType } from '../types';
import { Star, Users, Clock, Loader2, ChevronLeft, Play, Info, BookOpen, GraduationCap, Calendar, Mail, Phone } from 'lucide-react';

const SimulationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [simulation, setSimulation] = useState<SimulationDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await simulationService.guestGet(parseInt(id));
        setSimulation(res.data);
      } catch (err) {
        setError('Failed to load simulation details. Please check your API configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-neutral-500 font-medium">Loading simulation details...</p>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm">
        <h2 className="text-red-800 font-bold text-xl mb-2">Error Occurred</h2>
        <p className="text-red-600 mb-6">{error || 'Simulation not found.'}</p>
        <Link 
          to="/"
          className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors font-medium inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-indigo-600 font-medium transition-colors group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info & Video */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center group cursor-pointer">
              <img 
                src={simulation.thumbnail || `https://picsum.photos/seed/sim-${simulation.id}/1280/720`} 
                alt={simulation.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                    {simulation.category.name}
                  </span>
                  <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                    {simulation.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-wrap gap-6 items-center text-neutral-500 font-medium border-b border-neutral-100 pb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-neutral-900 font-bold">{simulation.avgStar.toFixed(1)} Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="text-neutral-900 font-bold">{simulation.totalParticipant} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <span className="text-neutral-900 font-bold">{simulation.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <span className="text-neutral-900 font-bold">Level {simulation.level}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <Info className="w-6 h-6 text-indigo-600" />
                  Overview
                </h2>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  {simulation.overview}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Description
                </h2>
                <div className="text-neutral-600 leading-relaxed prose prose-indigo max-w-none">
                  {simulation.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Educator & Notice */}
        <div className="space-y-8">
          {/* Educator Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Your Educator</h3>
            <div className="flex items-center gap-4">
              <img 
                src={simulation.educator.profileAccountDto.avatar || `https://i.pravatar.cc/150?u=${simulation.educator.profileAccountDto.username}`} 
                alt={simulation.educator.profileAccountDto.fullName} 
                className="w-16 h-16 rounded-2xl border border-neutral-200 shadow-sm object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-neutral-900 text-lg">{simulation.educator.profileAccountDto.fullName}</p>
                <p className="text-neutral-500 text-sm">@{simulation.educator.profileAccountDto.username}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>{simulation.educator.profileAccountDto.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span>{simulation.educator.profileAccountDto.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>Born: {new Date(simulation.educator.birthday).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-3 rounded-xl transition-colors">
              View Profile
            </button>
          </div>

          {/* Notice Card */}
          <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-amber-900 tracking-tight flex items-center gap-2">
              <Info className="w-6 h-6" />
              Important Notice
            </h3>
            <p className="text-amber-800/80 leading-relaxed text-sm font-medium italic">
              "{simulation.notice}"
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-indigo-600 rounded-3xl p-8 shadow-xl shadow-indigo-600/20 text-white space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Ready to Start?</h3>
              <p className="text-indigo-100 text-sm">Enroll now and start your simulation immediately.</p>
            </div>
            <button className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">
              Enroll in Simulation
            </button>
            <p className="text-center text-xs text-indigo-200">
              Join {simulation.totalParticipant} other students today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationDetail;
