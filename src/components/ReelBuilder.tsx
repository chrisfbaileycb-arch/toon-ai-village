import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Zap,
  Volume2,
  Smartphone,
  Tv,
  Square,
  ArrowRight,
  Target,
  RefreshCw,
  Layers,
  Flame,
  CheckCircle2,
  BookOpenCheck,
  UserRoundCheck,
} from 'lucide-react';
import {
  MarketingGoal,
  ReelDuration,
  AspectRatio,
  VoicePersona,
  CartoonStyle,
  MarketingReel,
  CharacterBible,
} from '../types';

interface ReelBuilderProps {
  currentCartoonImage: string;
  currentStyle: CartoonStyle;
  initialDuration?: ReelDuration;
  onReelGenerated: (reel: MarketingReel) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

export const ReelBuilder: React.FC<ReelBuilderProps> = ({
  currentCartoonImage,
  currentStyle,
  initialDuration = 30,
  onReelGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const [duration, setDuration] = useState<ReelDuration>(initialDuration);
  const [goal, setGoal] = useState<MarketingGoal>('app-launch');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [voice, setVoice] = useState<VoicePersona>('Puck');

  const [appName, setAppName] = useState<string>('FitQuest Pro');
  const [appDescription, setAppDescription] = useState<string>(
    'A gamified workout app that turns daily fitness and habit building into an epic RPG adventure with rewards.'
  );
  const [targetAudience, setTargetAudience] = useState<string>(
    'Busy professionals and gamers looking for 15-minute fun workouts'
  );
  const [customKeywords, setCustomKeywords] = useState<string>('level up, XP, 100 bonus gems');
  const [generationStep, setGenerationStep] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('Village Guide');
  const [characterDescription, setCharacterDescription] = useState<string>(
    'A warm, trustworthy small-business guide with friendly expressions and simple professional clothing'
  );
  const [characterBible, setCharacterBible] = useState<CharacterBible | null>(null);
  const [isGeneratingBible, setIsGeneratingBible] = useState(false);

  const generateCharacterBible = async () => {
    setIsGeneratingBible(true);
    try {
      const res = await fetch('/api/generate-character-bible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: characterName,
          description: characterDescription,
          style: currentStyle,
          referenceImageUrl: currentCartoonImage,
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setCharacterBible(await res.json());
    } catch (error) {
      console.error('Character Bible generation failed:', error);
      alert('Character Bible generation could not be completed. Check the image API configuration and try again.');
    } finally {
      setIsGeneratingBible(false);
    }
  };

  const GOALS: { id: MarketingGoal; label: string; icon: string; desc: string; badge: string }[] = [
    {
      id: 'app-launch',
      label: 'Mobile App Launch',
      icon: '📱',
      desc: 'Hook -> Problem -> App UI Demo -> App Store CTA',
      badge: 'High Conversion',
    },
    {
      id: 'viral-reel',
      label: 'TikTok & IG Viral Reel',
      icon: '📲',
      desc: 'High-retention shock hook, relatable pain, link-in-bio offer',
      badge: 'Max Reach',
    },
    {
      id: 'youtube-explainer',
      label: 'YouTube Shorts / Explainer',
      icon: '🎥',
      desc: 'Story-driven breakdown, product credibility, subscribe CTA',
      badge: 'High Watch Time',
    },
    {
      id: 'ecommerce-showcase',
      label: 'D2C & Product Spotlight',
      icon: '🛍️',
      desc: 'Unboxing aesthetic, physical benefits, limited discount',
      badge: 'Direct Sales',
    },
    {
      id: 'saas-workflow',
      label: 'SaaS & B2B Automation',
      icon: '💼',
      desc: 'Hours saved calculation, automated feature demo, free trial',
      badge: 'Enterprise ROI',
    },
  ];

  const VOICES: { id: VoicePersona; label: string; tone: string; avatar: string }[] = [
    { id: 'Puck', label: 'Puck', tone: 'Energetic & Youthful Hype', avatar: '⚡' },
    { id: 'Zephyr', label: 'Zephyr', tone: 'Confident & Smooth Tech Lead', avatar: '🎙️' },
    { id: 'Fenrir', label: 'Fenrir', tone: 'Authoritative & Bold Commercial', avatar: '🦁' },
    { id: 'Kore', label: 'Kore', tone: 'Warm, Friendly & Welcoming', avatar: '🌸' },
    { id: 'Aoede', label: 'Aoede', tone: 'Inspiring & Sophisticated Storyteller', avatar: '✨' },
    { id: 'Charon', label: 'Charon', tone: 'Deep Cinematic Narration', avatar: '🎬' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing marketing hook and script architecture...');

    try {
      setTimeout(() => {
        setGenerationStep(`Drafting ${duration}s spoken voiceover script (~${duration === 30 ? '70' : duration === 60 ? '140' : '220'} words)...`);
      }, 700);

      setTimeout(() => {
        setGenerationStep(`Generating ${duration === 30 ? '3' : duration === 60 ? '5' : '7'} cartoon storyboard scenes in ${currentStyle} style...`);
      }, 1500);

      const res = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appNameOrProduct: appName,
          appDescription,
          targetAudience,
          goal,
          duration,
          voicePersona: voice,
          characterStyle: currentStyle,
          characterCartoonUrl: currentCartoonImage,
          aspectRatio,
          customKeywords,
          characterBible,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const generatedReel: MarketingReel = await res.json();
      onReelGenerated(generatedReel);
    } catch (err: any) {
      console.error('Failed to generate reel:', err);
      alert('Generation encountered an issue, please check inputs and retry.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/20">
          <Zap className="h-3.5 w-3.5" />
          <span>Marketing Reel Architect</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Configure Your <span className="text-orange-400">{duration}-Second</span> Spoken Video Reel
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Powered by Gemini AI. Turns your cartoon character into an animated marketing spokesperson with synchronized voiceover and kinetic subtitles.
        </p>
      </div>

      {/* Selected Mascot Preview Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 sm:p-4">
        <div className="flex items-center space-x-3.5">
          <img
            src={currentCartoonImage}
            alt="Current Character"
            referrerPolicy="no-referrer"
            className="h-14 w-14 rounded-xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Active Spokesperson Mascot
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                {currentStyle}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Character will be featured across all generated video scenes.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-zinc-400">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Character Consistent</span>
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-300">
              <BookOpenCheck className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-wider">Character Bible</span>
            </div>
            <h3 className="mt-1 text-xl font-black text-white">Lock the character before building scenes</h3>
            <p className="mt-1 max-w-2xl text-xs text-emerald-100/70">
              This reference sheet preserves the same face, clothing, proportions, palette, and friendly cartoon treatment throughout the video.
            </p>
          </div>
          {characterBible && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-black text-emerald-300 border border-emerald-500/30">
              <UserRoundCheck className="h-4 w-4" /> Identity locked
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-zinc-300">Character name</span>
            <input value={characterName} onChange={(e) => setCharacterName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-zinc-300">Appearance and personality</span>
            <input value={characterDescription} onChange={(e) => setCharacterDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </label>
          <button type="button" onClick={generateCharacterBible} disabled={isGeneratingBible}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {isGeneratingBible ? 'Creating reference…' : characterBible ? 'Regenerate Bible' : 'Create Character Bible'}
          </button>
        </div>

        {characterBible?.referenceImageUrl && (
          <div className="grid sm:grid-cols-[240px_1fr] gap-4 rounded-2xl border border-emerald-500/20 bg-black/20 p-3">
            <img src={characterBible.referenceImageUrl} alt={`${characterBible.name} character reference sheet`}
              className="h-36 w-full rounded-xl object-cover border border-emerald-500/30" />
            <div className="py-1">
              <p className="text-sm font-black text-white">{characterBible.name}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">{characterBible.identityPrompt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {characterBible.guardrails.slice(0, 4).map((rule) => (
                  <span key={rule} className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-zinc-300">{rule}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Step 1: Reel Duration Selector */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Clock className="h-4 w-4 text-orange-400" />
          <span>1. Select Reel Duration</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              sec: 30 as ReelDuration,
              scenes: '3 Scenes',
              words: '~70 Words',
              best: 'TikTok / IG Reels',
              pace: 'Fast & Punchy Hook',
            },
            {
              sec: 60 as ReelDuration,
              scenes: '5 Scenes',
              words: '~140 Words',
              best: 'YouTube Shorts & Ads',
              pace: 'Story & Feature Demo',
            },
            {
              sec: 90 as ReelDuration,
              scenes: '7 Scenes',
              words: '~220 Words',
              best: 'Full Product Explainer',
              pace: 'Deep Transformation',
            },
          ].map((item) => {
            const isSelected = duration === item.sec;
            return (
              <button
                key={item.sec}
                id={`duration-selector-${item.sec}s`}
                type="button"
                onClick={() => setDuration(item.sec)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-xl scale-[1.02]'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-black text-white">{item.sec} Seconds</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.scenes}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 font-semibold">{item.best}</div>
                <div className="text-[11px] text-zinc-400 mt-1">{item.pace} • {item.words}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Campaign Objective & Marketing Angle */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Target className="h-4 w-4 text-orange-400" />
          <span>2. Campaign Marketing Goal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            return (
              <button
                key={g.id}
                id={`goal-btn-${g.id}`}
                type="button"
                onClick={() => setGoal(g.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-lg'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{g.icon}</span>
                    <span className="text-xs font-bold text-white">{g.label}</span>
                  </div>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-400">
                    {g.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{g.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Product Description & Call to Action */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>3. Product & Brand Details for AI Copywriter</span>
          </h3>
          <span className="text-xs text-zinc-400">Gemini 2.5 Flash Scriptwriter</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Product / App Name</label>
            <input
              id="app-name-input"
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
              placeholder="e.g. FitQuest Pro"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Target Audience & Ideal User</label>
            <input
              id="target-audience-input"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
              placeholder="e.g. Busy developers, students, gamers"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Core Value Proposition & Benefits</label>
            <textarea
              id="app-description-input"
              rows={3}
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
              placeholder="Describe what problem your app solves and the #1 reason someone should download it."
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Key Keywords & Offers</label>
            <input
              id="custom-keywords-input"
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
              placeholder="e.g. 50% discount, zero fluff, instant results"
            />
          </div>
        </div>
      </div>

      {/* Step 4: Voice Persona & Aspect Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voiceover Selection */}
        <div className="lg:col-span-7 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Volume2 className="h-4 w-4 text-orange-400" />
            <span>4. AI Voiceover Actor</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {VOICES.map((v) => {
              const isSelected = voice === v.id;
              return (
                <button
                  key={v.id}
                  id={`voice-btn-${v.id}`}
                  type="button"
                  onClick={() => setVoice(v.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/20 shadow'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span>{v.avatar}</span>
                    <span className="text-xs font-bold text-white">{v.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">{v.tone}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Canvas Ratio */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Smartphone className="h-4 w-4 text-orange-400" />
            <span>5. Video Aspect Ratio</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '9:16' as AspectRatio, label: '9:16 Vertical', desc: 'TikTok & Shorts', icon: Smartphone },
              { id: '16:9' as AspectRatio, label: '16:9 Wide', desc: 'YouTube & Web', icon: Tv },
              { id: '1:1' as AspectRatio, label: '1:1 Square', desc: 'Feed Ads', icon: Square },
            ].map((ar) => {
              const isSelected = aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  id={`aspect-ratio-btn-${ar.id.replace(':', '-')}`}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/20 text-white shadow'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  <ar.icon className="h-5 w-5 mb-1.5 text-orange-400" />
                  <span className="text-xs font-bold">{ar.id}</span>
                  <span className="text-[9px] text-zinc-400 mt-0.5">{ar.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generation Trigger Button */}
      <div className="pt-2">
        <button
          id="generate-marketing-reel-btn"
          onClick={handleGenerate}
          disabled={isGenerating || !characterBible}
          className="w-full flex items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 px-8 py-4 font-black text-white shadow-2xl hover:brightness-110 transition-all transform hover:scale-[1.01] cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{generationStep || 'Synthesizing Storyboard & Kinetic Scenes...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span className="text-base">{characterBible ? `Generate Complete ${duration}-Second Marketing Reel` : 'Create Character Bible First'}</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-zinc-500 mt-2">
          Uses the locked Character Bible to generate a consistent script, reviewable storyboard scenes, and voiceover.
        </p>
      </div>
    </div>
  );
};

export default ReelBuilder;
