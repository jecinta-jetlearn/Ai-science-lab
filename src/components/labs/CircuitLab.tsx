import { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import ProfessorPip from '../ProfessorPip';
import { Zap, Sun, Battery, Lightbulb, Fan, Bell, CheckCircle2, XCircle } from 'lucide-react';

interface CircuitLabProps {
  onUnlockBadge: (badgeId: string) => void;
  onOpenAskPip: () => void;
}

type PowerSource = 'battery' | 'solar';
type OutputDevice = 'bulb' | 'fan' | 'bell';

interface TestObject {
  id: string;
  name: string;
  emoji: string;
  isConductor: boolean;
  type: string;
  explanation: string;
}

const TEST_OBJECTS: TestObject[] = [
  { id: 'coin', name: 'Copper Coin', emoji: '🪙', isConductor: true, type: 'Metal', explanation: 'Copper is full of free electrons that let electric current zoom right through!' },
  { id: 'paperclip', name: 'Metal Paperclip', emoji: '📎', isConductor: true, type: 'Steel Metal', explanation: 'Steel is a great conductor that bridges the electrical gap cleanly.' },
  { id: 'lemon', name: 'Juicy Lemon', emoji: '🍋', isConductor: true, type: 'Acidic Fruit', explanation: 'Lemon juice has natural citric acid (electrolytes) that lets electricity flow!' },
  { id: 'key', name: 'Brass Key', emoji: '🗝️', isConductor: true, type: 'Metal', explanation: 'Heavy brass metal conducts electricity with almost zero resistance!' },
  { id: 'pencil', name: 'Wooden Pencil', emoji: '🪵', isConductor: false, type: 'Wood', explanation: 'Wood holds tightly onto its electrons, stopping electricity in its tracks (Insulator)!' },
  { id: 'dino', name: 'Plastic Toy Dino', emoji: '🦖', isConductor: false, type: 'Plastic', explanation: 'Plastic is a strong insulator, which is why electrical wires are wrapped in plastic for safety!' },
  { id: 'sponge', name: 'Dry Sponge', emoji: '🧽', isConductor: false, type: 'Foam', explanation: 'Dry foam is full of trapped air, which blocks electrical current!' },
];

export default function CircuitLab({ onUnlockBadge, onOpenAskPip }: CircuitLabProps) {
  const [powerSource, setPowerSource] = useState<PowerSource>('battery');
  const [outputDevice, setOutputDevice] = useState<OutputDevice>('bulb');
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<TestObject>(TEST_OBJECTS[0]);

  // A circuit is active only when:
  // 1. Switch is closed
  // 2. The placed object is a conductor
  const isCircuitComplete = switchClosed && selectedObject.isConductor;

  const [pipMessage, setPipMessage] = useState<string>(
    "Welcome to the Spark & Glow Circuit! Electricity loves traveling in loops. Test different everyday toys to see what conducts power!"
  );

  const handleToggleSwitch = () => {
    soundManager.playPop();
    const nextState = !switchClosed;
    setSwitchClosed(nextState);

    if (nextState) {
      if (selectedObject.isConductor) {
        soundManager.playSpark();
        if (outputDevice === 'bell') soundManager.playSuccess();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        onUnlockBadge('circuit_sparky');
        setPipMessage(`ZAP! The loop is closed and ${selectedObject.name} is a CONDUCTOR! Look at it power up!`);
      } else {
        setPipMessage(`The switch is closed, BUT ${selectedObject.name} is an INSULATOR! It blocks the electric loop!`);
      }
    } else {
      setPipMessage("You opened the switch! Breaking the loop turns off the flow of electricity, like turning off a faucet.");
    }
  };

  const handleSelectObject = (obj: TestObject) => {
    soundManager.playPop();
    setSelectedObject(obj);

    if (switchClosed && obj.isConductor) {
      soundManager.playSpark();
      setPipMessage(`Awesome! ${obj.name} is a CONDUCTOR! Power is flowing freely!`);
      onUnlockBadge('circuit_sparky');
    } else if (switchClosed && !obj.isConductor) {
      setPipMessage(`Uh oh! ${obj.name} is an INSULATOR. Electricity cannot pass through ${obj.type}!`);
    }
  };

  return (
    <div className="space-y-6">
      <ProfessorPip
        message={pipMessage}
        analogy="Water in a circular toy train track! If there is a missing track piece (an insulator), the train stops. Connect metal, and the train races full speed!"
        onAskPipClick={onOpenAskPip}
        mood={isCircuitComplete ? 'excited' : 'happy'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Circuit Station Toolbox */}
        <div className="lg:col-span-5 bg-white border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>⚡</span>
              <span>Circuit Parts</span>
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Conductivity Tester
            </span>
          </div>

          {/* 1. Pick Power Source */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Power Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="power-battery"
                onClick={() => {
                  soundManager.playPop();
                  setPowerSource('battery');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  powerSource === 'battery'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 font-bold text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                  🔋
                </div>
                <div>
                  <div className="text-xs font-bold">AA Battery</div>
                  <div className="text-[10px] text-slate-500">Chemical Energy</div>
                </div>
              </button>

              <button
                id="power-solar"
                onClick={() => {
                  soundManager.playPop();
                  setPowerSource('solar');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  powerSource === 'solar'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 font-bold text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-300 text-amber-900 flex items-center justify-center font-bold">
                  ☀️
                </div>
                <div>
                  <div className="text-xs font-bold">Solar Panel</div>
                  <div className="text-[10px] text-slate-500">Clean Sunlight</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Choose Item to Place in Test Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Test Item (Drop into the Circuit Slot)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEST_OBJECTS.map((obj) => (
                <button
                  key={obj.id}
                  id={`test-obj-${obj.id}`}
                  onClick={() => handleSelectObject(obj)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedObject.id === obj.id
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{obj.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{obj.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    obj.isConductor ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {obj.isConductor ? 'Conductor' : 'Insulator'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Choose Output Toy */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Connected Output Toy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bulb', name: 'Lightbulb', icon: '💡' },
                { id: 'fan', name: 'Propeller Fan', icon: '🛸' },
                { id: 'bell', name: 'Music Chime', icon: '🔔' },
              ].map((toy) => (
                <button
                  key={toy.id}
                  id={`output-${toy.id}`}
                  onClick={() => {
                    soundManager.playPop();
                    setOutputDevice(toy.id as OutputDevice);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    outputDevice === toy.id
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 font-bold text-amber-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{toy.icon}</span>
                  <span className="text-xs font-bold">{toy.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Lever Control */}
          <div className="pt-2">
            <button
              id="switch-lever-btn"
              onClick={handleToggleSwitch}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                switchClosed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-800 text-amber-200'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>{switchClosed ? 'SWITCH IS CLOSED (CLICK TO OPEN)' : 'SWITCH IS OPEN (CLICK TO CLOSE)'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Visual Circuit Board Graphic */}
        <div className="lg:col-span-7 bg-slate-900 border-4 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Header Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 border-b border-slate-800 pb-2 font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCircuitComplete ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span>LOOP STATUS: {isCircuitComplete ? 'FLOWING ELECTRICITY' : 'LOOP INCOMPLETE'}</span>
            </div>
            <div className="text-amber-400 font-bold">
              {isCircuitComplete ? 'CIRCUIT ACTIVE ⚡' : 'CIRCUIT BROKEN ❌'}
            </div>
          </div>

          {/* Interactive Circuit Loop Visual Schema */}
          <div className="relative flex-1 my-6 flex items-center justify-center">
            {/* Breadboard Plate */}
            <div className="w-full max-w-md h-72 sm:h-80 bg-slate-800/80 rounded-2xl border-2 border-slate-700 relative p-4 flex flex-col justify-between">
              {/* TOP WIRE: Power to Switch */}
              <div className="absolute top-8 left-16 right-16 h-3 rounded-full bg-slate-700 overflow-hidden">
                {isCircuitComplete && (
                  <div className="h-full w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-pulse" />
                )}
              </div>

              {/* BOTTOM WIRE: Output to Test Object */}
              <div className="absolute bottom-8 left-16 right-16 h-3 rounded-full bg-slate-700 overflow-hidden">
                {isCircuitComplete && (
                  <div className="h-full w-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse" />
                )}
              </div>

              {/* LEFT WIRE: Vertical connection */}
              <div className="absolute top-8 bottom-8 left-16 w-3 rounded-full bg-slate-700 overflow-hidden">
                {isCircuitComplete && (
                  <div className="h-full w-full bg-amber-400 animate-pulse" />
                )}
              </div>

              {/* RIGHT WIRE: Vertical connection */}
              <div className="absolute top-8 bottom-8 right-16 w-3 rounded-full bg-slate-700 overflow-hidden">
                {isCircuitComplete && (
                  <div className="h-full w-full bg-amber-400 animate-pulse" />
                )}
              </div>

              {/* Node 1 (Top Left): Power Source */}
              <div className="absolute top-2 left-6 z-10 bg-slate-900 border-2 border-amber-400 p-2.5 rounded-2xl flex items-center gap-2 shadow-lg">
                <span className="text-2xl">{powerSource === 'battery' ? '🔋' : '☀️'}</span>
                <span className="text-xs font-bold text-amber-300">
                  {powerSource === 'battery' ? '9V Battery' : 'Solar Cell'}
                </span>
              </div>

              {/* Node 2 (Top Right): Mechanical Switch */}
              <div
                onClick={handleToggleSwitch}
                className="absolute top-2 right-6 z-10 bg-slate-900 border-2 border-slate-600 hover:border-amber-400 p-2.5 rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${switchClosed ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${switchClosed ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {switchClosed ? 'Closed (ON)' : 'Open (OFF)'}
                </span>
              </div>

              {/* Center Slot: Test Object Container */}
              <div className="absolute inset-0 m-auto w-44 h-24 bg-slate-900 border-2 border-dashed border-amber-400/80 rounded-2xl flex flex-col items-center justify-center p-2 z-20 shadow-xl">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-0.5">
                  🧪 Test Material Slot
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedObject.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{selectedObject.name}</div>
                    <div className="text-[10px] text-slate-400">{selectedObject.type}</div>
                  </div>
                </div>
                {selectedObject.isConductor ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Conductor (Allows Zap!)
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5 mt-1">
                    <XCircle className="w-3 h-3" /> Insulator (Blocks Zap!)
                  </span>
                )}
              </div>

              {/* Node 3 (Bottom Center): Output Toy */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900 border-2 border-amber-400 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl">
                {/* Visual state of toy */}
                {outputDevice === 'bulb' && (
                  <div className={`p-2 rounded-xl transition-all ${isCircuitComplete ? 'bg-amber-400 text-amber-950 shadow-[0_0_25px_#fde047] scale-110' : 'bg-slate-800 text-slate-500'}`}>
                    <Lightbulb className="w-7 h-7" />
                  </div>
                )}
                {outputDevice === 'fan' && (
                  <div className={`p-2 rounded-xl transition-all ${isCircuitComplete ? 'bg-sky-400 text-sky-950 shadow-[0_0_25px_#38bdf8] scale-110' : 'bg-slate-800 text-slate-500'}`}>
                    <Fan className={`w-7 h-7 ${isCircuitComplete ? 'animate-spin' : ''}`} />
                  </div>
                )}
                {outputDevice === 'bell' && (
                  <div className={`p-2 rounded-xl transition-all ${isCircuitComplete ? 'bg-purple-400 text-purple-950 shadow-[0_0_25px_#c084fc] scale-110' : 'bg-slate-800 text-slate-500'}`}>
                    <Bell className={`w-7 h-7 ${isCircuitComplete ? 'animate-bounce' : ''}`} />
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-white">
                    {outputDevice === 'bulb' ? 'Lightbulb' : outputDevice === 'fan' ? 'Propeller Fan' : 'Chime Bell'}
                  </div>
                  <div className="text-[10px] text-amber-300">
                    {isCircuitComplete ? '⚡ ACTIVE & POWERED!' : 'Sleepy (Need circuit)'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Object Explanation Card */}
          <div className="mt-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-slate-300 text-xs flex items-start gap-2">
            <span className="text-base flex-shrink-0">💡</span>
            <div>
              <strong className="text-amber-300">{selectedObject.name}:</strong> {selectedObject.explanation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
