import type { AppProps } from 'next/app';
import { Navbar } from '../components/organisms/navbar';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
