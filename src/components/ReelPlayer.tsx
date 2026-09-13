import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Check,
  Maximize2,
  RefreshCw,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { MarketingReel } from '../types';
import { playVoiceover, stopVoiceover, generateSRT } from '../lib/audioService';
import { exportReelToVideo, ExportProgress } from '../lib/videoExporter';
import ToonCharacter from './ToonCharacter';
import VectorCartoonRig from './VectorCartoonRig';
import FreemiumWatermark from './FreemiumWatermark';

interface ReelPlayerProps {
  reel: MarketingReel;
  onEditStoryboard: () => void;
  onOpenSocialPackage?: () => void;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reel,
  onEditStoryboard,
  onOpenSocialPackage,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const isPro = useMemo(() => {
    try { return localStorage.getItem('toonmark_v1_pro') === '1'; } catch { return false; }
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  // Find active scene based on currentTime
  const currentSceneIdx = reel.scenes.findIndex(
    (s) => currentTime >= s.startSeconds && currentTime < s.endSeconds
  );
  const activeScene = reel.scenes[currentSceneIdx >= 0 ? currentSceneIdx : 0] || reel.scenes[0];

  const togglePlay = async () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = async () => {
    setIsPlaying(true);

    if (!isMuted) {
      stopAudioRef.current = await playVoiceover(
        reel.fullVoiceoverScript,
        reel.audioBase64,
        reel.audioMimeType || 'audio/mp3',
        () => {
          pausePlayback();
          setCurrentTime(0);
        }
      );
    }
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    stopVoiceover();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const restartPlayback = () => {
    pausePlayback();
    setCurrentTime(0);
    setTimeout(() => {
      startPlayback();
    }, 150);
  };

  // Timer loop for continuous playback progression
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 100 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= reel.totalDuration) {
            pausePlayback();
            return 0;
          }
          return next;
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, reel.totalDuration]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopVoiceover();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleExportVideo = async () => {
    setIsExporting(true);
    pausePlayback();

    try {
      await exportReelToVideo(reel, (progress) => {
        setExportProgress(progress);
      });
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Video export could not be completed: ' + err.message);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const downloadSRTFile = () => {
    const srt = generateSRT(reel.scenes);
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reel.title.replace(/\s+/g, '-').toLowerCase()}-subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(reel.fullVoiceoverScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-orange-500/20 px-3 py-0.5 text-xs font-bold text-orange-400 border border-orange-500/30">
              {reel.totalDuration}s Spoken Marketing Reel
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-medium">
              Voice: <strong className="text-zinc-200">{reel.voice}</strong>
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-medium">
              Ratio: <strong className="text-zinc-200">{reel.aspectRatio}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {reel.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
            &quot;{reel.hookHeadline}&quot;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="edit-storyboard-btn"
            onClick={onEditStoryboard}
            className="flex items-center space-x-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
          >
            <Layers className="h-4 w-4 text-orange-400" />
            <span>Edit Storyboard Script</span>
          </button>

          <button
            id="export-video-webm-btn"
            onClick={handleExportVideo}
            disabled={isExporting}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 px-5 py-2.5 text-xs font-black text-white shadow-lg hover:brightness-110 transition cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>
                  {exportProgress
                    ? `${exportProgress.stage} (${exportProgress.percent}%)`
                    : 'Exporting...'}
                </span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Video (WebM / MP4)</span>
              </>
            )}
          </button>

          {onOpenSocialPackage && (
            <button
              id="view-social-package-btn"
              onClick={onOpenSocialPackage}
              className="flex items-center space-x-1.5 rounded-xl bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-pink-400" />
              <span>Social Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Player Display: Center Reel + Side Script */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center Column: Cinematic Reel Frame */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <div
            id="reel-viewport-container"
            className={`relative rounded-3xl overflow-hidden border-2 border-zinc-700 bg-black shadow-2xl flex items-center justify-center ${
              reel.aspectRatio === '9:16'
                ? 'w-full max-w-[360px] aspect-[9/16]'
                : reel.aspectRatio === '16:9'
                  ? 'w-full aspect-[16/9]'
                  : 'w-full max-w-[440px] aspect-square'
            }`}
          >
            {/* Active Scene Background with Ken Burns motion */}
            {activeScene && (
              <img
                src={activeScene.imageUrl}
                alt={activeScene.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 transform scale-105"
                style={{
                  filter: 'brightness(0.9)',
                }}
              />
            )}

            {/* Gradient Dimming for Subtitle Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

            {/* Freemium watermark for free-tier users — sits above gradient, below mascot/HUD */}
            {!isPro && <FreemiumWatermark opacity={0.15} />}

            {/* Spokesperson Mascot Overlay in Scene */}
            <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-6 pointer-events-none z-10">
              <div className="relative flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-zinc-900/90 p-1 flex items-center justify-center backdrop-blur-sm">
                  {reel.characterCartoonUrl && reel.characterCartoonUrl.startsWith('data:image/svg+xml') ? (
                    <img
                      src={reel.characterCartoonUrl}
                      alt="Spokesperson"
                      className={`w-full h-full object-contain ${
                        isPlaying ? 'animate-bounce' : ''
                      }`}
                      style={{ animationDuration: '1.2s' }}
                    />
                  ) : (
                    <div className="w-full h-full scale-[0.65] origin-center -mt-2">
                      <VectorCartoonRig
                        archetype={reel.characterStyle === 'anime-manga' ? 'anime' : reel.characterStyle === 'vector-flat' ? 'vector' : 'robot'}
                        action={isPlaying ? 'talking' : 'idle'}
                        expression={isPlaying ? 'excited' : 'happy'}
                        glowColor="#ff9900"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-black text-amber-300 border border-amber-500/30">
                  {reel.characterStyle}
                </div>
              </div>
            </div>

            {/* Top Scene Tracker HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                Scene {currentSceneIdx + 1} of {reel.scenes.length}: {activeScene?.title}
              </div>
              <div className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-black text-white shadow">
                {currentTime.toFixed(1)}s / {reel.totalDuration}s
              </div>
            </div>

            {/* Kinetic Caption Overlay at bottom */}
            {activeScene && (
              <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                <div className="inline-block rounded-2xl bg-black/80 backdrop-blur-md px-4 py-2.5 border border-white/15 max-w-sm shadow-xl">
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider block mb-0.5">
                    {activeScene.title}
                  </span>
                  <p className="text-white font-bold text-xs sm:text-sm leading-snug">
                    &quot;{activeScene.caption}&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Big Center Play Icon overlay when paused */}
            {!isPlaying && (
              <button
                id="viewport-center-play-btn"
                onClick={togglePlay}
                className="absolute z-30 p-5 rounded-full bg-orange-500/90 hover:bg-orange-500 text-white shadow-2xl transition transform hover:scale-110 cursor-pointer backdrop-blur-sm"
              >
                <Play className="h-8 w-8 ml-1" />
              </button>
            )}
          </div>

          {/* Media Player Controls Bar */}
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3 shadow-lg">
            {/* Scrubber Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{reel.totalDuration}s</span>
              </div>
              <input
                id="playback-timeline-scrubber"
                type="range"
                min="0"
                max={reel.totalDuration}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentTime(val);
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Player Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  id="play-pause-toggle-btn"
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold transition shadow-md cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>

                <button
                  id="restart-playback-btn"
                  onClick={restartPlayback}
                  className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  id="mute-unmute-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-zinc-300" />}
                </button>
              </div>

              {/* Speed toggle */}
              <div className="flex items-center space-x-1">
                {[0.8, 1, 1.25].map((spd) => (
                  <button
                    key={spd}
                    id={`speed-btn-${spd}x`}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                      playbackSpeed === spd
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Spoken Script & Scene List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Script Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="h-4 w-4 text-orange-400" />
                <span>Complete Voiceover Script</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  id="copy-voiceover-script-btn"
                  onClick={copyScriptToClipboard}
                  className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : null}
                  <span>{copiedScript ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  id="download-srt-subtitles-btn"
                  onClick={downloadSRTFile}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center space-x-1 cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>.SRT File</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/80 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-h-48 overflow-y-auto">
              {reel.fullVoiceoverScript}
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Word Count: <strong className="text-white">{reel.fullVoiceoverScript.split(' ').length} words</strong></span>
              <span>Estimated Pace: <strong className="text-white">~140 WPM</strong></span>
            </div>
          </div>

          {/* Scene Breakdown List */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Scenes Breakdown ({reel.scenes.length} Scenes)
              </h3>
              <span className="text-[11px] text-zinc-400">Click to seek</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {reel.scenes.map((scene, idx) => {
                const isActive = currentSceneIdx === idx;
                return (
                  <button
                    key={scene.id}
                    id={`scene-item-${scene.id}`}
                    onClick={() => {
                      setCurrentTime(scene.startSeconds);
                      if (!isPlaying) {
                        startPlayback();
                      }
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition cursor-pointer ${
                      isActive
                        ? 'border-orange-500 bg-orange-500/15 shadow-md'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={scene.imageUrl}
                      alt={scene.title}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">
                          {idx + 1}. {scene.title}
                        </span>
                        <span className="text-[10px] font-mono text-orange-400">
                          {scene.startSeconds}s - {scene.endSeconds}s
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                        &quot;{scene.narration}&quot;
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelPlayer;
