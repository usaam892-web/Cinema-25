export type MediaType = 'movie' | 'series' | 'anime';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  summary: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface DownloadOption {
  quality: '4K' | '1080p' | '720p' | '480p';
  size: string;
  format: 'MP4' | 'MKV';
  requiresAd?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle: string;
  type: MediaType;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  duration?: string; // For movies
  seasonsCount?: number; // For series/anime
  episodesCount?: number;
  genres: string[];
  description: string;
  cast: string[];
  director?: string;
  studio?: string;
  videoUrl: string;
  trailerUrl?: string;
  seasons?: Season[];
  downloadOptions: DownloadOption[];
  featured?: boolean;
  trending?: boolean;
  isDubbed?: boolean; // For anime
  isSubtitled?: boolean;
  ageRating?: string;
}

export interface DownloadTask {
  id: string;
  mediaId: string;
  title: string;
  poster: string;
  quality: string;
  size: string;
  subtitleLanguage?: string;
  progress: number; // 0 to 100
  speedMBps: number;
  status: 'downloading' | 'paused' | 'completed' | 'error';
  episodeTitle?: string;
  downloadedBytes: number;
  totalBytes: number;
  createdAt: number;
}

export interface AdminPayoutDetails {
  paypalEmail: string;
  bankAccountName: string;
  bankIban: string;
  bankName: string;
  vodafoneNumber: string;
  usdtAddress: string;
}

export interface PayoutTransaction {
  id: string;
  amountUSD: number;
  method: 'paypal' | 'bank' | 'vodafone' | 'usdt';
  accountDetails: string;
  status: 'completed' | 'pending' | 'processing';
  date: string;
}

export interface AdUnitConfig {
  publisherId: string; // AdMob / AdSense Publisher ID (e.g. pub-9876543210123456)
  bannerAdUnitId: string; // Banner Ad Unit ID
  interstitialAdUnitId: string; // Interstitial Ad Unit ID
  rewardedAdUnitId: string; // Rewarded Ad Unit ID
  customAdScript: string; // Custom HTML/JavaScript Ad script tag (AdSense, Adsterra, PopAds, etc.)
  adminPin: string; // Owner Admin PIN code for withdrawal protection (default 1234)
  payoutDetails: AdminPayoutDetails;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  rewardedEnabled: boolean;
  nativeEnabled: boolean;
  skipDurationSec: number;
  ecpmRates: {
    banner: number; // e.g. $1.50
    interstitial: number; // e.g. $8.50
    rewarded: number; // e.g. $15.00
  };
}

export interface AdStats {
  totalImpressions: number;
  totalClicks: number;
  totalEarningsUSD: number;
  todayEarningsUSD: number;
  ctrPercent: number;
  interstitialShows: number;
  rewardedShows: number;
  bannerShows: number;
  payoutHistory?: PayoutTransaction[];
}

export interface UserReview {
  id: string;
  mediaId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}
