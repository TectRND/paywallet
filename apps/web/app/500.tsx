export const dynamic = 'force-dynamic';

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-gray-500">Please try again later.</p>
      </div>
    </div>
  );
}
