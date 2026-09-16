import { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import ProfessorPip from '../ProfessorPip';
import { Dna, Sparkles, RefreshCw, Heart, Award, Eye, Zap } from 'lucide-react';

interface CritterLabProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

interface AnimalPower {
  id: string;
  name: string;
  emoji: string;
  trait: string;
  adaptation: string;
  habitat: string;
  color: string;
}

const ANIMAL_POWERS: AnimalPower[] = [
  { id: 'frog', name: 'Tree Frog', emoji: '🐸', trait: 'Spring Legs', adaptation: 'Jumps 20x its body height to escape hungry birds!', habitat: 'Rainforest Canopy', color: 'text-emerald-500' },
  { id: 'chameleon', name: 'Chameleon', emoji: '🦎', trait: 'Camouflage Skin', adaptation: 'Shifts skin pigments to hide like an invisible spy!', habitat: 'Leafy Trees', color: 'text-lime-500' },
  { id: 'firefly', name: 'Firefly', emoji: '🪲', trait: 'Glowing Lantern', adaptation: 'Bioluminescent belly that flashes happy light signals at night!', habitat: 'Summer Meadow', color: 'text-yellow-400' },
  { id: 'eagle', name: 'Golden Eagle', emoji: '🦅', trait: 'Telescope Eyes & Wings', adaptation: 'Spots a tiny mouse in the grass from a mile up in the sky!', habitat: 'Mountain Peaks', color: 'text-amber-600' },
  { id: 'dolphin', name: 'Ocean Dolphin', emoji: '🐬', trait: 'Sonar Whistle & Fins', adaptation: 'Uses sound waves to see clearly in dark deep waters!', habitat: 'Coral Reef', color: 'text-cyan-500' },
  { id: 'cheetah', name: 'Wild Cheetah', emoji: '🐆', trait: 'Turbo Sprint', adaptation: 'Flexible spine acts like a spring to run faster than a highway car!', habitat: 'Savannah Grasslands', color: 'text-orange-500' },
  { id: 'beaver', name: 'Busy Beaver', emoji: '🦫', trait: 'Paddle Tail & Chisel Teeth', adaptation: 'Waterproof fur and broad tail for swimming and building dams!', habitat: 'River Woodland', color: 'text-amber-800' },
];

export default function CritterLab({ onUnlockBadge, onOpenAskPip }: CritterLabProps) {
  const [parentA, setParentA] = useState<AnimalPower>(ANIMAL_POWERS[0]); // Frog
  const [parentB, setParentB] = useState<AnimalPower>(ANIMAL_POWERS[2]); // Firefly

  const [isCombining, setIsCombining] = useState<boolean>(false);
  const [createdCreature, setCreatedCreature] = useState<{
    name: string;
    avatar: string;
    superpower: string;
    habitat: string;
    funFact: string;
  } | null>({
    name: 'Froggo-Lantern',
    avatar: '🐸✨',
    superpower: 'Glowing Night Leaps! Jumps through the dark sky like a shooting star!',
    habitat: 'Glowing Enchanted Rainforest',
    funFact: 'Inherited super spring legs from the Tree Frog and bioluminescent glowing tummy from the Firefly!',
  });

  const [pipMessage, setPipMessage] = useState<string>(
    "Welcome to the Bio-Critter Creator! Animals have cool superpowers called adaptations to survive. Pick two animal friends to merge traits!"
  );

  const handleCombine = () => {
    if (isCombining) return;
    setIsCombining(true);
    soundManager.playBubble();

    setTimeout(() => {
      soundManager.playSpark();
    }, 600);

    setTimeout(() => {
      soundManager.playSuccess();
      setIsCombining(false);

      // Generate friendly hybrid name and superpower
      const combinedName = `${parentA.name.split(' ')[0]}-${parentB.name.split(' ')[0]}`;
      const combinedAvatar = `${parentA.emoji}${parentB.emoji}`;
      const superpower = `Combines ${parentA.trait} with ${parentB.trait}!`;
      const funFact = `This wonder creature can live in the ${parentA.habitat} and ${parentB.habitat}, using ${parentA.trait.toLowerCase()} to explore!`;

      setCreatedCreature({
        name: combinedName,
        avatar: combinedAvatar,
        superpower,
        habitat: `${parentA.habitat} & ${parentB.habitat}`,
        funFact,
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      onUnlockBadge('critter_geneticist');
      setPipMessage(
        `TA-DA! Meet the ${combinedName}! It inherited ${parentA.trait} and ${parentB.trait}! That is how natural adaptations help living things survive!`
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <ProfessorPip
        message={pipMessage}
        analogy="Wearing winter snow boots and a cozy hat! Animals do not wear clothes, so their bodies grow fur, wings, or webbed feet to match their environment!"
        onAskPipClick={onOpenAskPip}
        mood={isCombining ? 'excited' : 'happy'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Trait Selection */}
        <div className="lg:col-span-6 bg-white border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🧬</span>
              <span>Animal Superpower Mixer</span>
            </h2>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Biology & Genetics
            </span>
          </div>

          {/* Parent A Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose Animal 1 (Main Body & Mobility)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ANIMAL_POWERS.map((animal) => (
                <button
                  key={`a-${animal.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setParentA(animal);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    parentA.id === animal.id
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{animal.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{animal.name}</span>
                  <span className="text-[10px] text-emerald-700">{animal.trait}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parent B Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Choose Animal 2 (Special Superpower Trait)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ANIMAL_POWERS.map((animal) => (
                <button
                  key={`b-${animal.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setParentB(animal);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    parentB.id === animal.id
                      ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-300 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{animal.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{animal.name}</span>
                  <span className="text-[10px] text-teal-700">{animal.trait}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Merge Action Button */}
          <div className="pt-2">
            <button
              id="combine-traits-btn"
              onClick={handleCombine}
              disabled={isCombining}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-white ${
                isCombining
                  ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-98 animate-pulse-gentle'
              }`}
            >
              <Dna className="w-5 h-5" />
              <span>{isCombining ? 'Blending Animal Traits...' : 'MERGE TRAITS IN BIO-POD! ✨'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Generated Creature Hologram Card */}
        <div className="lg:col-span-6 bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 border-4 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between overflow-hidden text-white">
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 border-b border-slate-800 pb-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>DNA SYNTHESIS CHAMBER</span>
            </div>
            <div className="text-emerald-400 font-bold">GENETIC ADAPTATION</div>
          </div>

          {/* Hologram Display Area */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-6">
            {/* Spinning Glow Ring */}
            <div className={`w-44 h-44 rounded-full border-2 border-dashed border-emerald-400/40 flex items-center justify-center relative ${isCombining ? 'animate-spin' : ''}`}>
              <div className="w-36 h-36 rounded-full bg-emerald-500/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <span className="text-5xl sm:text-6xl animate-bounce filter drop-shadow-md">
                  {isCombining ? '🧪' : createdCreature ? createdCreature.avatar : '🐾'}
                </span>
              </div>
            </div>

            {/* Creature Info Card */}
            {createdCreature && !isCombining && (
              <div className="mt-4 text-center max-w-sm space-y-2">
                <div className="inline-block bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                  New Species Discovered!
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  {createdCreature.name}
                </h3>
                <div className="text-xs text-emerald-200 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <div className="font-bold text-amber-300 mb-1 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Special Superpower:</span>
                  </div>
                  <p>{createdCreature.superpower}</p>
                  <p className="mt-1.5 text-[11px] text-slate-400">{createdCreature.funFact}</p>
                </div>
              </div>
            )}
          </div>

          {/* Biological Learning Fact Footer */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-2xl p-3 text-xs text-emerald-200 flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <div>
              <strong>Why Animals Have Superpowers:</strong> In real life, animals develop traits over millions of years so they can find food, stay safe, and care for their babies in nature!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
