import React, { useState } from 'react';
import {
  Layers,
  Play,
  Square as StopSquare,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  MoveRight,
  Volume2,
  Check,
  Edit3,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import { MarketingReel, ReelScene } from '../types';
import { playVoiceover, stopVoiceover } from '../lib/audioService';

interface StoryboardEditorProps {
  reel: MarketingReel;
  onUpdateReel: (updated: MarketingReel) => void;
  onOpenPlayer: () => void;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  reel,
  onUpdateReel,
  onOpenPlayer,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isRegeneratingSceneId, setIsRegeneratingSceneId] = useState<string | null>(null);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState<boolean>(false);

  // Play spoken voiceover
  const handlePlayVoiceover = async () => {
    if (isPlayingAudio) {
      stopVoiceover();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await playVoiceover(
      reel.fullVoiceoverScript,
      reel.audioBase64,
      reel.audioMimeType || 'audio/mp3',
      () => {
        setIsPlayingAudio(false);
      }
    );
  };

  // Generate Gemini TTS Audio
  const handleGenerateTTS = async () => {
    setIsGeneratingTTS(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reel.fullVoiceoverScript,
          voice: reel.voice,
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        onUpdateReel({
          ...reel,
          audioBase64: data.audioBase64,
          audioMimeType: data.mimeType,
        });
        alert('AI voiceover synthesized successfully with selected voice persona!');
      } else {
        alert('Voiceover ready using high-fidelity browser speech synthesis engine.');
      }
    } catch (e) {
      console.warn('TTS request failed, fallback speech synthesis ready:', e);
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  // Update scene text
  const updateScene = (index: number, updates: Partial<ReelScene>) => {
    const newScenes = [...reel.scenes];
    newScenes[index] = { ...newScenes[index], ...updates };

    // Recompute full voiceover script
    const newScript = newScenes.map((s) => s.narration).join(' ');

    onUpdateReel({
      ...reel,
      scenes: newScenes,
      fullVoiceoverScript: newScript,
    });
  };

  // Regenerate image for scene
  const regenerateSceneImage = async (sceneId: string, prompt: string) => {
    setIsRegeneratingSceneId(sceneId);
    try {
      const res = await fetch('/api/regenerate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          prompt,
          characterStyle: reel.characterStyle,
          aspectRatio: reel.aspectRatio,
          characterBible: reel.characterBible,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const sceneIndex = reel.scenes.findIndex((s) => s.id === sceneId);
        if (sceneIndex >= 0) {
          updateScene(sceneIndex, { imageUrl: data.imageUrl, approvalStatus: 'review' });
        }
      }
    } catch (e) {
      console.warn('Failed to regenerate scene image:', e);
    } finally {
      setIsRegeneratingSceneId(null);
    }
  };

  // Delete scene
  const deleteScene = (index: number) => {
    if (reel.scenes.length <= 1) {
      alert('A reel must have at least one scene.');
      return;
    }
    const newScenes = reel.scenes.filter((_, i) => i !== index);
    const newScript = newScenes.map((s) => s.narration).join(' ');

    // Recompute timestamps
    const durPerScene = reel.totalDuration / newScenes.length;
    const recomputed = newScenes.map((sc, i) => ({
      ...sc,
      startSeconds: Math.round(i * durPerScene * 10) / 10,
      endSeconds: Math.round((i + 1) * durPerScene * 10) / 10,
    }));

    onUpdateReel({
      ...reel,
      scenes: recomputed,
      fullVoiceoverScript: newScript,
    });

    if (activeSceneIndex >= newScenes.length) {
      setActiveSceneIndex(newScenes.length - 1);
    }
  };

  // Add scene
  const addScene = () => {
    const newId = 'scene-' + Date.now();
    const durPerScene = reel.totalDuration / (reel.scenes.length + 1);
    const newScene: ReelScene = {
      id: newId,
      sceneNumber: reel.scenes.length + 1,
      durationSeconds: Math.round(durPerScene * 10) / 10,
      title: 'Bonus Highlight',
      narration: 'And here is another reason your customers will absolutely love this experience.',
      visualDescription: 'Cartoon character presenting high-value feature with gleaming sparkles',
      visualPrompt: `Cartoon character celebrating feature with gold stars in ${reel.characterStyle}`,
      imageUrl: reel.characterCartoonUrl,
      captionText: 'Unmatched customer love and viral retention.',
      highlightedKeyword: 'viral retention',
      motionType: 'zoom-in',
      caption: 'Unmatched customer love and viral retention.',
      cameraEffect: 'zoom-in',
      characterMood: 'excited',
      startSeconds: 0,
      endSeconds: 0,
    };

    const newScenes = [...reel.scenes, newScene];
    const recomputed = newScenes.map((sc, i) => ({
      ...sc,
      startSeconds: Math.round(i * durPerScene * 10) / 10,
      endSeconds: Math.round((i + 1) * durPerScene * 10) / 10,
    }));

    const newScript = recomputed.map((s) => s.narration).join(' ');

    onUpdateReel({
      ...reel,
      scenes: recomputed,
      fullVoiceoverScript: newScript,
    });

    setActiveSceneIndex(recomputed.length - 1);
  };

  const currentScene = reel.scenes[activeSceneIndex] || reel.scenes[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              Interactive Storyboard Studio
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">
              {reel.scenes.length} Scenes · {reel.totalDuration}s Total
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Script & Scene Director
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Review every frame, refine the narration, and regenerate visuals from the locked Character Bible.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="tts-preview-play-btn"
            onClick={handlePlayVoiceover}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              isPlayingAudio
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <StopSquare className="h-4 w-4" />
                <span>Stop Spoken Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-amber-400" />
                <span>Listen to Voiceover</span>
              </>
            )}
          </button>

          <button
            id="synthesize-gemini-tts-btn"
            onClick={handleGenerateTTS}
            disabled={isGeneratingTTS}
            className="flex items-center space-x-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-700 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 text-amber-400 ${isGeneratingTTS ? 'animate-spin' : ''}`} />
            <span>{isGeneratingTTS ? 'Synthesizing...' : 'Synthesize Gemini Voice'}</span>
          </button>

          <button
            id="back-to-player-btn"
            onClick={onOpenPlayer}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-lg hover:brightness-110 transition cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Preview in Video Player →</span>
          </button>
        </div>
      </div>

      {/* Storyboard Grid: Left Scene Strip / Right Editor Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scene Thumbnails Timeline */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Scenes List ({reel.scenes.length})
            </span>
            <button
              id="add-scene-btn"
              onClick={addScene}
              className="flex items-center space-x-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Scene</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {reel.scenes.map((sc, idx) => {
              const isSelected = activeSceneIndex === idx;
              return (
                <div
                  key={sc.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-md'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-black shrink-0">
                    <img
                      src={sc.imageUrl}
                      alt={sc.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 rounded-tl-lg bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{sc.title}</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {sc.startSeconds}s - {sc.endSeconds}s
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                      &quot;{sc.narration}&quot;
                    </p>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black ${sc.approvalStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                      {sc.approvalStatus === 'approved' ? 'Approved' : 'Needs review'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Scene Detail Editor */}
        {currentScene && (
          <div className="lg:col-span-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 space-y-6 shadow-2xl">
            {/* Header with Scene Index */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <span className="rounded-xl bg-amber-500 px-3 py-1 text-xs font-black text-white">
                  Scene {activeSceneIndex + 1} of {reel.scenes.length}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Timing: {currentScene.startSeconds}s to {currentScene.endSeconds}s (
                  {(currentScene.endSeconds - currentScene.startSeconds).toFixed(1)}s)
                </span>
              </div>

              <button
                id="delete-current-scene-btn"
                onClick={() => deleteScene(activeSceneIndex)}
                className="flex items-center space-x-1 text-xs font-semibold text-red-400 hover:text-red-300 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Scene</span>
              </button>
              <button
                id="approve-current-scene-btn"
                onClick={() => updateScene(activeSceneIndex, { approvalStatus: 'approved' })}
                className="flex items-center space-x-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{currentScene.approvalStatus === 'approved' ? 'Scene approved' : 'Approve scene'}</span>
              </button>
            </div>

            {/* Scene Visual & Regeneration */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-zinc-700 bg-black shadow-lg">
                <img
                  src={currentScene.imageUrl}
                  alt={currentScene.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {isRegeneratingSceneId === currentScene.id && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="h-6 w-6 text-amber-400 animate-spin" />
                    <span className="text-xs font-bold text-white">Generating Visual...</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-7 space-y-2.5">
                <span className="text-xs font-bold text-white block">Visual Scene Prompt & Setting</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Regenerate this frame while preserving the locked face, clothing, proportions, palette, and art direction.
                </p>
                <button
                  id="regenerate-scene-img-btn"
                  onClick={() =>
                    regenerateSceneImage(
                      currentScene.id,
                      currentScene.visualPrompt || `${currentScene.title}. ${currentScene.visualDescription}`
                    )
                  }
                  disabled={isRegeneratingSceneId === currentScene.id}
                  className="flex items-center space-x-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Regenerate with Character Bible</span>
                </button>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Scene Headline / Title</label>
                <input
                  id="edit-scene-title-input"
                  type="text"
                  value={currentScene.title}
                  onChange={(e) => updateScene(activeSceneIndex, { title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  Voiceover Spoken Narration (What the AI Actor Says)
                </label>
                <textarea
                  id="edit-scene-narration-input"
                  rows={3}
                  value={currentScene.narration}
                  onChange={(e) => updateScene(activeSceneIndex, { narration: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  On-Screen Kinetic Caption (Big bold text displayed in video)
                </label>
                <input
                  id="edit-scene-caption-input"
                  type="text"
                  value={currentScene.caption}
                  onChange={(e) => updateScene(activeSceneIndex, { caption: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Camera & Mood */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Camera Pan / Zoom Effect</label>
                  <select
                    id="edit-scene-camera-select"
                    value={currentScene.cameraEffect || 'zoom-in'}
                    onChange={(e) => updateScene(activeSceneIndex, { cameraEffect: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="zoom-in">Slow Zoom In (High Tension)</option>
                    <option value="zoom-out">Slow Zoom Out (Reveal)</option>
                    <option value="pan-left">Pan Left (Motion)</option>
                    <option value="pan-right">Pan Right (Forward Momentum)</option>
                    <option value="static">Static Focus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Character Mascot Mood</label>
                  <select
                    id="edit-scene-mood-select"
                    value={currentScene.characterMood || 'energetic'}
                    onChange={(e) => updateScene(activeSceneIndex, { characterMood: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="shocked">Shocked / Problem Hook</option>
                    <option value="curious">Curious / Seeking Answer</option>
                    <option value="energetic">Energetic / Feature Demo</option>
                    <option value="celebrating">Celebrating / Results</option>
                    <option value="confident">Confident / Call to Action</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryboardEditor;
