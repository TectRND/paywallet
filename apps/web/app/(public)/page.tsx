export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">PayWallet</h1>
      <p className="text-lg text-gray-700">
        Backend-controlled smart account wallet platform powered by Payload CMS and thirdweb Engine.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Deterministic smart accounts on major EVM chains.</li>
        <li>Server-controlled Solana wallets for custody by default.</li>
        <li>Allowlisted deposit tracking with confirmation progress.</li>
      </ul>
    </main>
  );
}
