import { Networks } from '@stellar/stellar-sdk';

export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? 'https://soroban-testnet.stellar.org';

export const STREAM_CONTRACT_ID =
  process.env.NEXT_PUBLIC_STREAM_CONTRACT_ID ?? '';

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? Networks.PUBLIC
    : Networks.TESTNET;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export const USDC_CONTRACT_ID =
  process.env.NEXT_PUBLIC_USDC_CONTRACT_ID ?? '';
