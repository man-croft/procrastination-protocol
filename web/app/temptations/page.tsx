'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { getCurrentTemptation, CLAIM_TEMPTATION_OPTIONS } from '../../lib/contracts';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';

interface Temptation {
  name: { value: string };
  bonus: { value: bigint };
}

export default function TemptationsPage() {
  const { address, isConnected } = useWallet();
  const [temptation, setTemptation] = useState<Temptation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadTemptation();
    }
  }, [address]);

  const loadTemptation = async () => {
    setLoading(true);
    try {
      const temp = await getCurrentTemptation();
      // Clarity result unwrapping depends on library version, assuming standard object map here or null if err
      // If it's an error (none), cvToValue might return null or error obj.
      if (temp && typeof temp === 'object' && 'value' in temp) {
        // It might be wrapped in Some/Ok.
        // Simplified assumption: the lib/contracts returns the inner value or null.
        // Let's assume cvToValue returns the JS object {name: ..., bonus: ...} directly if OK
         setTemptation(temp as any);
      } else if (temp) {
         setTemptation(temp as any);
      } else {
        setTemptation(null);
      }
    } catch (e) {
      setTemptation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    await openContractCall({
      ...CLAIM_TEMPTATION_OPTIONS,
      onFinish: () => {
        setTemptation(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Temptation Events</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Every now and then, the protocol offers you a way out. 
          Claiming a temptation gives you an instant bonus but <span className="font-bold text-red-600">resets your streak to zero</span>.
        </p>

        {loading ? (
          <div className="animate-pulse flex justify-center">Loading...</div>
        ) : temptation ? (
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-10 rounded-3xl border-2 border-yellow-400 dark:border-yellow-600 shadow-xl max-w-lg mx-auto transform hover:scale-105 transition-transform">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-3xl font-black mb-2">{temptation.name.value || "Mystery Event"}</h2>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-8">
              +{Number(temptation.bonus.value) / 1000000} STX Bonus
            </p>
            
            <button
              onClick={handleClaim}
              className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black"
            >
              Succumb to Temptation
            </button>
            <p className="text-xs text-red-600 mt-4 font-bold uppercase tracking-widest">
              Warning: This resets your streak
            </p>
          </div>
        ) : (
          <div className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-3xl max-w-lg mx-auto">
            <div className="text-6xl mb-6 opacity-50">🧘</div>
            <h2 className="text-2xl font-bold mb-2">No Active Temptations</h2>
            <p className="text-zinc-500">
              The blockchain is quiet. Stay strong and do nothing.
            </p>
            <button 
              onClick={loadTemptation} 
              className="mt-6 text-sm underline text-zinc-500 hover:text-black dark:hover:text-white"
            >
              Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
