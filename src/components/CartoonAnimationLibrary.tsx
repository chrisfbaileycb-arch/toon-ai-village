import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Sliders,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Flame,
  Wand2,
  Footprints,
  Music,
  AlertCircle,
  MessageSquare,
  Hand,
  ArrowUpCircle,
  X,
  ChevronRight,
} from 'lucide-react';
import ToonCharacter, { characterNames } from './ToonCharacter';
import {
  cartoonVariants,
  ANIMATION_PRESET_METADATA,
  PRESET_LIST,
  getCustomCartoonVariant,
} from '../animations/toonVariants';
import { type AnimationPresetName } from '../types';
import { playToonSound } from '../utils/audioSynth';

interface CartoonAnimationLibraryProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectPreset?: (preset: AnimationPresetName) => void;
  initialPreset?: AnimationPresetName;
  mode?: 'modal' | 'embedded';
}

const backgroundThemes = [
  {
    id: 'studio',
    label: 'Studio Glow',
    gradient: 'from-[#1f0d3d] via-[#2a1354] to-[#15072b]',
    border: 'border-[#4a2b7e]',
  },
  {
    id: 'sunset',
    label: 'Golden Sunset',
    gradient: 'from-[#7c2d12] via-[#ea580c] to-[#fde047]',
    border: 'border-[#fb923c]',
  },
  {
    id: 'cyber',
    label: 'Cyber Grid',
    gradient: 'from-[#030712] via-[#111827] to-[#1e1b4b]',
    border: 'border-[#38bdf8]',
  },
  {
    id: 'meadow',
    label: 'Sunny Meadow',
    gradient: 'from-[#0284c7] via-[#38bdf8] to-[#65a30d]',
    border: 'border-[#4ade80]',
  },
  {
    id: 'blueprint',
    label: 'Animation Blueprint',
    gradient: 'from-[#1e3a8a] via-[#1d4ed8] to-[#172554]',
    border: 'border-[#60a5fa]',
  },
];

export const CartoonAnimationLibrary: React.FC<CartoonAnimationLibraryProps> = ({
  isOpen = true,
  onClose,
  onSelectPreset,
  initialPreset = 'jump',
  mode = 'embedded',
}) => {
  const [activePreset, setActivePreset] = useState<AnimationPresetName>(initialPreset);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('Ava');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [squashIntensity, setSquashIntensity] = useState<number>(1);
  const [showCartoonFX, setShowCartoonFX] = useState<boolean>(true);
  const [activeBgIndex, setActiveBgIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'stage' | 'parade' | 'code' | 'principles'>('stage');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'locomotion' | 'expressive' | 'action' | 'reaction'>('all');

  const meta = ANIMATION_PRESET_METADATA[activePreset];
  const bgTheme = backgroundThemes[activeBgIndex];

  const filteredPresets = PRESET_LIST.filter(
    (p) => filterCategory === 'all' || p.category === filterCategory
  );

  const handleSelectPreset = (presetName: AnimationPresetName) => {
    setActivePreset(presetName);
    if (soundEnabled) {
      const sound = ANIMATION_PRESET_METADATA[presetName].soundEffect;
      if (sound) playToonSound(sound);
      else playToonSound('click');
    }
  };

  const handleCharacterChange = (char: string) => {
    setSelectedCharacter(char);
    if (soundEnabled) playToonSound('jump');
  };

  const handleCopyCode = () => {
    const code = `import { motion } from 'motion/react';
import { cartoonVariants } from './animations/toonVariants';
import ToonCharacter from './components/ToonCharacter';

export function AnimatedScene() {
  return (
    <ToonCharacter
      character="${selectedCharacter}"
      preset="${activePreset}"
      speedMultiplier={${speedMultiplier}}
      squashIntensity={${squashIntensity}}
      showCartoonEffects={${showCartoonFX}}
    />
  );
}`;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const computedVariant = getCustomCartoonVariant(activePreset, {
    speedMultiplier,
    squashIntensity,
  });

  const getPresetIcon = (id: AnimationPresetName) => {
    switch (id) {
      case 'walk':
      case 'sneak':
        return <Footprints className="w-4 h-4" />;
      case 'jump':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'talk':
        return <MessageSquare className="w-4 h-4" />;
      case 'wave':
        return <Hand className="w-4 h-4" />;
      case 'celebrate':
        return <Flame className="w-4 h-4" />;
      case 'dance':
        return <Music className="w-4 h-4" />;
      case 'shock':
        return <AlertCircle className="w-4 h-4" />;
      case 'present':
        return <Wand2 className="w-4 h-4" />;
      case 'idle':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  if (!isOpen && mode === 'modal') return null;

  const content = (
    <div className="flex flex-col h-full bg-[#120624] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#301c4d] bg-[#1a0b2e]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff9900] to-[#ff5500] flex items-center justify-center shadow-lg shadow-[#ff9900]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                Cartoon Animation Laboratory
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40">
                12 Principles Engine
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Fine-tune speed, squash, stretch, and kinematics on procedural toon rigs
            </p>
          </div>
        </div>

        {/* Action Tabs & Close */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-[#100520] p-1 rounded-xl border border-[#2b164a]">
            <button
              id="tab-interactive-stage-btn"
              type="button"
              onClick={() => setActiveTab('stage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'stage'
                  ? 'bg-[#ff9900] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Interactive Stage
            </button>
            <button
              id="tab-all-presets-btn"
              type="button"
              onClick={() => setActiveTab('parade')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'parade'
                  ? 'bg-[#ff9900] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All 10 Presets
            </button>
            <button
              id="tab-12-principles-btn"
              type="button"
              onClick={() => setActiveTab('principles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'principles'
                  ? 'bg-[#ff9900] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              12 Principles
            </button>
            <button
              id="tab-export-code-btn"
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'code'
                  ? 'bg-[#ff9900] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Export Code
            </button>
          </div>

          {onSelectPreset && (
            <button
              id="apply-preset-btn"
              type="button"
              onClick={() => onSelectPreset(activePreset)}
              className="bg-[#ff9900] hover:bg-[#e68700] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Apply Preset
            </button>
          )}

          {onClose && (
            <button
              id="close-animation-lib-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'stage' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Panel: Preset Browser & Categories (4 cols) */}
          <div className="lg:col-span-4 border-r border-[#301c4d] bg-[#160a2c] p-4 overflow-y-auto flex flex-col gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'locomotion', 'expressive', 'action', 'reaction'] as const).map((cat) => (
                <button
                  key={cat}
                  id={`filter-cat-${cat}`}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#ff9900] text-white shadow'
                      : 'bg-[#241142] text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              {filteredPresets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`preset-card-${preset.id}`}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-[#2f1359] border-[#ff9900] shadow-lg shadow-[#ff9900]/10 scale-[1.01]'
                        : 'bg-[#1e0e38] border-[#371f5c] hover:border-gray-500 hover:bg-[#251245]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#ff9900] text-white'
                          : 'bg-[#2b1450] text-[#ff9900] group-hover:bg-[#391b68]'
                      }`}
                    >
                      {getPresetIcon(preset.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-extrabold text-white truncate">{preset.name}</p>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-gray-300">
                          {preset.defaultDuration}s
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{preset.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {preset.principles.slice(0, 2).map((principle) => (
                          <span
                            key={principle}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-[#e0aaff]"
                          >
                            {principle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Character Switcher */}
            <div className="mt-auto pt-4 border-t border-[#301c4d]">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Active Character Rig:
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {characterNames.map((name) => (
                  <button
                    key={name}
                    id={`char-picker-${name.toLowerCase()}`}
                    type="button"
                    onClick={() => handleCharacterChange(name)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                      selectedCharacter === name
                        ? 'bg-white text-[#1a0b2e] shadow-md scale-105'
                        : 'bg-[#241142] text-gray-400 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Stage Viewport & Kinematic Controls (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0d041a] p-4 lg:p-6 overflow-y-auto">
            
            {/* The Live Cartoon Stage */}
            <div
              className={`relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b ${bgTheme.gradient} border-2 ${bgTheme.border} transition-all duration-300 select-none flex flex-col items-center justify-end pb-8`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Stage Badges */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md text-[#ff9900] border border-[#ff9900]/40 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PRESET: {meta.name.toUpperCase()}
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-2.5 py-1 rounded-full">
                  {meta.category}
                </span>
              </div>

              {/* Audio & Sound Toggle */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  id="toggle-sfx-btn"
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full border border-white/20 text-xs transition-colors"
                  title={soundEnabled ? 'Mute Cartoon SFX' : 'Enable Cartoon SFX'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ff9900]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                </button>
              </div>

              {/* Cartoon Speech Bubble */}
              <div className="mb-4 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border-2 border-[#ff9900] text-center max-w-[80%] z-20">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#ff9900]">
                  {selectedCharacter} • {meta.name}
                </div>
                <p className="text-xs md:text-sm font-extrabold text-[#1a0b2e]">
                  "{meta.description}"
                </p>
              </div>

              {/* Cartoon Character Rig With Live Framer Motion Variants */}
              <div className="relative z-10">
                <ToonCharacter
                  character={selectedCharacter}
                  preset={activePreset}
                  customVariants={computedVariant}
                  speedMultiplier={speedMultiplier}
                  squashIntensity={squashIntensity}
                  showCartoonEffects={showCartoonFX}
                  className="w-40 h-52 md:w-56 md:h-72 drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                  showName={false}
                />
              </div>

              {/* Cartoon Stage Ground Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-sm border-t border-white/10" />
            </div>

            {/* Real-time Kinematic Physics Tuning Bar */}
            <div className="mt-4 p-4 rounded-2xl bg-[#190a32] border border-[#301c4d] grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Playback Controls & Speed */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-[#ff9900]" /> Speed Multiplier:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ff9900]">{speedMultiplier}x</span>
                </div>
                <div className="flex gap-1.5">
                  {[0.25, 0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      id={`speed-btn-${s}`}
                      type="button"
                      onClick={() => setSpeedMultiplier(s)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                        speedMultiplier === s
                          ? 'bg-[#ff9900] text-white shadow'
                          : 'bg-[#241142] text-gray-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Squash & Stretch Exaggeration Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#ff9900]" /> Squash & Stretch:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ff9900]">
                    {Math.round(squashIntensity * 100)}%
                  </span>
                </div>
                <input
                  id="squash-stretch-slider"
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.1"
                  value={squashIntensity}
                  onChange={(e) => setSquashIntensity(parseFloat(e.target.value))}
                  className="w-full accent-[#ff9900] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Subtle</span>
                  <span>Classic (100%)</span>
                  <span>Exaggerated</span>
                </div>
              </div>

              {/* Cartoon FX & Stage Backdrop */}
              <div className="flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Cartoon FX Particles:</span>
                  <button
                    id="toggle-cartoon-fx-btn"
                    type="button"
                    onClick={() => setShowCartoonFX(!showCartoonFX)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      showCartoonFX
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {showCartoonFX ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 mr-1">Backdrop:</span>
                  {backgroundThemes.map((bg, idx) => (
                    <button
                      key={bg.id}
                      id={`backdrop-btn-${bg.id}`}
                      type="button"
                      onClick={() => setActiveBgIndex(idx)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        activeBgIndex === idx ? 'scale-110 border-white shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ background: bg.gradient }}
                      title={bg.label}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Principles Used in this Preset */}
            <div className="mt-4 p-4 rounded-2xl bg-[#15072b] border border-[#2e174a]">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#ff9900] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cartoon Animation Principles In This Preset:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {meta.principles.map((principle) => (
                  <div
                    key={principle}
                    className="bg-[#210d3f] p-2.5 rounded-xl border border-[#3b1d68] flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ff9900]" />
                    <span className="text-xs font-bold text-white">{principle}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* View All Presets Parade Tab */}
      {activeTab === 'parade' && (
        <div className="flex-1 p-6 overflow-y-auto bg-[#0e041c]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-white">All 10 Cartoon Presets Running Live</h3>
              <p className="text-sm text-gray-400 mt-1">
                Synchronized Framer Motion variants operating on procedural Toon character rigs
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {PRESET_LIST.map((preset, idx) => {
                const charName = characterNames[idx % characterNames.length];
                return (
                  <div
                    key={preset.id}
                    id={`parade-card-${preset.id}`}
                    onClick={() => {
                      setActivePreset(preset.id);
                      setSelectedCharacter(charName);
                      setActiveTab('stage');
                    }}
                    className={`group cursor-pointer rounded-2xl p-4 border transition-all hover:-translate-y-1 ${
                      activePreset === preset.id
                        ? 'bg-[#29134d] border-[#ff9900] shadow-xl'
                        : 'bg-[#1b0c36] border-[#371f5c] hover:border-gray-400'
                    }`}
                  >
                    <div className="h-40 rounded-xl bg-gradient-to-b from-[#241142] to-[#120524] flex items-center justify-center relative overflow-hidden mb-3 border border-white/5">
                      <ToonCharacter
                        character={charName}
                        preset={preset.id}
                        className="w-24 h-32"
                        showName={false}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-white truncate">{preset.name}</h4>
                      {getPresetIcon(preset.id)}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{charName} • {preset.category}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-[#ff9900] font-bold group-hover:underline">
                      <span>Tune & Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 12 Principles Educational Tab */}
      {activeTab === 'principles' && (
        <div className="flex-1 p-6 overflow-y-auto bg-[#0e041c]">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[#ff9900] font-mono text-xs uppercase font-bold tracking-widest">
                Traditional Animation Meets Web Physics
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                The 12 Principles of Cartoon Animation
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mt-2">
                How our Framer Motion variants translate traditional Disney & Warner Bros cartoon principles into mathematical web keyframes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: '1. Squash and Stretch',
                  desc: 'Giving weight and flexibility to moving characters. Complementary scaleX and scaleY keyframes preserve cartoon mass without volume distortion.',
                  presetExample: 'Jump, Walk, Celebrate',
                },
                {
                  title: '2. Anticipation',
                  desc: 'Preparing the audience for an action. A jump begins with an unmistakable downward crouch (scaleY: 0.78) before rocketing upward.',
                  presetExample: 'Jump, Wave, Shock',
                },
                {
                  title: '3. Staging',
                  desc: 'Presenting an idea with maximum clarity. Poses center gestures with clear silhouettes and expressive head tilts.',
                  presetExample: 'Present, Talk',
                },
                {
                  title: '4. Follow Through & Overlapping Action',
                  desc: 'When the main torso stops, secondary elements like hair, arms, and accessories continue moving to settle naturally.',
                  presetExample: 'Jump landing, Wave recoil',
                },
                {
                  title: '5. Slow In and Slow Out',
                  desc: 'Softening start and end motions using spring curves and easeInOut rather than mechanical linear speed.',
                  presetExample: 'All Presets',
                },
                {
                  title: '6. Arcs',
                  desc: 'Natural actions follow curved paths rather than straight lines. Head turns and waving hands traverse gentle circular trajectories.',
                  presetExample: 'Wave, Dance, Walk',
                },
                {
                  title: '7. Exaggeration',
                  desc: 'Pushing motions beyond reality for dramatic impact and comedic delight. Elastic stretch leaps and wild shivering takes.',
                  presetExample: 'Shock, Celebrate, Dance',
                },
                {
                  title: '8. Secondary Action',
                  desc: 'Subtle actions enriching the primary motion—such as facial visemes during talking or rhythmic hair swaying during walks.',
                  presetExample: 'Talk, Walk, Idle',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-[#1b0c36] p-5 rounded-2xl border border-[#371f5c]"
                >
                  <h4 className="text-sm font-black text-[#ff9900]">{item.title}</h4>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{item.desc}</p>
                  <p className="text-[11px] font-bold text-gray-400 mt-3 flex items-center gap-1">
                    <span className="text-[#a855f7]">Active in:</span> {item.presetExample}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Export Tab */}
      {activeTab === 'code' && (
        <div className="flex-1 p-6 overflow-y-auto bg-[#0e041c]">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Reusable Framer Motion Variant Code</h3>
                <p className="text-xs text-gray-400">
                  Ready-to-use TypeScript snippet for your own scenes and components
                </p>
              </div>
              <button
                id="copy-code-btn"
                type="button"
                onClick={handleCopyCode}
                className="bg-[#ff9900] hover:bg-[#e68700] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Copied to Clipboard!' : 'Copy Snippet'}
              </button>
            </div>

            <div className="bg-[#15072b] p-5 rounded-2xl border border-[#331a57] font-mono text-xs text-gray-200 overflow-x-auto">
              <pre>
{`// 1. Import Framer Motion and the Animation Preset
import { motion } from 'motion/react';
import { cartoonVariants } from './animations/toonVariants';
import ToonCharacter from './components/ToonCharacter';

// 2. Drop into any React view with full cartoon physics
export function MyCartoonScene() {
  return (
    <div className="flex items-center justify-center p-8">
      <ToonCharacter
        character="${selectedCharacter}"
        preset="${activePreset}"
        speedMultiplier={${speedMultiplier}}
        squashIntensity={${squashIntensity}}
        showCartoonEffects={${showCartoonFX}}
        className="w-48 h-64"
      />
    </div>
  );
}

// 3. Variant definition for "${activePreset}":
export const ${activePreset}Variant = ${JSON.stringify(cartoonVariants[activePreset], null, 2)};`}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  if (mode === 'modal') {
    return (
      <div id="animation-library-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#ff9900]/50">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default CartoonAnimationLibrary;
