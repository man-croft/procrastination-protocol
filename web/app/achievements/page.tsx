'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';
import { LoadingSpinner } from '../../components/Loading';

export const dynamic = 'force-dynamic';

const BADGES = [
  { id: 1, name: "Lazy Beginner", days: 1, icon: "🥱" },
  { id: 2, name: "Expert Procrastinator", days: 7, icon: "🛋️" },
  { id: 3, name: "Professional Slacker", days: 14, icon: "🎮" },
  { id: 4, name: "Master of Inaction", days: 30, icon: "🗿" },
  { id: 5, name: "Legendary Statue", days: 100, icon: "💎" },
];

interface AchievementError {
  message: string;
  type: 'wallet' | 'contract' | 'unknown';
}

export default function AchievementsPage() {
  const { address, isConnected } = useWallet();
  const [ownedBadges, setOwnedBadges] = useState<number[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AchievementError | null>(null);

  useEffect(() => {
    if (address) {
      loadBadges();
    }
  }, [address]);

  const loadBadges = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      // Dynamic import to avoid build-time SSR issues with @stacks/transactions
      const { hasBadge, getStreakDays } = await import('../../lib/contracts');
      
      const streak = await getStreakDays(address);
      setCurrentStreak(Number(streak || 0));

      const owned: number[] = [];
      for (const badge of BADGES) {
        try {
          const ownedResult = await hasBadge(address, badge.id);
          if (ownedResult) {
            owned.push(badge.id);
          }
        } catch (badgeError) {
          console.warn(`Failed to check badge ${badge.id}:`, badgeError);
        }
      }
      setOwnedBadges(owned);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to load achievements';
      setError({
        message: errorMessage,
        type: 'contract'
      });
      console.error('Achievements load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (badgeId: number) => {
    const { getClaimBadgeOptions } = await import('../../lib/contracts');
    const options = await getClaimBadgeOptions(badgeId);
    await openContractCall({
      ...options,
      onFinish: () => {
        setTimeout(loadBadges, 5000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-2 text-center">Achievements</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Milestones for your journey of doing nothing. Claim them as NFTs.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl max-w-2xl mx-auto">
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

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading your achievements..." />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map((badge) => {
            const isOwned = ownedBadges.includes(badge.id);
            const isEligible = currentStreak >= badge.days;
            
            return (
              <div 
                key={badge.id}
                className={`relative p-8 rounded-2xl border-2 transition-all ${
                  isOwned 
                    ? 'bg-white dark:bg-zinc-900 border-green-500 shadow-md' 
                    : isEligible 
                      ? 'bg-white dark:bg-zinc-900 border-blue-400 shadow-lg scale-105' 
                      : 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60 grayscale'
                }`}
              >
                <div className="text-6xl mb-4">{badge.icon}</div>
                <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
                <p className="text-sm font-medium text-zinc-500 mb-6">{badge.days} Days Streak</p>

                {isOwned ? (
                  <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-center">
                    Owned ✓
                  </div>
                ) : isEligible ? (
                  <button
                    onClick={() => handleClaim(badge.id)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors animate-pulse"
                  >
                    Claim Badge
                  </button>
                ) : (
                  <div className="w-full py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded-lg font-bold text-center text-sm">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
