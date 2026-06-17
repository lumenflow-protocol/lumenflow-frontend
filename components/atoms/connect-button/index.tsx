import { useWallet } from '../../../hooks/useWallet';

export function ConnectButton() {
  const { connected, connecting, displayName, connect } = useWallet();

  if (connecting) {
    return <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-700" />;
  }

  if (connected && displayName) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {displayName}
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 active:scale-95"
    >
      Connect Freighter
    </button>
  );
}
