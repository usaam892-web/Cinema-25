import React, { useState } from 'react';
import {
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  CreditCard,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Layers,
  PlusCircle,
  Lock,
  KeyRound,
  Code2,
  Wallet,
  Building2,
  Smartphone,
  Coins,
  FileCode,
  LogOut,
  History,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { AdStats, AdUnitConfig, PayoutTransaction } from '../types';

interface PublisherDashboardProps {
  stats: AdStats;
  config: AdUnitConfig;
  onUpdateConfig: (newConfig: Partial<AdUnitConfig>) => void;
  onSimulateAdImpression: (amountUSD: number) => void;
  onOpenAddMedia?: () => void;
  onRecordPayout?: (transaction: PayoutTransaction) => void;
}

export const PublisherDashboard: React.FC<PublisherDashboardProps> = ({
  stats,
  config,
  onUpdateConfig,
  onSimulateAdImpression,
  onOpenAddMedia,
  onRecordPayout,
}) => {
  // Admin Security Unlock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'ad_units' | 'withdraw' | 'security'>('analytics');

  // Currency & Payout Form States
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'SAR' | 'EGP'>('USD');
  const [payoutMethod, setPayoutMethod] = useState<'paypal' | 'bank' | 'vodafone' | 'usdt'>('paypal');
  const [payoutAmount, setPayoutAmount] = useState('1.00');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  // Editable Ad Units Local Form State
  const [pubId, setPubId] = useState(config.publisherId || 'ca-pub-9876543210123456');
  const [bannerUnitId, setBannerUnitId] = useState(config.bannerAdUnitId || 'ca-app-pub-9876543210123456/1029384756');
  const [interstitialUnitId, setInterstitialUnitId] = useState(config.interstitialAdUnitId || 'ca-app-pub-9876543210123456/5544332211');
  const [rewardedUnitId, setRewardedUnitId] = useState(config.rewardedAdUnitId || 'ca-app-pub-9876543210123456/9988776655');
  const [customScript, setCustomScript] = useState(
    config.customAdScript ||
      '<!-- Google AdSense / AdMob Web Banner -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9876543210123456"\n     crossorigin="anonymous"></script>\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-9876543210123456"\n     data-ad-slot="1029384756"\n     data-ad-format="auto"\n     data-full-width-responsive="true"></ins>\n<script>\n     (adsbygoogle = window.adsbygoogle || []).push({});\n</script>'
  );

  // Editable Payout Accounts Form State
  const [paypalEmail, setPaypalEmail] = useState(config.payoutDetails?.paypalEmail || 'owner.cinema@paypal.com');
  const [bankIban, setBankIban] = useState(config.payoutDetails?.bankIban || 'EG380002000100000000123456789');
  const [bankAccountName, setBankAccountName] = useState(config.payoutDetails?.bankAccountName || 'المالك الشخصي للموقع');
  const [bankName, setBankName] = useState(config.payoutDetails?.bankName || 'البنك الأهلي المصري / CIB');
  const [vodafoneNumber, setVodafoneNumber] = useState(config.payoutDetails?.vodafoneNumber || '01012345678');
  const [usdtAddress, setUsdtAddress] = useState(config.payoutDetails?.usdtAddress || 'T9zX3P...TRC20...OwnerWallet');

  // Change PIN Form State
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Payout Transaction History Local State
  const [payoutHistory, setPayoutHistory] = useState<PayoutTransaction[]>(
    stats.payoutHistory || [
      {
        id: 'tx_101',
        amountUSD: 25.0,
        method: 'vodafone',
        accountDetails: 'فودافون كاش: 01012345678',
        status: 'completed',
        date: '2026-08-01',
      },
      {
        id: 'tx_102',
        amountUSD: 10.0,
        method: 'paypal',
        accountDetails: 'owner.cinema@paypal.com',
        status: 'completed',
        date: '2026-08-05',
      },
    ]
  );

  const currencyMultiplier = selectedCurrency === 'SAR' ? 3.75 : selectedCurrency === 'EGP' ? 48.5 : 1.0;
  const currencySymbol = selectedCurrency === 'SAR' ? 'ر.س' : selectedCurrency === 'EGP' ? 'ج.م' : '$';

  const formatAmount = (numUSD: number) => {
    return (numUSD * currencyMultiplier).toFixed(2);
  };

  // PIN Unlock Verification
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const targetPin = config.adminPin || '1234';

    if (enteredPin.trim() === targetPin) {
      setIsUnlocked(true);
      setEnteredPin('');
    } else {
      setPinError('رمز PIN غير صحيح! الرمز الافتراضي لمالك الموقع هو 1234.');
    }
  };

  // Save Ad Config Changes
  const handleSaveAdConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      publisherId: pubId,
      bannerAdUnitId: bannerUnitId,
      interstitialAdUnitId: interstitialUnitId,
      rewardedAdUnitId: rewardedUnitId,
      customAdScript: customScript,
    });
    alert('✅ تم حفظ إعدادات معرّفات وأكواد الإعلانات بنجاح!');
  };

  // Save Payout Accounts Changes
  const handleSavePayoutDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      payoutDetails: {
        paypalEmail,
        bankAccountName,
        bankIban,
        bankName,
        vodafoneNumber,
        usdtAddress,
      },
    });
    alert('✅ تم حفظ حسابات وسيلة سحب الأرباح الشخصية لمالك الموقع بنجاح!');
  };

  // Change Admin PIN Code
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      alert('رمز PIN يجب أن يتكون من 4 أرقام أو رموز على الأقل!');
      return;
    }
    onUpdateConfig({ adminPin: newPin });
    setNewPin('');
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 4000);
  };

  // Submit Withdrawal Request
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');

    const numVal = parseFloat(payoutAmount);
    if (isNaN(numVal) || numVal < 1.0) {
      setPayoutError('عفواً، الحد الأدنى لطلب سحب الأرباح هو 1.00$ (واحد دولار) فقط!');
      return;
    }

    if (numVal > stats.totalEarningsUSD) {
      setPayoutError(`عفواً، رصيدك الحالي المتاح للسحب هو $${stats.totalEarningsUSD.toFixed(2)} فقط.`);
      return;
    }

    let accountDetailStr = '';
    if (payoutMethod === 'paypal') accountDetailStr = `PayPal: ${paypalEmail}`;
    else if (payoutMethod === 'bank') accountDetailStr = `Bank IBAN: ${bankIban} (${bankName})`;
    else if (payoutMethod === 'vodafone') accountDetailStr = `Vodafone Cash: ${vodafoneNumber}`;
    else accountDetailStr = `USDT TRC20: ${usdtAddress}`;

    const newTx: PayoutTransaction = {
      id: 'tx_' + Date.now(),
      amountUSD: numVal,
      method: payoutMethod,
      accountDetails: accountDetailStr,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    setPayoutHistory([newTx, ...payoutHistory]);
    if (onRecordPayout) onRecordPayout(newTx);

    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 5000);
  };

  // Render PIN Protection Lock Screen if Admin is locked
  if (!isUnlocked) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4 dir-rtl text-slate-100">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            منطقة محظورة 🔒
          </span>

          <h2 className="text-xl font-black text-white mb-2">
            لوحة تحكم مدير الموقع والأرباح
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            هذه الشاشة محمية بكلمة مرور خاصة بمالك الموقع وحده. لا يمتلك المستخدمون العاديون أي صلاحيات لرؤية الأرباح أو طرق السحب.
          </p>

          {pinError && (
            <div className="mb-4 bg-red-950/80 border border-red-500/50 p-3 rounded-2xl text-red-300 text-xs font-bold flex items-center justify-center gap-2 dir-rtl">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 text-right">
                أدخل رمز PIN للمدير (الافتراضي: 1234):
              </label>
              <div className="relative">
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="****"
                  maxLength={10}
                  className="w-full bg-slate-950 border border-slate-800 text-center font-mono text-lg font-black text-amber-400 pr-10 pl-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>فتح لوحة المدير المحمية</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-500 mt-4 dir-rtl">
            💡 ملاحظة: الرمز السري الأول هو <code className="text-amber-400 font-bold">1234</code> ويمكنك تغييره من داخل اللوحة بعد الدخول.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 dir-rtl text-slate-100">
      
      {/* Admin Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>لوحة المدير المعتمدة</span>
            </span>
            <span className="text-xs text-amber-400 font-bold">مالك الموقع والمستفيد الأوحد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            لوحة الإعلانات وإعدادات سحب الأرباح الشخصية
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ربط شبكات الإعلانات الحقيقية (AdMob / AdSense / Adsterra)، وتحويل الأرباح لحسابك البنكي أو المحفظة
          </p>
        </div>

        {/* Lock & Currency Switcher */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {onOpenAddMedia && (
            <button
              onClick={onOpenAddMedia}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة فيلم +</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <span className="text-xs text-slate-400 px-1 font-bold">العملة:</span>
            {(['USD', 'SAR', 'EGP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedCurrency === curr
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className="bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-600 text-slate-300 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-2xl transition-all flex items-center gap-1.5"
            title="قفل لوحة التحكم"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">قفل اللوحة 🔒</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-32 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>إحصائيات الأرباح والمشاهدات</span>
        </button>

        <button
          onClick={() => setActiveTab('ad_units')}
          className={`flex-1 min-w-32 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ad_units'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>أكواد وشبكات الإعلانات الحقيقية</span>
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 min-w-32 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'withdraw'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>طرق وسحب الأرباح الشخصية</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>تغيير رمز PIN 🔒</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Live Simulator */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Main Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-medium">
                <span>إجمالي الأرباح المتاحة بالسحب</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono dir-ltr text-right mb-1">
                {currencySymbol} {formatAmount(stats.totalEarningsUSD)}
              </div>
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>خاصة بمالك الموقع 100%</span>
              </p>
            </div>

            {/* Total Impressions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-medium">
                <span>إجمالي مشاهدات الإعلانات (Impressions)</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono dir-ltr text-right mb-1">
                {stats.totalImpressions.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                {stats.interstitialShows} فيديو + {stats.bannerShows} بانر
              </p>
            </div>

            {/* Total Clicks & CTR */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-medium">
                <span>النقرات ونسبة التفاعل (CTR)</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <MousePointer className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono dir-ltr text-right mb-1">
                {stats.totalClicks} <span className="text-xs text-purple-400 font-sans">({stats.ctrPercent}%)</span>
              </div>
              <p className="text-[11px] text-slate-400">عائد مرتفع من البانرات والرعاية</p>
            </div>

            {/* eCPM Average */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-medium">
                <span>متوسط سعر eCPM للشبكات</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono dir-ltr text-right mb-1">
                {currencySymbol} {formatAmount(8.5)}
              </div>
              <p className="text-[11px] text-slate-400">سعر شبكات AdMob / AdSense الحقيقي</p>
            </div>

          </div>

          {/* Simulator Tool & Quick Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-base font-extrabold text-white">اختبار جني الأرباح التلقائي</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  اضغط أدناه لمحاكاة ورود مشاهدات ونقرات إعلانات على أفلامك لزيادة الرصيد فوراً واختبار نظام السحب:
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onSimulateAdImpression(0.15)}
                  className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>إعلان فيديو Rewarded (+{currencySymbol} {formatAmount(0.15)})</span>
                </button>

                <button
                  onClick={() => onSimulateAdImpression(0.05)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>نقرة بانر إعلاني (+{currencySymbol} {formatAmount(0.05)})</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-extrabold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>ضمان حقوق المالك وإعلانات الموقع</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                تم ربط نظام الإعلانات بالكامل ليخدم معرّفاتك الإعلانية الخاصة بـ <strong className="text-amber-400">Google AdMob / AdSense</strong> أو أي شبكة بديلة تختارها. جميع الأرباح الناتجة عن المشاهدين والتحميلات تذهب حصرياً لحسابات السحب المسجلة باسمك في هذه اللوحة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">الحد الأدنى للسحب:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">1.00$ فقط</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">وسائل الدفع المتاحة:</span>
                  <span className="text-white font-bold">باي بال / تحويل بنكي / فودافون كاش / USDT</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Real Ad Networks & Script Integration */}
      {activeTab === 'ad_units' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveAdConfig} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span>ربط شبكات ومعرّفات الإعلانات الحقيقية (AdMob / AdSense)</span>
              </h3>
              <p className="text-xs text-slate-400">
                أدخل معرّفات وحداتك الإعلانية الحقيقية لتذهب جميع أرباح المشاهدات لحسابك الشخصي مباشرةً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  معرف الناشر Publisher ID (Google AdSense / AdMob):
                </label>
                <input
                  type="text"
                  value={pubId}
                  onChange={(e) => setPubId(e.target.value)}
                  placeholder="ca-pub-9876543210123456"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400 px-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  معرّف إعلانات البانر Banner Ad Unit ID:
                </label>
                <input
                  type="text"
                  value={bannerUnitId}
                  onChange={(e) => setBannerUnitId(e.target.value)}
                  placeholder="ca-app-pub-xxx/yyy"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400 px-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  معرّف إعلانات الفيديو الشاشات Interstitial Ad Unit ID:
                </label>
                <input
                  type="text"
                  value={interstitialUnitId}
                  onChange={(e) => setInterstitialUnitId(e.target.value)}
                  placeholder="ca-app-pub-xxx/zzz"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400 px-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  معرّف إعلانات المكافآت Rewarded Video Ad Unit ID:
                </label>
                <input
                  type="text"
                  value={rewardedUnitId}
                  onChange={(e) => setRewardedUnitId(e.target.value)}
                  placeholder="ca-app-pub-xxx/rrr"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400 px-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Custom Ad Script Box */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                كود سكريبت إعلانات مخصص (Custom HTML / JS Code):
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                يمكنك لصق كود الإعلانات من AdSense أو الشبكات البديلة (PropellerAds, PopAds, Adsterra, Yllix) ليظهر في مشغل الفيديو والقوائم:
              </p>
              <textarea
                rows={5}
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 p-4 rounded-2xl focus:outline-none focus:border-amber-500 dir-ltr"
              />
            </div>

            {/* Ad Type Toggle Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold text-white">تفعيل وإيقاف أماكن الإعلانات في المشغل والتطبيق:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ interstitialEnabled: !config.interstitialEnabled })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    config.interstitialEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>إعلانات الفيديو قبل البث</span>
                  {config.interstitialEnabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6" />}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateConfig({ rewardedEnabled: !config.rewardedEnabled })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    config.rewardedEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>إعلانات فتح 4K والتحميل</span>
                  {config.rewardedEnabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6" />}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateConfig({ bannerEnabled: !config.bannerEnabled })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    config.bannerEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>بانرات العرض بين القوائم</span>
                  {config.bannerEnabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-xl transition-all"
              >
                حفظ إعدادات شبكات الإعلانات
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: Owner Personal Withdrawal & Payout Accounts */}
      {activeTab === 'withdraw' && (
        <div className="space-y-8">
          
          {/* Payout Accounts Settings Form */}
          <form onSubmit={handleSavePayoutDetails} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>إعدادات وسائل وسحب الأرباح الشخصية لمالك الموقع</span>
              </h3>
              <p className="text-xs text-slate-400">
                سجل بيانات حساباتك البنكية والإلكترونية التي ترغب في استقبال أرباحك الشخصية عليها حصرياً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>بريد حساب باي بال (PayPal):</span>
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="owner@paypal.com"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-bold text-white px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>رقم الآيبان البنكي (IBAN):</span>
                </label>
                <input
                  type="text"
                  value={bankIban}
                  onChange={(e) => setBankIban(e.target.value)}
                  placeholder="EG38..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span>رقم محفظة فودافون كاش / المحفظة الإلكترونية:</span>
                </label>
                <input
                  type="text"
                  value={vodafoneNumber}
                  onChange={(e) => setVodafoneNumber(e.target.value)}
                  placeholder="010xxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>عنوان عنوان المحفظة الرقمية USDT (TRC20):</span>
                </label>
                <input
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  placeholder="T..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition-all"
              >
                حفظ بيانات وسيلة السحب الشخصية
              </button>
            </div>

          </form>

          {/* Request Withdrawal Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-3xl p-6">
            <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>طلب تحويل وتفريغ الأرباح فوراً</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              اختر الوسيلة والمبلغ المراد سحبه لحسابك الشخصي. الحد الأدنى للسحب هو <strong className="text-emerald-400">1.00$ فقط!</strong>
            </p>

            {payoutError && (
              <div className="mb-6 bg-red-950 border border-red-500/50 p-4 rounded-2xl text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="mb-6 bg-emerald-950 border border-emerald-500/50 p-4 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم إرسال طلب تحويل الأرباح بنجاح لبياناتك المسجلة! سيتم إيداع المبلغ خلال دقائق.</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-2">طريقة تحويل المبلغ:</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-bold text-white px-4 py-3.5 rounded-2xl focus:outline-none"
                >
                  <option value="paypal">باي بال ({paypalEmail})</option>
                  <option value="bank">تحويل بنكي IBAN ({bankIban})</option>
                  <option value="vodafone">فودافون كاش ({vodafoneNumber})</option>
                  <option value="usdt">عملات رقمية USDT (TRC20)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-2">المبلغ المراد سحبه ($):</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 px-4 py-3 rounded-2xl focus:outline-none font-mono"
                />
                <span className="text-[10px] text-emerald-400 font-bold mt-1 block dir-rtl">
                  الرصيد المتاح حالياً: ${stats.totalEarningsUSD.toFixed(2)}
                </span>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>تأكيد سحب الأرباح الآن</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Payout Transaction History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>تاريخ وسجل عمليات السحب السابقة</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs dir-rtl">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3 rounded-r-xl">رقم العملية</th>
                    <th className="p-3">المبلغ ($)</th>
                    <th className="p-3">الوسيلة والتفاصيل</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3 rounded-l-xl">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payoutHistory.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-950/40">
                      <td className="p-3 font-mono font-bold text-slate-300">{tx.id}</td>
                      <td className="p-3 font-mono font-black text-emerald-400">${tx.amountUSD.toFixed(2)}</td>
                      <td className="p-3 text-slate-200 max-w-xs truncate">{tx.accountDetails}</td>
                      <td className="p-3 font-mono text-slate-400">{tx.date}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          tx.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {tx.status === 'completed' ? 'تم التحويل بنجاح ✅' : 'قيد المعالجة ⏳'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: Security Lock & PIN Management */}
      {activeTab === 'security' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
            <KeyRound className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-base font-black text-white">تغيير رمز الحماية PIN للمدير</h3>
              <p className="text-xs text-slate-400">حماية لوحة التحكم وطرق السحب من الوصول غير المصرح به.</p>
            </div>
          </div>

          {pinChangeSuccess && (
            <div className="mb-4 bg-emerald-950 border border-emerald-500/50 p-3 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تم تغيير رمز PIN للمدير بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رمز PIN الجديد (4 أرقام أو أكثر):
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="أدخل الرمز الجديد..."
                className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400 p-3 rounded-2xl focus:outline-none focus:border-red-500 text-center text-lg font-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-lg transition-all"
            >
              حفظ الرمز السري الجديد 🔒
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
