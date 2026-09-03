import axios from 'axios';
import { API_URL } from './constants';

export interface Stream {
  stream_id: string;
  sender: string;
  recipient: string;
  token: string;
  title: string;
  deposit: string;
  rate_per_second: string;
  start_time: string;
  stop_time: string;
  cliff_time: string;
  withdrawn: string;
  status: 'Active' | 'Paused' | 'Cancelled' | 'Completed';
  last_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface StreamEvent {
  id: number;
  stream_id: string;
  event_type: 'CREATED' | 'WITHDRAW' | 'TOP_UP' | 'TRANSFER' | 'PAUSED' | 'RESUMED' | 'CANCEL' | 'COMPLETE';
  actor: string;
  amount: string;
  tx_hash: string | null;
  ledger: number;
  created_at: string;
}

export interface AddressStats {
  address: string;
  sendingCount: number;
  receivingCount: number;
  activeOutgoing: number;
  activeIncoming: number;
  totalDeposited: string;
  totalClaimed: string;
}

export interface GlobalAnalytics {
  totalStreams: number;
  activeStreams: number;
  totalVolumeLocked: string;
  totalVolumeWithdrawn: string;
}

const client = axios.create({ baseURL: API_URL });

export const api = {
  getStream: async (id: string): Promise<Stream> => {
    const { data } = await client.get<Stream>(`/streams/${id}`);
    return data;
  },

  getStreamEvents: async (id: string): Promise<StreamEvent[]> => {
    const { data } = await client.get<StreamEvent[]>(`/streams/${id}/events`);
    return data;
  },

  getStreamsBySender: async (
    address: string,
    params?: { status?: string; search?: string },
  ): Promise<Stream[]> => {
    const { data } = await client.get<any>(`/streams/sender/${address}`, { params });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.streams)) return data.streams;
    return [];
  },

  getStreamsByRecipient: async (
    address: string,
    params?: { status?: string; search?: string },
  ): Promise<Stream[]> => {
    const { data } = await client.get<any>(`/streams/recipient/${address}`, { params });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.streams)) return data.streams;
    return [];
  },

  getAddressStats: async (address: string): Promise<AddressStats> => {
    const { data } = await client.get<AddressStats>(`/streams/stats/${address}`);
    return data;
  },

  getGlobalAnalytics: async (): Promise<GlobalAnalytics> => {
    const { data } = await client.get<GlobalAnalytics>('/streams/analytics/overview');
    return data;
  },
};
