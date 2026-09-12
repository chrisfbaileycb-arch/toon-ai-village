import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clapperboard,
  Palette,
  Film,
  Sliders,
  Wand2,
  Flame,
  Share2,
  Tv,
  Layers,
  ChevronRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkle,
  Cloud,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ToonCustomizationProvider } from './context/ToonCustomizationContext';
import ReelBuilder from './components/ReelBuilder';
import ReelPlayer from './components/ReelPlayer';
import StoryboardEditor from './components/StoryboardEditor';
import MarketingCopyPanel from './components/MarketingCopyPanel';
import PresetGallery from './components/PresetGallery';
import CartoonStudio from './components/CartoonStudio';
import SceneEditor from './components/SceneEditor';
import HitPawAiToolkit from './components/HitPawAiToolkit';
import CartoonAnimationLibrary from './components/CartoonAnimationLibrary';
import FirebaseVault from './components/FirebaseVault';
import PwaStudioCockpit from './components/PwaStudioCockpit';
import { SAMPLE_PROJECTS } from './data/presets';
import { MarketingReel, Scene } from './types';
import { getCloudSyncStatus } from './lib/projectService';

export type ActiveTab =
  | 'marketing-reel'
  | 'cartoon-rig-studio'
  | 'storyboard-director'
  | 'timeline-scenes'
  | '12-principles-lab'
  | 'preset-campaigns'
  | 'firebase-vault'
  | 'pwa-hub';

const TAB_PIPELINE: { id: ActiveTab; label: string; icon: any; nextTab: ActiveTab; nextLabel: string }[] = [
  {
    id: 'marketing-reel',
    label: '🎬 Marketing Reel Studio',
    icon: Clapperboard,
    nextTab: 'cartoon-rig-studio',
    nextLabel: 'Mascot & Character Rigging',
  },
  {
    id: 'cartoon-rig-studio',
    label: '🎨 Mascot & Character Rigging',
    icon: Palette,
    nextTab: 'storyboard-director',
    nextLabel: 'Storyboard & TTS Director',
  },
  {
    id: 'storyboard-director',
    label: '🎞️ Storyboard & TTS Director',
    icon: Layers,
    nextTab: 'timeline-scenes',
    nextLabel: 'Scene Timeline Editor',
  },
  {
    id: 'timeline-scenes',
    label: '⏱️ Scene Timeline Editor',
    icon: Film,
    nextTab: '12-principles-lab',
    nextLabel: '12 Animation Principles Lab',
  },
  {
    id: '12-principles-lab',
    label: '⚡ 12 Animation Principles Lab',
    icon: Sparkles,
    nextTab: 'preset-campaigns',
    nextLabel: '30s/60s/90s Templates',
  },
  {
    id: 'preset-campaigns',
    label: '🌟 30s/60s/90s Templates',
    icon: Flame,
    nextTab: 'firebase-vault',
    nextLabel: 'Firebase Cloud Database',
  },
  {
    id: 'firebase-vault',
    label: '☁️ Firebase Cloud Database',
    icon: Cloud,
    nextTab: 'pwa-hub',
    nextLabel: 'Ultra PWA Cockpit',
  },
  {
    id: 'pwa-hub',
    label: '📲 Ultra PWA Cockpit',
    icon: Smartphone,
    nextTab: 'marketing-reel',
    nextLabel: 'Marketing Reel Studio',
  },
];

export function App() {
  // Initialize with the flagship 30s SaaS Mascot Launch campaign preset
  const [currentReel, setCurrentReel] = useState<MarketingReel>(SAMPLE_PROJECTS[0].reel);
  const [activeTab, setActiveTab] = useState<ActiveTab>('marketing-reel');
  const [showHitPawModal, setShowHitPawModal] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  useEffect(() => {
    const checkSync = () => {
      const status = getCloudSyncStatus();
      setIsCloudSynced(status.isCloudConnected);
    };
    checkSync();
    const interval = setInterval(checkSync, 5000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize scene updates across editors
  const handleUpdateScenes = (updatedScenes: Scene[]) => {
    setCurrentReel((prev) => ({
      ...prev,
      scenes: updatedScenes,
    }));
    notify('Storyboard updated across all studio views');
  };

  const handleUpdateReel = (newReel: MarketingReel) => {
    setCurrentReel(newReel);
    notify(`Loaded campaign: "${newReel.title}"`);
  };

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // Convert reel scenes to SceneEditor format if needed
  const editorScenes = currentReel.scenes.map((s, idx) => ({
    id: s.id || `scene-${idx + 1}`,
    title: `Scene ${idx + 1}`,
    character: currentReel.characterStyle || 'Mascot',
    action: s.characterAction || 'idle',
    caption: s.spokenLine || '',
    duration: s.durationSeconds || 5,
    background: s.imageUrl || 'Cartoon Studio',
    transition: (s.cameraTransition as any) || 'fade',
  }));

  const currentPipeline = TAB_PIPELINE.find((t) => t.id === activeTab) || TAB_PIPELINE[0];

  return (
    <ToonCustomizationProvider>
      <div className="min-h-screen bg-[#0d0417] text-zinc-100 flex flex-col font-sans selection:bg-[#ff9900] selection:text-black">
        {/* Persistent Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#140824]/95 backdrop-blur-md border-b border-[#2e174b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo / Brand */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setActiveTab('marketing-reel')}
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff9900] to-[#ff4400] flex items-center justify-center shadow-lg shadow-[#ff9900]/25">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black tracking-tight text-white">
                      ToneMark <span className="text-[#ff9900]">AI Toon Studio</span>
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#ff9900]/15 border border-[#ff9900]/30 text-[#ff9900] text-[10px] font-extrabold uppercase tracking-wider">
                      Unified Suite
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">
                    100% Cartoon Marketing Reels • Real-Time Firebase Backend • Ultra PWA
                  </p>
                </div>
              </div>

              {/* Quick Status Badges & Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Cloud Sync Status Pill */}
                <button
                  id="header-cloud-sync-btn"
                  onClick={() => setActiveTab('firebase-vault')}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-200 hover:text-white text-xs font-bold transition cursor-pointer"
                  title="Open Firebase Cloud Vault"
                >
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline text-[11px]">Firestore Cloud</span>
                  <span className={`w-2 h-2 rounded-full ${isCloudSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                </button>

                {/* PWA Cockpit Pill */}
                <button
                  id="header-pwa-cockpit-btn"
                  onClick={() => setActiveTab('pwa-hub')}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 hover:text-emerald-100 text-xs font-bold transition cursor-pointer"
                  title="Open Ultra PWA Cockpit"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-[11px]">PWA Hub</span>
                </button>

                {/* HitPaw Toolkit Trigger */}
                <button
                  id="header-open-hitpaw-btn"
                  onClick={() => setShowHitPawModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white text-xs font-extrabold shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">HitPaw AI Tools</span>
                </button>

                {/* Presets Button */}
                <button
                  id="header-preset-btn"
                  onClick={() => setActiveTab('preset-campaigns')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#200e3a] border border-[#3d2666] text-zinc-300 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Templates</span>
                </button>
              </div>
            </div>

            {/* Studio Mode Navigation Tabs (Connected Platforms) */}
            <div className="flex space-x-1 overflow-x-auto pb-2 pt-1 border-t border-[#23113b] scrollbar-none">
              {TAB_PIPELINE.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#ff9900] text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Global Floating Toast Notification */}
        {statusNotification && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl bg-zinc-900 border border-[#ff9900]/50 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Main Body Content View */}
        <main className="flex-1 pb-16">
          {/* TAB 1: MARKETING REELS STUDIO */}
          {activeTab === 'marketing-reel' && (
            <div className="space-y-12">
              {/* Creator Hero & Reel Configurator */}
              <section className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ReelBuilder
                  onReelGenerated={handleUpdateReel}
                  initialDuration={currentReel.durationSeconds}
                  onOpenPresets={() => setActiveTab('preset-campaigns')}
                />
              </section>

              {/* Live Canvas Video Player, Audio Equalizer & Subtitles */}
              <section className="border-t border-[#23113b] pt-8">
                <ReelPlayer reel={currentReel} />
              </section>

              {/* Social Media Copy Package & SRT Subtitle Export */}
              <section className="border-t border-[#23113b] pt-4">
                <MarketingCopyPanel reel={currentReel} />
              </section>

              {/* Storyboard Beats Quick View */}
              <section className="border-t border-[#23113b] pt-8">
                <StoryboardEditor
                  reel={currentReel}
                  onUpdateScenes={handleUpdateScenes}
                  onOpenCartoonStudio={() => setActiveTab('cartoon-rig-studio')}
                />
              </section>
            </div>
          )}

          {/* TAB 2: CARTOON RIG & MASCOT STUDIO */}
          {activeTab === 'cartoon-rig-studio' && (
            <div className="pt-4">
              <CartoonStudio onBack={() => setActiveTab('marketing-reel')} />
            </div>
          )}

          {/* TAB 3: STORYBOARD & TTS DIRECTOR */}
          {activeTab === 'storyboard-director' && (
            <div className="pt-8">
              <StoryboardEditor
                reel={currentReel}
                onUpdateScenes={handleUpdateScenes}
                onOpenCartoonStudio={() => setActiveTab('cartoon-rig-studio')}
              />
            </div>
          )}

          {/* TAB 4: TIMELINE SCENES EDITOR */}
          {activeTab === 'timeline-scenes' && (
            <div className="pt-2">
              <SceneEditor
                projectName={currentReel.title}
                projectDuration={`${currentReel.durationSeconds} Seconds`}
                initialScenes={editorScenes}
                onBack={() => setActiveTab('marketing-reel')}
                onSave={(newScenes) => {
                  const updatedReelScenes: Scene[] = newScenes.map((ns, idx) => ({
                    id: ns.id,
                    sceneNumber: idx + 1,
                    visualPrompt: `${ns.character} performing ${ns.action}`,
                    visualStyle: '3D Pixar Vibrant',
                    imageUrl: currentReel.characterCartoonUrl,
                    spokenLine: ns.caption,
                    durationSeconds: ns.duration,
                    characterAction: ns.action,
                    cameraTransition: ns.transition,
                  }));
                  handleUpdateScenes(updatedReelScenes);
                }}
              />
            </div>
          )}

          {/* TAB 5: 12 ANIMATION PRINCIPLES LAB */}
          {activeTab === '12-principles-lab' && (
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
              <div className="border-b border-[#2e174b] pb-4">
                <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-[#ff9900]" />
                  <span>The 12 Classic Disney Principles of Animation</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Interact with real-time physics, kinematics, squash & stretch, follow-through, and anticipation timings.
                </p>
              </div>
              <CartoonAnimationLibrary />
            </div>
          )}

          {/* TAB 6: CAMPAIGN PRESETS GALLERY */}
          {activeTab === 'preset-campaigns' && (
            <div className="pt-4">
              <PresetGallery
                onLoadProject={(selectedReel) => {
                  setCurrentReel(selectedReel);
                  setActiveTab('marketing-reel');
                  notify(`Loaded ${selectedReel.title} (${selectedReel.durationSeconds}s)`);
                }}
                onSelectDuration={(dur) => {
                  setCurrentReel((prev) => ({
                    ...prev,
                    durationSeconds: dur,
                  }));
                  setActiveTab('marketing-reel');
                }}
              />
            </div>
          )}

          {/* TAB 7: FIREBASE CLOUD DATABASE VAULT */}
          {activeTab === 'firebase-vault' && (
            <div className="pt-4">
              <FirebaseVault
                currentReel={currentReel}
                onLoadReel={(loaded) => {
                  setCurrentReel(loaded);
                  notify(`Loaded "${loaded.title}" from Firebase Firestore!`);
                }}
                onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
              />
            </div>
          )}

          {/* TAB 8: ULTRA PWA COCKPIT */}
          {activeTab === 'pwa-hub' && (
            <div className="pt-4">
              <PwaStudioCockpit
                onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
              />
            </div>
          )}

          {/* Pipeline Connectivity Banner linking current platform to next */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17092b] via-[#200c3b] to-[#17092b] border border-[#ff9900]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center space-x-2 text-xs text-purple-200">
                <span className="px-2 py-0.5 rounded-full bg-[#ff9900]/20 text-[#ff9900] font-black text-[10px] uppercase">
                  Connected Workflow
                </span>
                <span>
                  Finished in <strong className="text-white">{currentPipeline.label}</strong>?
                </span>
              </div>

              <button
                id="btn-next-pipeline-tab"
                onClick={() => setActiveTab(currentPipeline.nextTab)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff5500] hover:brightness-110 text-white text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to {currentPipeline.nextLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>

        {/* HitPaw AI Pro Toolkit Modal */}
        <HitPawAiToolkit
          isOpen={showHitPawModal}
          onClose={() => setShowHitPawModal(false)}
          activeSceneCharacter="Ava"
        />

        {/* Unified Studio Footer */}
        <footer className="border-t border-[#23113b] bg-[#0c0414] py-8 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-zinc-400">
              <Film className="w-4 h-4 text-[#ff9900]" />
              <span className="font-semibold text-white">ToneMark AI Animation Studio</span>
              <span>— 100% Cartoon Marketing Platform & PWA</span>
            </div>
            <p className="text-zinc-500">
              Firebase Firestore Real-Time Backend • 60fps Vector Cartoon Physics Engine • Service Worker Offline PWA
            </p>
          </div>
        </footer>
      </div>
    </ToonCustomizationProvider>
  );
}

export default App;
