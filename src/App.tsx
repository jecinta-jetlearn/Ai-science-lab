/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LabId, Badge } from './types';
import { LAB_STATIONS, INITIAL_BADGES } from './data/labData';
import { soundManager } from './utils/audio';

import Navbar from './components/Navbar';
import VolcanoLab from './components/labs/VolcanoLab';
import GravityLab from './components/labs/GravityLab';
import CircuitLab from './components/labs/CircuitLab';
import RocketLab from './components/labs/RocketLab';
import CritterLab from './components/labs/CritterLab';
import QuizArena from './components/QuizArena';
import BadgesModal from './components/BadgesModal';
import AskPipModal from './components/AskPipModal';

export default function App() {
  const [currentLab, setCurrentLab] = useState<LabId>('volcano');
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('junior_science_badges');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BADGES;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isAskPipModalOpen, setIsAskPipModalOpen] = useState(false);

  // Save badges on update
  useEffect(() => {
    try {
      localStorage.setItem('junior_science_badges', JSON.stringify(badges));
    } catch {}
  }, [badges]);

  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b))
    );
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.setSoundEnabled(nextState);
  };

  const currentStation = LAB_STATIONS.find((s) => s.id === currentLab) || LAB_STATIONS[0];
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Top Navigation Bar */}
      <Navbar
        currentLab={currentLab}
        onSelectLab={(id) => setCurrentLab(id)}
        unlockedBadgesCount={unlockedBadgesCount}
        totalBadgesCount={badges.length}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenAskPip={() => setIsAskPipModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Lab Station Title Banner */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl ${currentStation.themeColor.bg} border-2 ${currentStation.themeColor.border} flex items-center justify-center text-3xl shadow-xs`}>
              {currentStation.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
                  {currentStation.title}
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${currentStation.themeColor.bg} ${currentStation.themeColor.text}`}>
                  {currentStation.ageTag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {currentStation.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Lab Explorer Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAskPipModalOpen(true)}
              className="py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>🤖</span>
              <span>Ask Pip a Question</span>
            </button>
          </div>
        </div>

        {/* Dynamic Lab Station Content */}
        {currentLab === 'volcano' && (
          <VolcanoLab
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}

        {currentLab === 'gravity' && (
          <GravityLab
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}

        {currentLab === 'circuit' && (
          <CircuitLab
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}

        {currentLab === 'rocket' && (
          <RocketLab
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}

        {currentLab === 'critter' && (
          <CritterLab
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}

        {currentLab === 'quiz' && (
          <QuizArena
            onUnlockBadge={handleUnlockBadge}
            onOpenAskPip={() => setIsAskPipModalOpen(true)}
          />
        )}
      </main>

      {/* Footer for Parents & Teachers */}
      <footer className="mt-auto border-t border-amber-200/80 bg-white/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧪</span>
            <span>
              <strong>Junior AI Science Lab:</strong> Designed for curious young learners (ages 5-9) to touch, discover, and learn real science without confusing jargon.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBadgesModalOpen(true)}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Junior Scientist Certificate
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAskPipModalOpen(true)}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Ask Professor Pip
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
      />

      <AskPipModal
        isOpen={isAskPipModalOpen}
        onClose={() => setIsAskPipModalOpen(false)}
        currentStationName={currentStation.shortTitle}
      />
    </div>
  );
}
