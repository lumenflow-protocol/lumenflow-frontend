import Head from 'next/head';
import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-time contributor streams',
    desc: 'Tokens drip per second directly on-chain to contributors as they ship PRs and close issues.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Milestone review cliffs',
    desc: 'Maintainers can lock funds behind review cliffs before contributor tokens unlock for withdrawal.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    title: 'Runway top-ups',
    desc: 'Reward active contributors by topping up existing streams with more funds without redeploying.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Safe wallet rotation',
    desc: 'Contributors can seamlessly transfer receiving rights to cold wallets or new Stellar accounts.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Issue memo & audit trail',
    desc: 'Every stream links to a GitHub issue memo with complete on-chain event logs and explorer links.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Any Stellar asset',
    desc: 'Stream native XLM, USDC, or custom SAC tokens on Soroban with automated TTL extensions.',
  },
];

const STEPS = [
  { num: '01', title: 'Connect Freighter', desc: 'One-click wallet connect for maintainers and contributors.' },
  { num: '02', title: 'Attach Issue & Rate', desc: 'Specify contributor address, GitHub issue memo, and flow rate.' },
  { num: '03', title: 'Set Milestone Cliff', desc: 'Optional review cliff period before funds become claimable.' },
  { num: '04', title: 'Real-Time Accrual', desc: 'Contributors withdraw live tokens anytime, verified on-chain.' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>LumenFlow — Streaming Payments for Open-Source Maintainers</title>
        <meta
          name="description"
          content="Stream bounties, grants, and contributor rewards per second on Stellar with Soroban smart contracts. Real-time, non-custodial, milestone-ready."
        />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute left-1/4 top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-violet-400 uppercase">
            Stellar Soroban · Open-Source Maintainers & Contributors
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Stream rewards to contributors{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              in real time
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            LumenFlow powers the contributor economy. Open-source maintainers stream XLM and USDC
            rewards per second to contributors solving GitHub issues, complete with milestone cliffs, runway top-ups, and audit trails.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/streams/create"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
            >
              Stream to Contributor →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:-translate-y-0.5"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        {/* Live preview card */}
        <div className="relative mx-auto mt-16 max-w-md rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/10 via-slate-900 to-cyan-600/5 p-6 text-left shadow-2xl shadow-violet-500/10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-violet-400">Issue #42 Bounty</span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/25">
              ● Active Stream
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-white">
            Indexer Pagination & Retry Logic
          </p>
          <p className="font-mono text-xs text-slate-400">
            To: GDMO...X9F1
          </p>

          <div className="mt-4 rounded-xl bg-slate-950/70 p-4 ring-1 ring-slate-800">
            <p className="text-xs text-slate-400">Accrued to contributor right now</p>
            <p className="mt-1 text-3xl font-extrabold text-white tabular-nums">
              348.8241 <span className="text-lg font-normal text-slate-400">XLM</span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>66% of 500 XLM</span>
              <span>0.005 XLM/sec</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Built for Open-Source Workflows</h2>
          <p className="mt-3 text-slate-400">Everything maintainers and contributors need for fair, transparent streaming.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition hover:border-violet-500/40 hover:bg-slate-900/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400 ring-1 ring-violet-500/25">
                {f.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-slate-800/80">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-slate-400">Start dripping rewards to contributors in four simple steps.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.num} className="relative rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6">
              <span className="font-mono text-3xl font-extrabold text-violet-500/30">{s.num}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
