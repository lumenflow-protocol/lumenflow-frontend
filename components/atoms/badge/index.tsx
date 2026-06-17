type Status = 'Active' | 'Paused' | 'Cancelled' | 'Completed';

const styles: Record<Status, string> = {
  Active:    'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  Paused:    'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  Cancelled: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  Completed: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30',
};

const dots: Record<Status, string> = {
  Active:    'bg-emerald-400 animate-pulse',
  Paused:    'bg-amber-400',
  Cancelled: 'bg-red-400',
  Completed: 'bg-slate-400',
};

export function Badge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}
