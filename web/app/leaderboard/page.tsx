'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../lib/contracts';
import Navbar from '../../components/Navbar';
import { useWallet } from '../../hooks/use-wallet';
import { LoadingSpinner } from '../../components/Loading';

interface LeaderboardEntry {
  user: { value: string };
  blocks: { value: bigint };
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { address } = useWallet();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      if (Array.isArray(data)) {
        // Sort by blocks descending just in case, though contract usually appends
        const sorted = (data as any[]).sort((a, b) => Number(b.blocks.value) - Number(a.blocks.value));
        setEntries(sorted);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (index: number) => {
    if (index < 3) {
      return <span className="text-2xl">{RANK_MEDALS[index]}</span>;
    }
    return <span className="text-zinc-500 font-bold">#{index + 1}</span>;
  };

  const getRowStyle = (index: number, isMe: boolean) => {
    const baseStyle = "transition-all hover:scale-[1.02] hover:shadow-md";
    if (index === 0) return `${baseStyle} bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400`;
    if (index === 1) return `${baseStyle} bg-zinc-50 dark:bg-zinc-800/30 border-l-4 border-zinc-400`;
    if (index === 2) return `${baseStyle} bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-400`;
    if (isMe) return `${baseStyle} bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-400`;
    return baseStyle;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Hall of Inaction</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-2">
          The top procrastinators who have done absolutely nothing for the longest time.
        </p>
        {lastUpdated && (
          <p className="text-center text-sm text-zinc-500 mb-12">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Streak (Blocks)</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Est. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <LoadingSpinner size="lg" message="Loading rankings..." />
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    <div className="text-4xl mb-2">🏆</div>
                    <p>No records yet. Be the first to do nothing!</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => {
                  const isMe = address && entry.user.value === address;
                  const blocks = Number(entry.blocks.value);
                  const days = (blocks / 144).toFixed(1);
                  
                  return (
                    <tr key={index} className={getRowStyle(index, isMe)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRankDisplay(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        {entry.user.value.slice(0, 8)}...{entry.user.value.slice(-8)}
                        {isMe && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">YOU</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                        {blocks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-500">
                        ~{days} Days
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
