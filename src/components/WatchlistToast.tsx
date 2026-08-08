import React, { useEffect, useRef } from 'react';
import { Bookmark, Trash2, ArrowLeft, Sparkles, X } from 'lucide-react';
import { MediaItem } from '../types';

interface WatchlistToastProps {
  toast: {
    media: MediaItem;
    action: 'added' | 'removed';
  } | null;
  onClose: () => void;
  onGoToWatchlist: () => void;
}

export const WatchlistToast: React.FC<WatchlistToastProps> = ({
  toast,
  onClose,
  onGoToWatchlist,
}) => {
  const onCloseRef = useRef(onClose);

  // Keep latest onClose ref without re-triggering timer on parent re-renders
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle 4 seconds auto-dismiss duration
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onCloseRef.current();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const { media, action } = toast;
  const isAdded = action === 'added';

  return (
    <>
      <style>{`
        @keyframes toastShrinkBar {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
      
      <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:right-6 sm:left-auto z-50 max-w-sm w-full dir-rtl animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className={`relative overflow-hidden p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center justify-between gap-3 ${
          isAdded
            ? 'bg-zinc-950/95 border-red-600/60 shadow-red-600/20 text-white'
            : 'bg-zinc-950/95 border-zinc-700/80 shadow-black/50 text-zinc-200'
        }`}>
          
          {/* 4-second animated progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80 overflow-hidden">
            <div 
              className={`h-full ${isAdded ? 'bg-red-600' : 'bg-zinc-400'}`} 
              style={{ animation: 'toastShrinkBar 4s linear forwards' }}
            />
          </div>
          
          {/* Media Thumbnail & Text Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={media.poster}
                alt={media.title}
                className="w-11 h-15 object-cover rounded-xl shadow-md border border-zinc-800"
              />
              <span className={`absolute -bottom-1 -left-1 p-1 rounded-full text-[10px] shadow-md border ${
                isAdded ? 'bg-red-600 text-white border-black' : 'bg-zinc-800 text-zinc-300 border-zinc-900'
              }`}>
                {isAdded ? <Bookmark className="w-3 h-3 fill-white" /> : <Trash2 className="w-3 h-3" />}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                {isAdded ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                    تمت الإضافة للمفضلة 🔖
                  </span>
                ) : (
                  <span className="text-zinc-400">تمت الإزالة من المفضلة</span>
                )}
              </div>
              <h4 className="text-xs font-black text-white truncate mt-0.5">
                {media.title}
              </h4>
              <p className="text-[10px] text-zinc-400 font-mono truncate">
                {media.year} • {media.type === 'movie' ? 'فيلم' : media.type === 'series' ? 'مسلسل' : 'أنمي'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 border-r border-zinc-800 pr-2.5">
            {isAdded && (
              <button
                onClick={() => {
                  onGoToWatchlist();
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-500 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow flex items-center gap-1 transition-all active:scale-95"
              >
                <span>عرض القائمة</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

