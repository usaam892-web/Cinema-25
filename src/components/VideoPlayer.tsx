import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles, SkipForward, ArrowRight, ShieldAlert, Sparkles, ExternalLink, Radio } from 'lucide-react';
import { MediaItem, Episode } from '../types';

interface VideoPlayerProps {
  media: MediaItem | null;
  episode?: Episode | null;
  isOpen: boolean;
  onClose: () => void;
  onAdImpression?: (cpm?: number) => void;
  onAdClick?: () => void;
  currentServerName?: string;
  onOpenServerModal?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  media,
  episode,
  isOpen,
  onClose,
  onAdImpression,
  onAdClick,
  currentServerName = 'PulseStream',
  onOpenServerModal,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [quality, setQuality] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [subtitle, setSubtitle] = useState<'ar' | 'en' | 'off'>('ar');
  const [showPreRollAd, setShowPreRollAd] = useState(true);
  const [preRollSeconds, setPreRollSeconds] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setShowPreRollAd(true);
      setPreRollSeconds(5);
      return;
    }

    if (onAdImpression) {
      onAdImpression(0.08); // Video Pre-Roll Ad revenue $0.08
    }

    // Pre-roll ad timer
    const timer = setInterval(() => {
      setPreRollSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, media, episode]);

  if (!isOpen || !media) return null;

  const currentVideoUrl = episode?.videoUrl || media.videoUrl;
  const videoTitle = episode ? `${media.title} - ${episode.title}` : media.title;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);

    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    setCurrentTime(formatTime(cur));
    setDuration(formatTime(dur));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      videoRef.current.requestFullscreen?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between dir-ltr">
      
      {/* Top Header Bar */}
      <div className="bg-black/95 border-b border-red-950/80 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold border border-zinc-800"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع للرئيسية</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
              {videoTitle}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              <span className="text-amber-400 font-extrabold flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-400" />
                السيرفر: {currentServerName}
              </span>
              <span>•</span>
              <span>جودة المشاهدة: {quality}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenServerModal && (
            <button
              onClick={onOpenServerModal}
              className="flex items-center gap-1.5 bg-[#fde2c3] hover:bg-[#fcd3a1] text-zinc-950 px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-md border border-amber-300 transition-all active:scale-95"
              title="تغيير السيرفر"
            >
              <Radio className="w-3.5 h-3.5 text-zinc-900" />
              <span>تغيير السيرفر</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        {/* Pre-roll Ad Overlay */}
        {showPreRollAd ? (
          <div className="absolute inset-0 z-30 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative">
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                إعلان قبل البث
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                اشترك الآن في الباقة الذهبية وشاهد بدون إعلانات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                احصل على تجربة مشغل الفيديو المتقدم بدقة 4K مع إمكانية التحميل المباشر للفيلم بضغطة زر.
              </p>

              {preRollSeconds > 0 ? (
                <div className="w-full bg-slate-800 py-3 rounded-xl text-xs text-amber-400 font-mono border border-slate-700">
                  سيبدأ البث خلال {preRollSeconds} ثوانٍ...
                </div>
              ) : (
                <button
                  onClick={() => setShowPreRollAd(false)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-red-900/50 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>تخطي الإعلان والبدء بالمشاهدة</span>
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Video HTML Element */}
        <video
          ref={videoRef}
          src={currentVideoUrl}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full max-h-[85vh] object-contain"
        />

        {/* Subtitle Display Overlay Simulation */}
        {subtitle !== 'off' && (
          <div className="absolute bottom-16 left-0 right-0 text-center z-10 pointer-events-none px-4">
            <span className="bg-slate-950/80 text-amber-300 font-bold text-sm sm:text-lg px-4 py-1.5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
              {subtitle === 'ar' ? '[ترجمة عربية احترافية مدمجة]' : '[English Subtitles Active]'}
            </span>
          </div>
        )}

      </div>

      {/* Bottom Video Controls Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-4 space-y-3 z-20">
        
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 min-w-10 dir-ltr">{currentTime}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <span className="text-xs font-mono text-slate-400 min-w-10 dir-ltr">{duration}</span>
        </div>

        {/* Control Buttons Bar */}
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button onClick={toggleMute} className="p-2 text-slate-300 hover:text-white">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Subtitle Selector */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
              <Subtitles className="w-4 h-4 text-slate-400 ml-1" />
              <button
                onClick={() => setSubtitle('ar')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                  subtitle === 'ar' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setSubtitle('en')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                  subtitle === 'en' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSubtitle('off')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                  subtitle === 'off' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                إيقاف
              </button>
            </div>

            {/* Quality Selector */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 px-3 py-1.5 rounded-xl focus:outline-none"
            >
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
            </select>

            <button onClick={toggleFullscreen} className="p-2 text-slate-300 hover:text-white">
              <Maximize className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
