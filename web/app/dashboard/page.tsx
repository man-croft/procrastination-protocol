'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { 
  getLockedAmount, 
  getStreakDays, 
  CLAIM_OPTIONS, 
  QUIT_OPTIONS, 
  UPDATE_LEADERBOARD_OPTIONS 
} from '../../lib/contracts';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [lockedAmount, setLockedAmount] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadData();
    }
  }, [address]);

  const loadData = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const locked = await getLockedAmount(address);
      const days = await getStreakDays(address);
      
      // Handle response parsing if needed, assumed cvToValue returns primitives
      // contracts.ts uses cvToValue which handles uint -> bigint/number
      setLockedAmount(Number(locked || 0));
      setStreakDays(Number(days || 0));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (options: any) => {
    await openContractCall({
      ...options,
      onFinish: () => {
        // Optimistic update or reload
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
          <h1 className="text-3xl font-bold">Your Inactivity</h1>
          <button 
            onClick={loadData}
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wider">Locked STX</h3>
            <p className="text-4xl font-black font-mono">
              {(lockedAmount / 1000000).toLocaleString()} <span className="text-lg text-zinc-400">STX</span>
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wider">Streak</h3>
            <p className="text-4xl font-black font-mono">
              {streakDays} <span className="text-lg text-zinc-400">Days</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleAction(CLAIM_OPTIONS)}
            className="p-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            Claim Rewards
          </button>

          <button
             onClick={() => handleAction(UPDATE_LEADERBOARD_OPTIONS)}
             className="p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Update Leaderboard
          </button>

          <button
            onClick={() => handleAction(QUIT_OPTIONS)}
            className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Quit (10% Penalty)
          </button>
        </div>
      </div>
    </div>
  );
}
