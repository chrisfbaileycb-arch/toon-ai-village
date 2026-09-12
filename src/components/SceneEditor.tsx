import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Captions,
  Check,
  CheckCircle2,
  Clock3,
  Film,
  GripVertical,
  Image,
  Maximize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  Wand2,
  X,
} from 'lucide-react';
import ToonCharacter from './ToonCharacter';
import WorkflowStatusPanel from './WorkflowStatusPanel';
import DeliveryModal from './DeliveryModal';
import CartoonAnimationLibrary from './CartoonAnimationLibrary';
import HitPawAiToolkit from './HitPawAiToolkit';
import { type AnimationPresetName } from '../animations/toonVariants';
import {
  type WorkflowStage,
  type RenderJob,
  type ProjectValidation,
  validateScenes,
  determineWorkflowStage,
  createRenderJob,
  simulateRenderProgress,
} from '../lib/workflowEngine';
import { updateProjectWorkflowState } from '../lib/projectService';

export type SceneTransition = 'fade' | 'slide' | 'zoom' | 'wipe';

export interface AnimationScene {
  id: string;
  title: string;
  character: string;
  action?: string;
  caption: string;
  duration: number;
  background?: string;
  transition?: SceneTransition;
}

interface SceneEditorProps {
  projectId?: string;
  projectName: string;
  projectDuration: string;
  initialScenes: AnimationScene[];
  onBack: () => void;
  onSave: (scenes: AnimationScene[]) => void;
  workflowStage?: WorkflowStage;
  onWorkflowUpdate?: (stage: WorkflowStage, progress: number, message: string, job?: RenderJob | null) => void;
}

interface BackgroundOption {
  id: string;
  description: string;
  className: string;
  decoration: React.ReactNode;
}

const characters = ['No character', 'Ava', 'Milo', 'Nova', 'Kai', 'Luna', 'Max'];

const actions = [
  { id: 'idle', label: 'Idle', description: 'Breathing & weight sway' },
  { id: 'walk', label: 'Walk', description: 'Cartoon bouncy walk cycle' },
  { id: 'jump', label: 'Jump & Squash', description: 'Dynamic leap & impact squash' },
  { id: 'talk', label: 'Talk', description: 'Conversational delivery & gestures' },
  { id: 'wave', label: 'Wave', description: 'Friendly greeting & lean' },
  { id: 'celebrate', label: 'Celebrate', description: 'Excited star leap & victory' },
  { id: 'sneak', label: 'Tip-Toe Sneak', description: 'Stealthy creeping crouch' },
  { id: 'dance', label: 'Cartoon Boogie', description: 'High-energy cartoon rhythm' },
  { id: 'shock', label: 'Shock / Take', description: 'Frantic double-take & recoil' },
  { id: 'present', label: 'Present', description: 'Show the focal message' },
];

const transitions: Array<{
  id: SceneTransition;
  label: string;
  description: string;
}> = [
  { id: 'fade', label: 'Fade', description: 'Blend softly into the next scene.' },
  { id: 'slide', label: 'Slide', description: 'Move horizontally into the next scene.' },
  { id: 'zoom', label: 'Zoom', description: 'Push forward into the next scene.' },
  { id: 'wipe', label: 'Wipe', description: 'Reveal the next scene across the frame.' },
];

const backgrounds: BackgroundOption[] = [
  {
    id: 'Studio purple',
    description: 'Bold creative workspace',
    className: 'bg-[#1a0b2e]',
    decoration: (
      <>
        <span className="absolute -right-10 -bottom-12 w-48 h-48 rounded-full border-[28px] border-[#3a2b5e]" />
        <span className="absolute left-[12%] top-[14%] w-12 h-12 rotate-12 rounded-xl bg-[#ff9900]" />
        <span className="absolute inset-x-[18%] bottom-[12%] h-2 rounded-full bg-white/15" />
      </>
    ),
  },
  {
    id: 'Sunny park',
    description: 'Bright outdoor setting',
    className: 'bg-gradient-to-b from-[#82d8ff] via-[#bceaff] to-[#a9df79]',
    decoration: (
      <>
        <span className="absolute right-[12%] top-[10%] w-20 h-20 rounded-full bg-[#ffd35c] shadow-[0_0_35px_rgba(255,211,92,0.7)]" />
        <span className="absolute -left-12 bottom-0 w-72 h-28 rounded-t-full bg-[#4d9f52]" />
        <span className="absolute right-[-5%] bottom-0 w-96 h-36 rounded-t-full bg-[#66b85d]" />
        <span className="absolute left-[14%] bottom-[18%] w-7 h-28 bg-[#85552f]" />
        <span className="absolute left-[8%] bottom-[34%] w-28 h-28 rounded-full bg-[#368b47]" />
      </>
    ),
  },
  {
    id: 'City sunset',
    description: 'Warm skyline backdrop',
    className: 'bg-gradient-to-b from-[#d96887] via-[#f69172] to-[#ffc36b]',
    decoration: (
      <>
        <span className="absolute bottom-0 left-[5%] w-[14%] h-[45%] bg-[#513551]" />
        <span className="absolute bottom-0 left-[24%] w-[18%] h-[62%] bg-[#3d304d]" />
        <span className="absolute bottom-0 right-[9%] w-[19%] h-[52%] bg-[#513551]" />
      </>
    ),
  },
  {
    id: 'Creative office',
    description: 'Modern work scene',
    className: 'bg-[#d9edf5]',
    decoration: (
      <>
        <span className="absolute left-[8%] top-[11%] w-36 h-24 rounded-lg bg-[#7bb5ca] border-8 border-white" />
        <span className="absolute right-[8%] bottom-0 w-20 h-40 bg-[#9a663d]" />
        <span className="absolute right-[5%] bottom-[35%] w-32 h-32 rounded-full bg-[#4e9a65]" />
      </>
    ),
  },
  {
    id: 'Ocean blue',
    description: 'Calm coastal atmosphere',
    className: 'bg-gradient-to-b from-[#78d8ea] via-[#52b6d8] to-[#2077a7]',
    decoration: (
      <>
        <span className="absolute left-[10%] top-[10%] w-16 h-16 rounded-full bg-[#ffe38b]" />
        <span className="absolute right-[8%] bottom-0 w-28 h-24 rounded-t-full bg-[#145e82]" />
      </>
    ),
  },
  {
    id: 'Warm stage',
    description: 'Spotlight presentation',
    className: 'bg-gradient-to-b from-[#4f295c] to-[#1f1739]',
    decoration: (
      <>
        <span className="absolute left-1/2 top-0 -translate-x-1/2 w-72 h-[80%] bg-[#ffcf6a]/20 blur-2xl [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]" />
        <span className="absolute inset-x-0 bottom-0 h-[14%] bg-[#753947]" />
      </>
    ),
  },
];

const getBackground = (id?: string) =>
  backgrounds.find((background) => background.id === id) ?? backgrounds[0];

const getAction = (id?: string) =>
  actions.find((action) => action.id === id) ?? actions[0];

const getTransition = (id?: SceneTransition) =>
  transitions.find((transition) => transition.id === id) ?? transitions[0];

const SceneCanvas: React.FC<{
  scene: AnimationScene;
  compact?: boolean;
  className?: string;
  playbackTime?: number;
  forcedAction?: string;
}> = ({ scene, compact = false, className = '', playbackTime, forcedAction }) => {
  const background = getBackground(scene.background);

  return (
    <div className={`absolute inset-0 overflow-hidden ${background.className} ${className}`}>
      {background.decoration}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <ToonCharacter
          character={scene.character}
          action={forcedAction || scene.action}
          playbackTime={playbackTime}
          className={compact ? 'w-20 h-24' : 'w-32 h-40 md:w-40 md:h-48'}
          showName={!compact}
        />
        <div
          className={`max-w-xl bg-white text-[#1a0b2e] font-semibold shadow-xl ${
            compact
              ? 'mt-2 rounded-lg px-2 py-1 text-[9px]'
              : 'mt-5 rounded-2xl px-5 py-3 text-sm md:text-base'
          }`}
        >
          {scene.caption || 'Your scene caption will appear here.'}
        </div>
      </div>
    </div>
  );
};

export const SceneEditor: React.FC<SceneEditorProps> = ({
  projectId,
  projectName,
  projectDuration,
  initialScenes,
  onBack,
  onSave,
  workflowStage: externalWorkflowStage,
  onWorkflowUpdate,
}) => {
  const [scenes, setScenes] = useState<AnimationScene[]>(initialScenes);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    initialScenes[0]?.id ?? ''
  );
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showHitPawModal, setShowHitPawModal] = useState(false);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const selectedScene =
    scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];

  const validation: ProjectValidation = useMemo(
    () => validateScenes(scenes),
    [scenes]
  );

  const currentStage: WorkflowStage = useMemo(() => {
    if (renderJob?.status === 'complete') return 'render_complete';
    if (renderJob?.status === 'processing') return 'render_processing';
    if (renderJob?.status === 'queued') return 'render_queued';
    return externalWorkflowStage || determineWorkflowStage(scenes);
  }, [scenes, externalWorkflowStage, renderJob]);

  const totalDuration = useMemo(
    () => scenes.reduce((sum, s) => sum + s.duration, 0),
    [scenes]
  );

  const updateSelectedScene = (patch: Partial<AnimationScene>) => {
    setScenes((currentScenes) =>
      currentScenes.map((scene) =>
        scene.id === selectedSceneId ? { ...scene, ...patch } : scene
      )
    );
  };

  const addScene = () => {
    const newScene: AnimationScene = {
      id: `scene-${Date.now()}`,
      title: `Scene ${scenes.length + 1}`,
      character: 'Ava',
      action: 'wave',
      caption: 'Add animated message here...',
      duration: 3,
      background: 'Studio purple',
      transition: 'fade',
    };
    setScenes([...scenes, newScene]);
    setSelectedSceneId(newScene.id);
  };

  const removeScene = (id: string) => {
    if (scenes.length <= 1) return;
    const remaining = scenes.filter((s) => s.id !== id);
    setScenes(remaining);
    if (selectedSceneId === id) {
      setSelectedSceneId(remaining[0].id);
    }
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;
    const reordered = [...scenes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setScenes(reordered);
  };

  const handleSave = () => {
    onSave(scenes);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleStartRender = () => {
    const job = createRenderJob(projectId || 'local-job', totalDuration, 'mp4');
    setRenderJob(job);
    simulateRenderProgress(job, (updatedJob) => {
      setRenderJob({ ...updatedJob });
      if (updatedJob.status === 'complete') {
        if (projectId) {
          updateProjectWorkflowState(projectId, 'render_complete', 100, 'Render complete!', updatedJob);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0417] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#301c4d] pb-6">
        <div className="flex items-center gap-4">
          <button
            id="scene-editor-back-btn"
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-[#1c0d33] border border-[#3d2666] text-gray-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{projectName}</h1>
              <span className="bg-[#ff9900]/20 text-[#ff9900] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#ff9900]/30">
                {projectDuration}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {scenes.length} Scenes · {totalDuration}s Timeline · Workflow Validated
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="open-kinematic-library-modal-btn"
            type="button"
            onClick={() => setShowLibraryModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2a134a] border border-[#4a267a] hover:bg-[#391b63] text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ff9900]" />
            <span>12 Principles Lab</span>
          </button>

          <button
            id="open-hitpaw-toolkit-modal-btn"
            type="button"
            onClick={() => setShowHitPawModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff5500] text-xs font-extrabold text-white flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>HitPaw Pro AI Suite</span>
          </button>

          <button
            id="save-scenes-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-extrabold text-white flex items-center gap-1.5 transition shadow cursor-pointer"
          >
            {showSavedFeedback ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{showSavedFeedback ? 'Saved!' : 'Save Scenes'}</span>
          </button>
        </div>
      </div>

      {/* Workflow Engine Status Panel */}
      <WorkflowStatusPanel
        projectId={projectId}
        currentStage={currentStage}
        validation={validation}
        renderJob={renderJob}
        onStartRender={handleStartRender}
        onDeliver={() => setShowDeliveryModal(true)}
      />

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Live Preview Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#150a26] border border-[#3d2666] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
              <span className="font-bold text-[#ff9900] flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                Live Stage Monitor
              </span>
              <span>
                Scene {scenes.findIndex((s) => s.id === selectedSceneId) + 1} of {scenes.length}
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              {selectedScene && (
                <SceneCanvas
                  scene={selectedScene}
                  playbackTime={playbackTime}
                />
              )}
            </div>

            {/* Scrubber & Controls */}
            <div className="mt-4 p-4 rounded-2xl bg-[#10051e] border border-[#2e174b] flex items-center justify-between gap-4">
              <button
                id="timeline-play-toggle-btn"
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-[#ff9900] text-white hover:bg-[#e68700] transition cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>{playbackTime.toFixed(1)}s</span>
                  <span>{selectedScene?.duration}s duration</span>
                </div>
                <input
                  id="scene-playback-scrubber"
                  type="range"
                  min="0"
                  max={selectedScene?.duration || 3}
                  step="0.1"
                  value={playbackTime}
                  onChange={(e) => setPlaybackTime(Number(e.target.value))}
                  className="w-full accent-[#ff9900] cursor-pointer"
                />
              </div>

              <button
                id="reset-scene-playhead-btn"
                type="button"
                onClick={() => setPlaybackTime(0)}
                className="p-2.5 rounded-xl bg-[#200e3a] text-gray-300 hover:text-white transition cursor-pointer"
                title="Reset playhead"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Scene Editor Controls */}
        <div className="lg:col-span-5 space-y-5">
          {selectedScene && (
            <div className="bg-[#150a26] border border-[#3d2666] rounded-3xl p-5 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#301c4d] pb-3">
                <h3 className="font-extrabold text-base text-white">
                  Scene Configuration
                </h3>
                <span className="text-xs font-mono text-[#ff9900]">
                  {selectedScene.title}
                </span>
              </div>

              {/* Title & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">Title</label>
                  <input
                    id="scene-title-input"
                    type="text"
                    value={selectedScene.title}
                    onChange={(e) => updateSelectedScene({ title: e.target.value })}
                    className="w-full bg-[#10051e] border border-[#3d2666] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff9900]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">Duration (sec)</label>
                  <input
                    id="scene-duration-input"
                    type="number"
                    min="1"
                    max="30"
                    value={selectedScene.duration}
                    onChange={(e) => updateSelectedScene({ duration: Number(e.target.value) || 1 })}
                    className="w-full bg-[#10051e] border border-[#3d2666] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff9900]"
                  />
                </div>
              </div>

              {/* Character Rig Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5 text-[#ff9900]" />
                  <span>Character Rig</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {characters.map((char) => (
                    <button
                      key={char}
                      id={`char-picker-${char.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => updateSelectedScene({ character: char })}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedScene.character === char
                          ? 'border-[#ff9900] bg-[#ff9900] text-white shadow'
                          : 'border-[#3d2666] bg-[#10051e] text-gray-400 hover:text-white'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action / Motion Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9900]" />
                  <span>Kinematic Motion</span>
                </label>
                <select
                  id="scene-action-select"
                  value={selectedScene.action || 'idle'}
                  onChange={(e) => updateSelectedScene({ action: e.target.value })}
                  className="w-full bg-[#10051e] border border-[#3d2666] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff9900]"
                >
                  {actions.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.label} — {act.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <Captions className="w-3.5 h-3.5 text-[#ff9900]" />
                  <span>Scene Caption / Speech</span>
                </label>
                <textarea
                  id="scene-caption-textarea"
                  rows={2}
                  value={selectedScene.caption}
                  onChange={(e) => updateSelectedScene({ caption: e.target.value })}
                  className="w-full bg-[#10051e] border border-[#3d2666] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff9900] leading-relaxed"
                />
              </div>

              {/* Background Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-[#ff9900]" />
                  <span>Background Scene</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      id={`scene-bg-${bg.id.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => updateSelectedScene({ background: bg.id })}
                      className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                        selectedScene.background === bg.id
                          ? 'border-[#ff9900] bg-[#ff9900]/20 text-white'
                          : 'border-[#3d2666] bg-[#10051e] text-gray-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{bg.id}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{bg.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scene Timeline Reordering Strip */}
      <div className="bg-[#150a26] border border-[#3d2666] rounded-3xl p-5 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white">
            Storyboard Timeline ({scenes.length} Scenes)
          </h3>
          <button
            id="add-timeline-scene-btn"
            type="button"
            onClick={addScene}
            className="flex items-center gap-1 text-xs font-bold text-[#ff9900] hover:text-[#ffaa22] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scene</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {scenes.map((scene, idx) => {
            const isSelected = selectedSceneId === scene.id;
            return (
              <div
                key={scene.id}
                id={`timeline-card-${scene.id}`}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`relative min-w-[200px] w-52 p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shrink-0 ${
                  isSelected
                    ? 'border-[#ff9900] bg-[#ff9900]/15 shadow-xl scale-[1.02]'
                    : 'border-[#3d2666] bg-[#10051e] hover:border-gray-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-white">
                      #{idx + 1} {scene.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {scene.duration}s
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">
                    {scene.caption || 'No caption'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-[#ff9900]">
                    {scene.character} ({scene.action || 'idle'})
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`move-up-${scene.id}`}
                      type="button"
                      onClick={() => moveScene(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`move-down-${scene.id}`}
                      type="button"
                      onClick={() => moveScene(idx, 'down')}
                      disabled={idx === scenes.length - 1}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`remove-scene-${scene.id}`}
                      type="button"
                      onClick={() => removeScene(scene.id)}
                      disabled={scenes.length <= 1}
                      className="p-1 rounded text-red-400 hover:text-red-300 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HitPaw AI Toolkit Modal */}
      <HitPawAiToolkit
        isOpen={showHitPawModal}
        onClose={() => setShowHitPawModal(false)}
        activeSceneCharacter={selectedScene?.character}
      />

      {/* Cartoon Animation Principles Modal */}
      {showLibraryModal && (
        <div
          id="anim-principles-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-6xl bg-[#150a26] border border-[#3d2666] rounded-3xl p-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#301c4d]">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff9900]" />
                12 Principles Kinematic Animation Studio
              </h2>
              <button
                id="close-principles-modal-btn"
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CartoonAnimationLibrary />
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && renderJob && (
        <DeliveryModal
          renderJob={renderJob}
          projectName={projectName}
          projectId={projectId}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}
    </div>
  );
};

export default SceneEditor;
