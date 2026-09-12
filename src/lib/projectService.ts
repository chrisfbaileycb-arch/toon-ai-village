import {
  db,
  isFirebaseAvailable,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from './firebase';
import type { WorkflowStage, RenderJob } from './workflowEngine';
import type { HitPawFormSettings, MarketingReel } from '../types';

export interface CharacterRigConfig {
  character: string;
  species?: 'humanoid_toon' | 'robot_mascot' | 'bunny_critter' | 'cyber_fox' | 'chibi_hero' | 'clay_bear';
  appearance?: {
    skinTone?: string;
    hairColor?: string;
    clothingColor?: string;
    accentColor?: string;
    hairStyle?: string;
    accessory?: string;
  };
  action?: string;
  expression?: 'happy' | 'talking' | 'surprised' | 'serious' | 'winking';
  mouthShape?: 'closed' | 'open' | 'wide' | 'round' | 'smile';
}

export interface KeyframeData {
  time: number;
  action: string;
  mouthShape: string;
  headTilt?: number;
  scale?: number;
}

export interface FirestoreScene {
  id: string;
  projectId: string;
  title: string;
  duration: number;
  keyframes: KeyframeData[];
  characterRigConfig: CharacterRigConfig;
  dialoguePrompt: string;
  background: string;
  transition: string;
}

export interface FirestoreProject {
  id: string;
  userId: string;
  title: string;
  duration: string;
  template: string;
  reelData?: MarketingReel;
  sceneData: Array<{
    id: string;
    title: string;
    character: string;
    caption: string;
    duration: number;
    background?: string;
    action?: string;
    transition?: string;
    keyframes?: KeyframeData[];
    characterRigConfig?: CharacterRigConfig;
  }>;
  workflowState: {
    stage: WorkflowStage;
    progress: number;
    message: string;
    timestamp: number;
  };
  status: 'Draft' | 'Ready to animate' | 'Rendering' | 'Render complete';
  renderJob?: RenderJob | null;
  hitpawSettings?: HitPawFormSettings;
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowEventLog {
  id?: string;
  projectId: string;
  stage: WorkflowStage;
  progress: number;
  message: string;
  timestamp: number;
  actor: string;
}

const LOCAL_STORAGE_KEY = 'tonemark_cartoon_projects_cache';
const EVENTS_STORAGE_KEY = 'tonemark_cartoon_events_cache';

export const getCachedProjects = (): FirestoreProject[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCachedProjects = (projects: FirestoreProject[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('projects_updated'));
  } catch {
    // ignore quota issues
  }
};

let isCloudConnected = isFirebaseAvailable;
let lastCloudSyncTime = Date.now();

export const getCloudSyncStatus = () => ({
  isCloudConnected,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastSyncTime: lastCloudSyncTime,
});

export const saveProjectToFirestore = async (
  project: Omit<FirestoreProject, 'userId' | 'createdAt' | 'updatedAt'> & {
    userId?: string;
    createdAt?: number;
    updatedAt?: number;
  }
): Promise<string> => {
  const currentUserId = project.userId || 'toon-director-1';
  const now = Date.now();
  const projectId = project.id.toString();

  const projectPayload: FirestoreProject = {
    ...project,
    id: projectId,
    userId: currentUserId,
    createdAt: project.createdAt || now,
    updatedAt: now,
  };

  // 1. Immediately cache locally
  const existing = getCachedProjects();
  const idx = existing.findIndex((p) => p.id === projectId);
  if (idx >= 0) {
    existing[idx] = projectPayload;
  } else {
    existing.unshift(projectPayload);
  }
  setCachedProjects(existing);

  // 2. Persist to real Firebase Firestore if available
  if (db && isFirebaseAvailable) {
    try {
      const projectRef = doc(db, 'cartoon_projects', projectId);
      // Clean undefined fields for Firestore
      const sanitized = JSON.parse(JSON.stringify(projectPayload));
      await setDoc(projectRef, sanitized, { merge: true });
      lastCloudSyncTime = Date.now();
      isCloudConnected = true;
      window.dispatchEvent(new CustomEvent('cloud_sync_success', { detail: { projectId } }));
    } catch (error) {
      console.warn('Firebase Firestore save failed, saved locally:', error);
      isCloudConnected = false;
    }
  }

  // 3. Log event
  logWorkflowEvent(
    projectId,
    project.workflowState.stage,
    project.workflowState.progress,
    project.workflowState.message
  );

  return projectId;
};

export const deleteProjectFromFirestore = async (projectId: string): Promise<void> => {
  // Remove from local cache
  const existing = getCachedProjects();
  const filtered = existing.filter((p) => p.id !== projectId);
  setCachedProjects(filtered);

  // Remove from real Firebase Firestore
  if (db && isFirebaseAvailable) {
    try {
      const projectRef = doc(db, 'cartoon_projects', projectId);
      await deleteDoc(projectRef);
      lastCloudSyncTime = Date.now();
    } catch (err) {
      console.warn('Firestore delete error:', err);
    }
  }
};

export const updateProjectWorkflowState = async (
  projectId: string,
  stage: WorkflowStage,
  progress: number,
  message: string,
  renderJob?: RenderJob | null
): Promise<void> => {
  const existing = getCachedProjects();
  const idx = existing.findIndex((p) => p.id === projectId);
  if (idx >= 0) {
    const status =
      stage === 'delivery_ready' || stage === 'render_complete'
        ? 'Render complete'
        : stage === 'render_processing' || stage === 'render_queued'
          ? 'Rendering'
          : 'Ready to animate';

    const updated: FirestoreProject = {
      ...existing[idx],
      workflowState: {
        stage,
        progress,
        message,
        timestamp: Date.now(),
      },
      status,
      renderJob: renderJob !== undefined ? renderJob : existing[idx].renderJob,
      updatedAt: Date.now(),
    };

    existing[idx] = updated;
    setCachedProjects(existing);

    if (db && isFirebaseAvailable) {
      try {
        const projectRef = doc(db, 'cartoon_projects', projectId);
        await setDoc(projectRef, JSON.parse(JSON.stringify(updated)), { merge: true });
      } catch (err) {
        console.warn('Firestore update state failed:', err);
      }
    }
  }

  logWorkflowEvent(projectId, stage, progress, message);
};

export const logWorkflowEvent = (
  projectId: string,
  stage: WorkflowStage,
  progress: number,
  message: string
) => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    const events: WorkflowEventLog[] = raw ? JSON.parse(raw) : [];
    events.push({
      id: 'evt-' + Date.now(),
      projectId,
      stage,
      progress,
      message,
      timestamp: Date.now(),
      actor: 'Cartoon Studio Engine',
    });
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events.slice(-50)));
    window.dispatchEvent(new CustomEvent('workflow_event_' + projectId));
  } catch {
    // Ignore storage issues
  }
};

export const subscribeToWorkflowEvents = (
  projectId: string,
  callback: (events: WorkflowEventLog[]) => void
): (() => void) => {
  const getEvents = () => {
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
      const all: WorkflowEventLog[] = raw ? JSON.parse(raw) : [];
      return all.filter((e) => e.projectId === projectId);
    } catch {
      return [];
    }
  };

  callback(getEvents());

  const handler = () => {
    callback(getEvents());
  };

  window.addEventListener('workflow_event_' + projectId, handler);
  return () => {
    window.removeEventListener('workflow_event_' + projectId, handler);
  };
};

export const subscribeToUserProjects = (
  userId: string | undefined,
  callback: (projects: FirestoreProject[]) => void
): (() => void) => {
  // Initial local response for instant UI
  callback(getCachedProjects());

  let unsubscribeFirestore: (() => void) | null = null;

  if (db && isFirebaseAvailable) {
    try {
      const projectsCol = collection(db, 'cartoon_projects');
      unsubscribeFirestore = onSnapshot(
        projectsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudProjects: FirestoreProject[] = [];
            snapshot.forEach((docSnap) => {
              cloudProjects.push(docSnap.data() as FirestoreProject);
            });
            // Merge with local cache
            setCachedProjects(cloudProjects);
            callback(cloudProjects);
            isCloudConnected = true;
            lastCloudSyncTime = Date.now();
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot listener error:', err);
          isCloudConnected = false;
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore listener:', err);
    }
  }

  const localHandler = () => {
    callback(getCachedProjects());
  };

  window.addEventListener('projects_updated', localHandler);
  return () => {
    window.removeEventListener('projects_updated', localHandler);
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
};
