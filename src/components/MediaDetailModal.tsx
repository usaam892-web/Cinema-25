import React, { useState } from 'react';
import { X, Play, Download, Star, Bookmark, Check, Share2, MessageSquare, Send, Sparkles, Tv, ShieldCheck, Radio, Server } from 'lucide-react';
import { MediaItem, Episode, UserReview } from '../types';
import { AdBanner } from './AdBanner';

interface MediaDetailModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (media: MediaItem, episode?: Episode) => void;
  onDownload: (media: MediaItem, episode?: Episode) => void;
  onToggleWatchlist: (media: MediaItem) => void;
  isInWatchlist: boolean;
  reviews: UserReview[];
  onAddReview: (mediaId: string, rating: number, comment: string) => void;
  onAdImpression?: () => void;
  onAdClick?: () => void;
  onOpenServerModal?: () => void;
  activeServerName?: string;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  media,
  isOpen,
  onClose,
  onPlay,
  onDownload,
  onToggleWatchlist,
  isInWatchlist,
  reviews,
  onAddReview,
  onAdImpression,
  onAdClick,
  onOpenServerModal,
  activeServerName = 'PulseStream',
}) => {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !media) return null;

  const currentSeason = media.seasons ? media.seasons[selectedSeasonIndex] : null;
  const mediaReviews = reviews.filter((r) => r.mediaId === media.id);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(media.id, newRating, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex justify-center p-3 sm:p-6 dir-ltr">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-red-950/80 rounded-3xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 text-zinc-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="relative w-full h-[280px] sm:h-[360px] bg-black overflow-hidden">
          <img
            src={media.backdrop}
            alt={media.title}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

          {/* Play Center Overlay Button */}
          <button
            onClick={() => onPlay(media)}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/80 border-2 border-white/20 hover:scale-110 transition-all z-20 group"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Details Container */}
        <div className="px-6 sm:px-10 pb-10 -mt-20 relative z-20">
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Poster Card */}
            <div className="w-36 sm:w-48 shrink-0 rounded-2xl overflow-hidden border-2 border-red-600/50 shadow-2xl bg-black mx-auto md:mx-0">
              <img src={media.poster} alt={media.title} className="w-full h-auto object-cover" />
            </div>

            {/* Info Block */}
            <div className="flex-1 space-y-3">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  media.type === 'movie'
                    ? 'bg-red-950/80 text-red-200 border-red-500/50'
                    : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                }`}>
                  {media.type === 'movie' ? 'فيلم سينمائي' : media.type === 'series' ? 'مسلسل تلفزيوني' : 'أنمي ياباني'}
                </span>

                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {media.rating} / 10
                </span>

                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-full border border-zinc-700">
                  {media.year}
                </span>

                {media.ageRating && (
                  <span className="bg-red-950 text-red-300 text-xs font-bold px-2 py-0.5 rounded border border-red-800">
                    {media.ageRating}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {media.title}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">{media.originalTitle}</p>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 pt-1">
                {media.genres.map((genre, i) => (
                  <span key={i} className="text-xs bg-black text-red-400 font-semibold px-3 py-1 rounded-xl border border-red-950">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                
                <button
                  onClick={() => onPlay(media)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-xl shadow-red-600/40 transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>مشاهدة الآن</span>
                </button>

                {onOpenServerModal && (
                  <button
                    onClick={onOpenServerModal}
                    className="flex items-center gap-2 bg-[#fde2c3] hover:bg-[#fcd3a1] text-zinc-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg border border-amber-300 transition-all active:scale-95"
                    title="تغيير سيرفر المشاهدة"
                  >
                    <Radio className="w-5 h-5 text-zinc-900" />
                    <span>السيرفرات ({activeServerName})</span>
                  </button>
                )}

                <button
                  onClick={() => onDownload(media)}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-2xl border border-red-600/40 transition-all"
                >
                  <Download className="w-5 h-5 text-red-500" />
                  <span>تحميل الجودة العالية</span>
                </button>

                <button
                  onClick={() => onToggleWatchlist(media)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md ${
                    isInWatchlist
                      ? 'bg-red-600/90 hover:bg-red-500 text-white border-red-500 shadow-red-600/30'
                      : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:border-zinc-500'
                  }`}
                  title={isInWatchlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                >
                  <Bookmark className={`w-5 h-5 ${isInWatchlist ? 'fill-white text-white animate-bounce' : 'text-zinc-300'}`} />
                  <span>{isInWatchlist ? 'في المفضلة' : 'إضافة للمفضلة'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all"
                  title="مشاركة"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {copied && <span className="text-xs text-red-400 font-bold">تم نسخ الرابط!</span>}

              </div>

            </div>

          </div>

          {/* Synopsis & Cast */}
          <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">قصة العمل</h3>
              <p className="text-sm text-zinc-300 leading-relaxed bg-black/60 p-4 rounded-2xl border border-zinc-800">
                {media.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/40 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-400 block mb-1 font-medium">طاقم التمثيل / الأداء الصوتي:</span>
                <span className="text-zinc-200 font-semibold">{media.cast.join(' • ')}</span>
              </div>
              {media.director && (
                <div className="bg-black/40 p-3.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 block mb-1 font-medium">الإخراج:</span>
                  <span className="text-zinc-200 font-semibold">{media.director}</span>
                </div>
              )}
              {media.studio && (
                <div className="bg-black/40 p-3.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 block mb-1 font-medium">الاستوديو المنتِج:</span>
                  <span className="text-zinc-200 font-semibold">{media.studio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Episode List for Series and Anime */}
          {media.seasons && media.seasons.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-600" />
                  <span>قائمة الحلقات</span>
                </h3>

                {/* Season Switcher Dropdown */}
                {media.seasons.length > 1 && (
                  <select
                    value={selectedSeasonIndex}
                    onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
                    className="bg-black border border-zinc-800 text-xs font-bold text-zinc-200 px-3 py-2 rounded-xl"
                  >
                    {media.seasons.map((s, idx) => (
                      <option key={idx} value={idx}>
                        الموسم {s.seasonNumber} ({s.episodes.length} حلقة)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Episodes Grid */}
              <div className="space-y-3">
                {currentSeason?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="bg-black/80 border border-zinc-800 hover:border-red-600/60 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                        <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-red-600/40 transition-colors flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                          {ep.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{ep.summary}</p>
                        <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{ep.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end">
                      <button
                        onClick={() => onPlay(media, ep)}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>مشاهدة</span>
                      </button>

                      <button
                        onClick={() => onDownload(media, ep)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-zinc-700 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Native Sponsor Banner inside Details */}
          <div className="my-6">
            <AdBanner type="native" onAdImpression={onAdImpression} onAdClick={onAdClick} />
          </div>

          {/* Reviews & Comments Section */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span>تقييمات وآراء المشاهدين ({mediaReviews.length})</span>
            </h3>

            {/* Add Review Form */}
            <form onSubmit={handleCommentSubmit} className="bg-black p-4 rounded-2xl border border-zinc-800 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-medium">اكتب رأيك وتقييمك للعمل:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف تعليقك هنا..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-500 px-4 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600 dir-ltr"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-md shadow-red-600/30"
                >
                  <span>نشر</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {mediaReviews.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">كن أول من يضيف تقييماً لهذا العمل!</p>
              ) : (
                mediaReviews.map((rev) => (
                  <div key={rev.id} className="bg-black/60 p-3.5 rounded-2xl border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <img src={rev.avatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-bold text-zinc-200">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">{rev.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed pr-9">{rev.comment}</p>
                    <span className="text-[10px] text-zinc-500 pr-9 block mt-1">{rev.date}</span>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
