'use client';

import { useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { getStartOptions } from '../../lib/contracts';
import { openContractCall } from '@stacks/connect';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function StartPage() {
  const { address, isConnected } = useWallet();
  const [amount, setAmount] = useState<string>('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!address) return;
    
    try {
      setIsSubmitting(true);
      const stxAmount = Math.floor(parseFloat(amount) * 1000000); // STX to microSTX
      
      const opts = await getStartOptions(stxAmount, address);
      const options = {
        ...opts,
        onFinish: (data: any) => {
          console.log('Transaction finished:', data);
          setIsSubmitting(false);
          // Ideally wait for tx confirmation or show pending state
          router.push('/dashboard');
        },
        onCancel: () => {
          setIsSubmitting(false);
        },
      };

      await openContractCall(options);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">Please connect your wallet to start.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 px-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold mb-6">Start Procrastinating</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-zinc-600 dark:text-zinc-400">
              Amount to Lock (STX)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              min="1"
            />
          </div>

          <p className="text-sm text-zinc-500 mb-8">
            Once locked, you must NOT interact with the protocol to build your streak. 
            Quitting early incurs a 10% penalty.
          </p>

          <button
            onClick={handleStart}
            disabled={isSubmitting}
            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isSubmitting ? 'Processing...' : 'Lock & Do Nothing'}
          </button>
        </div>
      </div>
    </div>
  );
}
