import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Palette,
  Sliders,
  Grid,
  Eye,
  Maximize2,
  Film,
  Zap,
  Layers,
  ChevronRight,
  Smile,
  Activity,
  Check,
} from 'lucide-react';
import VectorCartoonRig, { CartoonArchetype } from './components/VectorCartoonRig';
import CartoonAnimationLibrary from './components/CartoonAnimationLibrary';

interface ArchetypeMeta {
  id: CartoonArchetype;
  name: string;
  genre: string;
  description: string;
  defaultClothing: string;
  defaultAccent: string;
  defaultSkin: string;
}

const ARCHETYPES: ArchetypeMeta[] = [
  {
    id: 'robot_mascot',
    name: 'Robot Mascot',
    genre: '3D Pixar Tech',
    description: 'Rounded mecha chassis with pulsing antenna, LED optic visor, and thruster boots.',
    defaultClothing: '#ff9900',
    defaultAccent: '#00f2fe',
    defaultSkin: '#cbd5e1',
  },
  {
    id: 'bunny_critter',
    name: 'Bunny Critter',
    genre: '2D Disney Looney',
    description: 'Long floppy ears, buck-tooth grin, cartoon suspenders, and bouncy squash kinematics.',
    defaultClothing: '#ef4444',
    defaultAccent: '#3b82f6',
    defaultSkin: '#ffd3b6',
  },
  {
    id: 'anime_hero',
    name: 'Anime Hero',
    genre: 'Shonen Manga',
    description: 'Spiky aerodynamic hair, glowing energy headband, dual-tone martial tunic.',
    defaultClothing: '#6366f1',
    defaultAccent: '#f59e0b',
    defaultSkin: '#ffd3b6',
  },
  {
    id: 'clay_bear',
    name: 'Clay Bear',
    genre: 'Aardman Stop-Motion',
    description: 'Textured round bear with cozy knitted scarf and expressive button snout.',
    defaultClothing: '#10b981',
    defaultAccent: '#fde047',
    defaultSkin: '#854d0e',
  },
  {
    id: 'cyber_fox',
    name: 'Cyber Fox',
    genre: 'Cyberpunk Neon',
    description: 'Tactical visor goggles, dual cyber ears, and high-contrast neo-Tokyo aesthetics.',
    defaultClothing: '#ec4899',
    defaultAccent: '#06b6d4',
    defaultSkin: '#ea580c',
  },
  {
    id: 'retro_90s',
    name: 'Retro Rubber Hose',
    genre: '1930s Vintage Toon',
    description: 'Pie eyes, white cartoon gloves, oversized yellow clown shoes, and fluid limbs.',
    defaultClothing: '#ef4444',
    defaultAccent: '#eab308',
    defaultSkin: '#ffffff',
  },
  {
    id: 'flat_vector',
    name: 'Flat Vector Mascot',
    genre: 'SaaS Tech Minimal',
    description: 'Smooth pill geometry with floating orbital limbs and crisp tech color blocking.',
    defaultClothing: '#8b5cf6',
    defaultAccent: '#38bdf8',
    defaultSkin: '#ffffff',
  },
];

const PRESET_CLOTHING_COLORS = [
  '#ff9900',
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#06b6d4',
  '#1e1b4b',
  '#f43f5e',
];

const PRESET_ACCENT_COLORS = [
  '#00f2fe',
  '#8b5cf6',
  '#fbbf24',
  '#ec4899',
  '#10b981',
  '#38bdf8',
  '#f97316',
  '#a855f7',
  '#e2e8f0',
  '#ff0055',
];

const STAGE_BACKDROPS = [
  { id: 'obsidian', label: 'Obsidian Night', bg: 'bg-[#0d0417]' },
  { id: 'studio', label: 'Studio Spotlight', bg: 'bg-gradient-to-b from-[#1b0833] to-[#0a0314]' },
  { id: 'blueprint', label: 'Blueprint Grid', bg: 'bg-[#0f172a]' },
  { id: 'sunset', label: 'Sunset Glow', bg: 'bg-gradient-to-b from-[#2e1065] via-[#450a0a] to-[#0f041d]' },
  { id: 'cyber', label: 'Cyber Dark', bg: 'bg-[#020617]' },
];

export function App() {
  // Navigation between the two requested full-screen inspection tools
  const [activeView, setActiveView] = useState<'vector-rigs' | 'animation-principles'>('vector-rigs');

  // Animation Play/Pause & Motion Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedArchetype, setSelectedArchetype] = useState<CartoonArchetype>('robot_mascot');
  const [action, setAction] = useState<'idle' | 'talk' | 'wave' | 'celebrate' | 'walk' | 'present'>('talk');
  const [expression, setExpression] = useState<'happy' | 'talking' | 'surprised' | 'serious' | 'winking'>('happy');
  const [mouthShape, setMouthShape] = useState<'closed' | 'open' | 'wide' | 'round' | 'smile' | 'talking'>('talking');
  
  // Custom Color Styling
  const [clothingColor, setClothingColor] = useState<string>('#ff9900');
  const [accentColor, setAccentColor] = useState<string>('#00f2fe');
  const [skinTone, setSkinTone] = useState<string>('#cbd5e1');
  const [accessory, setAccessory] = useState<'none' | 'crown' | 'headphones' | 'bow_tie'>('none');
  
  // Scale & View Mode
  const [modelScale, setModelScale] = useState<number>(1.2);
  const [galleryMode, setGalleryMode] = useState<'spotlight' | 'grid-all'>('spotlight');
  const [backdrop, setBackdrop] = useState<string>('studio');

  // Sync default palette when switching archetype
  const handleSelectArchetype = (archId: CartoonArchetype) => {
    setSelectedArchetype(archId);
    const meta = ARCHETYPES.find((a) => a.id === archId);
    if (meta) {
      setClothingColor(meta.defaultClothing);
      setAccentColor(meta.defaultAccent);
      setSkinTone(meta.defaultSkin);
    }
  };

  // Keyboard shortcut: Spacebar toggles Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeMeta = ARCHETYPES.find((a) => a.id === selectedArchetype) || ARCHETYPES[0];
  const activeBg = STAGE_BACKDROPS.find((b) => b.id === backdrop) || STAGE_BACKDROPS[0];

  return (
    <div className="min-h-screen bg-[#090312] text-zinc-100 flex flex-col font-sans selection:bg-[#ff9900] selection:text-black">
      {/* Top Gallery Header Bar with Direct Play/Pause and View Switches */}
      <header className="sticky top-0 z-50 bg-[#120521]/95 backdrop-blur-md border-b border-[#2d124d] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Mode Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff9900] to-[#ff4400] flex items-center justify-center shadow-lg shadow-[#ff9900]/25">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  ToneMark <span className="text-[#ff9900]">Character & Motion Inspector</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                  Direct Preview
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Full-screen inspection of 7 vector cartoon archetypes, live visemes, color schemes, and kinematics.
              </p>
            </div>
          </div>

          {/* Master View Switcher (Vector Cartoon Rig vs Cartoon Animation Library) */}
          <div className="flex items-center bg-[#1d0a36] p-1 rounded-xl border border-purple-900/60">
            <button
              id="btn-view-vector-rigs"
              onClick={() => setActiveView('vector-rigs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeView === 'vector-rigs'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Vector Cartoon Rig</span>
            </button>
            <button
              id="btn-view-animation-principles"
              onClick={() => setActiveView('animation-principles')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeView === 'animation-principles'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cartoon Animation Library</span>
            </button>
          </div>

          {/* Master Play/Pause Animation Control Pill */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-global-play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg transition cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
              title="Toggle Play / Pause (Spacebar)"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE ANIMATION' : 'RESUME PLAY'}</span>
            </button>

            <button
              id="btn-reset-motion"
              onClick={() => {
                setIsPlaying(true);
                setAction('idle');
                setExpression('happy');
                setMouthShape('smile');
              }}
              className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 text-purple-200 transition"
              title="Reset to Idle Rest Pose"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: VECTOR CARTOON RIG FULL-SCREEN GALLERY & INSPECTOR */}
      {activeView === 'vector-rigs' && (
        <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Quick Archetype Selector Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-purple-900/40">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
              {ARCHETYPES.map((arch) => (
                <button
                  key={arch.id}
                  id={`select-arch-${arch.id}`}
                  onClick={() => handleSelectArchetype(arch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedArchetype === arch.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-[#18092e] text-purple-200 hover:bg-purple-900/50 hover:text-white border border-purple-900/40'
                  }`}
                >
                  <span>{arch.name}</span>
                  <span className="text-[10px] opacity-75 font-normal hidden md:inline">({arch.genre})</span>
                </button>
              ))}
            </div>

            {/* Gallery Layout Mode Toggle (Spotlight vs 7 Models Grid) */}
            <div className="flex items-center space-x-1 bg-[#16072b] p-1 rounded-xl border border-purple-900/50">
              <button
                id="btn-mode-spotlight"
                onClick={() => setGalleryMode('spotlight')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  galleryMode === 'spotlight'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Spotlight Deck</span>
              </button>
              <button
                id="btn-mode-grid"
                onClick={() => setGalleryMode('grid-all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  galleryMode === 'grid-all'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>All 7 Models Grid</span>
              </button>
            </div>
          </div>

          {/* SPOTLIGHT MODE: HERO INSPECTION STAGE + CONTROL SUITE */}
          {galleryMode === 'spotlight' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Full-Screen Stage (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div
                  className={`relative rounded-3xl border-2 border-purple-800/60 p-8 flex flex-col items-center justify-center min-h-[460px] shadow-2xl overflow-hidden transition-all duration-300 ${activeBg.bg}`}
                >
                  {/* Status Badges Overlay */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-700/50 text-amber-300 text-xs font-bold flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      <span>{isPlaying ? 'Motion Active' : 'Animation Paused'}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-700/50 text-purple-200 text-xs font-mono">
                      Action: {action}
                    </span>
                  </div>

                  {/* Backdrop Selector Overlay */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/10">
                    {STAGE_BACKDROPS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBackdrop(b.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                          backdrop === b.id ? 'bg-amber-500 text-slate-950' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {b.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Live Vector Rig Subject */}
                  <div className="flex items-center justify-center w-full my-6">
                    <VectorCartoonRig
                      archetype={selectedArchetype}
                      action={action}
                      expression={expression}
                      mouthShape={mouthShape}
                      clothingColor={clothingColor}
                      accentColor={accentColor}
                      skinTone={skinTone}
                      accessory={accessory}
                      scale={modelScale}
                      isPaused={!isPlaying}
                      className="transition-all duration-200"
                    />
                  </div>

                  {/* Bottom Character Info Banner */}
                  <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-purple-700/40 rounded-2xl p-3.5 flex items-center justify-between mt-auto">
                    <div>
                      <h3 className="text-sm font-black text-white">{activeMeta.name}</h3>
                      <p className="text-[11px] text-purple-300">{activeMeta.description}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 pl-3 border-l border-purple-800/60">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: clothingColor }} title="Clothing Color" />
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: accentColor }} title="Accent Color" />
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: skinTone }} title="Skin Tone" />
                    </div>
                  </div>
                </div>

                {/* Quick Action Playback Triggers */}
                <div className="p-4 rounded-2xl bg-[#15072b] border border-purple-800/40 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Animation Actions:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['talk', 'celebrate', 'wave', 'walk', 'present', 'idle'] as const).map((act) => (
                      <button
                        key={act}
                        id={`btn-quick-act-${act}`}
                        onClick={() => {
                          setAction(act);
                          if (!isPlaying) setIsPlaying(true);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize ${
                          action === act
                            ? 'bg-amber-500 text-slate-950 font-black shadow'
                            : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/40'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Model Controls, Colors & Expressions Suite (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. Motion & Kinematics Control Card */}
                <div className="p-5 rounded-2xl bg-[#15072b] border border-purple-800/40 shadow-xl space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center justify-between border-b border-purple-900/40 pb-2">
                    <span className="flex items-center space-x-1.5">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>Pose, Kinematics & Scale</span>
                    </span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`text-xs px-2 py-0.5 rounded-md font-bold ${isPlaying ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                    >
                      {isPlaying ? 'Pause Motion' : 'Play Motion'}
                    </button>
                  </h3>

                  {/* Body Action Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-300">Body Action Kinematics</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['idle', 'talk', 'wave', 'celebrate', 'walk', 'present'] as const).map((act) => (
                        <button
                          key={act}
                          onClick={() => setAction(act)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition ${
                            action === act
                              ? 'bg-purple-600 text-white shadow'
                              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-800/30'
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Facial Expression Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-300">Facial Expression</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['happy', 'talking', 'surprised', 'serious', 'winking'] as const).map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExpression(exp)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition ${
                            expression === exp
                              ? 'bg-amber-500 text-slate-950 shadow'
                              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-800/30'
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mouth Viseme Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-300">Mouth Viseme / Phoneme Shape</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['talking', 'smile', 'open', 'wide', 'round', 'closed'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMouthShape(m)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition ${
                            mouthShape === m
                              ? 'bg-pink-600 text-white shadow'
                              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-800/30'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scale Zoom Slider */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-purple-300">
                      <span>Model Scale</span>
                      <span className="font-mono text-amber-400">{modelScale.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.8"
                      step="0.1"
                      value={modelScale}
                      onChange={(e) => setModelScale(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Color Palette & Accessories Card */}
                <div className="p-5 rounded-2xl bg-[#15072b] border border-purple-800/40 shadow-xl space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center space-x-1.5 border-b border-purple-900/40 pb-2">
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span>Color Swatches & Accessories</span>
                  </h3>

                  {/* Clothing Color Swatches */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-300">Primary Clothing Color</label>
                      <span className="text-[10px] font-mono text-zinc-400">{clothingColor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_CLOTHING_COLORS.map((col) => (
                        <button
                          key={col}
                          onClick={() => setClothingColor(col)}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            clothingColor === col ? 'scale-125 border-white shadow-md' : 'border-black/50 hover:scale-110'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                      <input
                        type="color"
                        value={clothingColor}
                        onChange={(e) => setClothingColor(e.target.value)}
                        className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
                        title="Custom Hex Color"
                      />
                    </div>
                  </div>

                  {/* Accent Glow Color Swatches */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-300">Accent & Glow Color</label>
                      <span className="text-[10px] font-mono text-zinc-400">{accentColor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_ACCENT_COLORS.map((col) => (
                        <button
                          key={col}
                          onClick={() => setAccentColor(col)}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            accentColor === col ? 'scale-125 border-white shadow-md' : 'border-black/50 hover:scale-110'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
                        title="Custom Hex Color"
                      />
                    </div>
                  </div>

                  {/* Accessory Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-300">Costume Accessory</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['none', 'crown', 'headphones', 'bow_tie'] as const).map((acc) => (
                        <button
                          key={acc}
                          onClick={() => setAccessory(acc)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition ${
                            accessory === acc
                              ? 'bg-amber-500 text-slate-950 shadow'
                              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-800/30'
                          }`}
                        >
                          {acc.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* GRID-ALL MODE: ALL 7 CHARACTER MODELS SIDE-BY-SIDE GALLERY */}
          {galleryMode === 'grid-all' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center space-x-2">
                    <Grid className="w-5 h-5 text-amber-400" />
                    <span>All 7 Vector Cartoon Models Live Motion Roster</span>
                  </h2>
                  <p className="text-xs text-purple-300">
                    Simultaneous rendering of all characters executing live animation action: <strong className="text-amber-400 capitalize">{action}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      isPlaying ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950 font-black'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause All' : 'Play All'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype === arch.id;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        handleSelectArchetype(arch.id);
                        setGalleryMode('spotlight');
                      }}
                      className={`p-4 rounded-2xl bg-[#16072b] border transition flex flex-col items-center justify-between cursor-pointer group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                          : 'border-purple-800/40 hover:border-purple-600/60'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                          {arch.genre}
                        </span>
                        <span className="text-[10px] text-purple-400 group-hover:text-white transition flex items-center space-x-0.5">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Mascot Display Canvas */}
                      <div className="w-full h-52 flex items-center justify-center relative overflow-hidden rounded-xl bg-black/30 border border-purple-900/30 p-2">
                        <VectorCartoonRig
                          archetype={arch.id}
                          action={action}
                          expression={expression}
                          mouthShape={mouthShape}
                          clothingColor={arch.defaultClothing}
                          accentColor={arch.defaultAccent}
                          skinTone={arch.defaultSkin}
                          scale={1}
                          isPaused={!isPlaying}
                        />
                      </div>

                      <div className="w-full mt-3 text-center">
                        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {arch.name}
                        </h4>
                        <p className="text-[11px] text-purple-300 line-clamp-1 mt-0.5">
                          {arch.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      )}

      {/* VIEW 2: CARTOON ANIMATION PRINCIPLES & PRESETS LIBRARY */}
      {activeView === 'animation-principles' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-4 pb-3 border-b border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Cartoon Animation Library & 12 Disney Principles</span>
              </h2>
              <p className="text-xs text-purple-300 mt-0.5">
                Explore physics kinematics, squash & stretch, anticipation, and sound-synchronized cartoon presets.
              </p>
            </div>

            <button
              onClick={() => setActiveView('vector-rigs')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-xs font-bold text-purple-200 transition"
            >
              Back to Vector Cartoon Rigs ➔
            </button>
          </div>

          {/* Mounted CartoonAnimationLibrary in Embedded Full-Screen Mode */}
          <div className="rounded-3xl border-2 border-purple-800/50 overflow-hidden shadow-2xl bg-[#140624]">
            <CartoonAnimationLibrary
              isOpen={true}
              mode="embedded"
              initialPreset="jump"
            />
          </div>
        </main>
      )}

      {/* Minimal Bottom Bar */}
      <footer className="border-t border-[#230f3b] bg-[#0c0317] py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-zinc-400">
            <Film className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-white">ToneMark Vector Cartoon Rig & Animation Inspector</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[10px]">Space</kbd> to Play / Pause live animations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
