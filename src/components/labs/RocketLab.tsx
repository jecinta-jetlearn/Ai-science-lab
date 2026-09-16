import { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import ProfessorPip from '../ProfessorPip';
import { Rocket, Sparkles, RefreshCw, Send, ArrowUp, Compass } from 'lucide-react';

interface RocketLabProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

type RocketColor = 'blue' | 'red' | 'yellow' | 'purple';
type NoseCone = 'pointy' | 'round';
type FinStyle = 'delta' | 'mini';

export default function RocketLab({ onUnlockBadge, onOpenAskPip }: RocketLabProps) {
  const [color, setColor] = useState<RocketColor>('blue');
  const [noseCone, setNoseCone] = useState<NoseCone>('pointy');
  const [fins, setFins] = useState<FinStyle>('delta');
  const [stompCount, setStompCount] = useState<number>(3); // 1 to 5

  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [altitude, setAltitude] = useState<number>(0); // 0 to 100%
  const [maxAltitudeMeters, setMaxAltitudeMeters] = useState<number>(0);
  const [currentMilestone, setCurrentMilestone] = useState<string>('Ground Launch Pad');
  const [countdown, setCountdown] = useState<number | null>(null);

  const [pipMessage, setPipMessage] = useState<string>(
    "Welcome to the Stomp Rocket Launch Pad! Tap the Stomp Pad to pump air pressure into the rocket, then tap Countdown to Blastoff!"
  );

  const handleStomp = () => {
    if (isLaunching) return;
    soundManager.playBubble();
    setStompCount((prev) => (prev < 5 ? prev + 1 : 1));
  };

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setAltitude(0);
    setMaxAltitudeMeters(0);

    // Calculate flight height: base + stomps + aerodynamics
    const baseMeters = stompCount * 120;
    const aeroBonus = noseCone === 'pointy' ? 40 : -20;
    const finBonus = fins === 'delta' ? 30 : 10;
    const totalMeters = Math.max(25, baseMeters + aeroBonus + finBonus);

    // 3, 2, 1 Countdown
    setCountdown(3);
    soundManager.playPop();

    setTimeout(() => {
      setCountdown(2);
      soundManager.playPop();
    }, 800);

    setTimeout(() => {
      setCountdown(1);
      soundManager.playPop();
    }, 1600);

    setTimeout(() => {
      setCountdown(null);
      soundManager.playRocketLaunch();
      setPipMessage("WHOOOOOSH! Look at that rocket blast straight into the sky! Air pressure in action!");

      // Flight ascent animation
      let currentAlt = 0;
      const interval = setInterval(() => {
        currentAlt += 2;
        setAltitude(currentAlt);

        // Calculate milestone reached
        const approxM = Math.round((currentAlt / 100) * totalMeters);
        setMaxAltitudeMeters(approxM);

        if (approxM >= 500) setCurrentMilestone("🛰️ Outer Space Orbit!");
        else if (approxM >= 300) setCurrentMilestone("✈️ Passenger Jet Altitude!");
        else if (approxM >= 150) setCurrentMilestone("☁️ Fluffy White Clouds!");
        else if (approxM >= 60) setCurrentMilestone("🌲 Taller than Big Trees!");
        else if (approxM >= 20) setCurrentMilestone("🦒 Taller than a Giraffe!");
        else setCurrentMilestone("🚀 Leaving Launch Pad!");

        if (currentAlt >= 100) {
          clearInterval(interval);
          soundManager.playSuccess();
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.5 },
          });
          onUnlockBadge('rocket_pilot');

          setPipMessage(
            `SPECTACULAR FLIGHT! Reached ${totalMeters} meters (${currentMilestone})! Pushing air down kicked your rocket sky high!`
          );

          // Parachute gentle float down after celebration
          setTimeout(() => {
            setIsLaunching(false);
          }, 3500);
        }
      }, 50);
    }, 2400);
  };

  const handleReset = () => {
    soundManager.playPop();
    setIsLaunching(false);
    setAltitude(0);
    setMaxAltitudeMeters(0);
    setCountdown(null);
    setCurrentMilestone('Ground Launch Pad');
    setPipMessage("Ready for another stomp blast! Try changing the nose cone or stomping more air!");
  };

  return (
    <div className="space-y-6">
      <ProfessorPip
        message={pipMessage}
        analogy="Letting go of a blown-up balloon! When you open your fingers, air rushes backward, shooting the balloon forward across the room!"
        onAskPipClick={onOpenAskPip}
        mood={isLaunching ? 'excited' : 'happy'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Stomp Rocket Customizer */}
        <div className="lg:col-span-5 bg-white border border-sky-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🚀</span>
              <span>Rocket Workshop</span>
            </h2>
            <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
              Aerodynamics
            </span>
          </div>

          {/* 1. Stomp Air Pressure Pump */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                1. Air Stomp Pressure
              </span>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                {stompCount} Stomps = {stompCount * 20} PSI
              </span>
            </div>

            {/* Tap to stomp button */}
            <button
              id="stomp-pad-btn"
              onClick={handleStomp}
              disabled={isLaunching}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-bold rounded-xl shadow-xs border-2 border-amber-500 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-2xl animate-bounce">🦶</span>
              <span>STOMP AIR PUMP! (Tap to add pressure)</span>
            </button>

            {/* Visual Stomp Gauge */}
            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`flex-1 h-3 rounded-full transition-all ${
                    level <= stompCount ? 'bg-amber-500 shadow-xs' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-amber-800">
              More stomps = more compressed air rushing out of the launch nozzle!
            </p>
          </div>

          {/* 2. Choose Nose Cone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Nose Cone Aerodynamics
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="nose-pointy"
                onClick={() => {
                  soundManager.playPop();
                  setNoseCone('pointy');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  noseCone === 'pointy'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 font-bold text-sky-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-2xl">▲</span>
                <div>
                  <div className="text-xs font-bold">Pointy Cone</div>
                  <div className="text-[10px] text-slate-500">Cuts through air like a dart!</div>
                </div>
              </button>

              <button
                id="nose-round"
                onClick={() => {
                  soundManager.playPop();
                  setNoseCone('round');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  noseCone === 'round'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 font-bold text-sky-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-2xl">●</span>
                <div>
                  <div className="text-xs font-bold">Round Dome</div>
                  <div className="text-[10px] text-slate-500">Friendly space capsule!</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Choose Fins */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Stabilizer Fins
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="fin-delta"
                onClick={() => {
                  soundManager.playPop();
                  setFins('delta');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  fins === 'delta'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 font-bold text-sky-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-2xl">📐</span>
                <div>
                  <div className="text-xs font-bold">Delta Wings</div>
                  <div className="text-[10px] text-slate-500">Super steady straight flight</div>
                </div>
              </button>

              <button
                id="fin-mini"
                onClick={() => {
                  soundManager.playPop();
                  setFins('mini');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  fins === 'mini'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 font-bold text-sky-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-xs font-bold">Mini Speed Fins</div>
                  <div className="text-[10px] text-slate-500">Fast zoom!</div>
                </div>
              </button>
            </div>
          </div>

          {/* Color Switcher */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700">Rocket Hull Color:</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'blue', bg: 'bg-sky-500' },
                { id: 'red', bg: 'bg-rose-500' },
                { id: 'yellow', bg: 'bg-amber-400' },
                { id: 'purple', bg: 'bg-purple-500' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundManager.playPop();
                    setColor(c.id as RocketColor);
                  }}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                    color === c.id ? 'ring-3 ring-sky-400 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Launch Action Button */}
          <div className="pt-2 flex gap-2">
            <button
              id="launch-rocket-btn"
              onClick={handleLaunch}
              disabled={isLaunching}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-white ${
                isLaunching
                  ? 'bg-sky-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 hover:brightness-110 active:scale-98 animate-pulse-gentle'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{isLaunching ? 'Ascending in Flight...' : '3-2-1 BLAST OFF! 🚀'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset Rocket Pad"
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: High Altitude Flight Sky Simulator */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-sky-800 to-sky-400 border-4 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          {/* Top Flight Radar Bar */}
          <div className="flex items-center justify-between text-xs text-white z-10 border-b border-white/20 pb-2">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ALTITUDE: {maxAltitudeMeters} METERS</span>
            </div>
            <div className="font-bold text-amber-300">
              {currentMilestone}
            </div>
          </div>

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center z-30 shadow-2xl border-4 border-amber-400 animate-pulse">
              <span className="text-6xl font-extrabold text-amber-900 font-display">
                {countdown}
              </span>
            </div>
          )}

          {/* Altitude Milestones Guide along Right Edge */}
          <div className="absolute right-4 top-14 bottom-16 flex flex-col justify-between text-right text-[11px] font-bold text-white/80 pointer-events-none z-10">
            <div className="flex items-center justify-end gap-1">
              <span>Orbit (500m+)</span>
              <span className="text-lg">🛰️</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span>Jetliner (300m)</span>
              <span className="text-lg">✈️</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span>Fluffy Clouds (150m)</span>
              <span className="text-lg">☁️</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span>Tall Trees (60m)</span>
              <span className="text-lg">🌲</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span>Giraffe (20m)</span>
              <span className="text-lg">🦒</span>
            </div>
          </div>

          {/* Flight Column Area */}
          <div className="relative flex-1 flex items-end justify-center py-6">
            {/* Launch Stand Tube */}
            <div className="absolute bottom-2 w-16 h-8 bg-slate-800 rounded-t-xl border-t-4 border-amber-400 z-0 flex items-center justify-center">
              <span className="text-[10px] text-amber-300 font-bold">PAD 01</span>
            </div>

            {/* Animated Rocket Craft */}
            <div
              className="relative z-20 flex flex-col items-center transition-all duration-75 ease-linear"
              style={{
                transform: `translateY(-${(altitude / 100) * 340}px)`,
              }}
            >
              {/* Rocket Nose Cone */}
              <div
                className={`w-10 h-8 flex items-center justify-center text-white ${
                  noseCone === 'pointy' ? 'rounded-t-full' : 'rounded-t-2xl'
                } ${
                  color === 'blue'
                    ? 'bg-sky-600'
                    : color === 'red'
                    ? 'bg-rose-600'
                    : color === 'yellow'
                    ? 'bg-amber-500'
                    : 'bg-purple-600'
                }`}
              >
                {noseCone === 'pointy' ? '▲' : '●'}
              </div>

              {/* Rocket Body */}
              <div
                className={`w-12 h-20 rounded-b-md shadow-md border border-white/40 flex flex-col items-center justify-center relative ${
                  color === 'blue'
                    ? 'bg-sky-500'
                    : color === 'red'
                    ? 'bg-rose-500'
                    : color === 'yellow'
                    ? 'bg-amber-400'
                    : 'bg-purple-500'
                }`}
              >
                {/* Space Porthole */}
                <div className="w-5 h-5 rounded-full bg-white/90 border border-slate-700 flex items-center justify-center text-[10px]">
                  🤖
                </div>
                <span className="text-[9px] font-bold text-white tracking-widest mt-1">
                  USA
                </span>

                {/* Left Fin */}
                <div
                  className={`absolute -left-3 bottom-0 w-3 h-8 bg-amber-400 rounded-l-md transform -skew-y-12 ${
                    fins === 'delta' ? 'w-4' : 'w-2'
                  }`}
                />
                {/* Right Fin */}
                <div
                  className={`absolute -right-3 bottom-0 w-3 h-8 bg-amber-400 rounded-r-md transform skew-y-12 ${
                    fins === 'delta' ? 'w-4' : 'w-2'
                  }`}
                />
              </div>

              {/* Exhaust Rocket Flame Particle Stream */}
              {isLaunching && (
                <div className="flex flex-col items-center -mt-1 animate-pulse">
                  <div className="w-6 h-10 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-b-full shadow-[0_0_20px_#f97316]" />
                  <span className="text-xs -mt-2">💨</span>
                </div>
              )}
            </div>
          </div>

          {/* Launch Pad Floor */}
          <div className="w-full bg-slate-950/80 border-t border-slate-700 py-2 px-4 rounded-b-2xl text-[11px] text-slate-300 flex items-center justify-between z-10">
            <span>Air Pressure Tank: Charged</span>
            <span>Launch Angle: 90° Vertical</span>
            <span>Recovery: Safe Parachute</span>
          </div>
        </div>
      </div>
    </div>
  );
}
