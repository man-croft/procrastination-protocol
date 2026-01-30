'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';

export const dynamic = 'force-dynamic';

const BADGES = [
  { id: 1, name: "Lazy Beginner", days: 1, icon: "🥱" },
  { id: 2, name: "Expert Procrastinator", days: 7, icon: "🛋️" },
  { id: 3, name: "Professional Slacker", days: 14, icon: "🎮" },
  { id: 4, name: "Master of Inaction", days: 30, icon: "🗿" },
  { id: 5, name: "Legendary Statue", days: 100, icon: "💎" },
];

export default function AchievementsPage() {
  const { address, isConnected } = useWallet();
  const [ownedBadges, setOwnedBadges] = useState<number[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadBadges();
    }
  }, [address]);

  const loadBadges = async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Dynamic import to avoid build-time SSR issues with @stacks/transactions
      const { hasBadge, getStreakDays } = await import('../../lib/contracts');
      
      const streak = await getStreakDays(address);
      setCurrentStreak(Number(streak || 0));

      const owned: number[] = [];
      for (const badge of BADGES) {
        const ownedResult = await hasBadge(address, badge.id);
        if (ownedResult) {
          owned.push(badge.id);
        }
      }
      setOwnedBadges(owned);
    } catch (e) {
      console.error(e);
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
