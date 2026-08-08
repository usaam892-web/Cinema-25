import React, { useState, useMemo } from 'react';
import { Film, Tv, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { AdBanner } from './AdBanner';

interface MediaGridProps {
  mediaItems: MediaItem[];
  selectedCategory: 'all' | 'movie' | 'series' | 'anime';
  setSelectedCategory: (cat: 'all' | 'movie' | 'series' | 'anime') => void;
  searchQuery: string;
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
  onDownloadMedia: (media: MediaItem) => void;
  onToggleWatchlist: (media: MediaItem) => void;
  watchlistIds: string[];
  onAdImpression?: () => void;
  onAdClick?: () => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  mediaItems,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onSelectMedia,
  onPlayMedia,
  onDownloadMedia,
  onToggleWatchlist,
  watchlistIds,
  onAdImpression,
  onAdClick,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'popular'>('latest');

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    genresSet.add('الكل');
    mediaItems.forEach((m) => m.genres.forEach((g) => genresSet.add(g)));
    return Array.from(genresSet);
  }, [mediaItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return mediaItems
      .filter((m) => {
        // Category filter
        if (selectedCategory !== 'all' && m.type !== selectedCategory) return false;
        // Genre filter
        if (selectedGenre !== 'الكل' && !m.genres.includes(selectedGenre)) return false;
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchOrig = m.originalTitle.toLowerCase().includes(q);
          const matchCast = m.cast.some((c) => c.toLowerCase().includes(q));
          return matchTitle || matchOrig || matchCast;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'latest') return b.year - a.year;
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      });
  }, [mediaItems, selectedCategory, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="w-full dir-rtl mb-12">
      
      {/* Category Bar Container */}
      <div className="w-full bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-2.5 sm:p-3 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-6">
        
        {/* Main Category Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-1 items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'الكل', icon: Sparkles },
            { id: 'movie', label: 'الأفلام', icon: Film },
            { id: 'series', label: 'المسلسلات', icon: Tv },
            { id: 'anime', label: 'الأنمي', icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/50'
                    : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800/90 border border-zinc-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-r border-zinc-800/80 pt-2.5 md:pt-0 md:pr-3.5">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-bold whitespace-nowrap">الترتيب:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-200 font-bold px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-600 shadow-inner"
          >
            <option value="latest">الأحدث إصداراً</option>
            <option value="rating">الأعلى تقييماً</option>
            <option value="popular">الأكثر شعبية</option>
          </select>
        </div>

      </div>

      {/* Genre Chips Horizontal Scroll */}
      <div className="w-full bg-zinc-950/40 p-2 sm:p-2.5 rounded-2xl border border-zinc-900 flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0 mx-1.5" />
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${
              selectedGenre === genre
                ? 'bg-red-600/20 text-red-400 border-red-500/60 font-black shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search Query Status */}
      {searchQuery && (
        <div className="mb-4 text-sm text-zinc-300 font-medium bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 inline-block">
          نتائج البحث عن: <span className="text-red-500 font-bold">"{searchQuery}"</span> ({filteredItems.length} نتيجة)
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center my-8">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-200 mb-1">لا توجد نتائج مطابقة</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            جرّب تغيير التصنيف، أو ابحث عن فيلم أو أنمي آخر بكلمات مختلفة.
          </p>
        </div>
      ) : (
        <>
          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredItems.map((media, index) => (
              <React.Fragment key={media.id}>
                <MediaCard
                  media={media}
                  onSelect={onSelectMedia}
                  onPlay={onPlayMedia}
                  onDownload={onDownloadMedia}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={watchlistIds.includes(media.id)}
                />

                {/* Inline Ad Placement after 6th item */}
                {index === 5 && (
                  <div className="col-span-full">
                    <AdBanner
                      type="banner"
                      onAdImpression={onAdImpression}
                      onAdClick={onAdClick}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
