import React from 'react';
import { Film, Tv, PlayCircle, Download, DollarSign, Bookmark, Search, Sparkles, Menu, X, PlusCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';
import { CinemaLogo } from './CinemaLogo';

interface HeaderProps {
  activeTab: 'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher';
  setActiveTab: (tab: 'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  watchlistCount: number;
  downloadsCount: number;
  earningsUSD: number;
  onOpenAiAssistant: () => void;
  onOpenAddMedia: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => void;
  onLogout: () => void;
  onInstallApp?: () => void;
  onOpenAppDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  watchlistCount,
  downloadsCount,
  earningsUSD,
  onOpenAiAssistant,
  onOpenAddMedia,
  currentUser,
  onSignInWithGoogle,
  onLogout,
  onInstallApp,
  onOpenAppDownload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: PlayCircle },
    { id: 'movies', label: 'الأفلام', icon: Film },
    { id: 'series', label: 'المسلسلات', icon: Tv },
    { id: 'anime', label: 'الأنمي', icon: Sparkles },
    { id: 'watchlist', label: 'المفضلة', icon: Bookmark, badge: watchlistCount },
    { id: 'downloads', label: 'التحميلات', icon: Download, badge: downloadsCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-red-950/80 text-zinc-100 shadow-xl shadow-red-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <CinemaLogo className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white font-sans">
                  Cinema <span className="text-red-600">Mix</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm shadow-red-600/50">
                  RED
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">بث وتحميل سينمائي بالأسود والأحمر</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث عن فيلم، مسلسل، أنمي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/90 text-sm text-zinc-100 placeholder-zinc-500 pr-10 pl-4 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all dir-rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all relative ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-500/50'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center border border-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">

            {/* Add Movie Button */}
            <button
              onClick={onOpenAddMedia}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-lg shadow-red-600/40 border border-red-500 transition-all active:scale-95"
              title="إضافة فيلم أو مسلسل جديد"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة فيلم +</span>
            </button>

            {/* Download App Modal Button */}
            {onOpenAppDownload && (
              <button
                onClick={onOpenAppDownload}
                className="flex items-center gap-1.5 bg-gradient-to-r from-red-600/20 via-zinc-900 to-zinc-900 hover:from-red-600/40 text-red-400 hover:text-white text-xs font-black px-3 py-2 rounded-xl border border-red-600/40 shadow-md transition-all active:scale-95"
                title="تنزيل تطبيق الهواتف والموقع"
              >
                <Download className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                <span className="hidden md:inline">تحميل التطبيق 📲</span>
              </button>
            )}
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-red-400 text-xs font-bold px-3 py-2 rounded-xl border border-red-600/40 shadow-md transition-all active:scale-95"
              title="مساعد السينما والأنمي بالذكاء الاصطناعي"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">اقتراح AI</span>
            </button>

            {/* Protected Admin Panel Button */}
            <button
              onClick={() => setActiveTab('publisher')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                activeTab === 'publisher'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-amber-500/30'
                  : 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-amber-500/50'
              }`}
              title="لوحة تحكم المدير وإعدادات السحب المحمية"
            >
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="hidden md:inline text-[11px] text-zinc-200 font-bold mr-0.5">لوحة المدير 🔒</span>
            </button>

            {/* Google Authentication Button / User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-700 transition-all shadow-md"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'صورة الحساب'}
                      className="w-6 h-6 rounded-full border border-red-500 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      {(currentUser.displayName || 'M')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold hidden sm:inline text-zinc-200 max-w-24 truncate">
                    {currentUser.displayName || 'حسابي'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 dir-rtl">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="text-xs font-extrabold text-white truncate">{currentUser.displayName || 'مستخدم Cinema Mix'}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('watchlist');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-red-500" />
                      <span>قائمة المفضلة ({watchlistCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignInWithGoogle}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow-lg shadow-red-600/30 border border-red-500/50 transition-all active:scale-95"
              >
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="hidden sm:inline">دخول Google</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث عن فيلم، مسلسل، أنمي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-500 pr-10 pl-4 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600 dir-rtl"
            />
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-900 py-3 space-y-1">
            {/* Mobile Auth Button */}
            {currentUser ? (
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 rounded-xl mb-2 border border-zinc-800">
                <div className="flex items-center gap-2">
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-7 h-7 rounded-full border border-red-500 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-xs font-bold text-white">{currentUser.displayName}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1 rounded-lg"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onSignInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-zinc-900 border border-red-600/50 text-white mb-2 shadow-md"
              >
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>تسجيل الدخول بـ Google</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onOpenAppDownload) onOpenAppDownload();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg shadow-red-600/30 mb-2 border border-red-500"
            >
              <Download className="w-5 h-5 text-white animate-bounce" />
              <span>تحميل تطبيق الهواتف (Android / iOS) 📲</span>
            </button>

            <button
              onClick={() => {
                onOpenAddMedia();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold bg-zinc-900 border border-zinc-800 text-zinc-200 mb-2"
            >
              <PlusCircle className="w-5 h-5 text-red-500" />
              <span>إضافة فيلم أو مسلسل جديد +</span>
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
