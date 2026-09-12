import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Video,
  Volume2,
  VolumeX,
  Layers,
  Scissors,
  Sliders,
  Check,
  Play,
  Pause,
  Maximize2,
  X,
  Wand2,
  Zap,
  Flame,
  ArrowRight,
  Music,
  Smile,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import ToonCharacter from './ToonCharacter';
import {
  HitPawFormSettings,
  HitPawCreationMode,
  HitPawAspectRatio,
  HitPawArtStyle,
  defaultHitPawSettings,
} from '../types';

interface HitPawAiToolkitProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings?: HitPawFormSettings;
  onApplySettings?: (settings: HitPawFormSettings) => void;
  activeSceneCharacter?: string;
}

const sampleCharacters = ['Ava', 'Milo', 'Nova', 'Luna', 'Kai'];

export const HitPawAiToolkit: React.FC<HitPawAiToolkitProps> = ({
  isOpen,
  onClose,
  currentSettings = defaultHitPawSettings,
  onApplySettings,
  activeSceneCharacter = 'Ava',
}) => {
  const [activeTab, setActiveTab] = useState<
    'photo_video' | 'upscaler' | 'bg_cutout' | 'audio_studio' | 'style_generator'
  >('photo_video');

  const [settings, setSettings] = useState<HitPawFormSettings>(currentSettings);
  const [selectedCharacter, setSelectedCharacter] = useState(activeSceneCharacter);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [photoDanceAction, setPhotoDanceAction] = useState<'dance' | 'jump' | 'talk' | 'wave'>('dance');
  const [customPhotoPreview, setCustomPhotoPreview] = useState<string | null>(null);
  const [audioEnhanced, setAudioEnhanced] = useState(true);
  const [selectedCutoutBg, setSelectedCutoutBg] = useState<'transparent' | 'green' | 'neon' | 'sunset' | 'stage'>('transparent');
  const [stylePrompt, setStylePrompt] = useState('A cheerful cartoon explorer celebrating on a sunny mountaintop');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhotoPreview(url);
      setSettings((prev) => ({
        ...prev,
        uploadedPhotoUrl: url,
        uploadedPhotoName: file.name,
      }));
    }
  };

  const handleApply = () => {
    onApplySettings?.(settings);
    onClose();
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  return (
    <div
      id="hitpaw-ai-toolkit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hitpaw-toolkit-title"
    >
      <div className="relative w-full max-w-5xl bg-[#150a26] border border-[#3d2666] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#301c4d] bg-[#1a0b2e]/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff9900] to-[#ff5500] flex items-center justify-center shadow-lg shadow-[#ff9900]/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="hitpaw-toolkit-title" className="text-xl font-black text-white">
                  HitPaw AI Photo & Video Suite
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#ff9900]/20 border border-[#ff9900]/40 text-[#ff9900] text-[10px] font-black uppercase tracking-wider">
                  Pro AI Engine
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Photo-to-video animation, 8K AI upscaling, 1-click cutout, and studio audio enhancement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="apply-hitpaw-top-btn"
              type="button"
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#ff9900]/25 hover:scale-105 transition-transform cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply to Project
            </button>
            <button
              id="close-hitpaw-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex overflow-x-auto border-b border-[#301c4d] bg-[#120622] px-4 py-2 gap-1.5 scrollbar-none">
          {[
            { id: 'photo_video', label: '📸 Photo to Video & Face Animator', icon: Smile },
            { id: 'upscaler', label: '⚡ 8K/4K AI Video Upscaler', icon: Zap },
            { id: 'bg_cutout', label: '✂️ 1-Click Cutout & BG Replacer', icon: Scissors },
            { id: 'audio_studio', label: '🎙️ AI Studio Audio & Vocal Enhancer', icon: Music },
            { id: 'style_generator', label: '🎨 AI Style & Text-to-Video', icon: Sparkles },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`hitpaw-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#ff9900] text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-white">
          {/* TAB 1: PHOTO TO VIDEO & FACE ANIMATOR */}
          {activeTab === 'photo_video' && (
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
              <div className="space-y-4">
                <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff9900]">
                      HitPaw Ability #1: Photo to Video Generator
                    </span>
                    <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      Picture-to-Dance & Lip-Sync Visemes
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    Bring Still Photos & Characters to Dynamic Life
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Upload any still portrait or character image to animate facial visemes, natural blinking, or full-body cartoon dancing.
                  </p>

                  {/* Photo Ingestion */}
                  <div className="mt-4 pt-4 border-t border-[#341b5a]">
                    <div className="flex items-center gap-3">
                      <button
                        id="hitpaw-upload-portrait-btn"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 border-2 border-dashed border-[#ff9900]/40 hover:border-[#ff9900] bg-[#160a29] rounded-xl p-4 text-center cursor-pointer transition-colors group"
                      >
                        <Upload className="w-5 h-5 text-[#ff9900] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-white">
                          {settings.uploadedPhotoName ? settings.uploadedPhotoName : 'Upload Character Photo or Portrait'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, or WEBP up to 25MB</p>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Or Pick Rig Character */}
                  <div className="mt-4">
                    <label className="text-xs font-bold text-gray-400 mb-2 block">
                      Or select a studio character to animate:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sampleCharacters.map((char) => (
                        <button
                          key={char}
                          id={`hitpaw-char-${char.toLowerCase()}`}
                          type="button"
                          onClick={() => {
                            setSelectedCharacter(char);
                            setCustomPhotoPreview(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedCharacter === char && !customPhotoPreview
                              ? 'bg-[#ff9900] text-white shadow'
                              : 'bg-[#150926] text-gray-400 hover:text-white border border-[#341b5a]'
                          }`}
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Action Selector */}
                  <div className="mt-5">
                    <label className="text-xs font-bold text-gray-400 mb-2 block">
                      HitPaw Motion & Expression Mode:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'dance', label: 'Picture to Dance', icon: Flame, desc: 'Full cartoon boogie' },
                        { id: 'jump', label: 'Squash & Jump', icon: Zap, desc: 'Kinetic cartoon leap' },
                        { id: 'talk', label: 'Talking Avatar', icon: Smile, desc: 'Audio lip-sync visemes' },
                        { id: 'wave', label: 'Friendly Greeting', icon: Wand2, desc: 'Camera lean & wave' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          id={`motion-mode-${item.id}`}
                          type="button"
                          onClick={() => setPhotoDanceAction(item.id as typeof photoDanceAction)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            photoDanceAction === item.id
                              ? 'border-[#ff9900] bg-[#ff9900]/15 shadow'
                              : 'border-[#341b5a] bg-[#160a29] hover:border-gray-500'
                          }`}
                        >
                          <item.icon className="w-4 h-4 text-[#ff9900] mb-1" />
                          <p className="text-xs font-bold text-white leading-tight">{item.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Presets */}
                <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-4">
                  <span className="text-xs font-bold text-gray-400 block mb-2">
                    Video Aspect Ratio (HitPaw Multi-Platform Export):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['16:9', '9:16', '1:1', '4:5'] as HitPawAspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        id={`hitpaw-ratio-${ratio.replace(':', '-')}`}
                        type="button"
                        onClick={() => setSettings((s) => ({ ...s, aspectRatio: ratio }))}
                        className={`p-2 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                          settings.aspectRatio === ratio
                            ? 'border-[#ff9900] bg-[#ff9900] text-white shadow'
                            : 'border-[#341b5a] bg-[#160a29] text-gray-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                        <span className="block text-[9px] font-normal opacity-80 mt-0.5">
                          {ratio === '16:9' ? 'YouTube' : ratio === '9:16' ? 'TikTok' : ratio === '1:1' ? 'Square' : 'Feed'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Monitor */}
              <div className="bg-[#10061e] border border-[#301c4d] rounded-2xl p-5 flex flex-col items-center justify-between min-h-[400px]">
                <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-3 pb-2 border-b border-[#291744]">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    HitPaw Neural Kinematics Engine
                  </span>
                  <span className="bg-[#ff9900]/20 text-[#ff9900] px-2 py-0.5 rounded font-mono text-[10px]">
                    {settings.aspectRatio}
                  </span>
                </div>

                <div className="relative w-full aspect-video bg-gradient-to-b from-[#2a134a] via-[#1a0b2e] to-[#0d0417] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#3d2666]">
                  {customPhotoPreview ? (
                    <motion.div
                      animate={
                        photoDanceAction === 'dance'
                          ? { y: [0, -15, 0, -10, 0], rotate: [-2, 3, -3, 2, 0] }
                          : photoDanceAction === 'jump'
                            ? { y: [0, -35, 0], scaleY: [0.85, 1.15, 0.9, 1] }
                            : photoDanceAction === 'talk'
                              ? { scale: [1, 1.04, 0.98, 1] }
                              : { rotate: [-5, 5, -3, 3, 0] }
                      }
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      className="relative flex flex-col items-center"
                    >
                      <img
                        src={customPhotoPreview}
                        alt="Uploaded Subject"
                        className="w-32 h-32 object-cover rounded-2xl shadow-2xl border-2 border-[#ff9900]"
                      />
                      <div className="mt-2 px-3 py-1 bg-black/70 rounded-full text-[10px] text-white font-bold backdrop-blur-sm">
                        AI Motion Applied: {photoDanceAction}
                      </div>
                    </motion.div>
                  ) : (
                    <ToonCharacter
                      character={selectedCharacter}
                      action={photoDanceAction}
                      showCartoonEffects={true}
                      className="h-48 w-36 drop-shadow-2xl"
                    />
                  )}
                </div>

                <div className="w-full mt-4 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white">
                      Action: {photoDanceAction.toUpperCase()}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>Squash & Stretch: Enabled</span>
                  </div>
                  <button
                    id="hitpaw-preview-play-toggle"
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-[#ff9900] text-white hover:bg-[#e68700] transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 8K/4K AI VIDEO UPSCALER */}
          {activeTab === 'upscaler' && (
            <div className="space-y-6">
              <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff9900]">
                      HitPaw Ability #2: AI Video & Photo Upscaler (8K Resolution)
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      Deep-Learning Neural Upscaling & Line-Art Denoising
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Drag the interactive comparison slider below to see how HitPaw AI reconstructs sharp cartoon line-art, cleans video artifacts, and restores 8K crystal clarity.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#120622] p-1.5 rounded-xl border border-[#3d2666]">
                    {(['1080p', '4k', '8k'] as const).map((res) => (
                      <button
                        key={res}
                        id={`resolution-select-${res}`}
                        type="button"
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            enhancements: { ...s.enhancements, upscaleResolution: res },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          settings.enhancements.upscaleResolution === res
                            ? 'bg-[#ff9900] text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {res.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Split-Screen Comparison Slider */}
                <div
                  ref={sliderRef}
                  id="hitpaw-upscale-slider"
                  onMouseDown={() => setIsDraggingSlider(true)}
                  onMouseUp={() => setIsDraggingSlider(false)}
                  onMouseLeave={() => setIsDraggingSlider(false)}
                  onMouseMove={(e) => isDraggingSlider && handleSliderMove(e.clientX)}
                  onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                  className="relative w-full aspect-[21/9] sm:aspect-[2.2/1] bg-black rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-[#3d2666]"
                >
                  {/* Left Side: Original SD */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#201138] to-[#120822] filter blur-[2.5px] opacity-85">
                    <ToonCharacter
                      character={selectedCharacter}
                      action="celebrate"
                      className="h-44 w-32 drop-shadow-md"
                    />
                  </div>
                  <div className="absolute top-4 left-4 z-20 bg-black/75 px-3 py-1 rounded-full text-xs font-bold text-red-400 border border-red-500/30">
                    Original SD (480p) • Low Bitrate
                  </div>

                  {/* Right Side: HitPaw 8K Neural Enhanced */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#2a134a] via-[#1a0b2e] to-[#250d3d]">
                      <ToonCharacter
                        character={selectedCharacter}
                        action="celebrate"
                        showCartoonEffects={true}
                        className="h-44 w-32 drop-shadow-[0_0_20px_rgba(255,153,0,0.5)] scale-105"
                      />
                    </div>
                    <div className="absolute top-4 right-4 z-20 bg-[#ff9900]/90 px-3 py-1 rounded-full text-xs font-black text-white shadow-lg">
                      HitPaw 8K AI Enhanced • Neural Denoised
                    </div>
                  </div>

                  {/* Divider Line & Thumb Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-30"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#1a0b2e] flex items-center justify-center font-black text-[10px] shadow-2xl border-2 border-[#ff9900]">
                      ↔
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 px-1">
                  <span>← Drag slider to inspect 8K super-resolution quality</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> Edge Sharpener
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> 60 FPS Interpolation
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> Color Vibrancy Boost
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-CLICK CUTOUT & BACKGROUND REPLACER */}
          {activeTab === 'bg_cutout' && (
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
              <div className="space-y-4">
                <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff9900] mb-1 block">
                    HitPaw Ability #3: AI Background Cutout & Replacer
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    1-Click Precise Cutout & Alpha Transparency
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    HitPaw's automated neural segmentation removes complex backgrounds cleanly without a physical green screen, allowing transparent exports or instant backdrop replacement.
                  </p>

                  <div className="mt-5">
                    <label className="text-xs font-bold text-gray-400 mb-2 block">
                      Choose Background Replacement:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'transparent', label: 'Transparent PNG', desc: 'Alpha channel grid' },
                        { id: 'green', label: 'Chroma Green', desc: 'Color #00FF00' },
                        { id: 'neon', label: 'Cyberpunk Neon', desc: 'Futuristic skyline' },
                        { id: 'sunset', label: 'Golden Sunset', desc: 'Warm coastal glow' },
                        { id: 'stage', label: 'Spotlight Stage', desc: 'Auditorium beam' },
                      ].map((bg) => (
                        <button
                          key={bg.id}
                          id={`cutout-bg-${bg.id}`}
                          type="button"
                          onClick={() => setSelectedCutoutBg(bg.id as typeof selectedCutoutBg)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedCutoutBg === bg.id
                              ? 'border-[#ff9900] bg-[#ff9900]/20 shadow'
                              : 'border-[#341b5a] bg-[#160a29] hover:border-gray-500'
                          }`}
                        >
                          <p className="text-xs font-bold text-white">{bg.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{bg.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Smart Edge Softening</p>
                      <p className="text-[10px] text-gray-400">Prevents jagged hair/clothing fringes</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>

              {/* Cutout Preview Display */}
              <div className="bg-[#10061e] border border-[#301c4d] rounded-2xl p-5 flex flex-col items-center justify-between min-h-[380px]">
                <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-3 pb-2 border-b border-[#291744]">
                  <span className="font-bold text-white">Live Cutout Preview</span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    {selectedCutoutBg.toUpperCase()}
                  </span>
                </div>

                <div
                  className={`relative w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#3d2666] ${
                    selectedCutoutBg === 'transparent'
                      ? 'bg-[linear-gradient(45deg,#201138_25%,transparent_25%),linear-gradient(-45deg,#201138_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#201138_75%),linear-gradient(-45deg,transparent_75%,#201138_75%)] bg-[size:16px_16px] bg-[#120722]'
                      : selectedCutoutBg === 'green'
                        ? 'bg-[#00e500]'
                        : selectedCutoutBg === 'neon'
                          ? 'bg-gradient-to-tr from-[#1f0538] via-[#450a5c] to-[#0b0416]'
                          : selectedCutoutBg === 'sunset'
                            ? 'bg-gradient-to-b from-[#ff7e5f] to-[#feb47b]'
                            : 'bg-gradient-to-b from-[#2d1b4e] to-[#0a0314]'
                  }`}
                >
                  <ToonCharacter
                    character={selectedCharacter}
                    action="wave"
                    className="h-44 w-32 drop-shadow-xl"
                  />
                </div>

                <div className="w-full mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Subject segmentation is calculated at 60 FPS in real time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI AUDIO & VOCAL ENHANCER */}
          {activeTab === 'audio_studio' && (
            <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
              <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-5 space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff9900] block">
                  HitPaw Ability #4: AI Audio Studio & Vocal Enhancer
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Studio Vocal Isolation & One-Click Background Denoise
                </h3>
                <p className="text-sm text-gray-300">
                  HitPaw eliminates ambient background noise, microphone rumble, room echo, and electrical hum while applying harmonic warmth to character dialogue.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#150926] border border-[#341b5a]">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-[#ff9900]" />
                      <div>
                        <p className="text-xs font-bold text-white">Neural Voice Isolation</p>
                        <p className="text-[10px] text-gray-400">Removes background noise and clicks</p>
                      </div>
                    </div>
                    <button
                      id="toggle-audio-enhance-btn"
                      type="button"
                      onClick={() => setAudioEnhanced(!audioEnhanced)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        audioEnhanced ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {audioEnhanced ? 'Enabled' : 'Bypassed'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#150926] border border-[#341b5a]">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-[#ff9900]" />
                      <div>
                        <p className="text-xs font-bold text-white">AI Background Music Matching</p>
                        <p className="text-[10px] text-gray-400">Adaptive cartoon soundtrack generator</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Active</span>
                  </div>
                </div>
              </div>

              {/* Simulated Frequency Waveform */}
              <div className="bg-[#10061e] border border-[#301c4d] rounded-2xl p-5 flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center justify-between text-xs text-gray-400 border-b border-[#291744] pb-2">
                  <span className="font-bold text-white">Audio Waveform & EQ Visualizer</span>
                  <span className="text-[#ff9900] font-mono">48 kHz • 24-bit Lossless</span>
                </div>

                <div className="h-32 flex items-center justify-center gap-1 my-6 px-4">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const height = audioEnhanced
                      ? Math.sin(i * 0.4) * 40 + 45
                      : Math.sin(i * 0.4) * 20 + 25;
                    return (
                      <motion.div
                        key={i}
                        animate={{ height: [`${height}%`, `${Math.max(15, (height * 1.3) % 95)}%`, `${height}%`] }}
                        transition={{ repeat: Infinity, duration: 0.8 + (i % 5) * 0.1, ease: 'easeInOut' }}
                        className={`w-1.5 rounded-full ${
                          audioEnhanced
                            ? 'bg-gradient-to-t from-[#ff9900] to-[#ff5500]'
                            : 'bg-gray-600'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="p-3 bg-[#170a2b] rounded-xl border border-[#301c4d] flex items-center justify-between text-xs">
                  <span className="text-gray-300">Dialogue Clarity Status:</span>
                  <span className="font-extrabold text-emerald-400">
                    {audioEnhanced ? 'Studio Crystal Clear (0 dB Noise Floor)' : 'Raw Input (Ambient Noise Present)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI STYLE GENERATOR & TEXT TO VIDEO */}
          {activeTab === 'style_generator' && (
            <div className="space-y-6">
              <div className="bg-[#1f1038] border border-[#3d2666] rounded-2xl p-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff9900] block mb-1">
                  HitPaw Ability #5: AI Video Style Transfer & Text-to-Video
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Transform Narrative Prompts into Stylized Animation
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  Select an artistic visual model to style your animated video, from 3D Pixar aesthetics to Studio Ghibli anime and stop-motion claymation.
                </p>

                {/* Prompt Input */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block">
                    AI Scene Prompt:
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="hitpaw-style-prompt-input"
                      type="text"
                      value={stylePrompt}
                      onChange={(e) => setStylePrompt(e.target.value)}
                      placeholder="Describe what happens in this scene..."
                      className="flex-1 bg-[#120622] border border-[#3d2666] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#ff9900]"
                    />
                    <button
                      id="surprise-prompt-btn"
                      type="button"
                      onClick={() => setStylePrompt('A lively animated party with confetti, dance moves, and high energy')}
                      className="px-3 py-2 bg-[#2a134a] hover:bg-[#3b1b66] text-xs font-bold rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Surprise Me
                    </button>
                  </div>
                </div>

                {/* Art Style Model Cards */}
                <div className="mt-6">
                  <label className="text-xs font-bold text-gray-400 mb-2.5 block">
                    Choose HitPaw AI Art Style:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { id: '3d_pixar', label: '3D Pixar Toon', desc: 'Soft lighting & vibrant textures' },
                      { id: 'anime_ghibli', label: 'Ghibli Anime', desc: 'Hand-painted pastel vistas' },
                      { id: 'claymation', label: 'Claymation', desc: 'Tactile stop-motion clay' },
                      { id: 'comic_book', label: 'Comic Book', desc: 'Halftone dots & bold ink lines' },
                      { id: 'classic_toon', label: 'Classic 2D', desc: 'Golden age Saturday morning' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        id={`hitpaw-art-style-${style.id}`}
                        type="button"
                        onClick={() => setSettings((s) => ({ ...s, artStyle: style.id as HitPawArtStyle }))}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          settings.artStyle === style.id
                            ? 'border-[#ff9900] bg-[#ff9900]/20 shadow-lg scale-[1.02]'
                            : 'border-[#341b5a] bg-[#160a29] hover:border-gray-500'
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 mb-2 ${settings.artStyle === style.id ? 'text-[#ff9900]' : 'text-gray-400'}`} />
                        <p className="text-xs font-extrabold text-white">{style.label}</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-tight">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#301c4d] bg-[#120622]">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            HitPaw Model: <strong>{settings.artStyle}</strong> • <strong>{settings.enhancements.upscaleResolution.toUpperCase()}</strong> • <strong>{settings.aspectRatio}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="hitpaw-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="hitpaw-apply-btn"
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply HitPaw Settings to Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HitPawAiToolkit;
