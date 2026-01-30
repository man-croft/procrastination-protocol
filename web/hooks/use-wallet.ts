'use client';

import { useState, useEffect, useCallback } from 'react';
import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      if (isConnected()) {
        const data = getLocalStorage() as any;
        // Handle both object (old) and array (new) formats
        const stxAddress = data?.addresses?.stx?.[0]?.address 
          || (Array.isArray(data?.addresses) ? data.addresses.find((a: any) => a.type === 'stx' || !a.type)?.address : null);
        setAddress(stxAddress || null);
      } else {
        setAddress(null);
      }
      setLoading(false);
    };

    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const response = await connect() as any;
      const stxAddress = response.addresses?.stx?.[0]?.address 
        || (Array.isArray(response.addresses) ? response.addresses.find((a: any) => a.type === 'stx' || !a.type)?.address : null);
      
      setAddress(stxAddress);
      return response;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setAddress(null);
  }, []);

  return {
    address,
    isConnected: !!address,
    loading,
    connectWallet,
    disconnectWallet,
  };
}
