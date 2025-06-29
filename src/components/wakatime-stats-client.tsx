'use client';

import { useState, useEffect } from 'react';
import { wakaTimeClient } from '@/lib/wakatime-client';

interface WakaTimeStatsData {
  totalHours: string;
  dailyAverage: string;
  topLanguage?: string;
  topProject?: string;
  username: string;
  isLoading: boolean;
  error?: string;
}

export function WakaTimeStatsClient() {
  const [stats, setStats] = useState<WakaTimeStatsData>({
    totalHours: '0h 0m',
    dailyAverage: '0h 0m',
    username: '',
    isLoading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [userResponse, statsResponse] = await Promise.all([
          wakaTimeClient.getCurrentUser(),
          wakaTimeClient.getStats('last_7_days')
        ]);

        const totalSeconds = statsResponse.data.total_seconds;
        const dailyAverageSeconds = statsResponse.data.daily_average;
        
        const formatTime = (seconds: number) => {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          return `${hours}h ${minutes}m`;
        };

        setStats({
          totalHours: formatTime(totalSeconds),
          dailyAverage: formatTime(dailyAverageSeconds),
          topLanguage: statsResponse.data.languages?.[0]?.name,
          topProject: statsResponse.data.projects?.[0]?.name,
          username: userResponse.data.display_name || userResponse.data.username,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load WakaTime stats:', error);
        setStats(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load coding stats' 
        }));
      }
    };

    loadStats();
  }, []);

  if (stats.isLoading) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-sm text-gray-500">Loading coding stats...</div>
          </div>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-sm text-gray-400">{stats.error}</div>
            {stats.error.includes('API key') && (
              <div className="text-xs text-gray-400">
                Get your WakaTime API key at{' '}
                <a 
                  href="https://wakatime.com/api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  wakatime.com/api-key
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-medium">{stats.username}&apos;s Coding Stats</span>
            <span>•</span>
            <span>Past 7 days: {stats.totalHours}</span>
            <span>•</span>
            <span>Daily avg: {stats.dailyAverage}</span>
          </div>
          {(stats.topLanguage || stats.topProject) && (
            <div className="flex items-center gap-4">
              {stats.topLanguage && (
                <>
                  <span>•</span>
                  <span>Top language: {stats.topLanguage}</span>
                </>
              )}
              {stats.topProject && (
                <>
                  <span>•</span>
                  <span>Top project: {stats.topProject}</span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>•</span>
            <span className="text-xs">Powered by</span>
            <a 
              href="https://wakatime.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              WakaTime
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}