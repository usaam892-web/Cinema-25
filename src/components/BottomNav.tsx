import React from 'react';
import { PlayCircle, Film, Tv, Sparkles, Bookmark, Download } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher';
  setActiveTab: (tab: 'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher') => void;
  watchlistCount: number;
  downloadsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  downloadsCount,
}) => {
  const items: Array<{
    id: 'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher';
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { id: 'home', label: 'الرئيسية', icon: PlayCircle },
    { id: 'movies', label: 'أفلام', icon: Film },
    { id: 'series', label: 'مسلسلات', icon: Tv },
    { id: 'anime', label: 'أنمي', icon: Sparkles },
    { id: 'watchlist', label: 'المفضلة', icon: Bookmark, badge: watchlistCount },
    { id: 'downloads', label: 'التحميلات', icon: Download, badge: downloadsCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 pb-safe dir-rtl shadow-2xl">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-red-500 font-extrabold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center border border-black shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-red-500 rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
