import { LabId } from '../types';
import { LAB_STATIONS } from '../data/labData';
import { Award, Volume2, VolumeX, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentLab: LabId;
  onSelectLab: (id: LabId) => void;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  onOpenBadges: () => void;
  onOpenAskPip: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function Navbar({
  currentLab,
  onSelectLab,
  unlockedBadgesCount,
  totalBadgesCount,
  onOpenBadges,
  onOpenAskPip,
  soundEnabled,
  onToggleSound,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Kid-Friendly Identity */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => onSelectLab('volcano')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-xl shadow-xs animate-pulse-gentle">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-800">
                  Junior AI Science Lab
                </h1>
                <span className="hidden md:inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Kids Edition
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Touch, explore, and discover real science superpowers!
              </p>
            </div>
          </div>

          {/* Quick Actions (Badges, Ask Pip, Sound) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ask Pip AI Assistant button */}
            <button
              id="ask-pip-nav-btn"
              onClick={() => {
                soundManager.playPop();
                onOpenAskPip();
              }}
              className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <MessageCircleQuestion className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Ask Pip AI</span>
              <span className="sm:hidden">Ask Pip</span>
            </button>

            {/* Badges Modal Trigger */}
            <button
              id="open-badges-btn"
              onClick={() => {
                soundManager.playPop();
                onOpenBadges();
              }}
              className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span className="hidden md:inline">My Badges:</span>
              <span className="bg-purple-200 text-purple-900 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {unlockedBadgesCount}/{totalBadgesCount}
              </span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Lab Stations Navigation Scrollable Carousel */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2.5 pb-1 no-scrollbar scroll-smooth">
          {LAB_STATIONS.map((station) => {
            const isActive = currentLab === station.id;
            return (
              <button
                key={station.id}
                id={`lab-tab-${station.id}`}
                onClick={() => {
                  soundManager.playPop();
                  onSelectLab(station.id);
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                  isActive
                    ? `${station.themeColor.bg} ${station.themeColor.border} ${station.themeColor.text} shadow-xs ring-2 ring-amber-300/60 scale-[1.02]`
                    : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-base sm:text-lg">{station.icon}</span>
                <span className="whitespace-nowrap">{station.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
