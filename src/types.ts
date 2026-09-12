import { type Variants } from 'motion/react';

// ==========================================
// TONE-MARK REEL & MARKETING TYPES
// ==========================================

export type CartoonStyle =
  | 'pixar-3d'
  | 'anime-manga'
  | 'comic-popart'
  | 'claymation'
  | 'cyberpunk'
  | 'vector-flat'
  | 'retro-90s'
  | 'chibi-kawaii';

export type MarketingGoal =
  | 'app-launch'
  | 'viral-reel'
  | 'youtube-explainer'
  | 'ecommerce-showcase'
  | 'saas-workflow';

export type ReelDuration = 30 | 60 | 90;

export type AspectRatio = '9:16' | '16:9' | '1:1';

export type VoicePersona = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede';

export interface CartoonStyleOption {
  id: CartoonStyle;
  name: string;
  badge: string;
  description: string;
  sampleBefore: string;
  sampleAfter: string;
  artStylePrompt: string;
  accentColor: string;
}

export interface CartoonAdjustments {
  expression: 'enthusiastic' | 'friendly' | 'surprised' | 'serious' | 'laughing';
  exaggeration: number; // 1 to 10
  lighting: 'studio' | 'neon' | 'golden-hour' | 'dramatic' | 'pastel';
  skinTonePreservation: boolean;
  eyeSparkle: boolean;
}

export interface ReelScene {
  id: string;
  sceneNumber: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  title: string;
  narration: string;
  visualDescription: string;
  visualPrompt: string;
  imageUrl: string;
  captionText: string;
  highlightedKeyword: string;
  badgeText?: string;
  motionType: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'tilt-up';
  caption?: string;
  cameraEffect?: string;
  characterMood?: string;
  characterAction?: string;
  cameraTransition?: string;
  spokenLine?: string;
  visualStyle?: string;
}

export type Scene = ReelScene;

export interface MarketingCopyBundle {
  instagramCaption: string;
  tiktokHook: string;
  youtubeTitle: string;
  youtubeDescription: string;
  hashtags: string[];
  adHooks: string[];
}

export interface MarketingReel {
  id: string;
  title: string;
  targetAppOrProduct: string;
  targetAudience: string;
  duration: ReelDuration;
  aspectRatio: AspectRatio;
  goal: MarketingGoal;
  voice: VoicePersona;
  hookHeadline: string;
  callToAction: string;
  ctaButtonText: string;
  ctaLink: string;
  scenes: ReelScene[];
  fullVoiceoverScript: string;
  totalDuration: number;
  characterOriginalUrl: string;
  characterCartoonUrl: string;
  characterStyle: CartoonStyle;
  marketingCopy: MarketingCopyBundle;
  createdAt: number;
}

export interface SampleProject {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  style: CartoonStyle;
  duration: ReelDuration;
  goal: MarketingGoal;
  thumbnail: string;
  reel: MarketingReel;
}

// ==========================================
// TOON ANIMATION & CHARACTER TYPES
// ==========================================

export type AnimationPresetName =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'talk'
  | 'wave'
  | 'celebrate'
  | 'sneak'
  | 'dance'
  | 'shock'
  | 'present';

export interface AnimationPresetMeta {
  id: AnimationPresetName;
  name: string;
  category: 'locomotion' | 'expressive' | 'action' | 'reaction';
  description: string;
  principles: string[]; // 12 Principles of cartoon animation
  defaultDuration: number;
  iconName: string;
  soundEffect?: 'jump' | 'wave' | 'talk' | 'click' | 'scene_change' | 'fanfare';
}

export type ToonHairStyle = 'wave' | 'spikes' | 'bob' | 'curl' | 'short' | 'cap';
export type ToonAccessory = 'none' | 'glasses' | 'headphones' | 'earrings';

export interface ToonAppearance {
  skinTone: string;
  hairColor: string;
  clothingColor: string;
  accentColor: string;
  hairStyle: ToonHairStyle;
  accessory: ToonAccessory;
}

export interface ToonCharacterProps {
  character: string;
  action?: string;
  preset?: AnimationPresetName;
  customVariants?: Variants;
  speedMultiplier?: number;
  squashIntensity?: number;
  showCartoonEffects?: boolean;
  className?: string;
  showName?: boolean;
  appearance?: Partial<ToonAppearance>;
  playbackTime?: number;
  mouthState?: 'closed' | 'open' | 'wide' | 'round' | 'smile' | 'auto';
  expression?: 'neutral' | 'happy' | 'talking' | 'surprised' | 'serious' | 'winking';
  interactive?: boolean;
}

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

export type WorkflowStage =
  | 'project_created'
  | 'scenes_configured'
  | 'characters_assigned'
  | 'actions_assigned'
  | 'backgrounds_set'
  | 'transitions_set'
  | 'captions_added'
  | 'workflow_validated'
  | 'render_queued'
  | 'render_processing'
  | 'render_complete'
  | 'delivery_ready';

export interface SceneValidation {
  hasCharacter: boolean;
  hasAction: boolean;
  hasBackground: boolean;
  hasTransition: boolean;
  hasCaption: boolean;
  hasValidTiming: boolean;
}

export interface ProjectValidation {
  scenesValid: boolean;
  sceneValidations: SceneValidation[];
  totalScenes: number;
  validScenes: number;
  readyToRender: boolean;
}

export interface RenderJob {
  id: string;
  projectId: string | number;
  projectName: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  progress: number;
  startedAt: number;
  completedAt?: number;
  outputFormat: string;
  outputUrl?: string;
  fileSize?: string;
  duration: number;
}

export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  format: string;
  resolution: string;
  icon: string;
}

// ==========================================
// HITPAW AI TOOLKIT TYPES
// ==========================================

export type HitPawCreationMode =
  | 'cartoon_story'
  | 'photo_to_video'
  | 'face_animator'
  | 'ai_style_video'
  | 'upscale_enhance';

export type HitPawAspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type HitPawArtStyle =
  | 'pixar_3d'
  | '3d_pixar'
  | 'japanese_anime'
  | 'anime_ghibli'
  | 'claymation'
  | 'cyberpunk'
  | 'flat_vector'
  | 'comic_book'
  | 'classic_toon';

export interface HitPawEnhancementConfig {
  superResolution: 'none' | '1080p' | '4K' | '8K' | '4k' | '8k';
  upscaleResolution?: 'none' | '1080p' | '4K' | '8K' | '4k' | '8k';
  frameInterpolation: 'none' | '60fps' | '120fps';
  audioDenoise: boolean;
  visemeSync: boolean;
  subtitlesAutoGenerate: boolean;
}

export interface HitPawFormSettings {
  mode: HitPawCreationMode;
  artStyle: HitPawArtStyle;
  aspectRatio: HitPawAspectRatio;
  fps: 24 | 30 | 60;
  enhancements: HitPawEnhancementConfig;
  uploadedPhotoUrl?: string;
  uploadedPhotoName?: string;
}

export const defaultHitPawSettings: HitPawFormSettings = {
  mode: 'cartoon_story',
  artStyle: 'pixar_3d',
  aspectRatio: '9:16',
  fps: 30,
  enhancements: {
    superResolution: '4K',
    frameInterpolation: '60fps',
    audioDenoise: true,
    visemeSync: true,
    subtitlesAutoGenerate: true,
  },
};

// ==========================================
// UNIFIED PROJECT CONTAINER TYPE
// ==========================================

export interface AnimationProject {
  id: string;
  name: string;
  type: 'cartoon-scene' | 'marketing-reel';
  durationSeconds: number;
  scenes: AnimationScene[];
  reel?: MarketingReel;
  updatedAt: number;
  createdAt: number;
  status: 'Draft' | 'Ready to animate' | 'Rendered';
  workflowStage: WorkflowStage;
  hitpawSettings?: HitPawFormSettings;
}
