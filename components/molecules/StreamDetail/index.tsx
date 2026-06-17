import { useState } from 'react';
import { Stream } from '../../../lib/api';
import { Badge } from '../../atoms/badge';
import { useStreamBalance } from '../../../hooks/useStreamBalance';
import { useWallet } from '../../../hooks/useWallet';
import { contract } from '../../../lib/contract';

function shortAddress(addr: string) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function formatAmount(raw: string | bigint, decimals = 7) {
  const n = Number(typeof raw === 'bigint' ? raw : BigInt(raw)) / 10 ** decimals;
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatDate(ts: string) {
  return new Date(Number(ts) * 1000).toLocaleString();
}

interface Props {
  stream: Stream;
  onRefetch: () => void;
}

export function StreamDetail({ stream, onRefetch }: Props) {
  const { balance, percentStreamed } = useStreamBalance(stream);
  const { address, sign } = useWallet();
  const [txLoading, setTxLoading] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const isSender = address === stream.sender;
  const isRecipient = address === stream.recipient;
  const streamId = BigInt(stream.stream_id);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setTxLoading(label);
    setTxError(null);
    try {
      await fn();
      setTimeout(onRefetch, 3000);
    } catch (err: any) {
      setTxError(err?.message ?? 'Transaction failed');
    } finally {
      setTxLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/15 to-cyan-600/10 p-8 ring-1 ring-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">
              {isRecipient ? 'Available to withdraw' : 'Streaming to recipient'}
            </p>
            <Badge status={stream.status} />
          </div>
          <p className="mt-3 text-5xl font-bold tracking-tight text-white tabular-nums">
            {formatAmount(balance)}
            <span className="ml-2 text-2xl font-normal text-slate-400">XLM</span>
          </p>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${percentStreamed}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {percentStreamed}% of {formatAmount(stream.deposit)} XLM streamed
          </p>
        </div>
      </div>

      {/* Actions */}
      {(isSender || isRecipient) && stream.status !== 'Cancelled' && stream.status !== 'Completed' && (
        <div className="flex flex-wrap gap-3">
          {isRecipient && (
            <button
              onClick={() => run('Withdraw', () => contract.withdraw(streamId, address!, sign))}
              disabled={!!txLoading || balance === 0n}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {txLoading === 'Withdraw' ? 'Confirming…' : 'Withdraw'}
            </button>
          )}
          {isSender && stream.status === 'Active' && (
            <>
              <button
                onClick={() => run('Pause', () => contract.pauseStream(streamId, address!, sign))}
                disabled={!!txLoading}
                className="rounded-xl bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-400 ring-1 ring-amber-500/20 transition hover:bg-amber-500/20 active:scale-95 disabled:opacity-50"
              >
                {txLoading === 'Pause' ? 'Confirming…' : 'Pause'}
              </button>
              <button
                onClick={() => run('Cancel', () => contract.cancelStream(streamId, address!, sign))}
                disabled={!!txLoading}
                className="rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
              >
                {txLoading === 'Cancel' ? 'Confirming…' : 'Cancel'}
              </button>
            </>
          )}
          {isSender && stream.status === 'Paused' && (
            <button
              onClick={() => run('Resume', () => contract.resumeStream(streamId, address!, sign))}
              disabled={!!txLoading}
              className="rounded-xl bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {txLoading === 'Resume' ? 'Confirming…' : 'Resume'}
            </button>
          )}
        </div>
      )}

      {txError && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {txError}
        </p>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: 'Stream ID', value: `#${stream.stream_id}` },
          { label: 'Rate', value: `${formatAmount(stream.rate_per_second)} XLM / sec` },
          { label: 'Sender', value: shortAddress(stream.sender), mono: true },
          { label: 'Recipient', value: shortAddress(stream.recipient), mono: true },
          { label: 'Start', value: formatDate(stream.start_time) },
          { label: 'End', value: formatDate(stream.stop_time) },
          { label: 'Total deposit', value: `${formatAmount(stream.deposit)} XLM` },
          { label: 'Withdrawn', value: `${formatAmount(stream.withdrawn)} XLM` },
        ].map(({ label, value, mono }) => (
          <div key={label} className="rounded-xl bg-slate-800/60 px-4 py-3 ring-1 ring-slate-700/60">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-sm text-slate-200 ${mono ? 'font-mono' : 'font-medium'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
