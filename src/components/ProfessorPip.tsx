import { useState } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ProfessorPipProps {
  message: string;
  analogy?: string;
  onAskPipClick?: () => void;
  mood?: "happy" | "thinking" | "excited" | "curious";
}

export default function ProfessorPip({
  message,
  analogy,
  onAskPipClick,
  mood = "happy",
}: ProfessorPipProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    soundManager.playPop();
    const fullText = analogy ? `${message}. Here is how to picture it: ${analogy}` : message;
    setIsSpeaking(true);
    soundManager.speak(fullText);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 4000);
  };

  const stopSpeaking = () => {
    soundManager.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="relative bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 shadow-sm backdrop-blur-sm transition-all hover:border-amber-300">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Animated Professor Pip Robot Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-1 shadow-md flex items-center justify-center animate-pulse-gentle">
            <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center p-1 relative overflow-hidden">
              {/* Antenna */}
              <div className="absolute top-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
              
              {/* Robot Face Screen */}
              <div className="flex items-center gap-1.5 mb-1 mt-1">
                {/* Left Eye */}
                <div className={`w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] transition-transform ${mood === 'excited' ? 'scale-125' : ''}`}>
                  <div className="w-1 h-1 bg-white rounded-full ml-0.5 mt-0.5" />
                </div>
                {/* Right Eye */}
                <div className={`w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] transition-transform ${mood === 'excited' ? 'scale-125' : ''}`}>
                  <div className="w-1 h-1 bg-white rounded-full ml-0.5 mt-0.5" />
                </div>
              </div>
              {/* Robot Mouth */}
              <div className={`h-1 rounded-full bg-amber-300 transition-all ${
                isSpeaking 
                  ? 'w-4 h-2 rounded-lg bg-emerald-400 animate-pulse' 
                  : mood === 'excited' 
                  ? 'w-4 h-1.5 rounded-b-md' 
                  : 'w-3'
              }`} />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-white border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs text-amber-800">
            Pip
          </span>
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Professor Pip says:
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Easy Science
              </span>
            </div>

            {/* Read Aloud Button for Young Learners */}
            <div className="flex items-center gap-1.5">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  title="Stop reading"
                  className="flex items-center gap-1 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </button>
              ) : (
                <button
                  onClick={handleSpeak}
                  title="Read aloud"
                  className="flex items-center gap-1 text-xs font-semibold bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-bold text-[11px]">Read to me!</span>
                </button>
              )}

              {onAskPipClick && (
                <button
                  onClick={() => {
                    soundManager.playPop();
                    onAskPipClick();
                  }}
                  className="flex items-center gap-1 text-xs font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Ask Pip a Question</span>
                  <span className="sm:hidden">Ask</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
            {message}
          </p>

          {analogy && (
            <div className="mt-2 text-xs sm:text-sm bg-white/80 border border-amber-200 rounded-xl px-3 py-1.5 text-amber-900 flex items-start gap-1.5">
              <span className="font-bold text-amber-700 flex-shrink-0">Think of it like:</span>
              <span>{analogy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
