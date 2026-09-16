import { useState } from 'react';
import { Badge } from '../types';
import { soundManager } from '../utils/audio';
import { X, Award, CheckCircle2, Lock, Sparkles, Printer } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export default function BadgesModal({ isOpen, onClose, badges }: BadgesModalProps) {
  const [childName, setChildName] = useState('Super Scientist');
  const [showCertificate, setShowCertificate] = useState(false);

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
              🎖️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Junior Scientist Badge Book
              </h2>
              <p className="text-xs text-slate-500">
                Unlocked {unlockedCount} of {badges.length} Discovery Badges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate preview button */}
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-xs font-bold text-amber-900">Official Junior Scientist Diploma</div>
              <div className="text-[11px] text-amber-700">Put your name on your science certificate!</div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              setShowCertificate(!showCertificate);
            }}
            className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {showCertificate ? 'View Badges' : 'View Certificate'}
          </button>
        </div>

        {showCertificate ? (
          /* Printable Kid Science Certificate */
          <div className="border-8 border-double border-amber-400 bg-amber-50/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-inner relative">
            <div className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              Official Award of Curiosity
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              JUNIOR SCIENTIST CERTIFICATE
            </h3>

            <p className="text-xs sm:text-sm text-slate-600">
              This prestigious certificate is proudly presented to:
            </p>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter young learner name"
                className="w-full text-center text-xl sm:text-2xl font-bold font-display text-amber-900 border-b-2 border-amber-400 bg-transparent focus:outline-none pb-1"
              />
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              For fearless scientific curiosity in erupting giant chemical volcanoes, testing gravity across planets, completing electric circuits, launching stomp rockets, and engineering animal wonders!
            </p>

            <div className="pt-4 flex items-center justify-around border-t border-amber-200 text-xs">
              <div>
                <span className="text-xl">🤖</span>
                <div className="font-bold text-slate-800">Professor Pip</div>
                <div className="text-[10px] text-slate-500">Chief Science Bot</div>
              </div>
              <div className="text-2xl font-bold text-amber-500">
                ⭐ ⭐ ⭐
              </div>
              <div>
                <span className="text-xl">🧪</span>
                <div className="font-bold text-slate-800">Junior AI Lab</div>
                <div className="text-[10px] text-slate-500">Certified Explorer</div>
              </div>
            </div>
          </div>
        ) : (
          /* Badges Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl sm:text-4xl flex-shrink-0">
                  {badge.unlocked ? badge.emoji : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-800">
                      {badge.title}
                    </h4>
                    {badge.unlocked ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded-full">
                        <Lock className="w-2.5 h-2.5" />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Back to Experiments
          </button>
        </div>
      </div>
    </div>
  );
}
