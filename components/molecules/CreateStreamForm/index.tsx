import { useState } from 'react';
import { contract } from '../../../lib/contract';
import { USDC_CONTRACT_ID } from '../../../lib/constants';
import { useWallet } from '../../../hooks/useWallet';

interface Props {
  onSuccess: (streamId: string) => void;
}

export function CreateStreamForm({ onSuccess }: Props) {
  const { address, connected, sign } = useWallet();
  const [form, setForm] = useState({
    recipient: '',
    deposit: '',
    ratePerSecond: '',
    durationDays: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !connected) return;
    setError(null);
    setLoading(true);
    try {
      const DECIMALS = 7;
      const SCALE = 10n ** BigInt(DECIMALS);
      const deposit = BigInt(Math.round(parseFloat(form.deposit) * 10 ** DECIMALS));
      const ratePerSecond = BigInt(Math.round(parseFloat(form.ratePerSecond) * 10 ** DECIMALS));
      const duration = BigInt(Math.round(parseFloat(form.durationDays) * 86400));

      const result = await contract.createStream(
        address,
        form.recipient,
        USDC_CONTRACT_ID || address, // fallback to native token address placeholder
        deposit,
        ratePerSecond,
        duration,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          Recipient address
        </label>
        <input
          type="text"
          placeholder="G..."
          value={form.recipient}
          onChange={set('recipient')}
          required
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Total deposit (XLM)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="1000"
            value={form.deposit}
            onChange={set('deposit')}
            required
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Rate (XLM / sec)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="0.01"
            value={form.ratePerSecond}
            onChange={set('ratePerSecond')}
            required
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          Duration (days)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="30"
          value={form.durationDays}
          onChange={set('durationDays')}
          required
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-slate-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {form.deposit && form.ratePerSecond && form.durationDays && (
        <div className="rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-400 ring-1 ring-slate-800">
          <span className="text-slate-300 font-medium">{form.deposit} XLM</span> streamed over{' '}
          <span className="text-slate-300 font-medium">{form.durationDays} days</span> at{' '}
          <span className="text-slate-300 font-medium">{form.ratePerSecond} XLM/sec</span>
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
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Confirm in Freighter…' : 'Create Stream'}
      </button>

      {!connected && (
        <p className="text-center text-xs text-slate-500">Connect Freighter to create a stream</p>
      )}
    </form>
  );
}
