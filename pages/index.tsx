import Head from 'next/head';
import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-time streaming',
    desc: 'Tokens drip per second directly on-chain. No batches, no delays.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Non-custodial',
    desc: 'Funds locked in a Soroban contract. No one can touch them except the rules.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Pause & cancel',
    desc: 'Senders can pause or cancel at any time. Accrued amount always protected.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Any Stellar token',
    desc: 'Stream XLM, USDC, or any Stellar asset — same contract, same UX.',
  },
];

const STEPS = [
  { num: '01', title: 'Connect Freighter', desc: 'One-click wallet connect. No email, no password.' },
  { num: '02', title: 'Set up a stream', desc: 'Choose recipient, deposit amount, and stream rate.' },
  { num: '03', title: 'Sign & deploy', desc: 'Approve in Freighter. Funds locked on Soroban instantly.' },
  { num: '04', title: 'Tokens flow', desc: 'Recipient withdraws accrued tokens anytime, in real time.' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>LumenFlow — Streaming Payments on Stellar</title>
        <meta name="description" content="Stream XLM and Stellar tokens per second with Soroban smart contracts. Real-time, non-custodial, unstoppable." />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/4 top-24 h-64 w-64 rounded-full bg-cyan-500/8 blur-[80px]" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-violet-400 uppercase">
            Built on Stellar · Soroban Smart Contracts
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Money that{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              flows in real time
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            LumenFlow lets you stream XLM and Stellar tokens per second.
            Pay salaries, subscriptions, and freelance work — live, on-chain, unstoppable.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/streams/create"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
            >
              Create a Stream →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:-translate-y-0.5"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Live demo card */}
        <div className="relative mx-auto mt-20 max-w-sm rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-cyan-600/5 p-6 text-left shadow-2xl shadow-violet-500/10 glow-violet">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Streaming to</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-300">GDMO...R4B2</p>
          <p className="mt-5 text-4xl font-bold tabular-nums text-white">
            2,481.
            <span className="text-violet-400">39</span>
            <span className="ml-1.5 text-xl font-normal text-slate-400">XLM</span>
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
          <p className="mt-2 text-xs text-slate-500">62% streamed · 0.0115 XLM/sec</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-violet-400">Why LumenFlow</p>
        <h2 className="mt-3 text-center text-3xl font-bold text-white">Everything a payment stream needs</h2>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 transition hover:border-violet-500/30 hover:bg-slate-800/60">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/20">
                {f.icon}
              </div>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-violet-400">How it works</p>
        <h2 className="mt-3 text-center text-3xl font-bold text-white">Up and streaming in four steps</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
              {i < STEPS.length - 1 && (
                <div className="absolute -right-3 top-8 hidden h-px w-6 bg-gradient-to-r from-violet-500/50 to-transparent lg:block" />
              )}
              <span className="text-3xl font-black text-violet-500/30">{s.num}</span>
              <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 to-cyan-600/10 px-8 py-16 text-center glow-violet mb-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
        <h2 className="relative text-3xl font-bold text-white">Ready to stream?</h2>
        <p className="relative mt-3 text-slate-400">Connect Freighter and create your first stream in under a minute.</p>
        <Link
          href="/streams/create"
          className="relative mt-8 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5"
        >
          Get Started →
        </Link>
      </section>
    </>
  );
}
