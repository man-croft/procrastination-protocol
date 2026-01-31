'use client';

import { useState, useEffect, useCallback } from 'react';
import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';

interface WalletError {
  message: string;
  code?: string;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WalletError | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      try {
        if (isConnected()) {
          const data = getLocalStorage() as any;
          // Handle both object (old) and array (new) formats
          const stxAddress = data?.addresses?.stx?.[0]?.address 
            || (Array.isArray(data?.addresses) ? data.addresses.find((a: any) => a.type === 'stx' || !a.type)?.address : null);
          setAddress(stxAddress || null);
          setError(null);
        } else {
          setAddress(null);
        }
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to check wallet connection',
          code: 'CONNECTION_CHECK_FAILED'
        });
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await connect() as any;
      const stxAddress = response.addresses?.stx?.[0]?.address 
        || (Array.isArray(response.addresses) ? response.addresses.find((a: any) => a.type === 'stx' || !a.type)?.address : null);
      
      setAddress(stxAddress);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError({
        message: errorMessage,
        code: 'CONNECTION_FAILED'
      });
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    try {
      disconnect();
      setAddress(null);
      setError(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Failed to disconnect wallet',
        code: 'DISCONNECT_FAILED'
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    address,
    isConnected: !!address,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    clearError,
  };
}
