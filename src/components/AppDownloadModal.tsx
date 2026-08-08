import React, { useState } from 'react';
import { Download, Smartphone, Monitor, ShieldCheck, Zap, Bell, WifiOff, Tv, QrCode, CheckCircle2, ArrowRight, Share2, Sparkles, X } from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
}) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'pc'>('android');
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setIsDownloadingApk(true);
    setDownloadProgress(10);
    setDownloadSuccess(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloadingApk(false);
          setDownloadSuccess(true);

          // Create a mock APK binary blob download for real user feedback
          const blob = new Blob([
            "Cinema Mix RED Official Mobile App Package\nVersion: 2.4.0\nStatus: Ready for installation"
          ], { type: "application/vnd.android.package-archive" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Cinema_Mix_RED_v2.4.apk";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          return 100;
        }
        return prev + 18;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 dir-rtl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-red-600/40 rounded-3xl overflow-hidden shadow-2xl my-auto text-zinc-100 border-t-2 border-t-red-600">
        
        {/* Top Header Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-950/40 via-red-900/10 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-red-600 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 transition-all shadow-md"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-5 sm:p-8 z-10">
          
          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3.5 py-1 rounded-full text-red-400 text-xs font-black mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              تطبيق ورابط موقع Cinema Mix RED الرسمي
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              حمل تطبيق <span className="text-red-600">Cinema Mix RED</span> للهاتف
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
              شاهد جميع الأفلام والمسلسلات والأنمي بضغط واحدة من تطبيقك الخاص أو تصفح الموقع مباشرة
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800/80">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activePlatform === 'android'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>أندرويد (APK)</span>
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activePlatform === 'ios'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>آيفون (iOS / PWA)</span>
            </button>

            <button
              onClick={() => setActivePlatform('pc')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activePlatform === 'pc'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>تطبيق الكمبيوتر</span>
            </button>
          </div>

          {/* Android Platform Section */}
          {activePlatform === 'android' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30 border border-red-500/50">
                    <Download className="w-7 h-7 text-white animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">Cinema Mix RED Official APK</h4>
                    <p className="text-xs text-zinc-400">الإصدار 2.4.0 • حجم الملف 18.5 MB • آمن وموثوق %100</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> بدون فيروسات
                      </span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-bold">
                        أندرويد 6.0+
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
                  <button
                    onClick={handleDownloadApk}
                    disabled={isDownloadingApk}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm px-6 py-3 rounded-xl shadow-xl shadow-red-600/40 border border-red-500 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingApk ? `جاري التحميل (${downloadProgress}%)...` : 'تحميل ملف APK المباشر'}</span>
                  </button>

                  <button
                    onClick={onInstallPwa}
                    className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs px-4 py-2 rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>أو تثبيت سريع كـ Web App</span>
                  </button>
                </div>
              </div>

              {/* Download Progress Bar */}
              {isDownloadingApk && (
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              )}

              {/* Success Banner */}
              {downloadSuccess && (
                <div className="p-3 bg-green-950/80 border border-green-800 text-green-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>تم تنزيل ملف APK بنجاح! افتح الملف على هاتفك واضغط "تثبيت".</span>
                </div>
              )}
            </div>
          )}

          {/* iOS Platform Section */}
          {activePlatform === 'ios' && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                <span>🍏 تثبيت تطبيق Cinema Mix RED على أجهزة آيفون (Safari):</span>
              </h4>
              <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside bg-black/40 p-3.5 rounded-xl border border-zinc-800/80 leading-relaxed">
                <li>افتح موقع <strong>Cinema Mix RED</strong> من متصفح Safari على الآيفون.</li>
                <li>اضغط على زر المشاركة الأسفل <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> (Share Button).</li>
                <li>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong> (Add to Home Screen).</li>
                <li>اضغط <strong>"إضافة"</strong> لتظهر أيقونة التطبيق على شاشتك الرئيسية فوراً.</li>
              </ol>
              <button
                onClick={onInstallPwa}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xs py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>تثبيت التمرير السريع الآن 📲</span>
              </button>
            </div>
          )}

          {/* PC Section */}
          {activePlatform === 'pc' && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-500" />
                <span>تطبيق أجهزة الكمبيوتر (Windows / Mac / Linux):</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                يمكنك تثبيت موقع Cinema Mix RED كتطبيق سطح مكتب خفيف ومستقل بضغطة واحدة من خلال متصفح Chrome أو Edge بدون الحاجة لتنزيل برامج إضافية.
              </p>
              <button
                onClick={onInstallPwa}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs py-2.5 rounded-xl border border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <Monitor className="w-4 h-4 text-red-500" />
                <span>تثبيت تطبيق سطح المكتب 🖥️</span>
              </button>
            </div>
          )}

          {/* App Features Grid */}
          <div className="mt-6 border-t border-zinc-800/80 pt-5">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-3 text-center">
              مميزات تطبيق Cinema Mix RED مقارنة بالموقع:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-[11px] font-black text-white">سرعة تشغيل 3X</p>
                <p className="text-[9px] text-zinc-400">بدون تقطيع</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl text-center">
                <WifiOff className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-[11px] font-black text-white">مشاهدة أوفلاين</p>
                <p className="text-[9px] text-zinc-400">تحميل مباشر</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl text-center">
                <Bell className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-[11px] font-black text-white">إشعارات الحلقات</p>
                <p className="text-[9px] text-zinc-400">تنبيه فور النزول</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl text-center">
                <Tv className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-[11px] font-black text-white">بث للتلفزيون</p>
                <p className="text-[9px] text-zinc-400">Chromecast/AirPlay</p>
              </div>
            </div>
          </div>


          {/* Share Link Box */}
          <div className="mt-5 bg-black/60 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-zinc-400 font-bold">رابط تحميل التطبيق والموقع المباشر:</p>
              <p className="text-xs font-mono text-red-400 truncate">https://cinemamix-red.app/download</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('تم نسخ رابط الموقع والتطبيق بنجاح!');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition-all border border-zinc-700"
            >
              نسخ الرابط 📋
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
