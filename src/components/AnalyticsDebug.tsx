import { useStore } from '../store/useStore';

export default function AnalyticsDebug() {
  const analyticsQueue = useStore((s) => s.analyticsQueue);
  const clearQueue = useStore((s) => s.clearAnalyticsQueue);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <details className="bg-gray-900 text-white rounded-lg shadow-xl">
        <summary className="px-4 py-2 cursor-pointer text-xs font-mono">
          Analytics ({analyticsQueue.length})
        </summary>
        <div className="p-3 max-h-64 overflow-auto">
          <button onClick={clearQueue} className="text-xs text-red-400 mb-2 hover:text-red-300">Clear</button>
          {analyticsQueue.slice(-10).reverse().map((event, i) => (
            <div key={i} className="text-xs font-mono mb-2 border-b border-gray-700 pb-1">
              <div className="text-teal-400">{event.name}</div>
              {event.payload && <pre className="text-gray-400 text-[10px] mt-0.5">{JSON.stringify(event.payload, null, 1)}</pre>}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
