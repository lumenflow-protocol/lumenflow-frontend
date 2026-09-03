import Link from 'next/link';
import { Stream } from '../../../lib/api';
import { Badge } from '../../atoms/badge';
import { useStreamBalance } from '../../../hooks/useStreamBalance';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatAmount(raw: string, decimals = 7) {
  const n = Number(BigInt(raw || '0')) / 10 ** decimals;
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function StreamCard({ stream, role }: { stream: Stream; role: 'sender' | 'recipient' }) {
  const { balance, percentStreamed } = useStreamBalance(stream);
  const counterparty = role === 'sender' ? stream.recipient : stream.sender;
  const label = role === 'sender' ? 'Contributor' : 'Maintainer';
  const tokenSymbol = stream.token?.includes('USDC') ? 'USDC' : 'XLM';

  const nowSec = Math.floor(Date.now() / 1000);
  const isCliffActive = stream.cliff_time && Number(stream.cliff_time) > nowSec;

  return (
    <Link href={`/streams/${stream.stream_id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/60 backdrop-blur transition hover:bg-slate-800/90 hover:ring-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 overflow-hidden">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-violet-300 transition">
              {stream.title || `Stream #${stream.stream_id}`}
            </h3>
            <p className="text-xs text-slate-400">
              <span className="text-slate-500">{label}: </span>
              <span className="font-mono">{shortAddress(counterparty)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge status={stream.status} />
            {isCliffActive && (
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 ring-1 ring-amber-500/20">
                Cliff Locked
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-white tabular-nums">
            {formatAmount(balance.toString())}
            <span className="ml-1.5 text-sm font-normal text-slate-400">{tokenSymbol}</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            of {formatAmount(stream.deposit)} total
          </p>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${percentStreamed}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>{percentStreamed}% streamed</span>
            <span className="font-mono text-slate-400">{formatAmount(stream.rate_per_second)}/s</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
