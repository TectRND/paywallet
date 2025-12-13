import Link from 'next/link';

export default function AccountHomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Your Wallet</h1>
        <p className="text-gray-700">Review deposits, confirmations, and funding addresses.</p>
      </header>
      <section className="rounded border p-6 space-y-3">
        <h2 className="text-xl font-semibold">Deposits</h2>
        <p className="text-gray-700">Track allowlisted token deposits across supported chains.</p>
        <Link className="text-indigo-600 font-medium" href="/account/deposits">
          View deposit history
        </Link>
      </section>
    </main>
  );
}
