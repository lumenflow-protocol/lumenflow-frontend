import axios from 'axios';
import { API_URL } from './constants';

export interface Stream {
  stream_id: string;
  sender: string;
  recipient: string;
  token: string;
  deposit: string;
  rate_per_second: string;
  start_time: string;
  stop_time: string;
  withdrawn: string;
  status: 'Active' | 'Paused' | 'Cancelled' | 'Completed';
  last_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

const client = axios.create({ baseURL: API_URL });

export const api = {
  getStream: async (id: string): Promise<Stream> => {
    const { data } = await client.get<Stream>(`/streams/${id}`);
    return data;
  },

  getStreamsBySender: async (address: string): Promise<Stream[]> => {
    const { data } = await client.get<Stream[]>(`/streams/sender/${address}`);
    return data;
  },

  getStreamsByRecipient: async (address: string): Promise<Stream[]> => {
    const { data } = await client.get<Stream[]>(`/streams/recipient/${address}`);
    return data;
  },
};
