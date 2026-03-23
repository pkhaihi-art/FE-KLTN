import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-neutral-200 shadow-xl shadow-indigo-600/5">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-indigo-600 mb-6">
            <LayoutDashboard className="w-8 h-8" />
            <span>SimuLearn</span>
          </Link>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-neutral-500">Please enter your details to sign in.</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-semibold text-neutral-700">Password</label>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all font-semibold text-neutral-700">
            <Chrome className="w-5 h-5" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all font-semibold text-neutral-700">
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
