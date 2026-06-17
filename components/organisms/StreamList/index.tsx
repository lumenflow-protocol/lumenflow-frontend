import { Stream } from '../../../lib/api';
import { StreamCard } from '../../molecules/StreamCard';

interface Props {
  streams: Stream[];
  role: 'sender' | 'recipient';
  loading: boolean;
  emptyText: string;
}

export function StreamList({ streams, role, loading, emptyText }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/60" />
        ))}
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="flex h-44 flex-col items-center justify-center rounded-2xl bg-slate-800/30 ring-1 ring-slate-700/40 ring-dashed">
        <p className="text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {streams.map((s) => (
        <StreamCard key={s.stream_id} stream={s} role={role} />
      ))}
    </div>
  );
}
