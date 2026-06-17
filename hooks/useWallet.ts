import { useCallback, useEffect, useState } from 'react';
import { isConnected, getUserInfo, signTransaction } from '@stellar/freighter-api';
import { NETWORK_PASSPHRASE } from '../lib/constants';

interface WalletState {
  address: string | null;
  displayName: string | null;
  connected: boolean;
  connecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    displayName: null,
    connected: false,
    connecting: true,
  });

  useEffect(() => {
    isConnected().then(async (ok) => {
      if (!ok) return setState((s) => ({ ...s, connecting: false }));
      const info = await getUserInfo();
      if (info?.publicKey) {
        setState({
          address: info.publicKey,
          displayName: `${info.publicKey.slice(0, 4)}...${info.publicKey.slice(-4)}`,
          connected: true,
          connecting: false,
        });
      } else {
        setState((s) => ({ ...s, connecting: false }));
      }
    });
  }, []);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true }));
    try {
      const info = await getUserInfo();
      if (!info?.publicKey) throw new Error('Freighter not available');
      setState({
        address: info.publicKey,
        displayName: `${info.publicKey.slice(0, 4)}...${info.publicKey.slice(-4)}`,
        connected: true,
        connecting: false,
      });
    } catch {
      setState((s) => ({ ...s, connecting: false }));
    }
  }, []);

  const sign = useCallback(
    async (xdr: string): Promise<string> => {
      const signed = await signTransaction(xdr, { networkPassphrase: NETWORK_PASSPHRASE });
      return signed;
    },
    [],
  );

  return { ...state, connect, sign };
}
