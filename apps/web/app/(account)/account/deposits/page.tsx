import Link from 'next/link';

const mockDeposits = [
  {
    id: 'dep-1',
    chainId: 1,
    token: 'USDC',
    confirmations: 2,
    confirmationsRequired: 12,
    amount: '125.00',
    status: 'pending'
  },
  {
    id: 'dep-2',
    chainId: 137,
    token: 'USDT',
    confirmations: 15,
    confirmationsRequired: 12,
    amount: '42.50',
    status: 'confirmed'
  }
];

export default function DepositPage() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <p className="text-gray-700">
          View tracked deposits for your deterministic smart accounts across supported chains.
        </p>
      </header>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-x-3 text-sm text-gray-600">
            <span>Toggle pending only, chain filters, and token filters will appear here.</span>
          </div>
          <Link className="text-indigo-600 font-medium" href="/account">
            Back to account
          </Link>
        </div>
        <div className="overflow-hidden rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Token</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Chain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Confirmations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockDeposits.map((deposit) => {
                const progress = Math.min(
                  100,
                  Math.round((deposit.confirmations / deposit.confirmationsRequired) * 100)
                );

                return (
                  <tr key={deposit.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{deposit.token}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{deposit.chainId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{deposit.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">{deposit.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded bg-gray-100">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${progress}%` }}
                            aria-label={`Confirmations ${deposit.confirmations}/${deposit.confirmationsRequired}`}
                          />
                        </div>
                        <span>
                          {deposit.confirmations}/{deposit.confirmationsRequired}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
