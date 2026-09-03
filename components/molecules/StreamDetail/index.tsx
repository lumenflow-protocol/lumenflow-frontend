import { useState, useId } from 'react';
import { Stream } from '../../../lib/api';
import { Badge } from '../../atoms/badge';
import { useStreamBalance } from '../../../hooks/useStreamBalance';
import { useStreamEvents } from '../../../hooks/useStream';
import { useWallet } from '../../../hooks/useWallet';
import { contract } from '../../../lib/contract';

function shortAddress(addr: string) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function formatAmount(raw: string | bigint, decimals = 7) {
  const n = Number(typeof raw === 'bigint' ? raw : BigInt(raw || '0')) / 10 ** decimals;
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatDate(ts: string | number) {
  if (!ts || ts === '0') return 'None';
  return new Date(Number(ts) * 1000).toLocaleString();
}

interface Props {
  stream: Stream;
  onRefetch: () => void;
}

export function StreamDetail({ stream, onRefetch }: Props) {
  const { balance, percentStreamed } = useStreamBalance(stream);
  const { events, refetchEvents } = useStreamEvents(stream.stream_id);
  const { address, sign } = useWallet();

  const [txLoading, setTxLoading] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Modals state
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const topUpInputId = useId();
  const transferInputId = useId();

  const isSender = address === stream.sender;
  const isRecipient = address === stream.recipient;
  const streamId = BigInt(stream.stream_id);
  const tokenSymbol = stream.token?.includes('USDC') ? 'USDC' : 'XLM';

  const nowSec = Math.floor(Date.now() / 1000);
  const cliffTimeNum = Number(stream.cliff_time || 0);
  const isCliffLocked = cliffTimeNum > 0 && cliffTimeNum > nowSec;

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setTxLoading(label);
    setTxError(null);
    try {
      await fn();
      setTimeout(() => {
        onRefetch();
        refetchEvents();
      }, 3000);
    } catch (err: any) {
      setTxError(err?.message ?? 'Transaction failed');
    } finally {
      setTxLoading(null);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(topUpAmount);
    if (!amountNum || amountNum <= 0 || !address) return;

    await run('Top Up', async () => {
      const DECIMALS = 7;
      const rawAmount = BigInt(Math.round(amountNum * 10 ** DECIMALS));
      await contract.depositMore(streamId, rawAmount, address, sign);
      setShowTopUpModal(false);
      setTopUpAmount('');
    });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !address) return;

    await run('Transfer', async () => {
      await contract.transferRecipient(streamId, newRecipient.trim(), address, sign);
      setShowTransferModal(false);
      setNewRecipient('');
    });
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Share Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Payment Stream #{stream.stream_id}
          </span>
          <h1 className="mt-0.5 text-2xl font-bold text-white">
            {stream.title || 'Contributor Stream'}
          </h1>
        </div>
        <button
          onClick={copyShareLink}
          className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 ring-1 ring-slate-700/60 transition hover:bg-slate-700 hover:text-white active:scale-95"
        >
          {copiedLink ? (
            <>
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share Stream Link</span>
            </>
          )}
        </button>
      </div>

      {/* Milestone Cliff Alert */}
      {cliffTimeNum > 0 && (
        <div
          className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ${
            isCliffLocked
              ? 'bg-amber-500/10 text-amber-300 ring-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30'
          }`}
        >
          <div className="mt-0.5">
            {isCliffLocked ? (
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold">
              {isCliffLocked ? 'Milestone Review Cliff Active' : 'Milestone Cliff Unlocked'}
            </p>
            <p className="mt-0.5 text-xs opacity-90">
              {isCliffLocked
                ? `Withdrawals are locked until the milestone review date: ${formatDate(cliffTimeNum)}. Accrued tokens will become claimable immediately afterwards.`
                : `The milestone cliff of ${formatDate(cliffTimeNum)} has passed. Contributor may freely claim accrued tokens.`}
            </p>
          </div>
        </div>
      )}

      {/* Balance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-slate-900 to-cyan-600/10 p-8 ring-1 ring-violet-500/30 shadow-2xl shadow-violet-900/10">
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">
              {isRecipient ? 'Available to withdraw right now' : 'Accrued to contributor'}
            </p>
            <Badge status={stream.status} />
          </div>

          <p className="mt-4 text-5xl font-extrabold tracking-tight text-white tabular-nums sm:text-6xl">
            {formatAmount(balance)}
            <span className="ml-3 text-2xl font-normal text-slate-400">{tokenSymbol}</span>
          </p>

          <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${percentStreamed}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{percentStreamed}% of {formatAmount(stream.deposit)} {tokenSymbol} streamed</span>
            <span>{formatAmount(stream.rate_per_second)} {tokenSymbol}/sec</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(isSender || isRecipient) && stream.status !== 'Cancelled' && stream.status !== 'Completed' && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Contributor actions */}
          {isRecipient && (
            <>
              <button
                onClick={() => run('Withdraw', () => contract.withdraw(streamId, address!, sign))}
                disabled={!!txLoading || balance === 0n || isCliffLocked}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 active:scale-95 disabled:opacity-50"
              >
                {txLoading === 'Withdraw' ? 'Confirming…' : isCliffLocked ? 'Locked by Cliff' : 'Withdraw Accrued'}
              </button>

              <button
                onClick={() => setShowTransferModal(true)}
                disabled={!!txLoading}
                className="rounded-xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700 active:scale-95 disabled:opacity-50"
              >
                Rotate Wallet
              </button>
            </>
          )}

          {/* Maintainer actions */}
          {isSender && (
            <>
              <button
                onClick={() => setShowTopUpModal(true)}
                disabled={!!txLoading}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 active:scale-95 disabled:opacity-50"
              >
                + Top Up Runway
              </button>

              {stream.status === 'Active' && (
                <>
                  <button
                    onClick={() => run('Pause', () => contract.pauseStream(streamId, address!, sign))}
                    disabled={!!txLoading}
                    className="rounded-xl bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-400 ring-1 ring-amber-500/20 transition hover:bg-amber-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {txLoading === 'Pause' ? 'Confirming…' : 'Pause Stream'}
                  </button>
                  <button
                    onClick={() => run('Cancel', () => contract.cancelStream(streamId, address!, sign))}
                    disabled={!!txLoading}
                    className="rounded-xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {txLoading === 'Cancel' ? 'Confirming…' : 'Cancel & Settle'}
                  </button>
                </>
              )}

              {stream.status === 'Paused' && (
                <button
                  onClick={() => run('Resume', () => contract.resumeStream(streamId, address!, sign))}
                  disabled={!!txLoading}
                  className="rounded-xl bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {txLoading === 'Resume' ? 'Confirming…' : 'Resume Stream'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {txError && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {txError}
        </p>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Maintainer (Sender)', value: shortAddress(stream.sender), mono: true },
          { label: 'Contributor (Recipient)', value: shortAddress(stream.recipient), mono: true },
          { label: 'Total Deposit', value: `${formatAmount(stream.deposit)} ${tokenSymbol}` },
          { label: 'Total Withdrawn', value: `${formatAmount(stream.withdrawn)} ${tokenSymbol}` },
          { label: 'Start Time', value: formatDate(stream.start_time) },
          { label: 'Stop Time', value: formatDate(stream.stop_time) },
          { label: 'Cliff Date', value: formatDate(stream.cliff_time) },
          { label: 'Rate per Second', value: `${formatAmount(stream.rate_per_second)} ${tokenSymbol}` },
        ].map(({ label, value, mono }) => (
          <div key={label} className="rounded-2xl bg-slate-800/60 p-4 ring-1 ring-slate-700/60">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-sm text-slate-200 ${mono ? 'font-mono' : 'font-medium'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* On-Chain Contributor Payout Audit Trail */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
        <h3 className="text-base font-bold text-white">On-Chain Payout & Event Ledger</h3>
        <p className="mt-1 text-xs text-slate-400">
          Immutable audit trail of all contributor withdrawals, maintainer top-ups, and state changes.
        </p>

        {events.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-700/60 py-8 text-center text-xs text-slate-500">
            No events indexed yet. Events poll from Soroban RPC every 5 seconds.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="py-2.5 font-medium">Event</th>
                  <th className="py-2.5 font-medium">Actor</th>
                  <th className="py-2.5 font-medium">Amount</th>
                  <th className="py-2.5 font-medium">Date</th>
                  <th className="py-2.5 font-medium">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {events.map((ev) => (
                  <tr key={ev.id} className="text-slate-300">
                    <td className="py-3 font-semibold">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] ${
                          ev.event_type === 'WITHDRAW'
                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                            : ev.event_type === 'TOP_UP'
                            ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                            : ev.event_type === 'CREATED'
                            ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'
                            : 'bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {ev.event_type}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {ev.actor ? shortAddress(ev.actor) : '—'}
                    </td>
                    <td className="py-3 tabular-nums font-medium text-white">
                      {ev.amount !== '0' ? `${formatAmount(ev.amount)} ${tokenSymbol}` : '—'}
                    </td>
                    <td className="py-3 text-slate-400">{new Date(ev.created_at).toLocaleString()}</td>
                    <td className="py-3">
                      {ev.tx_hash ? (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${ev.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-violet-400 hover:underline"
                        >
                          {ev.tx_hash.slice(0, 8)}…
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Top Up Contributor Runway</h3>
            <p className="mt-1 text-xs text-slate-400">
              Deposit more tokens to extend the duration and reward the contributor without interrupting the stream.
            </p>

            <form onSubmit={handleTopUp} className="mt-5 space-y-4">
              <div>
                <label htmlFor={topUpInputId} className="mb-1 block text-xs font-medium text-slate-300">
                  Additional Deposit ({tokenSymbol})
                </label>
                <input
                  id={topUpInputId}
                  type="number"
                  min="0.0000001"
                  step="any"
                  placeholder="500"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!txLoading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  {txLoading ? 'Confirming…' : 'Deposit & Extend'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rotate Recipient Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Rotate Payout Wallet</h3>
            <p className="mt-1 text-xs text-slate-400">
              Transfer future stream withdrawals to your new Stellar address.
            </p>

            <form onSubmit={handleTransfer} className="mt-5 space-y-4">
              <div>
                <label htmlFor={transferInputId} className="mb-1 block text-xs font-medium text-slate-300">
                  New Stellar Address
                </label>
                <input
                  id={transferInputId}
                  type="text"
                  placeholder="G..."
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 font-mono text-sm text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!txLoading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  {txLoading ? 'Confirming…' : 'Transfer Stream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
