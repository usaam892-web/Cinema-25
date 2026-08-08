import React from 'react';
import { Play, Download, Plus, Check, Star, Sparkles, Tv, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroBannerProps {
  media: MediaItem;
  onPlay: (media: MediaItem) => void;
  onDownload: (media: MediaItem) => void;
  onToggleWatchlist: (media: MediaItem) => void;
  isInWatchlist: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  media,
  onPlay,
  onDownload,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  return (
    <div className="relative w-full h-[500px] sm:h-[580px] rounded-3xl overflow-hidden mb-8 border border-red-950/60 shadow-2xl shadow-red-950/30">
      {/* Background Backdrop Image */}
      <img
        src={media.backdrop}
        alt={media.title}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-90 transition-transform duration-1000"
      />

      {/* Dark Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent dir-rtl" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-10 sm:pb-14 z-10 dir-rtl">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            الأكثر مشاهدة هذا الأسبوع
          </span>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            media.type === 'movie'
              ? 'bg-red-950/90 text-red-300 border-red-600/50'
              : media.type === 'series'
              ? 'bg-zinc-900/90 text-zinc-300 border-red-600/40'
              : 'bg-zinc-900/90 text-zinc-300 border-red-600/40'
          }`}>
            {media.type === 'movie' ? 'فيلم' : media.type === 'series' ? 'مسلسل' : 'أنمي'}
          </span>

          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {media.rating}
          </span>

          <span className="bg-zinc-900/90 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-800">
            {media.year}
          </span>

          {media.duration && (
            <span className="bg-zinc-900/90 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-800">
              {media.duration}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3 max-w-3xl drop-shadow-md" dir="auto">
          <bdi>{media.title}</bdi>
        </h1>

        {/* Original Title & Genres */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-4 font-mono">
          <span className="text-zinc-400">{media.originalTitle}</span>
          <span>•</span>
          <div className="flex gap-2">
            {media.genres.map((g, i) => (
              <span key={i} className="text-red-400 font-semibold bg-black/80 px-2 py-0.5 rounded border border-red-950/80">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 max-w-2xl mb-6 leading-relaxed">
          {media.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Watch Now Button */}
          <button
            onClick={() => onPlay(media)}
            className="flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-red-600/40 hover:shadow-red-600/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>مشاهدة الآن</span>
          </button>

          {/* Download Button */}
          <button
            onClick={() => onDownload(media)}
            className="flex items-center gap-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold px-6 py-3.5 rounded-2xl border border-red-600/40 hover:border-red-500 shadow-lg transition-all"
          >
            <Download className="w-5 h-5 text-red-500" />
            <span>تحميل مجاني</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => onToggleWatchlist(media)}
            className={`flex items-center gap-2 p-3.5 rounded-2xl border transition-all ${
              isInWatchlist
                ? 'bg-red-600/20 text-red-400 border-red-500/60'
                : 'bg-black/80 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isInWatchlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>

        </div>

      </div>
    </div>
  );
};
