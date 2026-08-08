import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface AdBannerProps {
  type?: 'banner' | 'native' | 'compact';
  publisherId?: string;
  adUnitId?: string;
  customScript?: string;
  onAdImpression?: () => void;
  onAdClick?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type = 'banner',
  publisherId = 'ca-pub-9876543210123456',
  adUnitId = 'ca-app-pub-9876543210123456/1029384756',
  customScript,
  onAdImpression,
  onAdClick,
}) => {
  useEffect(() => {
    // Record impression on mount
    if (onAdImpression) {
      onAdImpression();
    }
  }, []);

  const handleClick = () => {
    if (onAdClick) {
      onAdClick();
    }
  };

  if (type === 'compact') {
    return (
      <div
        onClick={handleClick}
        className="w-full bg-zinc-900 border border-red-950 rounded-xl p-3 flex items-center justify-between text-xs cursor-pointer hover:border-red-600 transition-all dir-rtl my-4 shadow-md"
      >
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
            إعلان {publisherId ? 'AdMob / AdSense' : ''}
          </span>
          <span className="text-zinc-200 font-medium">
            حمل تطبيق VPN السينمائي المجاني وتصفح بأقصى سرعة بدون إعلانات!
          </span>
        </div>
        <div className="flex items-center gap-1 text-red-400 font-bold hover:underline dir-ltr">
          <span>تنزيل الآن</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }

  if (type === 'native') {
    return (
      <div
        onClick={handleClick}
        className="relative bg-gradient-to-br from-black via-zinc-900 to-black border border-red-950/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-red-600/60 transition-all shadow-xl my-4 dir-rtl"
      >
        <div className="absolute top-2 left-2 bg-black/90 text-amber-400 text-[9px] px-2 py-0.5 rounded border border-zinc-800 font-mono dir-ltr">
          AdMob Slot: {adUnitId.slice(-8)}
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              سيرفرات IPTV وبث 4K بدون تقطيع
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
              احصل على خصم 70% على اشتراك الحزمة الذهبية لمشاهدة جميع الدوريات والأفلام بجودة فائقة.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>معتمد ومضمون 100%</span>
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow transition-all">
            احصل على العرض
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="w-full my-6 bg-zinc-900 border border-zinc-800 hover:border-red-600/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all shadow-lg dir-rtl"
    >
      <div className="flex items-center gap-3">
        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
          إعلان {publisherId ? 'AdSense / AdMob' : 'ممول'}
        </span>
        <div>
          <h4 className="text-sm font-bold text-zinc-100">
            احصل على مكافأة مشاهدة وتحميل مع أسرع سيرفرات السينما
          </h4>
          <p className="text-xs text-zinc-400">
            شاهد أفلامك ومسلسلاتك المفضلة بدون انتظار وبجميع الترجمات العربية.
          </p>
        </div>
      </div>

      <button className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/40 transition-all whitespace-nowrap">
        اشترك الآن مجاناً
      </button>
    </div>
  );
};
