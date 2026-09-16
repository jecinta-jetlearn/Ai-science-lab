import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import ProfessorPip from '../ProfessorPip';
import { Flame, Sparkles, RefreshCw, Info, CheckCircle2 } from 'lucide-react';

interface VolcanoLabProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

type Liquid = 'vinegar' | 'lemon' | 'water';
type Powder = 'baking_soda' | 'flour' | 'sugar';
type LavaColor = 'red' | 'orange' | 'purple' | 'green';

export default function VolcanoLab({ onUnlockBadge, onOpenAskPip }: VolcanoLabProps) {
  const [liquid, setLiquid] = useState<Liquid>('vinegar');
  const [powder, setPowder] = useState<Powder>('baking_soda');
  const [color, setColor] = useState<LavaColor>('red');
  const [hasDishSoap, setHasDishSoap] = useState<boolean>(true);
  const [hasGlitter, setHasGlitter] = useState<boolean>(true);
  const [powderScoops, setPowderScoops] = useState<number>(2);

  const [isErupting, setIsErupting] = useState<boolean>(false);
  const [foamLevel, setFoamLevel] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [pipMessage, setPipMessage] = useState<string>(
    "Welcome to the Fizz & Foam Volcano! Tap your ingredients, add dish soap for extra giant bubbles, then pull the Erupt Lever!"
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reaction logic: Acid (vinegar or lemon) + Base (baking soda) = huge fizz!
  const isReactive = (liquid === 'vinegar' || liquid === 'lemon') && powder === 'baking_soda';

  const handleTriggerEruption = () => {
    if (isErupting) return;
    setIsErupting(true);
    soundManager.playBubble();

    if (isReactive) {
      soundManager.playEruption();
      setPipMessage(
        liquid === 'vinegar'
          ? "WOOSH! Look at that giant fizzy eruption! Baking soda and vinegar made millions of carbon dioxide gas bubbles!"
          : "Zesty fizz! Lemon juice has citric acid, which loves reacting with baking soda to make fizzy foam!"
      );

      // Animate foam rising
      let current = 0;
      const target = hasDishSoap ? 100 : 70;
      const interval = setInterval(() => {
        current += 4;
        soundManager.playBubble();
        setFoamLevel(current);
        if (current >= target) {
          clearInterval(interval);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: color === 'red' ? ['#ef4444', '#f97316', '#fbbf24'] : ['#a855f7', '#3b82f6', '#10b981'],
          });
          onUnlockBadge('volcano_master');
        }
      }, 50);

      setTimeout(() => {
        setIsErupting(false);
      }, 5000);
    } else {
      // Non-reactive combination (teaches scientific method)
      soundManager.playPop();
      setFoamLevel(10);
      setPipMessage(
        powder === 'flour'
          ? "Hmm, no fizz! Flour doesn't make gas with liquid. It just makes gooey batter! Try Baking Soda instead!"
          : "Sugar dissolved quietly into sweet water! To make a big bubbly explosion, we need an Acid (Vinegar) and a Base (Baking Soda)!"
      );
      setTimeout(() => {
        setIsErupting(false);
        setFoamLevel(0);
      }, 3000);
    }
  };

  const handleReset = () => {
    soundManager.playPop();
    setIsErupting(false);
    setFoamLevel(0);
    setPipMessage("Ready for a new batch! What magical combination should we test next?");
  };

  // Canvas particle bubbling effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const getColorHex = () => {
      switch (color) {
        case 'orange': return '#f97316';
        case 'purple': return '#a855f7';
        case 'green': return '#22c55e';
        default: return '#ef4444';
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isErupting && isReactive) {
        // Spawn eruption bubbles & sparks
        for (let i = 0; i < (hasDishSoap ? 6 : 3); i++) {
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 60,
            y: 120,
            radius: hasDishSoap ? Math.random() * 9 + 4 : Math.random() * 5 + 2,
            vx: (Math.random() - 0.5) * (hasDishSoap ? 7 : 4),
            vy: -(Math.random() * 8 + 3),
            alpha: 0.9,
            color: hasGlitter && Math.random() > 0.6 ? '#fde047' : getColorHex(),
          });
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity pulling foam down mountain sides
        p.alpha -= 0.015;

        if (p.alpha <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Shiny bubble reflection
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isErupting, isReactive, color, hasDishSoap, hasGlitter]);

  return (
    <div className="space-y-6">
      {/* Friendly Professor Pip Dialogue Bar */}
      <ProfessorPip
        message={pipMessage}
        analogy="Shaking a fizzy soda can! When you open it, all the trapped gas bubbles want to burst out into the sky!"
        onAskPipClick={onOpenAskPip}
        mood={isErupting ? 'excited' : 'happy'}
      />

      {/* Main Lab Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Tactile Recipe Controls */}
        <div className="lg:col-span-5 bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🥣</span>
              <span>Volcano Recipe</span>
            </h2>
            <span className="text-xs font-semibold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              Kitchen Chemistry
            </span>
          </div>

          {/* 1. Pick Liquid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Step 1: Choose Liquid in Flask
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'vinegar', name: 'Vinegar', icon: '🍶', badge: 'Sour Acid' },
                { id: 'lemon', name: 'Lemon Juice', icon: '🍋', badge: 'Citric Acid' },
                { id: 'water', name: 'Plain Water', icon: '💧', badge: 'Neutral' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`liquid-${item.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setLiquid(item.id as Liquid);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    liquid === item.id
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] text-slate-500">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pick Powder */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Step 2: Choose Powder Scoops
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'baking_soda', name: 'Baking Soda', icon: '🧂', badge: 'Magic Base' },
                { id: 'flour', name: 'Flour', icon: '🌾', badge: 'Bread Dough' },
                { id: 'sugar', name: 'Sugar', icon: '🍬', badge: 'Sweet Taste' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`powder-${item.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setPowder(item.id as Powder);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    powder === item.id
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] text-slate-500">{item.badge}</span>
                </button>
              ))}
            </div>

            {/* Scoops slider */}
            <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Scoops of Powder:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((scoop) => (
                  <button
                    key={scoop}
                    onClick={() => {
                      soundManager.playPop();
                      setPowderScoops(scoop);
                    }}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      powderScoops === scoop
                        ? 'bg-rose-500 text-white shadow-xs scale-105'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {scoop}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Fun Boosters (Soap, Color, Glitter) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Step 3: Fun Lava Customizers
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                id="soap-booster"
                onClick={() => {
                  soundManager.playPop();
                  setHasDishSoap(!hasDishSoap);
                }}
                className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  hasDishSoap
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-xl">🫧</span>
                <div>
                  <div className="text-xs">Dish Soap</div>
                  <div className="text-[10px] opacity-75">{hasDishSoap ? 'Giant Foam ON' : 'Off'}</div>
                </div>
              </button>

              <button
                id="glitter-booster"
                onClick={() => {
                  soundManager.playPop();
                  setHasGlitter(!hasGlitter);
                }}
                className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  hasGlitter
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-xl">✨</span>
                <div>
                  <div className="text-xs">Glitter Sparks</div>
                  <div className="text-[10px] opacity-75">{hasGlitter ? 'Sparkles ON' : 'Off'}</div>
                </div>
              </button>
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Color:</span>
              {[
                { id: 'red', bg: 'bg-red-500' },
                { id: 'orange', bg: 'bg-orange-500' },
                { id: 'purple', bg: 'bg-purple-500' },
                { id: 'green', bg: 'bg-emerald-500' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundManager.playPop();
                    setColor(c.id as LavaColor);
                  }}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                    color === c.id ? 'ring-3 ring-amber-400 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Big Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              id="erupt-btn"
              onClick={handleTriggerEruption}
              disabled={isErupting}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-white ${
                isErupting
                  ? 'bg-rose-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 hover:brightness-110 active:scale-98 animate-pulse-gentle'
              }`}
            >
              <Flame className="w-5 h-5" />
              <span>{isErupting ? 'Erupting in Action...' : 'PULL THE ERUPT LEVER! 🌋'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset Volcano"
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Mountain Visual Simulation Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col items-center justify-center relative min-h-[440px] overflow-hidden">
          {/* Cloud & Sun Sky Background */}
          <div className="absolute top-4 left-6 text-2xl opacity-60">☁️</div>
          <div className="absolute top-8 right-12 text-3xl opacity-80">☀️</div>
          <div className="absolute top-12 left-1/3 text-xl opacity-50">☁️</div>

          {/* Foam Height Indicator */}
          <div className="absolute top-4 left-4 bg-white/90 border border-amber-200 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>🫧 Foam Meter:</span>
            <div className="w-20 bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${foamLevel}%` }}
              />
            </div>
            <span>{foamLevel}%</span>
          </div>

          {/* Canvas for Particle Bubbles */}
          <canvas
            ref={canvasRef}
            width={480}
            height={360}
            className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          />

          {/* SVG Volcano Mountain Graphic with Erupting Crater */}
          <div className="relative w-72 sm:w-80 h-64 sm:h-72 mt-12 flex items-end justify-center">
            {/* Mountain Body */}
            <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-md">
              {/* Rock Layers */}
              <polygon
                points="150,45 270,230 30,230"
                fill="#78350f"
              />
              <polygon
                points="150,45 220,230 80,230"
                fill="#92400e"
              />
              <polygon
                points="150,45 190,230 110,230"
                fill="#b45309"
              />

              {/* Crater Rim */}
              <ellipse cx="150" cy="48" rx="40" ry="12" fill="#451a03" />

              {/* Lava pool inside crater */}
              <ellipse
                cx="150"
                cy="48"
                rx="35"
                ry="9"
                fill={color === 'orange' ? '#ea580c' : color === 'purple' ? '#9333ea' : color === 'green' ? '#16a34a' : '#dc2626'}
                className={isErupting ? 'animate-pulse' : ''}
              />

              {/* Lava dripping down the sides */}
              {foamLevel > 20 && (
                <>
                  <path
                    d="M135,50 Q130,90 120,140 Q115,160 118,180"
                    stroke={color === 'orange' ? '#f97316' : color === 'purple' ? '#a855f7' : color === 'green' ? '#22c55e' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M165,50 Q175,100 185,150 Q190,170 186,190"
                    stroke={color === 'orange' ? '#f97316' : color === 'purple' ? '#a855f7' : color === 'green' ? '#22c55e' : '#ef4444'}
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
            </svg>

            {/* Giant Foam Puff on top of Crater */}
            {foamLevel > 0 && (
              <div
                className={`absolute top-0 transform -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  color === 'orange' ? 'bg-orange-400' : color === 'purple' ? 'bg-purple-400' : color === 'green' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
                style={{
                  width: `${Math.min(foamLevel * 2, 140)}px`,
                  height: `${Math.min(foamLevel * 1.5, 100)}px`,
                }}
              >
                <span className="text-xl animate-bounce">🫧</span>
                {hasGlitter && <span className="text-sm">✨</span>}
              </div>
            )}
          </div>

          {/* Grass Floor */}
          <div className="w-full bg-emerald-600 h-7 rounded-b-2xl -mt-2 border-t-2 border-emerald-700 flex items-center justify-around px-4 text-xs text-emerald-100 font-bold">
            <span>🌱 Safe Kid Workbench</span>
            <span>🧼 No Mess Simulation</span>
            <span>🌋 Ready to Fizz</span>
          </div>

          {/* Easy Explanation Drawer */}
          <div className="w-full mt-4 bg-white/90 border border-amber-200 rounded-2xl p-3.5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Info className="w-4 h-4 text-amber-600" />
                <span>What makes it foam up? (Easy Explanation)</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playPop();
                  setShowExplanation(!showExplanation);
                }}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                {showExplanation ? 'Hide' : 'Show Secret'}
              </button>
            </div>

            {showExplanation && (
              <div className="mt-2 text-xs sm:text-sm text-slate-700 space-y-1.5 pt-2 border-t border-amber-100">
                <p>
                  1. <strong>Baking Soda</strong> is a <em>Base</em> (like a chalky powder).
                </p>
                <p>
                  2. <strong>Vinegar</strong> is an <em>Acid</em> (sour liquid).
                </p>
                <p>
                  3. When they touch, they create <strong>Carbon Dioxide gas</strong> bubbles that rush out to the sky!
                </p>
                <p className="text-emerald-700 font-semibold">
                  Adding dish soap traps the gas inside stretchy soap walls, creating towering piles of super-foam!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
