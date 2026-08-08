import React, { useState, useMemo } from 'react';
import { 
  Bookmark, Play, Download, Trash2, Search, Filter, ArrowUpDown, 
  Grid, List, Sparkles, Film, Tv, Share2, AlertTriangle, 
  Clock, Star, CloudCheck, Check, Copy, RefreshCw
} from 'lucide-react';
import { MediaItem } from '../types';
import { User } from 'firebase/auth';

interface WatchlistManagerProps {
  watchlistItems: MediaItem[];
  currentUser: User | null;
  onSignInWithGoogle: () => void;
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
  onDownloadMedia: (media: MediaItem) => void;
  onRemoveFromWatchlist: (media: MediaItem) => void;
  onClearAllWatchlist: () => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlistItems,
  currentUser,
  onSignInWithGoogle,
  onSelectMedia,
  onPlayMedia,
  onDownloadMedia,
  onRemoveFromWatchlist,
  onClearAllWatchlist,
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series' | 'anime'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'year' | 'title'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  
  // Clear modal confirmation state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCount = watchlistItems.length;
    const moviesCount = watchlistItems.filter((m) => m.type === 'movie').length;
    const seriesCount = watchlistItems.filter((m) => m.type === 'series').length;
    const animeCount = watchlistItems.filter((m) => m.type === 'anime').length;

    const avgRating = totalCount > 0
      ? (watchlistItems.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
      : '0.0';

    // Estimated watch time (approx 2 hours per movie, 10 hours per series season)
    const estHours = watchlistItems.reduce((acc, curr) => {
      if (curr.type === 'movie') return acc + 2;
      if (curr.type === 'series' || curr.type === 'anime') return acc + ((curr.episodesCount || 12) * 0.4);
      return acc + 2;
    }, 0);

    return {
      totalCount,
      moviesCount,
      seriesCount,
      animeCount,
      avgRating,
      estHours: Math.round(estHours),
    };
  }, [watchlistItems]);

  // Filtered and sorted watchlist
  const filteredItems = useMemo(() => {
    let list = [...watchlistItems];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.originalTitle.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Type Filter
    if (typeFilter !== 'all') {
      list = list.filter((m) => m.type === typeFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'ar');
      return 0; // 'recent' respects current order
    });

    return list;
  }, [watchlistItems, searchQuery, typeFilter, sortBy]);

  // Share Watchlist Link Action
  const handleShareWatchlist = () => {
    const shareText = `قائمتي المفضلة على Cinema Mix 🎬 (${watchlistItems.length} أعمال):\n` +
      watchlistItems.map((m) => `• ${m.title} (${m.year})`).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } else {
      alert(shareText);
    }
  };

  return (
    <div className="dir-ltr my-6 space-y-6">
      
      {/* 1. Header & Sync Bar */}
      <div className="bg-gradient-to-l from-zinc-900 via-red-950/20 to-zinc-900 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Decorative Gradient Orb */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3.5 h-8 bg-red-600 rounded-full inline-block"></span>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                قائمتي المفضلة
                <span className="text-sm font-bold bg-red-600/30 text-red-400 border border-red-600/40 px-3 py-1 rounded-full">
                  {stats.totalCount} عمل
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mr-5">
              مكانك الخاص لإدارة وتنظيم جميع الأفلام والمسلسلات والأنمي التي ترغب بمشاهدتها لاحقاً.
            </p>
          </div>

          {/* Sync / Login Status */}
          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full border border-red-500 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                    {(currentUser.displayName || 'U')[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span>مرحبًا، {currentUser.displayName || 'مستخدم Cinema Mix'}</span>
                    <CloudCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400">مزامنة سحابية مفعّلة عبر Firestore</p>
                </div>
              </div>
            ) : (
              <button
                onClick={onSignInWithGoogle}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold px-4 py-3 rounded-2xl shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>ربط بالحساب للحفظ السحابي</span>
              </button>
            )}

            {/* Quick Share Watchlist */}
            {watchlistItems.length > 0 && (
              <button
                onClick={handleShareWatchlist}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold px-3.5 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
                title="مشاركة القائمة"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? 'تم نسخ القائمة!' : 'مشاركة'}</span>
              </button>
            )}

            {/* Clear Watchlist Button */}
            {watchlistItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-zinc-900 hover:bg-red-950/80 border border-red-900/50 text-red-400 text-xs font-bold px-3.5 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
                title="مسح القائمة"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">مسح الكل</span>
              </button>
            )}
          </div>

        </div>

        {/* 2. Quick Statistics Bar */}
        {watchlistItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800/80 text-xs">
            <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold">الأفلام المفضلة</p>
                <p className="text-base font-black text-white">{stats.moviesCount} فيلم</p>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold">المسلسلات والأنمي</p>
                <p className="text-base font-black text-white">{stats.seriesCount + stats.animeCount} عمل</p>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold">متوسط التقييم</p>
                <p className="text-base font-black text-white">{stats.avgRating} / 10</p>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold">زمن المشاهدة المقدر</p>
                <p className="text-base font-black text-white">~{stats.estHours} ساعة</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Control & Filter Panel (لوحة التحكم والفلترة) */}
      {watchlistItems.length > 0 && (
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box inside Watchlist */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث داخل المفضلة باسم الفيلم، النوع..."
              className="w-full bg-black/60 border border-zinc-700/80 focus:border-red-600 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'movie', label: 'أفلام 🎬' },
              { id: 'series', label: 'مسلسلات 📺' },
              { id: 'anime', label: 'أنمي ✨' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  typeFilter === f.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sorting & Layout View Toggle */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800 justify-between md:justify-start">
            
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-xl text-xs text-zinc-300 font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white text-xs outline-none cursor-pointer font-bold"
              >
                <option value="recent" className="bg-zinc-900">الأحدث إضافة</option>
                <option value="rating" className="bg-zinc-900">الأعلى تقييماً ⭐</option>
                <option value="year" className="bg-zinc-900">سنة الإنتاج 📅</option>
                <option value="title" className="bg-zinc-900">أبجدي (أ - ي)</option>
              </select>
            </div>

            {/* Layout Mode Toggle */}
            <div className="flex items-center bg-zinc-800/80 p-1 rounded-xl gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="عرض شبكة عادي"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'list' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="عرض قائمة تفصيلي"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 4. Main Watchlist Display */}
      {watchlistItems.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-12 text-center my-8">
          <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">قائمتك المفضلة فارغة حالياً</h3>
          <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6">
            استكشف مكتبة الأفلام والمسلسلات والأنمي واضغط على علامة المفضلة 🔖 لإضافة أي عمل ترغب بتابعه أو مشاهدته لاحقاً.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
          لا توجد نتائج تطابق بحثك أو الفلتر المحدد داخل القائمة المفضلة.
        </div>
      ) : viewMode === 'list' ? (
        /* Detailed List View Mode */
        <div className="space-y-3">
          {filteredItems.map((media) => (
            <div
              key={media.id}
              className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-red-600/50 rounded-2xl p-3 sm:p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              {/* Media Poster & Basic Info */}
              <div 
                onClick={() => onSelectMedia(media)}
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={media.poster}
                  alt={media.title}
                  className="w-16 h-22 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600/30 text-red-400 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-red-600/30">
                      {media.type === 'movie' ? 'فيلم' : media.type === 'series' ? 'مسلسل' : 'أنمي'}
                    </span>
                    <span className="text-zinc-400 text-xs font-mono">{media.year}</span>
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                      ★ {media.rating}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-red-500 transition-colors truncate">
                    {media.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-sans">
                    {media.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {media.genres.slice(0, 3).map((g, idx) => (
                      <span key={idx} className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions for Item */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800 shrink-0">
                <button
                  onClick={() => onPlayMedia(media)}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>مشاهدة</span>
                </button>

                <button
                  onClick={() => onDownloadMedia(media)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 transition-all"
                  title="تحميل"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">تحميل</span>
                </button>

                <button
                  onClick={() => onRemoveFromWatchlist(media)}
                  className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 transition-all"
                  title="إزالة من المفضلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Grid Layout View Mode */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((media) => (
            <div key={media.id} className="relative group">
              {/* Media Card Preview */}
              <div
                onClick={() => onSelectMedia(media)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-600/60 transition-all group-hover:scale-102 shadow-lg"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={media.poster}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-80"></div>

                  <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    {media.type === 'movie' ? 'فيلم' : media.type === 'series' ? 'مسلسل' : 'أنمي'}
                  </span>

                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/30">
                    ★ {media.rating}
                  </span>

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMedia(media);
                      }}
                      className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 fill-white mr-0.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-black text-white truncate group-hover:text-red-500 transition-colors">
                    {media.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1 font-sans">
                    <span>{media.year}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(media);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      title="حذف من المفضلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Clearing All Watchlist */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-600/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">تفريغ قائمتك المفضلة؟</h3>
            <p className="text-xs text-zinc-400">
              هل أنت تأكد من رغبتك في حذف جميع الأعمال ({watchlistItems.length}) من المفضلة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClearAllWatchlist();
                  setShowClearConfirm(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition-all"
              >
                نعم، مسح الكل
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
