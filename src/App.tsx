import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MediaGrid } from './components/MediaGrid';
import { MediaDetailModal } from './components/MediaDetailModal';
import { VideoPlayer } from './components/VideoPlayer';
import { DownloadModal } from './components/DownloadModal';
import { DownloadManager } from './components/DownloadManager';
import { PublisherDashboard } from './components/PublisherDashboard';
import { AdInterstitialModal } from './components/AdInterstitialModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AddMediaModal } from './components/AddMediaModal';
import { BottomNav } from './components/BottomNav';
import { WatchlistManager } from './components/WatchlistManager';
import { WatchlistToast } from './components/WatchlistToast';
import { ServerSelectionModal, STREAM_SERVERS, StreamServer } from './components/ServerSelectionModal';
import { AppDownloadModal } from './components/AppDownloadModal';
import { INITIAL_MEDIA, INITIAL_REVIEWS } from './data/mediaData';
import { MediaItem, Episode, DownloadTask, UserReview, AdStats, AdUnitConfig } from './types';
import { AdBanner } from './components/AdBanner';
import { auth, signInWithGoogle, logoutUser, onAuthStateChanged, db, type User } from './lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'series' | 'anime' | 'watchlist' | 'downloads' | 'publisher'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'movie' | 'series' | 'anime'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('📱 لتثبيت تطبيق Cinema Mix على شاشتك الرئيسية:\n1. اضغط على خيارات المتصفح (⋮) أو زر المشاركة (⬆)\n2. اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"');
    }
  };

  // Auth Listener
  useEffect(() => {
    if (!auth) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Auth listener skipped:', err);
    }
  }, []);

  // Media List State with LocalStorage & Firestore Sync
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinemax_media_list');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const [showAddMediaModal, setShowAddMediaModal] = useState(false);

  // Sync media list to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinemax_media_list', JSON.stringify(mediaList));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [mediaList]);

  // Firestore Custom Media Listener (real-time sync for custom movies)
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'customMedia'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreItems: MediaItem[] = [];
        snapshot.forEach((docSnap) => {
          firestoreItems.push(docSnap.data() as MediaItem);
        });

        if (firestoreItems.length > 0) {
          setMediaList((prevList) => {
            // Merge initial media with firestore custom items
            const customIds = new Set(firestoreItems.map((item) => item.id));
            const baseItems = prevList.filter((item) => !customIds.has(item.id));
            return [...firestoreItems, ...baseItems];
          });
        }
      }, (err) => {
        console.warn('Firestore customMedia listener note:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore subscription unavailable:', e);
    }
  }, []);

  // Add new Custom Movie/Series/Anime with Firestore sync
  const handleAddMedia = async (newMedia: MediaItem) => {
    setMediaList((prev) => [newMedia, ...prev]);

    // Save to Firestore if connected
    if (db) {
      try {
        const mediaRef = doc(db, 'customMedia', newMedia.id);
        await setDoc(mediaRef, {
          ...newMedia,
          addedByUserId: currentUser?.uid || 'guest',
          addedByUserName: currentUser?.displayName || 'مستخدم Cinema Mix',
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Error saving media to Firestore:', e);
      }
    }
  };

  // Watchlist LocalStorage & Firestore State
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinemax_watchlist');
      return saved ? JSON.parse(saved) : ['m1', 'a1'];
    } catch {
      return ['m1', 'a1'];
    }
  });

  // Sync Watchlist with Firestore when user logs in
  useEffect(() => {
    if (!currentUser || !db) return;

    try {
      const q = query(collection(db, 'watchlist'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const remoteIds: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.mediaId) remoteIds.push(data.mediaId);
        });

        if (remoteIds.length > 0) {
          setWatchlistIds(remoteIds);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Watchlist sync error:', e);
    }
  }, [currentUser]);

  // Download Tasks State
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>(() => {
    try {
      const saved = localStorage.getItem('cinemax_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);

  // Publisher Revenue & Ad System State
  const [publisherStats, setPublisherStats] = useState<AdStats>(() => {
    try {
      const saved = localStorage.getItem('cinemax_ad_stats');
      return saved ? JSON.parse(saved) : {
        totalImpressions: 2140,
        totalClicks: 268,
        totalEarningsUSD: 38.45,
        todayEarningsUSD: 7.20,
        ctrPercent: 5.2,
        interstitialShows: 420,
        rewardedShows: 180,
        bannerShows: 1540,
      };
    } catch {
      return {
        totalImpressions: 2140,
        totalClicks: 268,
        totalEarningsUSD: 38.45,
        todayEarningsUSD: 7.20,
        ctrPercent: 5.2,
        interstitialShows: 420,
        rewardedShows: 180,
        bannerShows: 1540,
      };
    }
  });

  const [publisherConfig, setPublisherConfig] = useState<AdUnitConfig>(() => {
    try {
      const saved = localStorage.getItem('cinemax_ad_config');
      return saved ? JSON.parse(saved) : {
        publisherId: 'ca-pub-9876543210123456',
        bannerAdUnitId: 'ca-app-pub-9876543210123456/1029384756',
        interstitialAdUnitId: 'ca-app-pub-9876543210123456/5544332211',
        rewardedAdUnitId: 'ca-app-pub-9876543210123456/9988776655',
        customAdScript: '',
        adminPin: '1234',
        payoutDetails: {
          paypalEmail: 'owner.cinema@paypal.com',
          bankAccountName: 'مالك الموقع الشخصي',
          bankIban: 'EG380002000100000000123456789',
          bankName: 'البنك الأهلي المصري / CIB',
          vodafoneNumber: '01012345678',
          usdtAddress: 'T9zX3P...TRC20...OwnerWallet',
        },
        bannerEnabled: true,
        interstitialEnabled: true,
        rewardedEnabled: true,
        nativeEnabled: true,
        skipDurationSec: 5,
        ecpmRates: { banner: 1.5, interstitial: 8.5, rewarded: 15.0 },
      };
    } catch {
      return {
        publisherId: 'ca-pub-9876543210123456',
        bannerAdUnitId: 'ca-app-pub-9876543210123456/1029384756',
        interstitialAdUnitId: 'ca-app-pub-9876543210123456/5544332211',
        rewardedAdUnitId: 'ca-app-pub-9876543210123456/9988776655',
        customAdScript: '',
        adminPin: '1234',
        payoutDetails: {
          paypalEmail: 'owner.cinema@paypal.com',
          bankAccountName: 'مالك الموقع الشخصي',
          bankIban: 'EG380002000100000000123456789',
          bankName: 'البنك الأهلي المصري / CIB',
          vodafoneNumber: '01012345678',
          usdtAddress: 'T9zX3P...TRC20...OwnerWallet',
        },
        bannerEnabled: true,
        interstitialEnabled: true,
        rewardedEnabled: true,
        nativeEnabled: true,
        skipDurationSec: 5,
        ecpmRates: { banner: 1.5, interstitial: 8.5, rewarded: 15.0 },
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('cinemax_ad_config', JSON.stringify(publisherConfig));
  }, [publisherConfig]);

  // Modal Controllers
  const [selectedMediaDetail, setSelectedMediaDetail] = useState<MediaItem | null>(null);
  const [activeVideoMedia, setActiveVideoMedia] = useState<MediaItem | null>(null);
  const [activeVideoEpisode, setActiveVideoEpisode] = useState<Episode | null>(null);

  // Server Selection State
  const [selectedServer, setSelectedServer] = useState<StreamServer>(STREAM_SERVERS[0]);
  const [showServerModal, setShowServerModal] = useState(false);

  const [activeDownloadMedia, setActiveDownloadMedia] = useState<MediaItem | null>(null);
  const [activeDownloadEpisode, setActiveDownloadEpisode] = useState<Episode | null>(null);

  const [showAiModal, setShowAiModal] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState(false);
  const [rewardedAdCallback, setRewardedAdCallback] = useState<(() => void) | null>(null);

  // Watchlist Toast Feedback State
  const [watchlistToast, setWatchlistToast] = useState<{
    media: MediaItem;
    action: 'added' | 'removed';
  } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cinemax_watchlist', JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  useEffect(() => {
    localStorage.setItem('cinemax_downloads', JSON.stringify(downloadTasks));
  }, [downloadTasks]);

  useEffect(() => {
    localStorage.setItem('cinemax_ad_stats', JSON.stringify(publisherStats));
  }, [publisherStats]);

  // Simulate active download task progress interval
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status !== 'downloading') return task;
          const nextProgress = task.progress + (task.speedMBps / 50) * 100;
          if (nextProgress >= 100) {
            return { ...task, progress: 100, status: 'completed' };
          }
          return { ...task, progress: nextProgress };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ad Impression & Click Handler
  const recordAdImpression = (amountUSD = 0.05) => {
    setPublisherStats((prev) => ({
      ...prev,
      totalImpressions: prev.totalImpressions + 1,
      totalEarningsUSD: prev.totalEarningsUSD + amountUSD,
      todayEarningsUSD: prev.todayEarningsUSD + amountUSD,
    }));
  };

  const recordAdClick = () => {
    setPublisherStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      totalEarningsUSD: prev.totalEarningsUSD + 0.10,
    }));
  };

  // Google Sign-In & Logout Handlers
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Watchlist Toggle with Firestore Sync
  const handleToggleWatchlist = async (media: MediaItem) => {
    const isPresent = watchlistIds.includes(media.id);
    const nextWatchlist = isPresent
      ? watchlistIds.filter((id) => id !== media.id)
      : [...watchlistIds, media.id];

    setWatchlistIds(nextWatchlist);

    // Show interactive toast popup feedback
    setWatchlistToast({
      media,
      action: isPresent ? 'removed' : 'added',
    });

    if (currentUser && db) {
      try {
        const docId = `${currentUser.uid}_${media.id}`;
        const watchRef = doc(db, 'watchlist', docId);
        if (isPresent) {
          await deleteDoc(watchRef);
        } else {
          await setDoc(watchRef, {
            userId: currentUser.uid,
            mediaId: media.id,
            media,
            addedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error('Error syncing watchlist to Firestore:', e);
      }
    }
  };

  // Clear All Watchlist Items
  const handleClearAllWatchlist = async () => {
    const idsToClear = [...watchlistIds];
    setWatchlistIds([]);

    if (currentUser && db) {
      try {
        await Promise.all(
          idsToClear.map((id) => deleteDoc(doc(db, 'watchlist', `${currentUser.uid}_${id}`)))
        );
      } catch (e) {
        console.error('Error clearing watchlist from Firestore:', e);
      }
    }
  };

  // Play Media
  const handlePlayMedia = (media: MediaItem, episode?: Episode) => {
    setActiveVideoMedia(media);
    setActiveVideoEpisode(episode || null);
  };

  // Download Media Modal Trigger
  const handleDownloadMedia = (media: MediaItem, episode?: Episode) => {
    setActiveDownloadMedia(media);
    setActiveDownloadEpisode(episode || null);
  };

  // Start Download Task
  const handleStartDownload = (taskData: Omit<DownloadTask, 'id' | 'createdAt' | 'status'>) => {
    const newTask: DownloadTask = {
      ...taskData,
      id: 'task_' + Date.now(),
      status: 'downloading',
      createdAt: Date.now(),
    };
    setDownloadTasks((prev) => [newTask, ...prev]);
    setActiveTab('downloads');
  };

  // Pause / Resume / Cancel Download Task
  const handlePauseTask = (id: string) => {
    setDownloadTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'paused' } : t))
    );
  };

  const handleResumeTask = (id: string) => {
    setDownloadTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'downloading' } : t))
    );
  };

  const handleCancelTask = (id: string) => {
    setDownloadTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger Rewarded Ad Modal
  const handleOpenRewardedAd = (onSuccess: () => void) => {
    setRewardedAdCallback(() => onSuccess);
    setShowRewardedAdModal(true);
  };

  // Add User Review
  const handleAddReview = (mediaId: string, rating: number, comment: string) => {
    const newRev: UserReview = {
      id: 'rev_' + Date.now(),
      mediaId,
      userName: currentUser?.displayName || 'زائر Cinema Mix',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      rating,
      comment,
      date: 'الآن',
      likes: 1,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Category Filtering according to activeTab
  const currentCategoryFilter =
    activeTab === 'movies'
      ? 'movie'
      : activeTab === 'series'
      ? 'series'
      : activeTab === 'anime'
      ? 'anime'
      : selectedCategory;

  // Filter Watchlist items
  const watchlistItems = mediaList.filter((m) => watchlistIds.includes(m.id));

  // Featured Media for Hero Banner
  const featuredMedia = mediaList.find((m) => m.featured) || mediaList[0];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        watchlistCount={watchlistIds.length}
        downloadsCount={downloadTasks.filter((t) => t.status === 'downloading').length}
        earningsUSD={publisherStats.totalEarningsUSD}
        onOpenAiAssistant={() => setShowAiModal(true)}
        onOpenAddMedia={() => setShowAddMediaModal(true)}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        onLogout={handleLogout}
        onInstallApp={handleInstallApp}
        onOpenAppDownload={() => setShowAppDownloadModal(true)}
      />

      {/* PWA App Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-black border-b border-red-600/30 px-4 py-2.5 dir-rtl flex items-center justify-between text-xs font-bold text-white shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg animate-bounce">📲</span>
            <div>
              <span>ثبّت تطبيق <strong className="text-red-500 font-extrabold">Cinema Mix</strong> على شاشة هاتفك الرئيسية لمشاهدة سريعة دون متصفح!</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallApp}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95"
            >
              تثبيت الآن 📲
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-zinc-400 hover:text-white p-1"
              title="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Home / Movies / Series / Anime Browse */}
        {(activeTab === 'home' || activeTab === 'movies' || activeTab === 'series' || activeTab === 'anime') && (
          <>
            {/* Show Hero Banner on Home tab when no search query */}
            {activeTab === 'home' && !searchQuery && (
              <>
                <HeroBanner
                  media={featuredMedia}
                  onPlay={(media) => handlePlayMedia(media)}
                  onDownload={(media) => handleDownloadMedia(media)}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={watchlistIds.includes(featuredMedia.id)}
                />

                {/* App + Web Download Section Card */}
                <div className="w-full bg-gradient-to-r from-red-950/80 via-zinc-900 to-black border border-red-600/40 rounded-3xl p-5 sm:p-7 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 dir-rtl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-2 text-center md:text-right relative z-10">
                    <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3 py-1 rounded-full text-red-400 text-xs font-black">
                      <span>📲 موقع وتطبيق سينمائي موحد</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      حمّل تطبيق <span className="text-red-500">Cinema Mix RED</span> للهاتف أو تصفّح عبر الموقع!
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                      استمتع بأقوى تجربة مشاهدة وتحميل للأفلام والمسلسلات. تطبيق خفيف للأندرويد والآيفون، مع إشعارات فورية وسرعة تنزيل فائقة دون إعلانات مزعجة.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
                    <button
                      onClick={() => setShowAppDownloadModal(true)}
                      className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-red-600/40 border border-red-500 flex items-center justify-center gap-2.5 transition-all active:scale-95"
                    >
                      <span>تنزيل التطبيق (APK) 📲</span>
                    </button>
                    <button
                      onClick={handleInstallApp}
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl border border-zinc-700/80 transition-all flex items-center justify-center gap-2"
                    >
                      <span>تثبيت PWA على الشاشة 🌐</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Media Grid */}
            <MediaGrid
              mediaItems={mediaList}
              selectedCategory={currentCategoryFilter}
              setSelectedCategory={(cat) => {
                setSelectedCategory(cat);
                if (cat === 'movie') setActiveTab('movies');
                else if (cat === 'series') setActiveTab('series');
                else if (cat === 'anime') setActiveTab('anime');
                else setActiveTab('home');
              }}
              searchQuery={searchQuery}
              onSelectMedia={(media) => setSelectedMediaDetail(media)}
              onPlayMedia={handlePlayMedia}
              onDownloadMedia={handleDownloadMedia}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistIds={watchlistIds}
              onAdImpression={() => recordAdImpression(0.05)}
              onAdClick={recordAdClick}
            />
          </>
        )}

        {/* Tab 2: Watchlist / المفضلة */}
        {activeTab === 'watchlist' && (
          <WatchlistManager
            watchlistItems={watchlistItems}
            currentUser={currentUser}
            onSignInWithGoogle={handleSignInWithGoogle}
            onSelectMedia={(media) => setSelectedMediaDetail(media)}
            onPlayMedia={handlePlayMedia}
            onDownloadMedia={handleDownloadMedia}
            onRemoveFromWatchlist={handleToggleWatchlist}
            onClearAllWatchlist={handleClearAllWatchlist}
          />
        )}

        {/* Tab 3: Downloads Manager / التحميلات */}
        {activeTab === 'downloads' && (
          <DownloadManager
            tasks={downloadTasks}
            onPauseTask={handlePauseTask}
            onResumeTask={handleResumeTask}
            onCancelTask={handleCancelTask}
            onPlayDownloadedFile={(title) => {
              const media = mediaList.find((m) => title.includes(m.title)) || mediaList[0];
              handlePlayMedia(media);
            }}
            onExit={() => setActiveTab('home')}
          />
        )}

        {/* Tab 4: Protected Admin Earnings Dashboard / لوحة تحكم المدير والإعلانات المحمية */}
        {activeTab === 'publisher' && (
          <PublisherDashboard
            stats={publisherStats}
            config={publisherConfig}
            onUpdateConfig={(newCfg) => setPublisherConfig((prev) => ({ ...prev, ...newCfg }))}
            onSimulateAdImpression={(amountUSD) => recordAdImpression(amountUSD)}
            onOpenAddMedia={() => setShowAddMediaModal(true)}
            onRecordPayout={(tx) => {
              setPublisherStats((prev) => ({
                ...prev,
                totalEarningsUSD: Math.max(0, prev.totalEarningsUSD - tx.amountUSD),
                payoutHistory: [tx, ...(prev.payoutHistory || [])],
              }));
            }}
          />
        )}

      </main>

      {/* Modals */}

      {/* Media Detail Page Modal */}
      <MediaDetailModal
        media={selectedMediaDetail}
        isOpen={Boolean(selectedMediaDetail)}
        onClose={() => setSelectedMediaDetail(null)}
        onPlay={(media, ep) => {
          setSelectedMediaDetail(null);
          handlePlayMedia(media, ep);
        }}
        onDownload={(media, ep) => {
          handleDownloadMedia(media, ep);
        }}
        onToggleWatchlist={handleToggleWatchlist}
        isInWatchlist={selectedMediaDetail ? watchlistIds.includes(selectedMediaDetail.id) : false}
        reviews={reviews}
        onAddReview={handleAddReview}
        onAdImpression={() => recordAdImpression(0.06)}
        onAdClick={recordAdClick}
        onOpenServerModal={() => setShowServerModal(true)}
        activeServerName={selectedServer.name}
      />

      {/* Streaming Video Player */}
      <VideoPlayer
        media={activeVideoMedia}
        episode={activeVideoEpisode}
        isOpen={Boolean(activeVideoMedia)}
        onClose={() => {
          setActiveVideoMedia(null);
          setActiveVideoEpisode(null);
        }}
        onAdImpression={(amount) => recordAdImpression(amount || 0.08)}
        onAdClick={recordAdClick}
        currentServerName={selectedServer.name}
        onOpenServerModal={() => setShowServerModal(true)}
      />

      {/* Server Selection Popup Dialog (as requested in user screenshot) */}
      <ServerSelectionModal
        media={selectedMediaDetail || activeVideoMedia}
        episode={activeVideoEpisode}
        isOpen={showServerModal}
        onClose={() => setShowServerModal(false)}
        selectedServerId={selectedServer.id}
        onSelectServer={(server) => {
          setSelectedServer(server);
        }}
      />

      {/* Quality & Download Options Modal */}
      <DownloadModal
        media={activeDownloadMedia}
        episode={activeDownloadEpisode}
        isOpen={Boolean(activeDownloadMedia)}
        onClose={() => {
          setActiveDownloadMedia(null);
          setActiveDownloadEpisode(null);
        }}
        onStartDownload={handleStartDownload}
        onOpenRewardedAd={handleOpenRewardedAd}
      />

      {/* High eCPM Rewarded Interstitial Video Ad Modal */}
      <AdInterstitialModal
        isOpen={showRewardedAdModal}
        onClose={() => setShowRewardedAdModal(false)}
        skipSeconds={5}
        onRewardGranted={() => {
          if (rewardedAdCallback) rewardedAdCallback();
        }}
        onRecordImpression={(cpm) => recordAdImpression(cpm)}
      />

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={showAddMediaModal}
        onClose={() => setShowAddMediaModal(false)}
        onAddMedia={handleAddMedia}
        existingMediaCount={mediaList.length}
      />

      {/* AI Assistant Chat Modal */}
      <AiAssistantModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />

      {/* Mobile App Download Center Modal */}
      <AppDownloadModal
        isOpen={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
        onInstallPwa={handleInstallApp}
      />

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 py-8 pb-20 lg:pb-8 text-center text-xs text-zinc-500 dir-rtl mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Movie<span className="text-red-600">Hub</span> RED</span>
            <span>• منصة وموقع سينمائي + تطبيق أندرويد وآيفون لمشاهدة وتحميل الميديا</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button onClick={() => setShowAppDownloadModal(true)} className="hover:text-red-400 transition-colors font-bold text-red-500">
              تحميل التطبيق 📲
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('publisher')} className="hover:text-red-400 transition-colors">
              منصة أرباح الناشر 💰
            </button>
            <span>•</span>
            <button onClick={() => setShowAiModal(true)} className="hover:text-red-400 transition-colors">
              مساعد AI 🍿
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile App Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistIds.length}
        downloadsCount={downloadTasks.filter((t) => t.status === 'downloading').length}
      />

      {/* Watchlist Interactive Toast Popup Notification */}
      <WatchlistToast
        toast={watchlistToast}
        onClose={() => setWatchlistToast(null)}
        onGoToWatchlist={() => setActiveTab('watchlist')}
      />

    </div>
  );
}
