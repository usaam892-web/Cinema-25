import React from 'react';
import { Play, Download, Star, Bookmark, Check, Film, Tv, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  media: MediaItem;
  onSelect: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  onDownload: (media: MediaItem) => void;
  onToggleWatchlist: (media: MediaItem) => void;
  isInWatchlist: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onSelect,
  onPlay,
  onDownload,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 flex flex-col cursor-pointer">
      
      {/* Poster Image & Overlay Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black" onClick={() => onSelect(media)}>
        <img
          src={media.poster}
          alt={media.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex justify-between items-start gap-1 z-10 dir-rtl">
          
          {/* Type Badge */}
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border backdrop-blur-md shadow ${
            media.type === 'movie'
              ? 'bg-red-950/90 text-red-200 border-red-600/50'
              : media.type === 'series'
              ? 'bg-zinc-900/90 text-zinc-200 border-zinc-700'
              : 'bg-zinc-900/90 text-zinc-200 border-zinc-700'
          }`}>
            {media.type === 'movie' ? 'فيلم' : media.type === 'series' ? 'مسلسل' : 'أنمي'}
          </span>

          {/* Rating Badge */}
          <span className="flex items-center gap-1 bg-black/80 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
            <Star className="w-3 h-3 fill-amber-400" />
            {media.rating}
          </span>
        </div>

        {/* Watchlist Quick Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(media);
          }}
          className={`absolute bottom-3 left-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-200 active:scale-125 z-20 shadow-lg ${
            isInWatchlist
              ? 'bg-red-600 text-white border-red-500 scale-105 shadow-red-600/50'
              : 'bg-black/80 text-zinc-300 hover:text-white border-zinc-700/80 hover:border-red-500/50 hover:bg-black'
          }`}
          title={isInWatchlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          {isInWatchlist ? (
            <Bookmark className="w-4 h-4 fill-white text-white animate-bounce" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 z-10 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(media);
            }}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/50 hover:scale-110 transition-all"
            title="مشاهدة"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(media);
            }}
            className="w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 text-red-400 flex items-center justify-center border border-red-600/40 hover:scale-110 transition-all"
            title="تحميل"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between dir-rtl bg-zinc-900">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-1 mb-1" dir="auto">
            <bdi>{media.title}</bdi>
          </h3>
          <p className="text-[11px] text-zinc-400 line-clamp-1 font-mono mb-2">
            {media.originalTitle}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
          <span className="font-semibold text-zinc-300">{media.year}</span>
          <div className="flex items-center gap-1.5">
            {media.downloadOptions.some(d => d.quality === '4K') && (
              <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-extrabold text-[9px]">
                4K
              </span>
            )}
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded text-[10px]">
              {media.duration || `${media.episodesCount || 1} حلقة`}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
