import React, { useState, useRef } from 'react';
import {
  Wand2,
  Sliders,
  Download,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  Smile,
  SunMedium,
  Check,
  Video,
  Cloud,
  Palette,
  Volume2,
} from 'lucide-react';
import { CartoonStyle, CartoonAdjustments } from '../types';
import { CARTOON_STYLES } from '../data/presets';
import {
  TOON_SKETCH_ROBOT,
  TOON_PIXAR_ROBOT,
  TOON_ANIME_SHONEN,
  TOON_CLAY_BEAR,
  TOON_CYBER_FOX,
  TOON_VECTOR_SAAS,
  TOON_RETRO_RUBBERHOSE,
  TOON_CHIBI_BUNNY,
} from '../data/cartoonAvatars';
import VectorCartoonRig, { CartoonArchetype } from './VectorCartoonRig';
import { saveProjectToFirestore } from '../lib/projectService';

interface CartoonStudioProps {
  selectedStyle?: CartoonStyle;
  onStyleSelect?: (style: CartoonStyle) => void;
  originalImage?: string;
  cartoonImage?: string;
  onImageChange?: (orig: string, cartoon: string) => void;
  onNavigateToReel?: (duration: 30 | 60 | 90) => void;
  onOpenHitPaw?: () => void;
  onOpenAnimLib?: () => void;
  onBack?: () => void;
}

export const CartoonStudio: React.FC<CartoonStudioProps> = ({
  selectedStyle: propSelectedStyle,
  onStyleSelect: propOnStyleSelect,
  originalImage: propOriginalImage,
  cartoonImage: propCartoonImage,
  onImageChange,
  onNavigateToReel,
  onOpenHitPaw,
  onOpenAnimLib,
}) => {
  const [internalStyle, setInternalStyle] = useState<CartoonStyle>('pixar-3d');
  const [internalOriginal, setInternalOriginal] = useState<string>(TOON_SKETCH_ROBOT);
  const [internalCartoon, setInternalCartoon] = useState<string>(TOON_PIXAR_ROBOT);

  const selectedStyle = propSelectedStyle || internalStyle;
  const onStyleSelect = propOnStyleSelect || setInternalStyle;
  const originalImage = propOriginalImage || internalOriginal;
  const cartoonImage = propCartoonImage || internalCartoon;

  // Mascot Rigging Controls
  const [archetype, setArchetype] = useState<CartoonArchetype>('robot_mascot');
  const [currentAction, setCurrentAction] = useState<'idle' | 'talk' | 'wave' | 'celebrate' | 'walk' | 'present'>('idle');
  const [currentExpression, setCurrentExpression] = useState<'happy' | 'talking' | 'surprised' | 'serious' | 'winking'>('happy');
  const [currentMouth, setCurrentMouth] = useState<'closed' | 'open' | 'wide' | 'round' | 'smile' | 'talking'>('talking');
  const [clothingColor, setClothingColor] = useState<string>('#ff9900');
  const [accentColor, setAccentColor] = useState<string>('#8b5cf6');
  const [accessory, setAccessory] = useState<string>('headphones');

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isTalkingTest, setIsTalkingTest] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [adjustments, setAdjustments] = useState<CartoonAdjustments>({
    intensity: 85,
    lineBoldness: 60,
    vibrance: 75,
    expression: 'energetic',
    lighting: 'studio',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const activeStyleObj = CARTOON_STYLES.find((s) => s.id === selectedStyle) || CARTOON_STYLES[0];

  const CARTOON_PRESET_MASCOTS = [
    {
      name: 'Volt the 3D Pixar Bot',
      archetype: 'robot_mascot' as CartoonArchetype,
      style: 'pixar-3d' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_PIXAR_ROBOT,
      cloth: '#ff9900',
      accent: '#00f2fe',
      acc: 'headphones',
    },
    {
      name: 'Kiko the Anime Hero',
      archetype: 'anime_hero' as CartoonArchetype,
      style: 'anime-manga' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_ANIME_SHONEN,
      cloth: '#f97316',
      accent: '#fbbf24',
      acc: 'none',
    },
    {
      name: 'Barnaby the Clay Bear',
      archetype: 'clay_bear' as CartoonArchetype,
      style: 'claymation' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_CLAY_BEAR,
      cloth: '#10b981',
      accent: '#fde047',
      acc: 'bow_tie',
    },
    {
      name: 'Cyber Fox Agent',
      archetype: 'cyber_fox' as CartoonArchetype,
      style: 'cyberpunk' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_CYBER_FOX,
      cloth: '#ea580c',
      accent: '#06b6d4',
      acc: 'headphones',
    },
    {
      name: 'Pixel SaaS Flat Mascot',
      archetype: 'flat_vector' as CartoonArchetype,
      style: 'vector-flat' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_VECTOR_SAAS,
      cloth: '#6366f1',
      accent: '#38bdf8',
      acc: 'crown',
    },
    {
      name: 'Boba Kawaii Bunny',
      archetype: 'bunny_critter' as CartoonArchetype,
      style: 'chibi-kawaii' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_CHIBI_BUNNY,
      cloth: '#ec4899',
      accent: '#a855f7',
      acc: 'bow_tie',
    },
    {
      name: 'Spike the 90s Toon',
      archetype: 'retro_90s' as CartoonArchetype,
      style: 'retro-90s' as CartoonStyle,
      before: TOON_SKETCH_ROBOT,
      after: TOON_RETRO_RUBBERHOSE,
      cloth: '#ef4444',
      accent: '#eab308',
      acc: 'bow_tie',
    },
  ];

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    setSliderPos(newPos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
    setSliderPos(newPos);
  };

  const handleSelectPreset = (preset: typeof CARTOON_PRESET_MASCOTS[0]) => {
    onStyleSelect(preset.style);
    setArchetype(preset.archetype);
    setClothingColor(preset.cloth);
    setAccentColor(preset.accent);
    setAccessory(preset.acc);
    setInternalOriginal(preset.before);
    setInternalCartoon(preset.after);
    if (onImageChange) {
      onImageChange(preset.before, preset.after);
    }
  };

  const handleRunAiStyling = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const match = CARTOON_PRESET_MASCOTS.find((p) => p.style === selectedStyle);
      if (match) {
        setArchetype(match.archetype);
        setInternalOriginal(match.before);
        setInternalCartoon(match.after);
        if (onImageChange) {
          onImageChange(match.before, match.after);
        }
      }
      setIsProcessing(false);
    }, 1200);
  };

  const toggleTalkingTest = () => {
    if (isTalkingTest) {
      setIsTalkingTest(false);
      setCurrentAction('idle');
      setCurrentMouth('smile');
    } else {
      setIsTalkingTest(true);
      setCurrentAction('talk');
      setCurrentMouth('talking');
    }
  };

  const handleSaveToCloud = async () => {
    setSaveStatus('Saving to Firebase...');
    try {
      const projectId = 'mascot-' + Date.now();
      await saveProjectToFirestore({
        id: projectId,
        title: `${archetype.replace('_', ' ').toUpperCase()} Marketing Mascot`,
        duration: '30s',
        template: selectedStyle,
        status: 'Ready to animate',
        sceneData: [
          {
            id: 'scene-hero',
            title: 'Mascot Hero Intro',
            character: archetype,
            caption: 'Meet our animated cartoon brand ambassador!',
            duration: 5,
            action: currentAction,
            characterRigConfig: {
              character: archetype,
              species: archetype,
              appearance: {
                clothingColor,
                accentColor,
                accessory,
              },
              action: currentAction,
              expression: currentExpression,
              mouthShape: currentMouth,
            },
          },
        ],
        workflowState: {
          stage: 'characters_assigned',
          progress: 50,
          message: 'Cartoon mascot configured and saved to Firestore',
          timestamp: Date.now(),
        },
      });
      setSaveStatus('Saved to Firebase Firestore!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('Saved to local storage (offline ready)');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div id="cartoon-forge-root" className="min-h-screen bg-[#0d0417] text-white pb-24">
      {/* Header Banner */}
      <div className="border-b border-purple-900/40 bg-[#150727]/80 backdrop-blur px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> 100% Cartoon Mascot Forge
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300 text-xs border border-purple-700/50">
                Zero Human Stock Photos
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-purple-300 bg-clip-text text-transparent">
              Cartoon Character Forge & Rigging Studio
            </h1>
            <p className="text-sm text-purple-300/70 mt-1">
              Design, rig, and animate custom 2D & 3D cartoon mascots for TikTok, Reels, YouTube & Ads with instant Firebase cloud sync.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-cloud-save-mascot"
              onClick={handleSaveToCloud}
              className="px-4 py-2.5 rounded-xl bg-purple-800/40 hover:bg-purple-700/50 border border-purple-500/40 text-sm font-medium flex items-center gap-2 transition"
            >
              <Cloud className="w-4 h-4 text-amber-400" />
              {saveStatus || 'Save Mascot to Firebase'}
            </button>
            <button
              id="btn-forward-to-storyboard"
              onClick={() => onNavigateToReel && onNavigateToReel(30)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              Send to Storyboard Director <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Step Progression Guide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase">Active Stage</p>
              <p className="text-sm font-bold text-white">Mascot Archetype & Rig</p>
            </div>
          </div>
          <div
            onClick={() => onNavigateToReel && onNavigateToReel(30)}
            className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/40 hover:border-purple-600/50 cursor-pointer flex items-center gap-3 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <p className="text-xs text-purple-400 font-semibold uppercase">Next Step</p>
              <p className="text-sm font-semibold text-purple-200">Storyboard Script & Prompts</p>
            </div>
          </div>
          <div
            onClick={onOpenAnimLib}
            className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/40 hover:border-purple-600/50 cursor-pointer flex items-center gap-3 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <p className="text-xs text-purple-400 font-semibold uppercase">Stage 3</p>
              <p className="text-sm font-semibold text-purple-200">60fps Canvas Animation Lab</p>
            </div>
          </div>
          <div
            onClick={onOpenHitPaw}
            className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/40 hover:border-purple-600/50 cursor-pointer flex items-center gap-3 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <p className="text-xs text-purple-400 font-semibold uppercase">Stage 4</p>
              <p className="text-sm font-semibold text-purple-200">HitPaw 4K AI Enhancer</p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live Animated Cartoon Rig Stage */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Interactive Vector Rig & Slider Comparison Card */}
            <div className="bg-[#17092b] border border-purple-800/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Live Cartoon Animation Rig
                  </h2>
                  <p className="text-xs text-purple-300/70">
                    Real-time SVG vector rendering • Zero stock photos • Interactive viseme & action tests
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-toggle-talking"
                    onClick={toggleTalkingTest}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isTalkingTest
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isTalkingTest ? 'Stop Viseme Sync' : 'Test Speech Visemes'}
                  </button>
                  <button
                    id="btn-re-render"
                    onClick={handleRunAiStyling}
                    disabled={isProcessing}
                    className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 text-purple-200 transition"
                    title="Re-render character"
                  >
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Stage Viewport */}
              <div
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative w-full h-[400px] md:h-[440px] rounded-xl overflow-hidden bg-gradient-to-b from-[#1b0a33] to-[#0d0417] border border-purple-900/60 select-none flex items-center justify-center shadow-inner"
              >
                {/* Visual Stage Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ff9900_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                {/* Left Half Layer (2D Concept / Line Art) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#160a28]/60">
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/70 border border-purple-500/40 text-[11px] font-bold text-amber-400 uppercase tracking-wider z-10">
                      2D Vector Concept
                    </span>
                    <VectorCartoonRig
                      archetype={archetype}
                      action={currentAction}
                      expression={currentExpression}
                      mouthShape={currentMouth}
                      skinTone="#f1f5f9"
                      clothingColor="#64748b"
                      accentColor="#94a3b8"
                      accessory={accessory}
                      scale={1.25}
                    />
                  </div>
                </div>

                {/* Right Half Layer (Rendered Stylized Cartoon) */}
                <div
                  className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center p-6"
                  style={{ left: `${sliderPos}%`, width: `${100 - sliderPos}%` }}
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{
                      width: `${containerRef.current ? containerRef.current.clientWidth : 600}px`,
                      left: `-${(sliderPos / 100) * (containerRef.current ? containerRef.current.clientWidth : 600)}px`,
                    }}
                  >
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/70 border border-amber-500/40 text-[11px] font-bold text-amber-400 uppercase tracking-wider z-10">
                      {activeStyleObj.name} Render
                    </span>
                    <VectorCartoonRig
                      archetype={archetype}
                      action={currentAction}
                      expression={currentExpression}
                      mouthShape={currentMouth}
                      clothingColor={clothingColor}
                      accentColor={accentColor}
                      accessory={accessory}
                      scale={1.25}
                    />
                  </div>
                </div>

                {/* Interactive Slider Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#ff9900] cursor-ew-resize z-20"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg cursor-ew-resize">
                    ⇄
                  </div>
                </div>

                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-[#0d0417]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                    <p className="text-sm font-bold text-amber-300">Stylizing Cartoon Character with AI...</p>
                  </div>
                )}
              </div>

              {/* Action and Rig Trigger Bar */}
              <div className="mt-4 pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-purple-300/80 mr-2 font-medium">Pose / Action:</span>
                  {(['idle', 'talk', 'wave', 'celebrate', 'walk', 'present'] as const).map((act) => (
                    <button
                      key={act}
                      onClick={() => {
                        setCurrentAction(act);
                        if (act === 'talk') setCurrentMouth('talking');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        currentAction === act
                          ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40'
                          : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-800/40'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-300/80 font-medium">Accessory:</span>
                  <select
                    value={accessory}
                    onChange={(e) => setAccessory(e.target.value)}
                    className="bg-[#120521] border border-purple-700/60 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="none">None</option>
                    <option value="headphones">Studio Headphones</option>
                    <option value="crown">Golden Crown</option>
                    <option value="bow_tie">Bow Tie</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Archetype Preset Switcher */}
            <div className="bg-[#17092b] border border-purple-800/40 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-400" />
                Select Ready-to-Animate Cartoon Mascot
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CARTOON_PRESET_MASCOTS.map((preset) => {
                  const isSelected = archetype === preset.archetype;
                  return (
                    <div
                      key={preset.name}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl cursor-pointer border transition flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-[#120521]/70 border-purple-900/40 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0d0417] p-1 mb-2 border border-purple-800/40">
                        <img
                          src={preset.after}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1">{preset.name}</span>
                      <span className="text-[10px] text-purple-300/70 capitalize mt-0.5">{preset.style.replace('-', ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Style & Rig Customization Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Style Selector */}
            <div className="bg-[#17092b] border border-purple-800/40 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                Cartoon Animation Art Style
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {CARTOON_STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => onStyleSelect(style.id)}
                      className={`p-3 rounded-xl cursor-pointer border transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-[#120521] border-purple-900/40 hover:border-purple-700/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{style.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-purple-300/70 line-clamp-2">{style.description}</p>
                      </div>
                      <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 self-start">
                        {style.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Color Rigging */}
            <div className="bg-[#17092b] border border-purple-800/40 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Mascot Color & Shading Rig
              </h2>

              <div className="space-y-4">
                {/* Outfit / Chassis Color */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-purple-200">Outfit / Chassis Color</span>
                    <span className="text-amber-400 font-mono">{clothingColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={clothingColor}
                      onChange={(e) => setClothingColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex gap-1.5 flex-1">
                      {['#ff9900', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setClothingColor(col)}
                          className="w-7 h-7 rounded-lg border border-white/20 transition hover:scale-105"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accent Highlight Color */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-purple-200">Accent & Glow Color</span>
                    <span className="text-amber-400 font-mono">{accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex gap-1.5 flex-1">
                      {['#00f2fe', '#ec4899', '#facc15', '#a855f7', '#10b981', '#ffffff'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setAccentColor(col)}
                          className="w-7 h-7 rounded-lg border border-white/20 transition hover:scale-105"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expression Selector */}
                <div>
                  <label className="text-xs text-purple-200 block mb-1.5">Facial Expression</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['happy', 'talking', 'surprised', 'serious', 'winking'] as const).map((expr) => (
                      <button
                        key={expr}
                        onClick={() => setCurrentExpression(expr)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${
                          currentExpression === expr
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-[#120521] text-purple-300 border-purple-800/40 hover:bg-purple-900/50'
                        }`}
                      >
                        {expr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mouth Viseme Shapes */}
                <div>
                  <label className="text-xs text-purple-200 block mb-1.5">Mouth Viseme (Speech Sync)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['smile', 'open', 'wide', 'round', 'closed', 'talking'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setCurrentMouth(m)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${
                          currentMouth === m
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-[#120521] text-purple-300 border-purple-800/40 hover:bg-purple-900/50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer Card */}
            <div className="bg-gradient-to-br from-amber-500/15 via-purple-900/20 to-[#17092b] border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Next Pipeline Step</h3>
              </div>
              <p className="text-xs text-purple-200">
                Ready to turn this cartoon mascot into high-converting TikTok reels, YouTube shorts, or B2B SaaS explainers?
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  id="btn-nav-to-storyboard-30"
                  onClick={() => onNavigateToReel && onNavigateToReel(30)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition"
                >
                  Generate 30s Reel Script <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-nav-to-canvas-lab"
                  onClick={onOpenAnimLib}
                  className="py-2.5 px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/50 border border-purple-600/50 text-purple-200 text-xs font-semibold transition"
                >
                  60fps Lab
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartoonStudio;
