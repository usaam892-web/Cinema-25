import React, { useState, useRef } from 'react';
import { X, Plus, Film, Image as ImageIcon, Link as LinkIcon, Star, Calendar, Clock, Tv, Sparkles, CheckCircle2, Trash2, Tag, Play, Upload, Smartphone, FolderOpen, Video } from 'lucide-react';
import { MediaItem, MediaType, DownloadOption } from '../types';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedia: (newMedia: MediaItem) => void;
  existingMediaCount: number;
}

const POPULAR_GENRES = [
  'أكشن', 'دراما', 'خيال علمي', 'إثارة', 'غموض', 'مغامرة', 
  'كوميديا', 'رعب', 'جريمة', 'فانتزيا', 'رومانسية', 'أنيميشن', 'شريحة من الحياة'
];

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  onAddMedia,
  existingMediaCount,
}) => {
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  
  // Poster source state
  const [posterMode, setPosterMode] = useState<'gallery' | 'url'>('gallery');
  const [posterUrl, setPosterUrl] = useState('');
  const [localPosterFile, setLocalPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  
  // Video source state
  const [videoMode, setVideoMode] = useState<'gallery' | 'url'>('gallery');
  const [videoUrl, setVideoUrl] = useState('');
  const [localVideoFile, setLocalVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoFileSize, setVideoFileSize] = useState('');

  const [backdrop, setBackdrop] = useState('');
  const [rating, setRating] = useState('8.5');
  const [year, setYear] = useState('2024');
  const [duration, setDuration] = useState('2 س 15 د');
  const [description, setDescription] = useState('');
  const [cast, setCast] = useState('');
  const [director, setDirector] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['أكشن', 'دراما']);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);

  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Default preset posters if user leaves them blank
  const PRESET_POSTERS = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  ];

  if (!isOpen) return null;

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Handle image file selection from gallery
  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة صالحة (JPG, PNG, WEBP)');
        return;
      }
      setLocalPosterFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPosterPreview(fileUrl);
    }
  };

  // Handle video file selection from gallery
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('الرجاء اختيار ملف فيديو صالح (MP4, MKV, AVI, MOV)');
        return;
      }
      setLocalVideoFile(file);
      setVideoFileName(file.name);
      
      // Calculate readable file size
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setVideoFileSize(sizeMB + ' MB');

      const fileUrl = URL.createObjectURL(file);
      setVideoPreview(fileUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('الرجاء كتابة عنوان الفيلم أو العمل السينمائي');
      return;
    }

    // Determine final poster
    let finalPoster = '';
    if (posterMode === 'gallery' && posterPreview) {
      finalPoster = posterPreview;
    } else if (posterMode === 'url' && posterUrl.trim()) {
      finalPoster = posterUrl.trim();
    } else {
      finalPoster = PRESET_POSTERS[Math.floor(Math.random() * PRESET_POSTERS.length)];
    }

    const finalBackdrop = backdrop.trim() || finalPoster;

    // Determine final video URL
    let finalVideoUrl = '';
    if (videoMode === 'gallery' && videoPreview) {
      finalVideoUrl = videoPreview;
    } else if (videoMode === 'url' && videoUrl.trim()) {
      finalVideoUrl = videoUrl.trim();
    } else {
      finalVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
    }

    const downloadOptions: DownloadOption[] = [
      { quality: '1080p Full HD', size: videoFileSize || '1.8 GB', format: 'MP4' },
      { quality: '720p HD', size: '950 MB', format: 'MP4' },
    ];

    const newItem: MediaItem = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      originalTitle: originalTitle.trim() || title.trim(),
      type,
      poster: finalPoster,
      backdrop: finalBackdrop,
      rating: parseFloat(rating) || 8.5,
      year: parseInt(year) || 2024,
      duration: type === 'movie' ? duration : undefined,
      episodesCount: type !== 'movie' ? 12 : undefined,
      seasonsCount: type !== 'movie' ? 1 : undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : ['سينما'],
      description: description.trim() || 'فيلم تم رفعه من الهاتف.',
      cast: cast.trim() ? cast.split(',').map((s) => s.trim()) : ['ممثل رئيسي'],
      director: director.trim() || undefined,
      videoUrl: finalVideoUrl,
      downloadOptions,
      featured,
      trending,
    };

    onAddMedia(newItem);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
      // Reset Form
      setTitle('');
      setOriginalTitle('');
      setDescription('');
      setPosterUrl('');
      setPosterPreview('');
      setLocalPosterFile(null);
      setVideoUrl('');
      setVideoPreview('');
      setLocalVideoFile(null);
      setVideoFileName('');
      setVideoFileSize('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 dir-ltr">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-red-600/40 rounded-3xl overflow-hidden shadow-2xl my-auto text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-black/80 border-b border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">إضافة فيلم من الهاتف أو المعرض</h2>
              <p className="text-xs text-zinc-400">اختر فيديو وصورة البوستر مباشرة من الاستوديو أو أدخل الروابط</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {successMessage && (
            <div className="bg-emerald-950 border border-emerald-500/60 p-4 rounded-2xl text-emerald-300 text-sm font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>تم رفع وإضافة الفيلم بنجاح! جاهز للعرض والتشغيل الآن.</span>
            </div>
          )}

          {/* Title & Original Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">اسم الفيلم / العمل السينمائي *</label>
              <input
                type="text"
                required
                placeholder="مثال: فيلمي المفضل / رحلة الصحراء"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 dir-ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">الاسم الأصلي / الإنجليزي (اختياري)</label>
              <input
                type="text"
                placeholder="مثال: My Gallery Movie"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 dir-ltr text-right"
              />
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2">نوع العمل:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'movie', label: 'فيلم سينمائي 🎬' },
                { id: 'series', label: 'مسلسل تلفزيوني 📺' },
                { id: 'anime', label: 'أنمي ياباني ⛩️' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setType(item.id as MediaType)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    type === item.id
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                      : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. SECTION: Video File or URL Selection */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                <span>ملف الفيديو (من الهاتف أو المعرض):</span>
              </label>

              {/* Mode switch */}
              <div className="flex bg-black p-1 rounded-xl border border-zinc-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setVideoMode('gallery')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    videoMode === 'gallery'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>معرض الهاتف 📱</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode('url')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    videoMode === 'url'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>رابط URL 🌐</span>
                </button>
              </div>
            </div>

            {videoMode === 'gallery' ? (
              <div>
                <input
                  type="file"
                  ref={videoFileInputRef}
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                {!videoPreview ? (
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-red-600/40 hover:border-red-500 bg-black/60 hover:bg-black/90 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform mb-3">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-extrabold text-white">اضغط هنا لاختيار فيديو من المعرض / الذاكرة 📁</p>
                    <p className="text-[10px] text-zinc-400 mt-1">يدعم جميع صيغ الفيديو: MP4, MKV, MOV, WebM</p>
                  </div>
                ) : (
                  <div className="bg-black border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                        <Film className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-white truncate dir-ltr">{videoFileName || 'فيديو من الهاتف'}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">الحجم: {videoFileSize || 'جاهز التشغيل'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 rounded-xl transition-all"
                      >
                        تغيير الفيديو 🔄
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalVideoFile(null);
                          setVideoPreview('');
                          setVideoFileName('');
                        }}
                        className="p-1.5 bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                placeholder="https://... (رابط فيديو MP4 أو سيرفر تشغيل مباشر)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 dir-ltr text-right"
              />
            )}
          </div>

          {/* 2. SECTION: Poster Image File or URL Selection */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>صورة بوستر الفيلم (Poster):</span>
              </label>

              {/* Mode switch */}
              <div className="flex bg-black p-1 rounded-xl border border-zinc-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPosterMode('gallery')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    posterMode === 'gallery'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>استوديو الصور 🖼️</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPosterMode('url')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    posterMode === 'url'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>رابط URL 🌐</span>
                </button>
              </div>
            </div>

            {posterMode === 'gallery' ? (
              <div>
                <input
                  type="file"
                  ref={posterFileInputRef}
                  accept="image/*"
                  onChange={handlePosterFileChange}
                  className="hidden"
                />

                {!posterPreview ? (
                  <div
                    onClick={() => posterFileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-black/60 hover:bg-black/90 rounded-2xl p-5 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-2">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-extrabold text-white">اختر صورة البوستر من المعرض / الاستوديو 🖼️</p>
                    <p className="text-[10px] text-zinc-400 mt-1">يدعم JPG, PNG, WEBP</p>
                  </div>
                ) : (
                  <div className="bg-black border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={posterPreview}
                        alt="Poster Preview"
                        className="w-12 h-16 object-cover rounded-xl border border-zinc-700 shadow-md"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-emerald-400">تم اختيار صورة البوستر بنجاح ✓</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">جاهزة للعرض كغلاف رئيسي</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => posterFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 rounded-xl transition-all"
                      >
                        تغيير الصورة 🔄
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalPosterFile(null);
                          setPosterPreview('');
                        }}
                        className="p-1.5 bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                placeholder="https://images.unsplash.com/... (رابط الصورة)"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 dir-ltr text-right"
              />
            )}
          </div>

          {/* Year, Rating, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">سنة الإنتاج</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">التقييم (من 10)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">المدة / عدد الحلقات</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2 س 10 د"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 dir-ltr"
              />
            </div>
          </div>

          {/* Genre Chips Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2">التصنيفات والأنواع (اختر المفضل):</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenreToggle(g)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">قصة وملخص العمل</label>
            <textarea
              rows={3}
              placeholder="اكتب ملخص القصة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 dir-ltr"
            />
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">طاقم التمثيل (افصل بينهم بفاصلة)</label>
              <input
                type="text"
                placeholder="ممثل 1, ممثل 2, ممثل 3"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 dir-ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">المخرج</label>
              <input
                type="text"
                placeholder="اسم المخرج"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 dir-ltr"
              />
            </div>
          </div>

          {/* Featured & Trending Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span>عرض في البانر الرئيسي العريض (Featured Hero)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-200">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span>إضافة لشريط الأكثر رواجاً (Trending)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/40 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>نشر الفيلم الآن 🚀</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

