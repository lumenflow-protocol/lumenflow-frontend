import Head from 'next/head';
import { useRouter } from 'next/router';
import { CreateStreamForm } from '../../components/molecules/CreateStreamForm';

export default function CreateStream() {
  const router = useRouter();

  const handleSuccess = (txHash: string) => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Create Stream · LumenFlow</title>
      </Head>

      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create a stream</h1>
          <p className="mt-2 text-sm text-slate-400">
            Lock tokens into a Soroban contract. The recipient can withdraw accrued tokens at any time.
          </p>
        </div>

        {/* Info card */}
        <div className="mb-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-cyan-600/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-300">
              Deposit must be at least <strong className="text-white">rate × duration</strong>.
              The contract holds the funds and releases them to the recipient at the set rate.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
          <CreateStreamForm onSuccess={handleSuccess} />
        </div>
      </div>
    </>
  );
}
