import Link from 'next/link';
import { Stream } from '../../../lib/api';
import { Badge } from '../../atoms/badge';
import { useStreamBalance } from '../../../hooks/useStreamBalance';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatAmount(raw: string, decimals = 7) {
  const n = Number(BigInt(raw)) / 10 ** decimals;
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function StreamCard({ stream, role }: { stream: Stream; role: 'sender' | 'recipient' }) {
  const { balance, percentStreamed } = useStreamBalance(stream);
  const counterparty = role === 'sender' ? stream.recipient : stream.sender;
  const label = role === 'sender' ? 'To' : 'From';

  return (
    <Link href={`/streams/${stream.stream_id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/60 backdrop-blur transition hover:bg-slate-800 hover:ring-slate-600 hover:shadow-xl hover:shadow-black/20">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="font-mono text-sm text-slate-300">{shortAddress(counterparty)}</p>
          </div>
          <Badge status={stream.status} />
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatAmount(balance.toString())}
            <span className="ml-1.5 text-sm font-normal text-slate-400">XLM</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            of {formatAmount(stream.deposit)} total
          </p>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${percentStreamed}%` }}
            />
          </div>
          <p className="mt-1.5 text-right text-xs text-slate-500">{percentStreamed}% streamed</p>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
          <span className="font-medium text-slate-400">
            {formatAmount(stream.rate_per_second)}
          </span>
          <span>XLM / sec</span>
          <span className="ml-auto text-slate-600">#{stream.stream_id}</span>
        </div>
      </div>
    </Link>
  );
}
