'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          router.push('/login');
        } else {
          setUser(session.user);
          setAccessToken(session.access_token);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      if (!user || !accessToken) return;
      setAnalysisLoading(true);

      try {
        const res = await fetch('/api/latestAnalysis', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await res.json();
        setLatestAnalysis(data);
      } catch (err) {
        console.error('Failed to fetch latest analysis:', err);
      } finally {
        setAnalysisLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, [user, accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center overflow-hidden px-6">
      {/* Background Blobs */}
      <div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full filter blur-3xl top-10 left-10 animate-pulse" />
      <div className="absolute w-80 h-80 bg-cyan-500 opacity-20 rounded-full filter blur-3xl bottom-20 right-10 animate-ping" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-8"
      >
        {/* Text Section */}
        <div className="flex-1 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Welcome to <span className="text-cyan-400">Your Dashboard</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Analyze, visualize, and manage your data with a seamless experience.
          </p>

          {/* Analysis Section */}
          {analysisLoading ? (
            <p className="text-sm text-gray-400">Loading your last analysis...</p>
          ) : latestAnalysis ? (
            <div className="text-sm bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
              <p className="text-gray-300">
                <strong>Last Analysis Date:</strong>{' '}
                {latestAnalysis?.created_at
                  ? new Date(latestAnalysis.created_at).toLocaleString()
                  : 'N/A'}
              </p>
              <p className="text-gray-300">
                <strong>Dream Job:</strong>{' '}
                {latestAnalysis?.input_data?.job_target?.length
                  ? latestAnalysis.input_data?.job_target
                  : 'None'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-6">No previous analysis found.</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/newAnalysis')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg"
            >
              New Analysis
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/prevAnalysis')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg"
            >
              Previous Analysis
            </motion.button>
          </div>
        </div>

        {/* Visual Section */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <Image
            src="/tamplate.webp"
            alt="Illustration"
            width={800} // You can customize width/height
            height={300}
            className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-lg border border-white/10"
            onError={(e) => {
              e.currentTarget.src = '/fallback.jpg';
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
