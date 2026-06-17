import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStream } from '../../hooks/useStream';
import { StreamDetail } from '../../components/molecules/StreamDetail';

export default function StreamPage() {
  const { query } = useRouter();
  const id = Array.isArray(query.id) ? query.id[0] : query.id;
  const { stream, loading, error, refetch } = useStream(id);

  return (
    <>
      <Head>
        <title>{id ? `Stream #${id}` : 'Stream'} · LumenFlow</title>
      </Head>

      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-center">
            <p className="text-sm font-medium text-red-400">{error}</p>
            <Link href="/dashboard" className="mt-4 inline-block text-sm text-slate-400 hover:text-white">
              ← Back to Dashboard
            </Link>
          </div>
        )}

        {stream && <StreamDetail stream={stream} onRefetch={refetch} />}
      </div>
    </>
  );
}
