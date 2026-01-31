'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { 
  getLockedAmount, 
  getStreakDays, 
  getClaimOptions, 
  getQuitOptions, 
  getUpdateLeaderboardOptions 
} from '../../lib/contracts';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';
import { LoadingCard } from '../../components/Loading';
import { StreakTimer } from '../../components/StreakTimer';

interface DashboardError {
  message: string;
  type: 'wallet' | 'contract' | 'unknown';
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [lockedAmount, setLockedAmount] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DashboardError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (address) {
      loadData();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [address]);

  const loadData = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const [locked, days] = await Promise.all([
        getLockedAmount(address),
        getStreakDays(address)
      ]);
      
      setLockedAmount(Number(locked || 0));
      setStreakDays(Number(days || 0));
      setLastUpdated(new Date());
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to load dashboard data';
      setError({
        message: errorMessage,
        type: 'contract'
      });
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (optionsGetter: () => Promise<any>) => {
    const options = await optionsGetter();
    await openContractCall({
      ...options,
      onFinish: () => {
        setTimeout(loadData, 5000); 
      }
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">Please connect your wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Your Inactivity</h1>
            {lastUpdated && (
              <p className="text-sm text-zinc-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">
              Error: {error.message}
            </p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 dark:text-red-500 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <LoadingCard title="Locked STX" message="Loading balance..." />
            <LoadingCard title="Streak" message="Loading streak..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wider">Locked STX</h3>
              <p className="text-4xl font-black font-mono">
                {(lockedAmount / 1000000).toLocaleString()} <span className="text-lg text-zinc-400">STX</span>
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wider">Streak</h3>
              <StreakTimer streakDays={streakDays} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleAction(getClaimOptions)}
            className="p-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            Claim Rewards
          </button>

          <button
             onClick={() => handleAction(getUpdateLeaderboardOptions)}
             className="p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Update Leaderboard
          </button>

          <button
            onClick={() => handleAction(getQuitOptions)}
            className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Quit (10% Penalty)
          </button>
        </div>
      </div>
    </div>
  );
}
