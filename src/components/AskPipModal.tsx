import { useState } from 'react';
import { soundManager } from '../utils/audio';
import { X, Send, Sparkles, Volume2, VolumeX, Bot, Lightbulb, Loader2 } from 'lucide-react';

interface AskPipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStationName?: string;
}

const WONDER_QUESTIONS = [
  "Why is the sky bright blue? ☀️",
  "Why do volcanoes shoot bubbly lava? 🌋",
  "Why do things fall down instead of up? 🍎",
  "How do birds fly in the sky? 🦅",
  "Why does ice float in my juice cup? 🧊",
  "How do rainbow colors appear in rain? 🌈",
];

export default function AskPipModal({ isOpen, onClose, currentStationName }: AskPipModalProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (qText?: string) => {
    const textToSend = qText || question;
    if (!textToSend.trim()) return;

    soundManager.playPop();
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/ask-pip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          experimentContext: currentStationName,
        }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.fallback || "That is an awesome question! Science is everywhere!");
      soundManager.playSuccess();
    } catch (err) {
      setAnswer("Professor Pip's antennae got a little tickled! Try asking another wonder question!");
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!answer) return;
    soundManager.playPop();
    setIsSpeaking(true);
    soundManager.speak(answer);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
  };

  const handleStopSpeaking = () => {
    soundManager.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
              🤖
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span>Ask Professor Pip</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </h2>
              <p className="text-xs text-slate-500">
                Kid-friendly AI science buddy with simple analogies
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleStopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Wonder Question Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tap a Curious Wonder Question:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {WONDER_QUESTIONS.map((wonder, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(wonder);
                  handleAsk(wonder);
                }}
                disabled={loading}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 font-medium px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer text-left"
              >
                {wonder}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Question Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Or Type Any Question:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. Why do stars twinkle at night?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Ask</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pip's AI Answer Card */}
        {answer && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3 animate-pulse-gentle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Professor Pip's Answer:
                </span>
              </div>

              {isSpeaking ? (
                <button
                  onClick={handleStopSpeaking}
                  className="flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleReadAloud}
                  className="flex items-center gap-1 text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read to me!</span>
                </button>
              )}
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
              {answer}
            </p>
          </div>
        )}

        {/* Footer Guidance */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              handleStopSpeaking();
              onClose();
            }}
            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Done Asking
          </button>
        </div>
      </div>
    </div>
  );
}
