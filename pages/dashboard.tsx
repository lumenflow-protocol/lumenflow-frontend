import Head from 'next/head';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useWallet } from '../hooks/useWallet';
import { useStreamsBySender, useStreamsByRecipient, useAddressStats } from '../hooks/useStream';
import { StreamList } from '../components/organisms/StreamList';
import { Stream } from '../lib/api';

function formatAmount(raw: string | bigint, decimals = 7) {
  const n = Number(typeof raw === 'bigint' ? raw : BigInt(raw || '0')) / 10 ** decimals;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function Dashboard() {
  const { address, connected, connecting, connect } = useWallet();
  const [tab, setTab] = useState<'sending' | 'receiving'>('sending');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const { streams: sending, loading: loadingSending } = useStreamsBySender(address);
  const { streams: receiving, loading: loadingReceiving } = useStreamsByRecipient(address);
  const { stats } = useAddressStats(address);

  const filteredSending = useMemo(() => {
    return sending.filter((s) => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchSearch =
        !search ||
        (s.title && s.title.toLowerCase().includes(search.toLowerCase())) ||
        s.sender.toLowerCase().includes(search.toLowerCase()) ||
        s.recipient.toLowerCase().includes(search.toLowerCase()) ||
        s.stream_id.includes(search);
      return matchStatus && matchSearch;
    });
  }, [sending, statusFilter, search]);

  const filteredReceiving = useMemo(() => {
    return receiving.filter((s) => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchSearch =
        !search ||
        (s.title && s.title.toLowerCase().includes(search.toLowerCase())) ||
        s.sender.toLowerCase().includes(search.toLowerCase()) ||
        s.recipient.toLowerCase().includes(search.toLowerCase()) ||
        s.stream_id.includes(search);
      return matchStatus && matchSearch;
    });
  }, [receiving, statusFilter, search]);

  // CSV Export for Maintainers & Contributors
  const exportCSV = () => {
    const list = tab === 'sending' ? sending : receiving;
    if (list.length === 0) return;

    const headers = [
      'Stream ID',
      'Title/Issue',
      'Sender',
      'Recipient',
      'Deposit',
      'Withdrawn',
      'Rate Per Second',
      'Status',
      'Start Time',
      'Stop Time',
      'Cliff Time',
      'Tx Hash',
    ];

    const rows = list.map((s) => [
      s.stream_id,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      s.sender,
      s.recipient,
      formatAmount(s.deposit),
      formatAmount(s.withdrawn),
      formatAmount(s.rate_per_second),
      s.status,
      new Date(Number(s.start_time) * 1000).toISOString(),
      new Date(Number(s.stop_time) * 1000).toISOString(),
      s.cliff_time && s.cliff_time !== '0' ? new Date(Number(s.cliff_time) * 1000).toISOString() : 'None',
      s.last_tx_hash || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lumenflow_${tab}_streams_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (connecting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 ring-1 ring-violet-500/20 shadow-xl shadow-violet-500/5">
          <svg className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">Connect your Stellar wallet</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Connect Freighter to manage open-source contributor streams and real-time payouts.
        </p>
        <button
          onClick={connect}
          className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90"
        >
          Connect Freighter
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Maintainer & Contributor Dashboard · LumenFlow</title>
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Streaming Dashboard</h1>
              <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-400 ring-1 ring-violet-500/20">
                Maintainer & Contributor
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-slate-400">
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-300 ring-1 ring-slate-700 hover:bg-slate-700 hover:text-white transition"
              title="Download CSV for grant & accounting records"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>

            <Link
              href="/streams/create"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90"
            >
              + Stream to Contributor
            </Link>
          </div>
        </div>

        {/* Portfolio Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <p className="text-xs font-medium text-slate-400">Active Contributor Streams</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {stats ? stats.activeOutgoing : sending.filter((s) => s.status === 'Active').length}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Outgoing active payouts</p>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <p className="text-xs font-medium text-slate-400">Incoming Streams</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {stats ? stats.receivingCount : receiving.length}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Total earned as contributor</p>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <p className="text-xs font-medium text-slate-400">Total Funded (XLM)</p>
            <p className="mt-1 text-2xl font-bold text-white tabular-nums">
              {stats ? formatAmount(stats.totalDeposited) : formatAmount(sending.reduce((acc, s) => acc + BigInt(s.deposit), 0n))}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Locked in maintainer streams</p>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <p className="text-xs font-medium text-slate-400">Total Claimed (XLM)</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400 tabular-nums">
              {stats ? formatAmount(stats.totalClaimed) : formatAmount(receiving.reduce((acc, s) => acc + BigInt(s.withdrawn), 0n))}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Withdrawn by contributors</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-slate-700/60 bg-slate-800/40 p-1">
            {(['sending', 'receiving'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === t
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'sending' ? `To Contributors (${sending.length})` : `Incoming Rewards (${receiving.length})`}
              </button>
            ))}
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search issue title or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-slate-800/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl bg-slate-800/80 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stream List */}
        {tab === 'sending' ? (
          <StreamList
            streams={filteredSending}
            role="sender"
            loading={loadingSending}
            emptyText={
              sending.length === 0
                ? 'No outgoing streams yet. Create a stream to start dripping rewards to contributors!'
                : 'No streams match your search or filter criteria.'
            }
          />
        ) : (
          <StreamList
            streams={filteredReceiving}
            role="recipient"
            loading={loadingReceiving}
            emptyText={
              receiving.length === 0
                ? 'No incoming contributor streams found for this address.'
                : 'No streams match your search or filter criteria.'
            }
          />
        )}
      </div>
    </>
  );
}
