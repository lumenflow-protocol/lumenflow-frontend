import { useEffect, useState } from 'react';
import { Stream } from '../lib/api';

function computeBalance(stream: Stream): bigint {
  if (stream.status === 'Paused' || stream.status === 'Cancelled' || stream.status === 'Completed') {
    const deposit = BigInt(stream.deposit);
    const withdrawn = BigInt(stream.withdrawn);
    return (deposit - withdrawn) > 0n ? deposit - withdrawn : 0n;
  }

  const now = BigInt(Math.floor(Date.now() / 1000));
  const start = BigInt(stream.start_time);
  const stop = BigInt(stream.stop_time);
  const rate = BigInt(stream.rate_per_second);
  const withdrawn = BigInt(stream.withdrawn);
  const deposit = BigInt(stream.deposit);

  const effectiveEnd = now < stop ? now : stop;
  const elapsed = effectiveEnd > start ? effectiveEnd - start : 0n;
  const streamed = elapsed * rate < deposit ? elapsed * rate : deposit;
  const available = streamed - withdrawn;

  return available > 0n ? available : 0n;
}

export function useStreamBalance(stream: Stream | null) {
  const [balance, setBalance] = useState<bigint>(0n);
  const [percentStreamed, setPercentStreamed] = useState(0);

  useEffect(() => {
    if (!stream) return;

    const update = () => {
      const bal = computeBalance(stream);
      setBalance(bal);

      const deposit = BigInt(stream.deposit);
      const withdrawn = BigInt(stream.withdrawn);
      const totalStreamed = withdrawn + bal;
      const pct = deposit > 0n ? Number((totalStreamed * 100n) / deposit) : 0;
      setPercentStreamed(Math.min(pct, 100));
    };

    update();
    if (stream.status !== 'Active') return;

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [stream]);

  return { balance, percentStreamed };
}
