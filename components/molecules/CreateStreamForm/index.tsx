import { useState, useId } from 'react';
import { contract } from '../../../lib/contract';
import { USDC_CONTRACT_ID } from '../../../lib/constants';
import { useWallet } from '../../../hooks/useWallet';

interface Props {
  onSuccess: (txHash: string) => void;
}

export function CreateStreamForm({ onSuccess }: Props) {
  const { address, connected, sign } = useWallet();
  const recipientId = useId();
  const titleId = useId();
  const depositId = useId();
  const durationId = useId();
  const cliffDaysId = useId();

  const [form, setForm] = useState({
    title: '',
    recipient: '',
    deposit: '',
    durationDays: '30',
    hasCliff: false,
    cliffDays: '7',
    tokenType: 'XLM',
    customToken: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Calculations
  const depositNum = parseFloat(form.deposit) || 0;
  const durationDaysNum = parseFloat(form.durationDays) || 0;
  const totalSeconds = durationDaysNum * 86400;
  const ratePerSecondNum = totalSeconds > 0 && depositNum > 0 ? depositNum / totalSeconds : 0;
  const ratePerHour = ratePerSecondNum * 3600;
  const ratePerDay = ratePerSecondNum * 86400;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !connected) return;
    if (depositNum <= 0 || durationDaysNum <= 0) {
      setError('Please provide a valid deposit and duration');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const DECIMALS = 7;
      const deposit = BigInt(Math.round(depositNum * 10 ** DECIMALS));
      const ratePerSecond = BigInt(Math.max(1, Math.round(ratePerSecondNum * 10 ** DECIMALS)));
      const duration = BigInt(Math.round(totalSeconds));

      const now = BigInt(Math.floor(Date.now() / 1000));
      let cliffTime = 0n;
      if (form.hasCliff && parseFloat(form.cliffDays) > 0) {
        cliffTime = now + BigInt(Math.round(parseFloat(form.cliffDays) * 86400));
        if (cliffTime > now + duration) {
          throw new Error('Cliff period cannot exceed total stream duration');
        }
      }

      let tokenAddress = address; // fallback
      if (form.tokenType === 'USDC' && USDC_CONTRACT_ID) {
        tokenAddress = USDC_CONTRACT_ID;
      } else if (form.tokenType === 'CUSTOM' && form.customToken) {
        tokenAddress = form.customToken.trim();
      }

      const result = await contract.createStream(
        address,
        form.recipient.trim(),
        tokenAddress,
        deposit,
        ratePerSecond,
        duration,
        cliffTime,
        form.title.trim() || 'Contributor Stream',
        sign,
      );
      onSuccess(result.hash);
    } catch (err: any) {
      setError(err?.message ?? 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title / GitHub Issue Memo */}
      <div>
        <label htmlFor={titleId} className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-300">
          <span>Stream Title / GitHub Issue Memo</span>
          <span className="text-xs text-slate-500">e.g. Issue #42 or Feature name</span>
        </label>
        <input
          id={titleId}
          type="text"
          placeholder="Issue #42: Build indexer pagination & retry logic"
          value={form.title}
          onChange={set('title')}
          required
          className="w-full rounded-xl bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700/80 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Recipient Address */}
      <div>
        <label htmlFor={recipientId} className="mb-1.5 block text-sm font-medium text-slate-300">
          Contributor Stellar Address (Recipient)
        </label>
        <input
          id={recipientId}
          type="text"
          placeholder="G..."
          value={form.recipient}
          onChange={set('recipient')}
          required
          className="w-full rounded-xl bg-slate-900/90 px-4 py-3 font-mono text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700/80 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Token & Amount Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Token Asset
          </label>
          <div className="flex gap-2">
            {(['XLM', 'USDC'] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, tokenType: t }))}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
                  form.tokenType === t
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-400 ring-1 ring-slate-700/80 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={depositId} className="mb-1.5 block text-sm font-medium text-slate-300">
            Total Deposit ({form.tokenType})
          </label>
          <input
            id={depositId}
            type="number"
            min="0"
            step="any"
            placeholder="1500"
            value={form.deposit}
            onChange={set('deposit')}
            required
            className="w-full rounded-xl bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700/80 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor={durationId} className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-300">
          <span>Stream Runway / Duration</span>
          <span className="text-xs text-slate-500">{form.durationDays} days</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['7', '14', '30', '90'].map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setForm((f) => ({ ...f, durationDays: d }))}
              className={`rounded-xl py-2 text-xs font-semibold transition ${
                form.durationDays === d
                  ? 'bg-violet-600/30 text-violet-300 ring-1 ring-violet-500'
                  : 'bg-slate-900 text-slate-400 ring-1 ring-slate-800 hover:text-white'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
        <input
          id={durationId}
          type="number"
          min="0.1"
          step="any"
          placeholder="Custom days"
          value={form.durationDays}
          onChange={set('durationDays')}
          required
          className="mt-2 w-full rounded-xl bg-slate-900/90 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700/80 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Milestone Cliff Vesting Toggle */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
        <label className="flex cursor-pointer items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-200">Milestone Review Cliff</span>
            <p className="mt-0.5 text-xs text-slate-400">
              Lock funds until a review date before contributor can withdraw
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.hasCliff}
            onChange={set('hasCliff')}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500"
          />
        </label>

        {form.hasCliff && (
          <div className="mt-4 border-t border-slate-800 pt-3">
            <label htmlFor={cliffDaysId} className="mb-1 block text-xs font-medium text-slate-300">
              Cliff Duration (Days before initial withdrawal unlocks)
            </label>
            <input
              id={cliffDaysId}
              type="number"
              min="0.1"
              max={form.durationDays || '365'}
              step="any"
              placeholder="7"
              value={form.cliffDays}
              onChange={set('cliffDays')}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              Contributor can claim full accrued amount once {form.cliffDays || '0'} days elapse.
            </p>
          </div>
        )}
      </div>

      {/* Live Budget Breakdown Preview */}
      {depositNum > 0 && durationDaysNum > 0 && (
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-cyan-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Streaming Budget Breakdown
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-900/60 p-2.5">
              <p className="text-[11px] text-slate-400">Per Second</p>
              <p className="mt-0.5 text-sm font-bold text-white tabular-nums">
                {ratePerSecondNum.toFixed(6)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-2.5">
              <p className="text-[11px] text-slate-400">Per Hour</p>
              <p className="mt-0.5 text-sm font-bold text-white tabular-nums">
                {ratePerHour.toFixed(3)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-2.5">
              <p className="text-[11px] text-slate-400">Per Day</p>
              <p className="mt-0.5 text-sm font-bold text-white tabular-nums">
                {ratePerDay.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !connected}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Confirm in Freighter…' : 'Start Contributor Stream'}
      </button>

      {!connected && (
        <p className="text-center text-xs text-slate-500">Connect Freighter to create a stream</p>
      )}
    </form>
  );
}
