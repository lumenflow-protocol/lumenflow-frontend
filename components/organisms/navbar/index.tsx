import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectButton } from '../../atoms/connect-button';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create Stream', href: '/streams/create' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30 transition group-hover:shadow-violet-500/50">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white">LumenFlow</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                router.pathname === href
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ConnectButton />
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 p-1 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 rounded bg-slate-400 transition-all" />
          <span className="block h-0.5 w-5 rounded bg-slate-400 transition-all" />
          <span className="block h-0.5 w-5 rounded bg-slate-400 transition-all" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  router.pathname === href
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-800 pt-4">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
