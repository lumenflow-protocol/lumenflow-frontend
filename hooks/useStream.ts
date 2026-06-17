import { useEffect, useState } from 'react';
import { api, Stream } from '../lib/api';

export function useStream(id: string | undefined) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getStream(id)
      .then(setStream)
      .catch(() => setError('Stream not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const refetch = () => {
    if (!id) return;
    api.getStream(id).then(setStream).catch(() => {});
  };

  return { stream, loading, error, refetch };
}

export function useStreamsBySender(address: string | null) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    api.getStreamsBySender(address)
      .then(setStreams)
      .finally(() => setLoading(false));
  }, [address]);

  return { streams, loading };
}

export function useStreamsByRecipient(address: string | null) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    api.getStreamsByRecipient(address)
      .then(setStreams)
      .finally(() => setLoading(false));
  }, [address]);

  return { streams, loading };
}
