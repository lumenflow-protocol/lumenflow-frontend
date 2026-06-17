import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '../hooks/useWallet';
import { useStreamsBySender, useStreamsByRecipient } from '../hooks/useStream';
import { StreamList } from '../components/organisms/StreamList';

export default function Dashboard() {
  const { address, connected, connecting, connect } = useWallet();
  const [tab, setTab] = useState<'sending' | 'receiving'>('sending');

  const { streams: sending, loading: loadingSending } = useStreamsBySender(address);
  const { streams: receiving, loading: loadingReceiving } = useStreamsByRecipient(address);

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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 ring-1 ring-violet-500/20">
          <svg className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">Connect your wallet</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Connect Freighter to view your streams and manage payments.
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
        <title>Dashboard · LumenFlow</title>
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 font-mono text-sm text-slate-400">
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </p>
          </div>
          <Link
            href="/streams/create"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90"
          >
            + Create Stream
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Sending', value: sending.length },
            { label: 'Receiving', value: receiving.length },
            { label: 'Active', value: [...sending, ...receiving].filter(s => s.status === 'Active').length },
            { label: 'Completed', value: [...sending, ...receiving].filter(s => s.status === 'Completed').length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-slate-700/60 bg-slate-800/40 px-5 py-4">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-slate-700/60 bg-slate-800/40 p-1 w-fit">
          {(['sending', 'receiving'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t} ({t === 'sending' ? sending.length : receiving.length})
            </button>
          ))}
        </div>

        {/* Stream list */}
        {tab === 'sending' ? (
          <StreamList
            streams={sending}
            role="sender"
            loading={loadingSending}
            emptyText="No outgoing streams yet. Create one to get started."
          />
        ) : (
          <StreamList
            streams={receiving}
            role="recipient"
            loading={loadingReceiving}
            emptyText="No incoming streams yet."
          />
        )}
      </div>
    </>
  );
}
