import React, { useState } from 'react';
import { X, Download, Zap, ShieldCheck, FileVideo, HardDrive, CheckCircle2, Gift, Sparkles, Copy, Check, Languages, FileText } from 'lucide-react';
import { MediaItem, Episode, DownloadOption, DownloadTask } from '../types';

export const SUBTITLE_OPTIONS = [
  { id: 'ar_embedded', label: 'العربية 🇸🇦 (ترجمة مدمجة)', flag: '🇸🇦', isDefault: true },
  { id: 'en_embedded', label: 'English 🇬🇧 (Embedded)', flag: '🇬🇧' },
  { id: 'fr_embedded', label: 'Français 🇫🇷', flag: '🇫🇷' },
  { id: 'es_embedded', label: 'Español 🇪🇸', flag: '🇪🇸' },
  { id: 'ar_srt', label: 'ملف ترجمة عربي منفصل (.SRT)', flag: '📄' },
  { id: 'none', label: 'بدون ترجمة (الصوت الأصلي)', flag: '🔊' },
];

interface DownloadModalProps {
  media: MediaItem | null;
  episode?: Episode | null;
  isOpen: boolean;
  onClose: () => void;
  onStartDownload: (task: Omit<DownloadTask, 'id' | 'createdAt' | 'status'>) => void;
  onOpenRewardedAd: (onSuccess: () => void) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  media,
  episode,
  isOpen,
  onClose,
  onStartDownload,
  onOpenRewardedAd,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'4K' | '1080p' | '720p' | '480p'>('1080p');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('العربية 🇸🇦 (ترجمة مدمجة)');
  const [turboBoostActive, setTurboBoostActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !media) return null;

  const downloadOptions: DownloadOption[] = media.downloadOptions || [
    { quality: '1080p', size: '2.4 GB', format: 'MP4' },
    { quality: '720p', size: '1.2 GB', format: 'MP4' },
    { quality: '480p', size: '600 MB', format: 'MP4' },
  ];

  const currentOption = downloadOptions.find((d) => d.quality === selectedQuality) || downloadOptions[0];
  const downloadTitle = episode ? `${media.title} - ${episode.title}` : media.title;

  const handleTurboBoostClick = () => {
    onOpenRewardedAd(() => {
      setTurboBoostActive(true);
    });
  };

  const handleStartDownload = () => {
    // If quality is 4K and requires ad, check or trigger rewarded ad
    if (selectedQuality === '4K') {
      onOpenRewardedAd(() => {
        executeDownload();
      });
    } else {
      executeDownload();
    }
  };

  const executeDownload = () => {
    const totalBytes = currentOption.size.includes('GB')
      ? parseFloat(currentOption.size) * 1024 * 1024 * 1024
      : parseFloat(currentOption.size) * 1024 * 1024;

    onStartDownload({
      mediaId: media.id,
      title: downloadTitle,
      poster: episode?.thumbnail || media.poster,
      quality: selectedQuality,
      size: currentOption.size,
      subtitleLanguage: selectedSubtitle,
      progress: 0,
      speedMBps: turboBoostActive ? 18.5 : 4.2,
      episodeTitle: episode?.title,
      downloadedBytes: 0,
      totalBytes,
    });

    onClose();
  };

  const copyDirectLink = () => {
    navigator.clipboard?.writeText?.(episode?.videoUrl || media.videoUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md dir-ltr overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-100 my-auto">
        
        {/* Top-Right Fixed Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-800/90 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-xl transition-all active:scale-95"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-slate-950 p-5 sm:p-6 pr-14 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">مركز التحميل المباشر السريع</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{downloadTitle}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quality Options Grid */}
          <div>
            <label className="text-xs text-slate-400 font-bold block mb-3">اختر جودة الملف للتحميل:</label>
            <div className="grid grid-cols-2 gap-3">
              {downloadOptions.map((opt) => (
                <button
                  key={opt.quality}
                  onClick={() => setSelectedQuality(opt.quality)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    selectedQuality === opt.quality
                      ? 'bg-red-600/20 border-red-500 text-white ring-2 ring-red-500/30'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold text-sm">{opt.quality}</span>
                    {opt.quality === '4K' && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                        إعلان VIP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{opt.size}</span>
                    <span>{opt.format}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle Language Selection (لغة الترجمة) */}
          <div>
            <label className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mb-2.5">
              <Languages className="w-4 h-4 text-red-500" />
              <span>اختر لغة الترجمة المصاحبة للملف:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBTITLE_OPTIONS.map((sub) => {
                const isSelected = selectedSubtitle === sub.label;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubtitle(sub.label)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-right flex items-center gap-2 truncate ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm shrink-0">{sub.flag}</span>
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Turbo Speed Boost Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-300">
                  {turboBoostActive ? 'مُسرّع التحميل 5x مفعّل بنجاح!' : 'تفعيل سرعة التحميل القصوى 5x (Turbo)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {turboBoostActive
                    ? 'ستحصل على سرعة تنزيل تصل إلى 18.5 ميجابايت/ثانية!'
                    : 'شاهد إعلان فيديو قصير لمدة 5 ثوانٍ لمضاعفة السرعة!'}
                </p>
              </div>
            </div>

            {!turboBoostActive && (
              <button
                onClick={handleTurboBoostClick}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-md"
              >
                تفعيل السرعة
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleStartDownload}
              className="w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-red-900/40 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>بدء التحميل المباشر ({currentOption.size})</span>
            </button>

            {/* External Download Managers (IDM / ADM) */}
            <button
              onClick={copyDirectLink}
              className="w-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط المباشر!' : 'نسخ رابط التحميل لبرامج IDM / ADM'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
