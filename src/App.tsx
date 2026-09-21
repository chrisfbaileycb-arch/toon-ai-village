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
  Home,
  Video,
  BookOpen,
  Settings,
  Wand2,
} from 'lucide-react';
import VectorCartoonRig, { CartoonArchetype } from './components/VectorCartoonRig';
import CartoonAnimationLibrary from './components/CartoonAnimationLibrary';
import CartoonStudio from './components/CartoonStudio';
import ReelBuilder from './components/ReelBuilder';
import ReelPlayer from './components/ReelPlayer';
import StoryboardEditor from './components/StoryboardEditor';
import HitPawAiToolkit from './components/HitPawAiToolkit';
import FirstProjectOnboarding from './components/FirstProjectOnboarding';
import type { OnboardingSetup } from './components/FirstProjectOnboarding';
import type { CartoonStyle, MarketingReel } from './types';
import { defaultHitPawSettings } from './types';

// ==========================================
// APP ROUTING
// ==========================================

type AppView = 'onboarding' | 'studio' | 'reel-builder' | 'storyboard' | 'reel-preview' | 'animation-lab' | 'inspector';

// ==========================================
// INSPECTOR CONSTANTS (PRESERVED)
// ==========================================

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
  '#ff9900', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6',
  '#ec4899', '#f59e0b', '#06b6d4', '#1e1b4b', '#f43f5e',
];

const PRESET_ACCENT_COLORS = [
  '#00f2fe', '#8b5cf6', '#fbbf24', '#ec4899', '#10b981',
  '#38bdf8', '#f97316', '#a855f7', '#e2e8f0', '#ff0055',
];

const STAGE_BACKDROPS = [
  { id: 'obsidian', label: 'Obsidian Night', bg: 'bg-[#0d0417]' },
  { id: 'studio', label: 'Studio Spotlight', bg: 'bg-gradient-to-b from-[#1b0833] to-[#0a0314]' },
  { id: 'blueprint', label: 'Blueprint Grid', bg: 'bg-[#0f172a]' },
  { id: 'sunset', label: 'Sunset Glow', bg: 'bg-gradient-to-b from-[#2e1065] via-[#450a0a] to-[#0f041d]' },
  { id: 'cyber', label: 'Cyber Dark', bg: 'bg-[#020617]' },
];

// ==========================================
// GLOBAL NAV
// ==========================================

interface GlobalNavProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
  onHitPawOpen: () => void;
}

function GlobalNav({ view, onViewChange, onHitPawOpen }: GlobalNavProps) {
  const tabs: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'studio', label: 'Studio', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'reel-builder', label: 'Reel Builder', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'animation-lab', label: 'Animation Lab', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'inspector', label: 'Rig Inspector', icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#120521]/95 backdrop-blur-md border-b border-[#2d124d] px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff9900] to-[#ff4400] flex items-center justify-center shadow-lg shadow-[#ff9900]/25">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black tracking-tight text-white">
            Tone<span className="text-[#ff9900]">Mark</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase hidden sm:inline">
            AI Studio
          </span>
        </div>

        {/* Tab Nav */}
        <nav className="flex items-center bg-[#1d0a36] p-1 rounded-xl border border-purple-900/60 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                view === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* HitPaw AI button */}
        <button
          onClick={onHitPawOpen}
          className="px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-purple-500/20 transition"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>HitPaw AI</span>
        </button>
      </div>
    </header>
  );
}

// ==========================================
// MAIN APP
// ==========================================

export function App() {
  // ---------- Routing ----------
  const [view, setView] = useState<AppView>(() => {
    try {
      return localStorage.getItem('toonmark_v1_onboarded') === '1' ? 'studio' : 'onboarding';
    } catch {
      return 'onboarding';
    }
  });

  // ---------- Shared cross-view state ----------
  const [cartoonStyle, setCartoonStyle] = useState<CartoonStyle>('pixar-3d');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [cartoonImage, setCartoonImage] = useState<string>('');
  const [reelDuration, setReelDuration] = useState<30 | 60 | 90>(30);
  const [isGeneratingReel, setIsGeneratingReel] = useState<boolean>(false);
  const [isHitPawOpen, setIsHitPawOpen] = useState<boolean>(false);
  const [generatedReel, setGeneratedReel] = useState<MarketingReel | null>(null);

  // ---------- Inspector state (preserved) ----------
  const [inspectorView, setInspectorView] = useState<'vector-rigs' | 'animation-principles'>('vector-rigs');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedArchetype, setSelectedArchetype] = useState<CartoonArchetype>('robot_mascot');
  const [action, setAction] = useState<'idle' | 'talk' | 'wave' | 'celebrate' | 'walk' | 'present'>('talk');
  const [expression, setExpression] = useState<'happy' | 'talking' | 'surprised' | 'serious' | 'winking'>('happy');
  const [mouthShape, setMouthShape] = useState<'closed' | 'open' | 'wide' | 'round' | 'smile' | 'talking'>('talking');
  const [clothingColor, setClothingColor] = useState<string>('#ff9900');
  const [accentColor, setAccentColor] = useState<string>('#00f2fe');
  const [skinTone, setSkinTone] = useState<string>('#cbd5e1');
  const [accessory, setAccessory] = useState<'none' | 'crown' | 'headphones' | 'bow_tie'>('none');
  const [modelScale, setModelScale] = useState<number>(1.2);
  const [galleryMode, setGalleryMode] = useState<'spotlight' | 'grid-all'>('spotlight');
  const [backdrop, setBackdrop] = useState<string>('studio');

  // ---------- Handlers ----------
  const handleOnboardingComplete = (setup: OnboardingSetup) => {
    try { localStorage.setItem('toonmark_v1_onboarded', '1'); } catch {}
    setView('studio');
  };

  const handleOnboardingSkip = () => {
    try { localStorage.setItem('toonmark_v1_onboarded', '1'); } catch {}
    setView('studio');
  };

  const handleNavigateToReel = (duration: 30 | 60 | 90) => {
    setReelDuration(duration);
    setView('reel-builder');
  };

  const handleReelGenerated = (reel: MarketingReel) => {
    setGeneratedReel(reel);
    setView('storyboard');
  };

  const handleSelectArchetype = (archId: CartoonArchetype) => {
    setSelectedArchetype(archId);
    const meta = ARCHETYPES.find((a) => a.id === archId);
    if (meta) {
      setClothingColor(meta.defaultClothing);
      setAccentColor(meta.defaultAccent);
      setSkinTone(meta.defaultSkin);
    }
  };

  // Spacebar toggles Play/Pause only when inspector is active
  useEffect(() => {
    if (view !== 'inspector') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  const activeMeta = ARCHETYPES.find((a) => a.id === selectedArchetype) || ARCHETYPES[0];
  const activeBg = STAGE_BACKDROPS.find((b) => b.id === backdrop) || STAGE_BACKDROPS[0];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#090312] text-zinc-100 flex flex-col font-sans selection:bg-[#ff9900] selection:text-black">

      {/* HitPaw AI Toolkit — always mounted as a modal overlay */}
      <HitPawAiToolkit
        isOpen={isHitPawOpen}
        onClose={() => setIsHitPawOpen(false)}
        currentSettings={defaultHitPawSettings}
        activeSceneCharacter={cartoonImage}
      />

      {/* ONBOARDING — full screen, no nav */}
      {view === 'onboarding' ? (
        <FirstProjectOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      ) : (
        <>
          {/* GLOBAL NAV */}
          <GlobalNav
            view={view}
            onViewChange={setView}
            onHitPawOpen={() => setIsHitPawOpen(true)}
          />

          {/* STUDIO */}
          {view === 'studio' && (
            <CartoonStudio
              selectedStyle={cartoonStyle}
              onStyleSelect={setCartoonStyle}
              originalImage={originalImage}
              cartoonImage={cartoonImage}
              onImageChange={(orig, cartoon) => {
                setOriginalImage(orig);
                setCartoonImage(cartoon);
              }}
              onNavigateToReel={handleNavigateToReel}
              onOpenHitPaw={() => setIsHitPawOpen(true)}
              onOpenAnimLib={() => setView('animation-lab')}
              onBack={() => {
                try { localStorage.removeItem('toonmark_v1_onboarded'); } catch {}
                setView('onboarding');
              }}
            />
          )}

          {/* REEL BUILDER */}
          {view === 'reel-builder' && (
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              <ReelBuilder
                currentCartoonImage={cartoonImage}
                currentStyle={cartoonStyle}
                initialDuration={reelDuration}
                onReelGenerated={handleReelGenerated}
                isGenerating={isGeneratingReel}
                setIsGenerating={setIsGeneratingReel}
              />
            </main>
          )}

          {view === 'storyboard' && generatedReel && (
            <StoryboardEditor
              reel={generatedReel}
              onUpdateReel={setGeneratedReel}
              onOpenPlayer={() => setView('reel-preview')}
            />
          )}

          {view === 'reel-preview' && generatedReel && (
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              <ReelPlayer
                reel={generatedReel}
                onEditStoryboard={() => setView('storyboard')}
              />
            </main>
          )}

          {/* ANIMATION LAB */}
          {view === 'animation-lab' && (
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              <div className="mb-4 pb-3 border-b border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Cartoon Animation Library &amp; 12 Disney Principles</span>
                  </h2>
                  <p className="text-xs text-purple-300 mt-0.5">
                    Explore physics kinematics, squash &amp; stretch, anticipation, and sound-synchronized cartoon presets.
                  </p>
                </div>
                <button
                  onClick={() => setView('studio')}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-xs font-bold text-purple-200 transition"
                >
                  Back to Studio ➔
                </button>
              </div>
              <div className="rounded-3xl border-2 border-purple-800/50 overflow-hidden shadow-2xl bg-[#140624]">
                <CartoonAnimationLibrary isOpen={true} mode="embedded" initialPreset="jump" />
              </div>
            </main>
          )}

          {/* RIG INSPECTOR (original App.tsx content, preserved) */}
          {view === 'inspector' && (
            <>
              {/* Inspector sub-nav */}
              <div className="bg-[#120521]/95 backdrop-blur-md border-b border-[#2d124d] px-4 sm:px-6 py-2">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-zinc-400 hidden sm:block">
                    Full-screen inspection of 7 vector cartoon archetypes, live visemes, color schemes, and kinematics.
                  </p>
                  <div className="flex items-center bg-[#1d0a36] p-1 rounded-xl border border-purple-900/60">
                    <button
                      onClick={() => setInspectorView('vector-rigs')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        inspectorView === 'vector-rigs'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Vector Cartoon Rig</span>
                    </button>
                    <button
                      onClick={() => setInspectorView('animation-principles')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        inspectorView === 'animation-principles'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Cartoon Animation Library</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
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
              </div>

              {/* Inspector View 1: Vector Rigs */}
              {inspectorView === 'vector-rigs' && (
                <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                  {/* Archetype selector pills */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-purple-900/40">
                    <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
                      {ARCHETYPES.map((arch) => (
                        <button
                          key={arch.id}
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
                    <div className="flex items-center space-x-1 bg-[#16072b] p-1 rounded-xl border border-purple-900/50">
                      <button
                        onClick={() => setGalleryMode('spotlight')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          galleryMode === 'spotlight' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
                        }`}
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Spotlight Deck</span>
                      </button>
                      <button
                        onClick={() => setGalleryMode('grid-all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          galleryMode === 'grid-all' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
                        }`}
                      >
                        <Grid className="w-3 h-3" />
                        <span>All 7 Models Grid</span>
                      </button>
                    </div>
                  </div>

                  {/* SPOTLIGHT MODE */}
                  {galleryMode === 'spotlight' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-7 flex flex-col space-y-4">
                        <div className={`relative rounded-3xl border-2 border-purple-800/60 p-8 flex flex-col items-center justify-center min-h-[460px] shadow-2xl overflow-hidden transition-all duration-300 ${activeBg.bg}`}>
                          <div className="absolute top-4 left-4 flex items-center space-x-2">
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-700/50 text-amber-300 text-xs font-bold flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                              <span>{isPlaying ? 'Motion Active' : 'Animation Paused'}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-700/50 text-purple-200 text-xs font-mono">
                              Action: {action}
                            </span>
                          </div>
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
                          <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-purple-700/40 rounded-2xl p-3.5 flex items-center justify-between mt-auto">
                            <div>
                              <h3 className="text-sm font-black text-white">{activeMeta.name}</h3>
                              <p className="text-[11px] text-purple-300">{activeMeta.description}</p>
                            </div>
                            <div className="flex items-center space-x-1.5 pl-3 border-l border-purple-800/60">
                              <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: clothingColor }} />
                              <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: accentColor }} />
                              <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: skinTone }} />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#15072b] border border-purple-800/40 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-400" />
                            <span>Quick Animation Actions:</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(['talk', 'celebrate', 'wave', 'walk', 'present', 'idle'] as const).map((act) => (
                              <button
                                key={act}
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

                      <div className="lg:col-span-5 space-y-4">
                        <div className="p-5 rounded-2xl bg-[#15072b] border border-purple-800/40 shadow-xl space-y-4">
                          <h3 className="text-sm font-black text-white flex items-center justify-between border-b border-purple-900/40 pb-2">
                            <span className="flex items-center space-x-1.5">
                              <Sliders className="w-4 h-4 text-amber-400" />
                              <span>Pose, Kinematics &amp; Scale</span>
                            </span>
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className={`text-xs px-2 py-0.5 rounded-md font-bold ${isPlaying ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                            >
                              {isPlaying ? 'Pause Motion' : 'Play Motion'}
                            </button>
                          </h3>
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

                        <div className="p-5 rounded-2xl bg-[#15072b] border border-purple-800/40 shadow-xl space-y-4">
                          <h3 className="text-sm font-black text-white flex items-center space-x-1.5 border-b border-purple-900/40 pb-2">
                            <Palette className="w-4 h-4 text-pink-400" />
                            <span>Color Swatches &amp; Accessories</span>
                          </h3>
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
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-purple-300">Accent &amp; Glow Color</label>
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
                              />
                            </div>
                          </div>
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

                  {/* GRID-ALL MODE */}
                  {galleryMode === 'grid-all' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-black text-white flex items-center space-x-2">
                            <Grid className="w-5 h-5 text-amber-400" />
                            <span>All 7 Vector Cartoon Models Live Motion Roster</span>
                          </h2>
                          <p className="text-xs text-purple-300">
                            Simultaneous rendering of all characters executing live animation action:{' '}
                            <strong className="text-amber-400 capitalize">{action}</strong>
                          </p>
                        </div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ARCHETYPES.map((arch) => (
                          <div
                            key={arch.id}
                            onClick={() => {
                              handleSelectArchetype(arch.id);
                              setGalleryMode('spotlight');
                            }}
                            className={`p-4 rounded-2xl bg-[#16072b] border transition flex flex-col items-center justify-between cursor-pointer group hover:scale-[1.02] ${
                              selectedArchetype === arch.id
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
                              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition">{arch.name}</h4>
                              <p className="text-[11px] text-purple-300 line-clamp-1 mt-0.5">{arch.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </main>
              )}

              {/* Inspector View 2: Animation Principles */}
              {inspectorView === 'animation-principles' && (
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                  <div className="rounded-3xl border-2 border-purple-800/50 overflow-hidden shadow-2xl bg-[#140624]">
                    <CartoonAnimationLibrary isOpen={true} mode="embedded" initialPreset="jump" />
                  </div>
                </main>
              )}

              <footer className="border-t border-[#230f3b] bg-[#0c0317] py-4 text-center text-xs text-zinc-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Film className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-white">ToneMark Rig Inspector</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[10px]">Space</kbd>
                    {' '}to Play / Pause live animations
                  </p>
                </div>
              </footer>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
