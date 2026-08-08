import React from 'react';
import { Download, Pause, Play, Trash2, CheckCircle2, FileVideo, HardDrive, Zap, ExternalLink, RefreshCw, Languages, ArrowRight, X } from 'lucide-react';
import { DownloadTask } from '../types';

interface DownloadManagerProps {
  tasks: DownloadTask[];
  onPauseTask: (id: string) => void;
  onResumeTask: (id: string) => void;
  onCancelTask: (id: string) => void;
  onPlayDownloadedFile: (mediaTitle: string) => void;
  onExit?: () => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  tasks,
  onPauseTask,
  onResumeTask,
  onCancelTask,
  onPlayDownloadedFile,
  onExit,
}) => {
  const activeTasks = tasks.filter((t) => t.status === 'downloading' || t.status === 'paused');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const triggerRealFileDownload = (task: DownloadTask) => {
    // Generate a downloadable dummy/video blob for testing local file save
    const dummyData = `CineMax Offline Media File\nTitle: ${task.title}\nQuality: ${task.quality}\nSubtitle: ${task.subtitleLanguage || 'العربية 🇸🇦'}\nSize: ${task.size}\nDate: ${new Date().toLocaleString()}`;
    const blob = new Blob([dummyData], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.title.replace(/[^a-zA-Z0-01-90-9\u0600-\u06FF]/g, '_')}_${task.quality}_sub.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 dir-ltr text-slate-100">
      
      {/* Title Header with Exit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Download className="w-7 h-7 text-red-500" />
            <span>مدير التحميلات والترتيب</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تابع عمليات التنزيل النشطة والملفات المكتملة المحفوظة في الجهاز
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>المساحة: 124.5 GB</span>
          </div>

          {/* Exit / Return Button (مكان الخروج من صفحة التحميلات) */}
          {onExit && (
            <button
              onClick={onExit}
              className="bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-white border border-red-600/40 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
              title="إغلاق والعودة للرئيسية"
            >
              <ArrowRight className="w-4 h-4 text-red-500" />
              <span>خروج للرئيسية</span>
              <X className="w-3.5 h-3.5 mr-1 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Active Downloads Section */}
      <div className="mb-10">
        <h2 className="text-base font-extrabold text-slate-200 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>التحميلات الجارية ({activeTasks.length})</span>
        </h2>

        {activeTasks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            لا توجد عمليات تحميل جارية حالياً. اختر أي فيلم أو مسلسل واضغط على "تحميل"!
          </div>
        ) : (
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={task.poster} alt={task.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-amber-400 font-bold">{task.quality}</span>
                        <span>•</span>
                        <span>{task.size}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{task.speedMBps} MB/s</span>
                        {task.subtitleLanguage && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 border border-slate-700">
                              <Languages className="w-3 h-3 text-red-400" />
                              {task.subtitleLanguage}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'downloading' ? (
                      <button
                        onClick={() => onPauseTask(task.id)}
                        className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700"
                        title="إيقاف مؤقت"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onResumeTask(task.id)}
                        className="p-2 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700"
                        title="استئناف"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onCancelTask(task.id)}
                      className="p-2 rounded-xl bg-slate-800 text-red-400 hover:bg-slate-700"
                      title="إلغاء التحميل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>التقدم: {Math.round(task.progress)}%</span>
                    <span>{task.status === 'paused' ? 'متوقف مؤقتاً' : 'جارٍ التنزيل...'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        task.status === 'paused' ? 'bg-amber-500' : 'bg-gradient-to-r from-red-600 to-amber-500'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Downloads Section */}
      <div>
        <h2 className="text-base font-extrabold text-slate-200 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>الملفات المكتملة في الجهاز ({completedTasks.length})</span>
        </h2>

        {completedTasks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            لم يكتمل أي تحميل بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={task.poster} alt={task.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="text-emerald-400 font-bold">{task.quality}</span>
                      <span>•</span>
                      <span>{task.size}</span>
                      <span>•</span>
                      <span className="text-slate-500">مكتمل</span>
                      {task.subtitleLanguage && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 border border-slate-700">
                            <Languages className="w-3 h-3 text-red-400" />
                            {task.subtitleLanguage}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerRealFileDownload(task)}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>حفظ كملف</span>
                  </button>

                  <button
                    onClick={() => onPlayDownloadedFile(task.title)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>تشغيل</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
