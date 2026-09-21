import React, { useMemo, useState } from 'react';
import {
  BookOpen, BriefcaseBusiness, Check, ChevronRight, CircleHelp, FileText,
  FolderOpen, Home, LayoutTemplate, Lightbulb, Link2, Megaphone, Mic2,
  MonitorPlay, Palette, Play, Presentation, Smartphone, Sparkles, Square,
  Video, WandSparkles, Monitor
} from 'lucide-react';
import { HitPawAspectRatio, HitPawFormSettings, defaultHitPawSettings } from '../types';

export type OnboardingDuration = '30 sec' | '60 sec' | '90 sec';

export interface OnboardingSetup {
  duration: OnboardingDuration;
  templateId: string;
  templateTitle: string;
  scenes: number;
  exportGoal: string;
  hitpawSettings: HitPawFormSettings;
}

interface FirstProjectOnboardingProps {
  onComplete: (setup: OnboardingSetup) => void;
  onSkip: () => void;
}

const creationTypes = [
  { id: 'marketing', title: 'Marketing Video', detail: 'Promote a business, product, or service.', icon: Megaphone, color: 'text-rose-500 bg-rose-50' },
  { id: 'explainer', title: 'Website Explainer', detail: 'Turn a page or idea into a clear story.', icon: MonitorPlay, color: 'text-blue-600 bg-blue-50' },
  { id: 'short-series', title: 'Short or Series', detail: 'YouTube Shorts, reels, or episodes.', icon: Video, color: 'text-red-500 bg-red-50' },
  { id: 'podcast', title: 'Faceless Podcast', detail: 'Turn narration into visual content.', icon: Mic2, color: 'text-violet-600 bg-violet-50' },
  { id: 'how-to-pitch', title: 'How-To & Business Pitch', detail: 'Teach an app, advertise, or pitch an idea.', icon: Presentation, color: 'text-emerald-600 bg-emerald-50' },
] as const;

const howToTypes = [
  { id: 'app-walkthrough', title: 'App walkthrough', icon: Smartphone },
  { id: 'advertising-guide', title: 'Advertising guide', icon: Megaphone },
  { id: 'business-pitch', title: 'Business pitch', icon: BriefcaseBusiness },
] as const;

const ratios: Array<{ value: HitPawAspectRatio; label: string; note: string; icon: React.ElementType }> = [
  { value: '9:16', label: '9:16', note: 'Shorts & Reels', icon: Smartphone },
  { value: '1:1', label: '1:1', note: 'Social feed', icon: Square },
  { value: '16:9', label: '16:9', note: 'YouTube & web', icon: Monitor },
];

export const FirstProjectOnboarding: React.FC<FirstProjectOnboardingProps> = ({ onComplete, onSkip }) => {
  const [idea, setIdea] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [templateId, setTemplateId] = useState('marketing');
  const [howToType, setHowToType] = useState('app-walkthrough');
  const [duration, setDuration] = useState<OnboardingDuration>('30 sec');
  const [aspectRatio, setAspectRatio] = useState<HitPawAspectRatio>('9:16');

  const selected = useMemo(
    () => creationTypes.find((item) => item.id === templateId) || creationTypes[0],
    [templateId]
  );

  const handleBuild = () => {
    const seconds = Number(duration.split(' ')[0]);
    onComplete({
      duration,
      templateId: templateId === 'how-to-pitch' ? howToType : templateId,
      templateTitle: templateId === 'how-to-pitch'
        ? howToTypes.find((item) => item.id === howToType)?.title || selected.title
        : selected.title,
      scenes: seconds === 30 ? 4 : seconds === 60 ? 6 : 9,
      exportGoal: aspectRatio === '9:16' ? 'social-channels' : aspectRatio === '16:9' ? 'landing-page' : 'social-feed',
      hitpawSettings: { ...defaultHitPawSettings, aspectRatio },
    });
  };

  return (
    <div id="first-project-onboarding" className="min-h-screen bg-[#fffaf0] text-[#071a3c] md:flex">
      <aside className="hidden md:flex md:w-[248px] lg:w-[272px] shrink-0 bg-[#092342] text-white p-5 lg:p-7 flex-col">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#ff6b5f] to-[#ffb02e] grid place-items-center shadow-lg">
            <Home className="h-6 w-6" />
          </div>
          <div className="font-black text-xl leading-5">Toon AI<br/><span className="text-[#ffd058]">Village</span></div>
        </div>
        <p className="mt-7 text-2xl leading-8 font-semibold text-white/90">Big ideas make brighter tomorrows.</p>
        <nav className="mt-10 space-y-2" aria-label="Main navigation">
          {[
            [Home, 'Home'], [FolderOpen, 'My Projects'], [Play, 'Create Video'],
            [LayoutTemplate, 'Templates'], [Palette, 'Brand Kit'], [CircleHelp, 'Help & Guides']
          ].map(([Icon, label]) => (
            <button key={String(label)} type="button" onClick={label === 'Home' ? onSkip : undefined}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${label === 'Create Video' ? 'bg-[#ff6b5f] shadow-lg shadow-red-950/20' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              {React.createElement(Icon as React.ElementType, { className: 'h-5 w-5' })}
              <span>{label as string}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-3xl bg-white/10 p-4 text-sm text-white/75">
          <Sparkles className="h-5 w-5 text-[#ffd058] mb-2" />
          Simple, friendly video creation for real people.
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <section className="relative min-h-[315px] overflow-hidden bg-[#ccecff]">
          <img src="/toon-village-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-transparent" />
          <div className="relative z-10 max-w-[780px] px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <div className="md:hidden flex items-center gap-2 font-black text-lg mb-5"><Home className="h-6 w-6 text-[#ff6b5f]"/> Toon AI Village</div>
            <p className="uppercase tracking-[.22em] text-xs font-black text-[#e34d45]">Create something people remember</p>
            <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[.97]">
              What story are we <span className="text-[#1466dd]">telling</span> <span className="text-[#ef463f]">today?</span>
            </h1>
            <p className="mt-4 max-w-xl text-base sm:text-lg font-semibold text-[#28415c]">
              Turn one simple idea into a friendly faceless cartoon video—in minutes.
            </p>
          </div>
        </section>

        <section className="relative z-20 -mt-5 px-4 pb-10 sm:px-7 lg:px-10">
          <div className="mx-auto max-w-[1180px] rounded-[28px] border border-[#dce3e8] bg-white shadow-[0_22px_70px_rgba(15,35,65,.14)] p-4 sm:p-6">
            <div className="grid lg:grid-cols-[1.65fr_.75fr] gap-3">
              <label className="rounded-2xl border-2 border-[#d9e4ef] bg-[#fbfdff] p-4 focus-within:border-[#2a72e5]">
                <span className="flex items-center gap-2 text-sm font-black"><FileText className="h-4 w-4 text-[#1768da]"/> Describe your idea or paste a script</span>
                <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={2}
                  placeholder="Example: Create a friendly 60-second cartoon showing customers how my app saves them time..."
                  className="mt-2 w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
              </label>
              <label className="rounded-2xl border-2 border-[#d9e4ef] bg-[#fbfdff] p-4 focus-within:border-[#2a72e5]">
                <span className="flex items-center gap-2 text-sm font-black"><Link2 className="h-4 w-4 text-[#1768da]"/> Or paste a website URL</span>
                <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} type="url" placeholder="https://"
                  className="mt-3 w-full rounded-xl border border-[#d8e1eb] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2a72e5]" />
              </label>
            </div>

            <div className="mt-5 grid xl:grid-cols-[1fr_320px] gap-6">
              <div>
                <h2 className="text-sm font-black">1. Choose what you want to create</h2>
                <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {creationTypes.map((item) => {
                    const Icon = item.icon;
                    const active = templateId === item.id;
                    return (
                      <button key={item.id} type="button" onClick={() => setTemplateId(item.id)}
                        aria-pressed={active}
                        className={`relative min-h-[146px] rounded-2xl border-2 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? 'border-[#1768da] bg-blue-50/40 shadow-sm' : 'border-[#e2e8ef] bg-white'}`}>
                        {active && <Check className="absolute right-2 top-2 h-4 w-4 text-[#1768da]" />}
                        <div className={`h-10 w-10 rounded-xl grid place-items-center ${item.color}`}><Icon className="h-5 w-5"/></div>
                        <h3 className="mt-3 text-sm font-black leading-4">{item.title}</h3>
                        <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{item.detail}</p>
                      </button>
                    );
                  })}
                </div>
                {templateId === 'how-to-pitch' && (
                  <div className="mt-3 rounded-2xl bg-emerald-50 p-3 flex flex-wrap gap-2" aria-label="How-to and pitch templates">
                    {howToTypes.map((item) => {
                      const Icon = item.icon;
                      return <button key={item.id} type="button" onClick={() => setHowToType(item.id)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black border transition ${howToType === item.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-200 text-emerald-900'}`}>
                        <Icon className="h-4 w-4"/>{item.title}
                      </button>;
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-black">2. Choose video length</h2>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(['30 sec','60 sec','90 sec'] as OnboardingDuration[]).map((value) => (
                      <button key={value} type="button" onClick={() => setDuration(value)}
                        className={`rounded-xl border-2 px-2 py-3 text-sm font-black ${duration === value ? 'border-[#1768da] bg-blue-50 text-[#1768da]' : 'border-[#e2e8ef]'}`}>
                        {value.replace(' sec','')}<span className="block text-[9px] font-bold">seconds</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-black">3. Choose output format</h2>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {ratios.map((ratio) => {
                      const Icon = ratio.icon;
                      return <button key={ratio.value} type="button" onClick={() => setAspectRatio(ratio.value)}
                        className={`rounded-xl border-2 px-2 py-2.5 text-center ${aspectRatio === ratio.value ? 'border-[#1768da] bg-blue-50 text-[#1768da]' : 'border-[#e2e8ef]'}`}>
                        <Icon className="mx-auto h-4 w-4"/><span className="block text-xs font-black mt-1">{ratio.label}</span><span className="block text-[8px] text-slate-500">{ratio.note}</span>
                      </button>;
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid lg:grid-cols-[1fr_250px] gap-4 items-stretch">
              <div className="rounded-2xl border border-[#e1e7ec] bg-[#fffaf1] p-4">
                <h2 className="text-sm font-black">From idea to polished cartoon</h2>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    [Lightbulb, '1. Your idea', 'Tell us what you need.'],
                    [BookOpen, '2. We build scenes', 'Review the simple storyboard.'],
                    [WandSparkles, '3. Your video', 'Download and share it.'],
                  ].map(([Icon, title, copy]) => (
                    <div key={String(title)} className="flex gap-2 rounded-xl bg-white p-3">
                      {React.createElement(Icon as React.ElementType, { className: 'h-6 w-6 shrink-0 text-[#ff9e25]' })}
                      <div><p className="text-xs font-black">{title as string}</p><p className="mt-1 text-[10px] text-slate-500">{copy as string}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <button id="onboarding-finish-create-btn" type="button" onClick={handleBuild}
                className="group rounded-2xl bg-[#ff6259] px-6 py-5 text-white shadow-lg shadow-red-200 transition hover:bg-[#ef4b43] hover:-translate-y-0.5">
                <span className="flex items-center justify-center gap-2 text-lg font-black"><Sparkles className="h-5 w-5"/> Build my story <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1"/></span>
                <span className="mt-1 block text-xs text-white/85">No technical skills required.</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FirstProjectOnboarding;
