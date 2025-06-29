'use client';

import dynamic from 'next/dynamic';

const WakaTimeStatsClient = dynamic(() => import('./wakatime-stats-client').then(mod => ({ default: mod.WakaTimeStatsClient })), {
  ssr: false,
  loading: () => (
    <div className="border-t border-gray-200 bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading coding stats...</div>
        </div>
      </div>
    </div>
  )
});

export function WakaTimeStats() {
  return <WakaTimeStatsClient />;
}