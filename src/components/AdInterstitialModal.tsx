import React, { useState, useEffect } from 'react';
import { X, PlayCircle, ExternalLink, Zap, Gift, ShieldAlert } from 'lucide-react';

interface AdInterstitialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  skipSeconds?: number;
  onRewardGranted?: () => void;
  onRecordImpression?: (cpmAmount: number) => void;
}

export const AdInterstitialModal: React.FC<AdInterstitialModalProps> = ({
  isOpen,
  onClose,
  title = 'إعلان فيديو ممول',
  skipSeconds = 5,
  onRewardGranted,
  onRecordImpression,
}) => {
  const [timeLeft, setTimeLeft] = useState(skipSeconds);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(skipSeconds);
      setCanSkip(false);
      return;
    }

    // Record high eCPM rewarded ad impression
    if (onRecordImpression) {
      onRecordImpression(0.12); // Adds $0.12 to publisher earnings!
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, skipSeconds]);

  if (!isOpen) return null;

  const handleSkipOrComplete = () => {
    if (onRewardGranted) {
      onRewardGranted();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md dir-ltr">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
              إعلان مكافأة
            </span>
            <span className="text-xs text-slate-300 font-bold">{title}</span>
          </div>

          {canSkip ? (
            <button
              onClick={handleSkipOrComplete}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <span>متابعة</span>
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-amber-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              تخطي خلال {timeLeft}ث
            </div>
          )}
        </div>

        {/* Ad Content Box */}
        <div className="p-6 text-center">
          
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-5 flex flex-col items-center justify-center p-6 group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mb-3 animate-pulse">
              <Gift className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-white mb-1">
              احصل على اشتراك طيران وفنادق بتخفيض 40%
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              احجز الآن من التطبيق الرسمي واحصل على نقاط مكافآت فورية مضاعفة.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-4 py-2 rounded-xl">
              <span>افتح العرض الحصري</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-right text-xs text-slate-400 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              مشاهدة هذا الإعلان تمنحك <strong className="text-emerald-300">سرعة تحميل فائقة 5x</strong> وتفتح جودة 4K مجاناً!
            </span>
          </div>

          {/* Skip or Claim Button */}
          <button
            disabled={!canSkip}
            onClick={handleSkipOrComplete}
            className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg ${
              canSkip
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {canSkip ? 'تخطي واستلام المكافأة الآن' : `انتظر ${timeLeft} ثوانٍ لمتابعة التحميل...`}
          </button>

        </div>

      </div>
    </div>
  );
};
