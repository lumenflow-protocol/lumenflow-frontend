import * as Dialog from '@radix-ui/react-dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'error';
  txHash?: string;
  message?: string;
}

export function TransactionModal({ open, onClose, status, txHash, message }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-4 text-center">
            {status === 'pending' && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-500/30">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              </div>
            )}
            {status === 'success' && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <div>
              <Dialog.Title className="text-base font-semibold text-white">
                {status === 'pending' && 'Transaction pending…'}
                {status === 'success' && 'Transaction confirmed'}
                {status === 'error' && 'Transaction failed'}
              </Dialog.Title>
              {message && <p className="mt-1.5 text-sm text-slate-400">{message}</p>}
              {txHash && <p className="mt-2 font-mono text-xs text-slate-500 break-all">{txHash}</p>}
            </div>
            {status !== 'pending' && (
              <button onClick={onClose} className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
                Close
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
