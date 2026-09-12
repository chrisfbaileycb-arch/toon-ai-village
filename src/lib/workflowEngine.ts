import {
  type WorkflowStage,
  type SceneValidation,
  type ProjectValidation,
  type RenderJob,
  type DeliveryOption,
} from '../types';

export type {
  WorkflowStage,
  SceneValidation,
  ProjectValidation,
  RenderJob,
  DeliveryOption,
};

export const getStageOrder = (): WorkflowStage[] => [
  'project_created',
  'scenes_configured',
  'characters_assigned',
  'actions_assigned',
  'backgrounds_set',
  'transitions_set',
  'captions_added',
  'workflow_validated',
  'render_queued',
  'render_processing',
  'render_complete',
  'delivery_ready',
];

export const getStageIndex = (stage: WorkflowStage): number =>
  getStageOrder().indexOf(stage);

export const getStageLabel = (stage: WorkflowStage): string => {
  const labels: Record<WorkflowStage, string> = {
    project_created: 'Project Created',
    scenes_configured: 'Scenes Configured',
    characters_assigned: 'Characters Assigned',
    actions_assigned: 'Actions Assigned',
    backgrounds_set: 'Backgrounds Set',
    transitions_set: 'Transitions Set',
    captions_added: 'Captions Added',
    workflow_validated: 'Workflow Validated',
    render_queued: 'Render Queued',
    render_processing: 'Render Processing',
    render_complete: 'Render Complete',
    delivery_ready: 'Delivery Ready',
  };

  return labels[stage] || stage;
};

export const getStageDescription = (stage: WorkflowStage): string => {
  const descriptions: Record<WorkflowStage, string> = {
    project_created: 'Project initialized with duration and template.',
    scenes_configured: 'Scene structure generated and editable.',
    characters_assigned: 'Every scene has a rendered toon character.',
    actions_assigned: 'Every character has an animated action.',
    backgrounds_set: 'Every scene has a visual environment.',
    transitions_set: 'Every scene has a transition configured.',
    captions_added: 'Every scene has dialogue or a caption.',
    workflow_validated: 'All production checks passed successfully.',
    render_queued: 'Project sent to the rendering pipeline.',
    render_processing: 'Frames are being generated and assembled.',
    render_complete: 'Video file rendered and encoded.',
    delivery_ready: 'Animation ready for export and delivery.',
  };

  return descriptions[stage] || '';
};

export const validateScenes = (
  scenes: Array<{
    character: string;
    action?: string;
    background?: string;
    transition?: string;
    caption: string;
    duration: number;
  }>
): ProjectValidation => {
  const sceneValidations: SceneValidation[] = scenes.map((scene) => ({
    hasCharacter: Boolean(scene.character && scene.character !== 'No character'),
    hasAction: Boolean(scene.action),
    hasBackground: Boolean(scene.background),
    hasTransition: Boolean(scene.transition),
    hasCaption: (scene.caption || '').trim().length > 0,
    hasValidTiming: Number.isFinite(scene.duration) && scene.duration >= 1,
  }));

  const validScenes = sceneValidations.filter(
    (v) =>
      v.hasCharacter &&
      v.hasAction &&
      v.hasBackground &&
      v.hasTransition &&
      v.hasCaption &&
      v.hasValidTiming
  ).length;

  return {
    scenesValid: validScenes === scenes.length && scenes.length > 0,
    sceneValidations,
    totalScenes: scenes.length,
    validScenes,
    readyToRender: validScenes === scenes.length && scenes.length > 0,
  };
};

export const determineWorkflowStage = (
  scenes: Array<{
    character: string;
    action?: string;
    background?: string;
    transition?: string;
    caption: string;
    duration: number;
  }>
): WorkflowStage => {
  if (!scenes || scenes.length === 0) return 'project_created';

  const validation = validateScenes(scenes);

  if (!validation.readyToRender) {
    const allHaveCharacters = scenes.every(
      (scene) => scene.character && scene.character !== 'No character'
    );
    if (!allHaveCharacters) return 'characters_assigned';

    const allHaveActions = scenes.every((scene) => Boolean(scene.action));
    if (!allHaveActions) return 'actions_assigned';

    const allHaveBackgrounds = scenes.every((scene) => Boolean(scene.background));
    if (!allHaveBackgrounds) return 'backgrounds_set';

    const allHaveTransitions = scenes.every((scene) => Boolean(scene.transition));
    if (!allHaveTransitions) return 'transitions_set';

    const allHaveCaptions = scenes.every((scene) => (scene.caption || '').trim().length > 0);
    if (!allHaveCaptions) return 'captions_added';

    return 'scenes_configured';
  }

  return 'workflow_validated';
};

export const calculateProgress = (stage: WorkflowStage): number => {
  const order = getStageOrder();
  const index = getStageIndex(stage);
  return Math.round(((index + 1) / order.length) * 100);
};

export const createRenderJob = (
  projectId: string | number,
  projectNameOrDuration: string | number,
  durationOrFormat?: number | string,
  outputFormat: string = 'MP4'
): RenderJob => {
  const projectName = typeof projectNameOrDuration === 'string' ? projectNameOrDuration : `Project-${projectId}`;
  const duration = typeof projectNameOrDuration === 'number' ? projectNameOrDuration : (typeof durationOrFormat === 'number' ? durationOrFormat : 30);
  const format = typeof durationOrFormat === 'string' ? durationOrFormat : outputFormat;

  return {
    id: `render-${Date.now()}-${projectId}`,
    projectId,
    projectName,
    status: 'queued',
    progress: 0,
    startedAt: Date.now(),
    outputFormat: format,
    duration,
  };
};

export const simulateRenderProgress = (
  job: RenderJob,
  progressOrCallback: number | ((updatedJob: RenderJob) => void)
): RenderJob => {
  if (typeof progressOrCallback === 'function') {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        progressOrCallback({
          ...job,
          progress: 100,
          status: 'complete',
          completedAt: Date.now(),
          outputUrl: `https://storage.googleapis.com/tonemark-renders/${job.id}.mp4`,
          fileSize: `${(job.duration * 0.85 + 2.5).toFixed(1)} MB`,
        });
      } else {
        progressOrCallback({
          ...job,
          progress: currentProgress,
          status: 'processing',
        });
      }
    }, 250);

    return { ...job, status: 'processing', progress: 5 };
  }

  const progress = progressOrCallback;
  if (progress >= 100) {
    return {
      ...job,
      progress: 100,
      status: 'complete',
      completedAt: Date.now(),
      outputUrl: `https://storage.googleapis.com/tonemark-renders/${job.id}.mp4`,
      fileSize: `${(job.duration * 0.85 + 2.5).toFixed(1)} MB`,
    };
  }

  if (progress > 0) {
    return {
      ...job,
      progress,
      status: 'processing',
    };
  }

  return job;
};

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 'social_mp4',
    label: 'Social MP4 (9:16 Vertical)',
    description: 'Optimized for TikTok, Instagram Reels, and YouTube Shorts',
    format: 'MP4 H.264',
    resolution: '1080×1920',
    icon: 'smartphone',
  },
  {
    id: 'youtube_mp4',
    label: 'YouTube Standard (16:9 Landscape)',
    description: 'Crisp 1080p widescreen explainer and trailer format',
    format: 'MP4 H.264',
    resolution: '1920×1080',
    icon: 'youtube',
  },
  {
    id: 'webm',
    label: 'WebM (High Fidelity VP9)',
    description: 'Ultra-compressed, transparent-ready web embedding',
    format: 'WebM VP9',
    resolution: '1920×1080',
    icon: 'globe',
  },
  {
    id: 'gif',
    label: 'Animated Cartoon GIF',
    description: 'Perfect for newsletters, READMEs, and Discord',
    format: 'GIF',
    resolution: '720×720',
    icon: 'image',
  },
];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};
