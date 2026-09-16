import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import ProfessorPip from '../ProfessorPip';
import { ArrowDownCircle, RefreshCw, Sparkles, Wind, ShieldAlert, Award } from 'lucide-react';

interface GravityLabProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

type World = 'earth' | 'moon' | 'jupiter' | 'space';

interface DropItem {
  id: string;
  name: string;
  emoji: string;
  weightLabel: string;
  airDrag: number; // 0 (aerodynamic) to 1 (high drag like feather)
  floatsInAir?: boolean;
}

const DROP_ITEMS: DropItem[] = [
  { id: 'feather', name: 'Fluffy Feather', emoji: '🪶', weightLabel: 'Super Light (1g)', airDrag: 0.85 },
  { id: 'bowling', name: 'Bowling Ball', emoji: '🎳', weightLabel: 'Heavy Metal (7kg)', airDrag: 0.05 },
  { id: 'apple', name: 'Crunchy Apple', emoji: '🍎', weightLabel: 'Normal Snack (150g)', airDrag: 0.15 },
  { id: 'balloon', name: 'Helium Balloon', emoji: '🎈', weightLabel: 'Lighter than Air', airDrag: 0.6, floatsInAir: true },
  { id: 'duck', name: 'Rubber Duck', emoji: '🦆', weightLabel: 'Toy Duck (60g)', airDrag: 0.3 },
];

export default function GravityLab({ onUnlockBadge, onOpenAskPip }: GravityLabProps) {
  const [world, setWorld] = useState<World>('earth');
  const [hasAir, setHasAir] = useState<boolean>(true);
  const [itemA, setItemA] = useState<DropItem>(DROP_ITEMS[0]); // Feather
  const [itemB, setItemB] = useState<DropItem>(DROP_ITEMS[1]); // Bowling Ball

  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [posA, setPosA] = useState<number>(0); // 0 (top) to 100 (ground)
  const [posB, setPosB] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);

  const [pipMessage, setPipMessage] = useState<string>(
    "Welcome to the Gravity Drop Chamber! Pick two toys to race to the ground. Try turning the air off to see a moon astronaut secret!"
  );

  const gravityMultiplier =
    world === 'space' ? 0 : world === 'moon' ? 0.35 : world === 'jupiter' ? 2.2 : 1.0;

  const handleStartDrop = () => {
    if (isDropping) return;
    setIsDropping(true);
    setPosA(0);
    setPosB(0);
    setWinner(null);
    soundManager.playPop();

    if (world === 'space') {
      soundManager.playSpark();
      setPipMessage("Whoa! In Zero-G space, gravity is turned off! Everything floats in mid-air like an astronaut!");
      // Float gently around top
      setTimeout(() => {
        setPosA(20);
        setPosB(15);
      }, 300);
      setTimeout(() => {
        setIsDropping(false);
      }, 3000);
      return;
    }

    // Dropping simulation calculation
    let currentA = 0;
    let currentB = 0;
    let velA = 0;
    let velB = 0;

    const interval = setInterval(() => {
      // In vacuum (hasAir === false), acceleration is identical regardless of mass!
      const dragA = hasAir ? itemA.airDrag * 0.7 : 0;
      const dragB = hasAir ? itemB.airDrag * 0.7 : 0;

      // Balloon floats up if there's air!
      if (hasAir && itemA.floatsInAir) {
        currentA = Math.max(0, currentA - 1);
      } else {
        velA += (1.4 * gravityMultiplier) * (1 - dragA);
        currentA = Math.min(100, currentA + velA);
      }

      if (hasAir && itemB.floatsInAir) {
        currentB = Math.max(0, currentB - 1);
      } else {
        velB += (1.4 * gravityMultiplier) * (1 - dragB);
        currentB = Math.min(100, currentB + velB);
      }

      setPosA(currentA);
      setPosB(currentB);

      const aFinished = currentA >= 100 || (hasAir && itemA.floatsInAir && currentA <= 0);
      const bFinished = currentB >= 100 || (hasAir && itemB.floatsInAir && currentB <= 0);

      if (currentA >= 100 && currentB >= 100) {
        clearInterval(interval);
        soundManager.playDropThud(1.5);
        soundManager.playSuccess();
        setIsDropping(false);

        if (!hasAir || Math.abs(currentA - currentB) < 2) {
          setWinner('tie');
          setPipMessage(
            "LOOK! A PERFECT TIE! Without air pushing back, gravity pulls heavy and light things down at the EXACT same speed!"
          );
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
          onUnlockBadge('gravity_astronaut');
        } else if (currentA >= 100 && currentB < 100) {
          setWinner(itemA.name);
          setPipMessage(`${itemA.name} landed first because air didn't slow it down as much!`);
        } else {
          setWinner(itemB.name);
          setPipMessage(`${itemB.name} landed first! Air pushed against ${itemA.name} like an open umbrella!`);
        }
      }
    }, 40);
  };

  const handleReset = () => {
    soundManager.playPop();
    setIsDropping(false);
    setPosA(0);
    setPosB(0);
    setWinner(null);
    setPipMessage("Ready for another drop race! Try comparing with air ON vs air OFF!");
  };

  return (
    <div className="space-y-6">
      <ProfessorPip
        message={pipMessage}
        analogy="Dropping a flat sheet of paper vs a crumpled paper ball! The crumpled paper falls faster on Earth only because air has less surface to push back against!"
        onAskPipClick={onOpenAskPip}
        mood={isDropping ? 'excited' : 'happy'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Setup Controls */}
        <div className="lg:col-span-5 bg-white border border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🪐</span>
              <span>Gravity Controls</span>
            </h2>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              Physics Sandbox
            </span>
          </div>

          {/* 1. Pick World */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose a Celestial World
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'earth', name: 'Earth', icon: '🌍', desc: 'Normal 1G' },
                { id: 'moon', name: 'The Moon', icon: '🌕', desc: '1/6 Bouncy 🌙' },
                { id: 'jupiter', name: 'Jupiter', icon: '🪐', desc: 'Heavy 2.5G' },
                { id: 'space', name: 'Zero-G Space', icon: '🚀', desc: 'Floaty Zero-G' },
              ].map((w) => (
                <button
                  key={w.id}
                  id={`world-${w.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setWorld(w.id as World);
                    handleReset();
                  }}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    world === w.id
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 font-bold text-indigo-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{w.name}</div>
                    <div className="text-[10px] text-slate-500">{w.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Air vs Vacuum Chamber */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-600" />
                Air in Chamber:
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  id="air-on-btn"
                  onClick={() => {
                    soundManager.playPop();
                    setHasAir(true);
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hasAir ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Air ON 💨
                </button>
                <button
                  id="vacuum-btn"
                  onClick={() => {
                    soundManager.playPop();
                    setHasAir(false);
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !hasAir ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Vacuum (No Air!) ⭕
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              {hasAir
                ? 'Air creates friction (resistance) pushing back against falling objects.'
                : 'Secret Trick: Sucking out all the air proves gravity pulls all matter at the same speed!'}
            </p>
          </div>

          {/* 3. Pick Item A and Item B */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Drop Lane 1: Choose Item
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {DROP_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playPop();
                      setItemA(item);
                      handleReset();
                    }}
                    className={`p-2 rounded-xl border text-center flex-shrink-0 transition-all cursor-pointer ${
                      itemA.id === item.id
                        ? 'bg-amber-100 border-amber-400 font-bold ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl block">{item.emoji}</span>
                    <span className="text-[10px] text-slate-700">{item.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Drop Lane 2: Choose Opponent
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {DROP_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playPop();
                      setItemB(item);
                      handleReset();
                    }}
                    className={`p-2 rounded-xl border text-center flex-shrink-0 transition-all cursor-pointer ${
                      itemB.id === item.id
                        ? 'bg-indigo-100 border-indigo-400 font-bold ring-2 ring-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl block">{item.emoji}</span>
                    <span className="text-[10px] text-slate-700">{item.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Button */}
          <div className="pt-2 flex gap-2">
            <button
              id="drop-btn"
              onClick={handleStartDrop}
              disabled={isDropping}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-white ${
                isDropping
                  ? 'bg-indigo-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:brightness-110 active:scale-98 animate-pulse-gentle'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              <span>{isDropping ? 'Falling in Progress...' : 'RELEASE & DROP! ⬇️'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset Drop"
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Dual Drop Lanes Vacuum Chamber */}
        <div className="lg:col-span-7 bg-slate-900 border-4 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Chamber Header Tag */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CHAMBER: {world.toUpperCase()}</span>
              <span>{hasAir ? '(1 ATM AIR)' : '(VACUUM SEALED)'}</span>
            </div>
            <div className="font-bold text-amber-400 flex items-center gap-1">
              <span>Gravity: {gravityMultiplier}x</span>
            </div>
          </div>

          {/* Star background if moon or space */}
          {(world === 'moon' || world === 'space') && (
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-6 left-10 text-xs">✨</div>
              <div className="absolute top-20 right-14 text-sm">⭐</div>
              <div className="absolute top-44 left-1/3 text-xs">✨</div>
              <div className="absolute top-60 right-1/4 text-xs">⭐</div>
            </div>
          )}

          {/* Fall Lanes Area */}
          <div className="relative flex-1 my-4 flex items-stretch justify-around">
            {/* Height Tick Marks */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-[10px] font-mono text-slate-500 pointer-events-none">
              <span>10m</span>
              <span>7.5m</span>
              <span>5.0m</span>
              <span>2.5m</span>
              <span>0.0m</span>
            </div>

            {/* Lane A */}
            <div className="w-32 sm:w-40 border-x border-dashed border-slate-700/80 relative flex flex-col justify-between items-center py-2">
              <div className="text-center">
                <span className="text-xs font-bold text-amber-300 block">{itemA.name}</span>
                <span className="text-[10px] text-slate-400">{itemA.weightLabel}</span>
              </div>

              {/* Animated Falling Object A */}
              <div
                className="absolute text-4xl sm:text-5xl transition-all duration-75 ease-linear filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                style={{
                  top: `calc(${posA}% - 40px)`,
                  transform: `translateY(${posA > 0 ? 0 : 40}px) rotate(${posA * 2}deg)`,
                }}
              >
                {itemA.emoji}
              </div>

              {/* Lane A Landing Pad */}
              <div
                className={`w-full h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  posA >= 100
                    ? 'bg-amber-400 text-amber-950 shadow-[0_0_15px_#f59e0b]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {posA >= 100 ? 'LANDED! 🏁' : 'TARGET'}
              </div>
            </div>

            {/* Lane Divider */}
            <div className="w-0.5 bg-slate-800 h-full" />

            {/* Lane B */}
            <div className="w-32 sm:w-40 border-x border-dashed border-slate-700/80 relative flex flex-col justify-between items-center py-2">
              <div className="text-center">
                <span className="text-xs font-bold text-indigo-300 block">{itemB.name}</span>
                <span className="text-[10px] text-slate-400">{itemB.weightLabel}</span>
              </div>

              {/* Animated Falling Object B */}
              <div
                className="absolute text-4xl sm:text-5xl transition-all duration-75 ease-linear filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                style={{
                  top: `calc(${posB}% - 40px)`,
                  transform: `translateY(${posB > 0 ? 0 : 40}px) rotate(${-posB * 2}deg)`,
                }}
              >
                {itemB.emoji}
              </div>

              {/* Lane B Landing Pad */}
              <div
                className={`w-full h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  posB >= 100
                    ? 'bg-indigo-400 text-indigo-950 shadow-[0_0_15px_#818cf8]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {posB >= 100 ? 'LANDED! 🏁' : 'TARGET'}
              </div>
            </div>
          </div>

          {/* Outcome Banner */}
          {winner && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-center text-white text-xs sm:text-sm animate-pulse-gentle">
              {winner === 'tie' ? (
                <span className="text-amber-300 font-bold">
                  🎉 PERFECT SCIENTIFIC TIE! Both hit the ground at the same moment!
                </span>
              ) : (
                <span>
                  🏆 <strong className="text-amber-300">{winner}</strong> reached the ground first!
                </span>
              )}
            </div>
          )}

          {/* Real Moon Fact Badge */}
          <div className="mt-2 bg-indigo-950/60 border border-indigo-800/60 rounded-xl p-2.5 text-[11px] text-indigo-200 flex items-center gap-2">
            <span className="text-base">🚀</span>
            <div>
              <strong>Astronaut Apollo 15 Secret:</strong> In 1971 on the Moon, astronaut David Scott dropped a real falcon feather and a hammer. With no air, they hit the lunar ground side-by-side!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
