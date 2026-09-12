import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  FolderDown,
  UploadCloud,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Copy,
  Clock,
  HardDrive,
} from 'lucide-react';
import {
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  subscribeToUserProjects,
  getCloudSyncStatus,
  FirestoreProject,
} from '../lib/projectService';
import { MarketingReel } from '../types';

interface FirebaseVaultProps {
  currentReel: MarketingReel;
  onLoadReel: (reel: MarketingReel) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const FirebaseVault: React.FC<FirebaseVaultProps> = ({
  currentReel,
  onLoadReel,
  onNavigateToTab,
}) => {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState(getCloudSyncStatus());

  useEffect(() => {
    const unsub = subscribeToUserProjects('toon-director-1', (cloudProjects) => {
      setProjects(cloudProjects);
      setSyncStatus(getCloudSyncStatus());
    });

    const interval = setInterval(() => {
      setSyncStatus(getCloudSyncStatus());
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSaveCurrentReel = async () => {
    setIsSaving(true);
    try {
      const projectId = currentReel.id || `proj-${Date.now()}`;
      await saveProjectToFirestore({
        id: projectId,
        title: currentReel.title,
        duration: `${currentReel.totalDuration}s`,
        template: currentReel.characterStyle,
        reelData: currentReel,
        sceneData: currentReel.scenes.map((s, idx) => ({
          id: s.id || `scene-${idx}`,
          title: s.title,
          character: currentReel.characterStyle,
          caption: s.caption || s.narration,
          duration: s.durationSeconds,
          background: s.imageUrl,
          action: s.motionType,
        })),
        status: 'Ready to animate',
        workflowState: {
          stage: 'workflow_validated',
          progress: 80,
          message: 'Saved to Firebase Firestore Cloud Vault',
          timestamp: Date.now(),
        },
      });
      showFeedback(`Successfully saved "${currentReel.title}" to Firestore!`);
    } catch (err: any) {
      showFeedback('Saved locally (Offline mode active): ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from Firebase?`)) {
      await deleteProjectFromFirestore(id);
      showFeedback(`Project "${title}" deleted`);
    }
  };

  const handleLoadProject = (proj: FirestoreProject) => {
    if (proj.reelData) {
      onLoadReel(proj.reelData);
      showFeedback(`Loaded "${proj.title}" into active studio workspace`);
      onNavigateToTab('marketing-reel');
    } else {
      showFeedback(`Loaded project scenes for "${proj.title}"`);
    }
  };

  const handleExportBackup = () => {
    const json = JSON.stringify(projects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tonemark-cartoon-projects-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Exported full Firestore backup JSON file');
  };

  return (
    <div id="firebase-vault-root" className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Top Banner & Cloud Health Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#17092b] border border-purple-800/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" /> Firebase Firestore Real-Time Backend
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                syncStatus.isCloudConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${syncStatus.isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {syncStatus.isCloudConnected ? 'Connected & Synced' : 'Offline Cache Active'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            ToneMark Firebase Cloud Vault
          </h2>
          <p className="text-xs md:text-sm text-purple-300/80">
            Database: <code className="font-mono text-amber-300">cartoon_projects</code> collection • Real-time onSnapshot synchronization • Durable cloud persistence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-save-current-to-cloud"
            onClick={handleSaveCurrentReel}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Save Current Reel to Cloud</span>
          </button>
          <button
            id="btn-export-backup-json"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-xs sm:text-sm font-semibold text-purple-200 flex items-center gap-1.5 transition"
          >
            <FolderDown className="w-4 h-4 text-amber-400" />
            <span>Export Backup JSON</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Cloud Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-400" />
            Saved Cloud Projects ({projects.length})
          </h3>
          <span className="text-xs text-purple-300/70">
            Last Synced: {new Date(syncStatus.lastSyncTime).toLocaleTimeString()}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#140824] border border-dashed border-purple-900/60">
            <Cloud className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
            <p className="text-base font-bold text-white mb-1">No Projects in Cloud Vault Yet</p>
            <p className="text-xs text-purple-300/70 max-w-md mx-auto mb-5">
              Click &quot;Save Current Reel to Cloud&quot; to securely store your cartoon marketing reels and mascot rigs in Firebase Firestore!
            </p>
            <button
              onClick={handleSaveCurrentReel}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Save Active Reel Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-[#17092b] border border-purple-800/40 hover:border-purple-600/60 transition shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 text-[10px] font-bold uppercase">
                      {proj.template || 'Cartoon'} • {proj.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {proj.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-purple-300/70 mt-1 line-clamp-2">
                    {proj.workflowState?.message || `${proj.sceneData?.length || 0} cartoon scenes`}
                  </p>

                  <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-purple-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-amber-400/90">{proj.sceneData?.length || 0} Scenes</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-900/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLoadProject(proj)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Load in Studio
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-red-300 transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Platform Pipeline Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-[#1e0a36] to-amber-950/40 border border-purple-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Connected Creation Pipeline
          </h4>
          <p className="text-xs text-purple-300/80 mt-1">
            Now that your reel is safely synchronized to Firebase, test the standalone PWA capabilities or launch the TikTok & Shorts suite!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('pwa-hub')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
          >
            Open Ultra PWA Cockpit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseVault;
