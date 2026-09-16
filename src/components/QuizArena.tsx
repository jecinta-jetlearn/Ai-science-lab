import { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { QUIZ_QUESTIONS } from '../data/labData';
import ProfessorPip from './ProfessorPip';
import { Star, CheckCircle, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface QuizArenaProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

export default function QuizArena({ onUnlockBadge, onOpenAskPip }: QuizArenaProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    setShowExplanation(true);

    const option = question.options[idx];
    if (option.isCorrect) {
      soundManager.playSuccess();
      setScore((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } else {
      soundManager.playPop();
    }
  };

  const handleNext = () => {
    soundManager.playPop();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      soundManager.playSuccess();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      onUnlockBadge('junior_detective');
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <ProfessorPip
        message={
          isCompleted
            ? `INCREDIBLE WORK! You answered all the science challenges and earned ${score} Stars! You are officially a Junior Scientist!`
            : "Welcome to Guess What Happens! Test your scientific detective superpowers with these fun questions!"
        }
        analogy="Science is all about guessing (making a hypothesis) and testing to see what happens!"
        onAskPipClick={onOpenAskPip}
        mood={isCompleted ? 'excited' : 'happy'}
      />

      <div className="max-w-3xl mx-auto bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Progress & Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Guess What Happens!
              </h2>
              <span className="text-xs text-purple-700 font-semibold">
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-bold text-purple-900">
              {score} Stars Earned
            </span>
          </div>
        </div>

        {/* Finished State */}
        {isCompleted ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-purple-500 p-1 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl">
                🏆
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">
                You are a Certified Junior Scientist!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                You scored {score} out of {QUIZ_QUESTIONS.length} correct answers. Keep exploring and asking curious wonder questions!
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question State */
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {question.question}
              </h3>
              <p className="text-xs sm:text-sm text-purple-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span><strong>Hint:</strong> {question.hint}</span>
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = "bg-slate-50 border-slate-200 hover:bg-purple-50/50 hover:border-purple-300 text-slate-800";

                if (selectedOption !== null) {
                  if (option.isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-50 border-rose-300 text-rose-950";
                  } else {
                    btnStyle = "opacity-50 bg-slate-50 border-slate-200 text-slate-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-opt-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer text-sm sm:text-base font-semibold ${btnStyle}`}
                  >
                    <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                    <span className="flex-1">{option.text}</span>
                    {selectedOption !== null && option.isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {showExplanation && selectedOption !== null && (
              <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 space-y-2 animate-pulse-gentle">
                <div className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <span>💡 Science Detective Note:</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-950">
                  {question.options[selectedOption].explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    id="quiz-next-btn"
                    onClick={handleNext}
                    className="py-2.5 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Challenge' : 'See Certificate!'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
