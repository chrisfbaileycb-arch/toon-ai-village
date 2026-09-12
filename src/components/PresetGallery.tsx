import React from 'react';
import { Sparkles, Play, Clock, Flame, ArrowRight, Layers } from 'lucide-react';
import { SampleProject, MarketingReel } from '../types';
import { SAMPLE_PROJECTS } from '../data/presets';

interface PresetGalleryProps {
  onLoadProject: (reel: MarketingReel) => void;
  onSelectDuration: (dur: 30 | 60 | 90) => void;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  onLoadProject,
  onSelectDuration,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
          <Flame className="h-3.5 w-3.5" />
          <span>High-Converting Campaign Templates</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Ready-Made <span className="text-amber-400">30s, 60s & 90s</span> Marketing Templates
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Click any pre-crafted cartoon marketing campaign to instantly load its complete storyboard, spoken voiceover script, and scene animations.
        </p>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_PROJECTS.map((project) => (
          <div
            key={project.id}
            id={`preset-card-${project.id}`}
            className="group relative flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header Image with duration pill */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
              <img
                src={project.reel.characterCartoonUrl}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

              {/* Duration Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                <Clock className="h-3 w-3" />
                <span>{project.duration} Seconds</span>
              </div>

              {/* Style Badge */}
              <div className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-zinc-200 border border-white/10">
                {project.style}
              </div>

              {/* Title on Image bottom */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {project.tag}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight">{project.name}</h3>
                <p className="text-xs text-zinc-400">{project.subtitle}</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300 leading-relaxed italic">
                  &quot;{project.reel.hookHeadline}&quot;
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <span>Scenes: <strong className="text-white">{project.reel.scenes.length}</strong></span>
                  <span>Words: <strong className="text-white">{project.reel.fullVoiceoverScript.split(' ').length}</strong></span>
                  <span>Voice: <strong className="text-white">{project.reel.voice}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  id={`load-preset-${project.id}`}
                  onClick={() => onLoadProject(project.reel)}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Load & Play Template</span>
                </button>

                <button
                  id={`similar-duration-${project.id}`}
                  onClick={() => {
                    onSelectDuration(project.duration);
                  }}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                  title="Create similar duration"
                >
                  <Clock className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetGallery;
