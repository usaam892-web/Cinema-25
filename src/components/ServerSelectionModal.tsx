import React from 'react';
import { X, Server, Check, Radio, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { MediaItem, Episode } from '../types';

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  speed: string;
  isFast: boolean;
  isPopular?: boolean;
}

export const STREAM_SERVERS: StreamServer[] = [
  { id: 'pulsestream', name: 'PulseStream', quality: '1080p FHD', speed: 'سريع جداً 🚀', isFast: true, isPopular: true },
  { id: 'lumastream', name: 'LumaStream', quality: '1080p HD', speed: 'مستقر ⚡', isFast: true },
  { id: 'zetstream', name: 'Zetstream', quality: '1080p HD', speed: 'سريع 📡', isFast: true },
  { id: 'netstream', name: 'NetStream', quality: '720p/1080p', speed: 'ممتاز 🌐', isFast: false },
  { id: 'huntstream', name: 'HuntStream', quality: '1080p 60fps', speed: 'فائق السرعة ⚡', isFast: true },
  { id: 'fluxstream', name: 'FluxStream', quality: '4K Ultra HD', speed: 'جودة فائقة 🎬', isFast: true },
];

interface ServerSelectionModalProps {
  media: MediaItem | null;
  episode?: Episode | null;
  isOpen: boolean;
  onClose: () => void;
  selectedServerId: string;
  onSelectServer: (server: StreamServer) => void;
}

export const ServerSelectionModal: React.FC<ServerSelectionModalProps> = ({
  media,
  episode,
  isOpen,
  onClose,
  selectedServerId,
  onSelectServer,
}) => {
  if (!isOpen || !media) return null;

  const title = episode ? `${media.title} - ${episode.title}` : media.title;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 dir-ltr animate-in fade-in duration-200">
      
      {/* Background Poster Preview Blur */}
      {media.backdrop && (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={media.backdrop} alt="" className="w-full h-full object-cover filter blur-xl" />
        </div>
      )}

      {/* Main Popup Container matching the provided UI */}
      <div className="relative z-10 w-full max-w-md bg-white text-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-6 border border-amber-200/50 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Mini Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-100 pr-2">
          <img src={media.poster} alt={title} className="w-10 h-14 object-cover rounded-lg shadow-md shrink-0" />
          <div className="overflow-hidden">
            <h4 className="text-xs font-black text-red-600 uppercase tracking-wide">سيرفرات البث والمشاهدة</h4>
            <h3 className="text-sm font-extrabold text-zinc-900 truncate">{title}</h3>
          </div>
        </div>

        {/* Header Title Message from user's image */}
        <div className="mb-5 text-center px-1">
          <h2 className="text-base sm:text-lg font-black text-zinc-900 leading-snug">
            If the selected server isn't working, try another one below.
          </h2>
          <p className="text-xs text-zinc-500 font-bold mt-1 dir-ltr">
            إذا كان السيرفر الحالي لا يعمل أو بطيء، اختَر سيرفر آخر من القائمة أدناه:
          </p>
        </div>

        {/* Server List - Matching the warm peach/tan rounded buttons in image */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 pl-1">
          {STREAM_SERVERS.map((server) => {
            const isSelected = selectedServerId === server.id;

            return (
              <button
                key={server.id}
                onClick={() => {
                  onSelectServer(server);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition-all transform active:scale-98 shadow-sm ${
                  isSelected
                    ? 'bg-[#fcd3a1] text-zinc-950 ring-2 ring-red-600 shadow-md font-black'
                    : 'bg-[#fde2c3] hover:bg-[#fcd3a1] text-zinc-900 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{server.name}</span>
                  {server.isPopular && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      الأسرع 🔥
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-700 bg-amber-200/60 px-2 py-0.5 rounded-lg font-mono">
                    {server.quality}
                  </span>
                  
                  {/* Server Icon matching radio icon in image */}
                  <div className="w-7 h-7 rounded-lg bg-amber-300/60 flex items-center justify-center text-zinc-800">
                    <Radio className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck className="w-4 h-4" />
            جميع السيرفرات مجانية وعالية السرعة
          </span>
          <span className="text-zinc-400 font-mono">Cinema Mix Player</span>
        </div>

      </div>

    </div>
  );
};
