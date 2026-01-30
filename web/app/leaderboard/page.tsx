'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../lib/contracts';
import Navbar from '../../components/Navbar';
import { useWallet } from '../../hooks/use-wallet';

interface LeaderboardEntry {
  user: { value: string };
  blocks: { value: bigint };
}

export default function LeaderboardPage() {
  const { address } = useWallet();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      if (Array.isArray(data)) {
        // Sort by blocks descending just in case, though contract usually appends
        const sorted = (data as any[]).sort((a, b) => Number(b.blocks.value) - Number(a.blocks.value));
        setEntries(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Hall of Inaction</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          The top procrastinators who have done absolutely nothing for the longest time.
        </p>

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
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Loading rankings...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No records yet. Be the first to do nothing!</td>
                </tr>
              ) : (
                entries.map((entry, index) => {
                  const isMe = address && entry.user.value === address;
                  const blocks = Number(entry.blocks.value);
                  const days = (blocks / 144).toFixed(1);
                  
                  return (
                    <tr key={index} className={isMe ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {index === 0 ? '👑' : `#${index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        {entry.user.value.slice(0, 8)}...{entry.user.value.slice(-8)}
                        {isMe && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black text-white dark:bg-white dark:text-black">YOU</span>}
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
