import { useEffect, useState, useCallback } from 'react';
import { api, Stream, StreamEvent, AddressStats } from '../lib/api';

export function useStream(id: string | undefined) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStream = useCallback(() => {
    if (!id) return;
    setLoading(true);
    api.getStream(id)
      .then(setStream)
      .catch(() => setError('Stream not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchStream();
  }, [fetchStream]);

  return { stream, loading, error, refetch: fetchStream };
}

export function useStreamEvents(id: string | undefined) {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(() => {
    if (!id) return;
    setLoading(true);
    api.getStreamEvents(id)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetchEvents: fetchEvents };
}

export function useStreamsBySender(
  address: string | null,
  params?: { status?: string; search?: string },
) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStreams = useCallback(() => {
    if (!address) return;
    setLoading(true);
    api.getStreamsBySender(address, params)
      .then(setStreams)
      .finally(() => setLoading(false));
  }, [address, params?.status, params?.search]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  return { streams, loading, refetch: fetchStreams };
}

export function useStreamsByRecipient(
  address: string | null,
  params?: { status?: string; search?: string },
) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStreams = useCallback(() => {
    if (!address) return;
    setLoading(true);
    api.getStreamsByRecipient(address, params)
      .then(setStreams)
      .finally(() => setLoading(false));
  }, [address, params?.status, params?.search]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  return { streams, loading, refetch: fetchStreams };
}

export function useAddressStats(address: string | null) {
  const [stats, setStats] = useState<AddressStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    api.getAddressStats(address)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [address]);

  return { stats, loading };
}
