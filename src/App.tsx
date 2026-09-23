import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpen, Check, ChevronRight, Clock, Film, FolderOpen, Home,
  Image as ImageIcon, Menu, Mic2, Monitor, Palette, Play, Plus, RefreshCw,
  Save, Settings, Sparkles, Square, UserRoundCheck, Video, WandSparkles, X
} from 'lucide-react';
import FirstProjectOnboarding, { type OnboardingSetup } from './components/FirstProjectOnboarding';
import ReelPlayer from './components/ReelPlayer';
import type { AspectRatio, CartoonStyle, CharacterBible, MarketingGoal, MarketingReel, ReelDuration, ReelScene, VoicePersona } from './types';
import './village.css';

type View = 'home' | 'builder' | 'studio' | 'preview' | 'projects' | 'settings';

interface Draft {
  name: string;
  description: string;
  audience: string;
  duration: ReelDuration;
  aspectRatio: AspectRatio;
  style: CartoonStyle;
  characterName: string;
  characterDescription: string;
  goal: MarketingGoal;
  voice: VoicePersona;
  websiteUrl: string;
}

const DEFAULT_DRAFT: Draft = {
  name: 'My cartoon story', description: '', audience: 'People who want a clear, friendly explanation',
  duration: 60, aspectRatio: '9:16', style: 'pixar-3d', characterName: 'Village Guide',
  characterDescription: 'A warm, trustworthy guide with friendly expressions, a memorable silhouette, and simple professional clothing',
  goal: 'youtube-explainer', voice: 'Kore', websiteUrl: '',
};

const STYLE_OPTIONS: Array<{id: CartoonStyle; label: string; note: string; tone: string}> = [
  { id: 'pixar-3d', label: 'Village 3D', note: 'Warm cinematic depth', tone: 'sunny' },
  { id: 'claymation', label: 'Friendly Clay', note: 'Tactile handcrafted charm', tone: 'clay' },
  { id: 'comic-popart', label: 'Bold Story Panels', note: 'Graphic energy and color', tone: 'comic' },
  { id: 'vector-flat', label: 'Modern Illustrated', note: 'Clean dimensional shapes', tone: 'vector' },
];

function safeLoadReel(): MarketingReel | null {
  try { return JSON.parse(localStorage.getItem('toon-ai-village-active-story') || 'null'); }
  catch { return null; }
}

function saveReel(reel: MarketingReel | null) {
  if (!reel) return;
  try {
    localStorage.setItem('toon-ai-village-active-story', JSON.stringify(reel));
    const summaries = JSON.parse(localStorage.getItem('toon-ai-village-projects') || '[]') as Array<Record<string, unknown>>;
    const next = [{ id: reel.id, title: reel.title, duration: reel.duration, aspectRatio: reel.aspectRatio, createdAt: reel.createdAt, sceneCount: reel.scenes.length }, ...summaries.filter((p) => p.id !== reel.id)].slice(0, 20);
    localStorage.setItem('toon-ai-village-projects', JSON.stringify(next));
  } catch (error) { console.warn('Project persistence is full; the active session is still safe.', error); }
}

function App() {
  const [view, setView] = useState<View>(() => safeLoadReel() ? 'studio' : 'home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [characterBible, setCharacterBible] = useState<CharacterBible | null>(null);
  const [reel, setReel] = useState<MarketingReel | null>(safeLoadReel);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedScene, setSelectedScene] = useState(0);

  useEffect(() => { if (reel) saveReel(reel); }, [reel]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);

  const approved = useMemo(() => reel?.scenes.filter((scene) => scene.approvalStatus === 'approved').length || 0, [reel]);
  const allApproved = Boolean(reel?.scenes.length && approved === reel.scenes.length);

  const openView = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const beginFromOnboarding = (setup: OnboardingSetup) => {
    const seconds = Number(setup.duration.split(' ')[0]) as ReelDuration;
    const goal: MarketingGoal = setup.templateId === 'marketing' ? 'viral-reel'
      : setup.templateId === 'business-pitch' ? 'saas-workflow'
      : setup.templateId === 'short-series' ? 'viral-reel' : 'youtube-explainer';
    setDraft((current) => ({
      ...current, name: setup.templateTitle, description: setup.idea || (setup.websiteUrl ? `Explain ${setup.websiteUrl}` : ''),
      websiteUrl: setup.websiteUrl, duration: seconds, aspectRatio: setup.hitpawSettings.aspectRatio as AspectRatio, goal,
    }));
    setView('builder');
  };

  const generateBible = async () => {
    setBusy('Creating your Character Bible…');
    try {
      const response = await fetch('/api/generate-character-bible', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draft.characterName, description: draft.characterDescription, style: draft.style, referenceImageUrl: '' }),
      });
      if (!response.ok) throw new Error(`Character service returned ${response.status}`);
      const bible = await response.json();
      setCharacterBible(bible); setNotice('Character identity locked for every scene.'); return bible as CharacterBible;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Character Bible could not be created.'); return null;
    } finally { setBusy(''); }
  };

  const buildStory = async () => {
    if (!draft.description.trim()) { setNotice('Describe the story before building it.'); return; }
    let bible = characterBible;
    if (!bible) bible = await generateBible();
    if (!bible) return;
    setBusy('Writing the script and painting consistent scenes…');
    try {
      const response = await fetch('/api/generate-reel', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appNameOrProduct: draft.name, appDescription: draft.description, targetAudience: draft.audience,
          goal: draft.goal, duration: draft.duration, voicePersona: draft.voice, characterStyle: draft.style,
          aspectRatio: draft.aspectRatio, customKeywords: draft.websiteUrl, characterBible: bible,
          characterCartoonUrl: bible.referenceImageUrl,
        }),
      });
      if (!response.ok) throw new Error(`Story service returned ${response.status}`);
      const result = await response.json() as MarketingReel;
      setReel(result); setSelectedScene(0); setView('studio'); setNotice('Your Story Studio is ready for review.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Story generation failed.'); }
    finally { setBusy(''); }
  };

  const updateScene = (sceneId: string, patch: Partial<ReelScene>) => {
    if (!reel) return;
    setReel({ ...reel, scenes: reel.scenes.map((scene) => scene.id === sceneId ? { ...scene, ...patch } : scene) });
  };

  const regenerateScene = async (scene: ReelScene) => {
    if (!reel) return;
    updateScene(scene.id, { approvalStatus: 'regenerating' });
    try {
      const response = await fetch('/api/regenerate-scene', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scene.visualPrompt || scene.visualDescription, style: reel.characterStyle, aspectRatio: reel.aspectRatio, characterBible: reel.characterBible }),
      });
      if (!response.ok) throw new Error(`Image service returned ${response.status}`);
      const result = await response.json();
      updateScene(scene.id, { imageUrl: result.imageUrl, approvalStatus: 'review' });
      setNotice('Scene repainted with the same Character Bible.');
    } catch (error) {
      updateScene(scene.id, { approvalStatus: 'review' });
      setNotice(error instanceof Error ? error.message : 'Scene regeneration failed.');
    }
  };

  const approveAll = () => {
    if (!reel) return;
    setReel({ ...reel, scenes: reel.scenes.map((scene) => ({ ...scene, approvalStatus: 'approved' })) });
    setNotice('Every scene is approved and ready to produce.');
  };

  const newStory = () => { setCharacterBible(null); setReel(null); setDraft(DEFAULT_DRAFT); openView('home'); };

  if (view === 'home') return <FirstProjectOnboarding onComplete={beginFromOnboarding} onSkip={() => setView('builder')} />;

  return (
    <div className="village-app">
      <aside className={`village-sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <button className="village-brand" onClick={() => openView('builder')}><span><Film /></span><strong>Toon AI<small>Village</small></strong></button>
        <nav>
          <button className={view === 'builder' ? 'active' : ''} onClick={() => openView('builder')}><BookOpen /> Story Builder</button>
          <button className={view === 'studio' ? 'active' : ''} onClick={() => openView('studio')}><WandSparkles /> Story Studio</button>
          <button className={view === 'preview' ? 'active' : ''} onClick={() => reel ? openView('preview') : setNotice('Build a story first.')}><Play /> Preview & Export</button>
          <button className={view === 'projects' ? 'active' : ''} onClick={() => openView('projects')}><FolderOpen /> My Projects</button>
          <button className={view === 'settings' ? 'active' : ''} onClick={() => openView('settings')}><Settings /> Settings</button>
        </nav>
        <div className="engine-ready"><Sparkles /><div><strong>Village engine ready</strong><small>One story from idea to export</small></div></div>
      </aside>

      <main className="village-main">
        <header className="village-topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}><Menu /></button>
          <div><strong>{view === 'builder' ? 'Story Builder' : view === 'studio' ? 'Story Studio' : view === 'preview' ? 'Preview & Export' : view === 'projects' ? 'My Projects' : 'Studio Settings'}</strong><small>{reel ? reel.title : 'Create dimensional cartoon stories people remember'}</small></div>
          <button className="new-story" onClick={newStory}><Plus /> New story</button>
        </header>

        {view === 'builder' && <section className="builder-page page-pad">
          <div className="builder-hero"><div><em>STORY BUILDER</em><h1>Build a world—not another flat slideshow.</h1><p>Your idea becomes a consistent character, cinematic storyboard, voiceover, captions, and an editable production.</p><div className="builder-promises"><span><Check /> Dimensional scenes</span><span><Check /> Character continuity</span><span><Check /> Approval before export</span></div></div><div className="hero-orb"><Sparkles /></div></div>

          <div className="builder-grid">
            <section className="village-card brief-card">
              <div className="section-title"><span>01</span><div><h2>Tell us the story</h2><p>Use an idea, script, business pitch, or app walkthrough.</p></div></div>
              <label>Project name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
              <label>Idea or script<textarea rows={6} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Example: Show bakery owners how to advertise a weekly special in three simple steps…" /></label>
              <div className="two-fields"><label>Audience<input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} /></label><label>Website or reference<input value={draft.websiteUrl} onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })} placeholder="https://" /></label></div>
              <div className="option-section"><h3>Video length</h3><div className="pill-options">{([30,60,90] as ReelDuration[]).map((value) => <button key={value} className={draft.duration === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, duration: value })}><Clock /> {value} sec</button>)}</div></div>
              <div className="option-section"><h3>Format</h3><div className="pill-options">{(['9:16','16:9','1:1'] as AspectRatio[]).map((value) => <button key={value} className={draft.aspectRatio === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, aspectRatio: value })}>{value === '9:16' ? <Video /> : value === '16:9' ? <Monitor /> : <Square />} {value}</button>)}</div></div>
            </section>

            <section className="village-card character-card">
              <div className="section-title"><span>02</span><div><h2>Lock the Character Bible</h2><p>One identity across every generated scene.</p></div></div>
              <div className={`character-preview ${draft.style}`}>{characterBible?.referenceImageUrl ? <img src={characterBible.referenceImageUrl} alt="Character reference" /> : <div><UserRoundCheck /><small>Reference sheet appears here</small></div>}</div>
              <label>Character name<input value={draft.characterName} onChange={(e) => { setDraft({ ...draft, characterName: e.target.value }); setCharacterBible(null); }} /></label>
              <label>Appearance and personality<textarea rows={3} value={draft.characterDescription} onChange={(e) => { setDraft({ ...draft, characterDescription: e.target.value }); setCharacterBible(null); }} /></label>
              <h3>Visual direction</h3><div className="style-grid">{STYLE_OPTIONS.map((style) => <button key={style.id} className={`${style.tone} ${draft.style === style.id ? 'selected' : ''}`} onClick={() => { setDraft({ ...draft, style: style.id }); setCharacterBible(null); }}><span></span><strong>{style.label}</strong><small>{style.note}</small></button>)}</div>
              <button className="secondary-action" onClick={generateBible} disabled={Boolean(busy)}>{busy.includes('Character') ? <RefreshCw className="spin" /> : <Palette />} {characterBible ? 'Rebuild Character Bible' : 'Create Character Bible'}</button>
              {characterBible && <div className="identity-locked"><Check /><div><strong>Identity locked</strong><small>{characterBible.guardrails.slice(0,2).join(' · ')}</small></div></div>}
            </section>
          </div>
          <button className="build-button" onClick={buildStory} disabled={Boolean(busy)}>{busy ? <RefreshCw className="spin" /> : <Sparkles />}<span><strong>{busy || 'Build the complete storyboard'}</strong><small>Script · scenes · voiceover · captions</small></span><ChevronRight /></button>
        </section>}

        {view === 'studio' && <section className="studio-page page-pad">
          {!reel ? <EmptyStudio onBuild={() => openView('builder')} /> : <>
            <div className="studio-heading"><div><em>STORY STUDIO</em><h1>{reel.title}</h1><p>Review the script and artwork. Regenerate only what needs work; the Character Bible stays locked.</p></div><div className="approval-meter"><strong>{approved}/{reel.scenes.length}</strong><span>scenes approved</span><div><i style={{width:`${(approved/reel.scenes.length)*100}%`}} /></div></div></div>
            <section className="bible-banner"><div className="bible-avatar">{reel.characterBible?.referenceImageUrl ? <img src={reel.characterBible.referenceImageUrl} alt="" /> : <UserRoundCheck />}</div><div><em>LOCKED CHARACTER BIBLE</em><h2>{reel.characterBible?.name || draft.characterName}</h2><p>{reel.characterBible?.identityPrompt || draft.characterDescription}</p></div><button onClick={() => openView('builder')}><Palette /> Edit identity</button></section>
            <div className="studio-toolbar"><div><h2>Scene storyboard</h2><p>{reel.duration} seconds · {reel.aspectRatio} · {reel.scenes.length} scenes</p></div><div><button onClick={approveAll}><Check /> Approve all</button><button className="produce" disabled={!allApproved} onClick={() => openView('preview')}><Play /> Produce video</button></div></div>
            <div className="scene-board">{reel.scenes.map((scene, index) => <article key={scene.id} className={`scene-card ${scene.approvalStatus === 'approved' ? 'approved' : ''} ${selectedScene === index ? 'focused' : ''}`} onClick={() => setSelectedScene(index)}>
              <div className="scene-image"><img src={scene.imageUrl} alt={`Scene ${index+1}`} /><span>SCENE {index+1}</span>{scene.approvalStatus === 'regenerating' && <div className="painting"><RefreshCw className="spin" /> Painting…</div>}</div>
              <div className="scene-copy"><div className="scene-title"><h3>{scene.title}</h3><span>{scene.durationSeconds}s</span></div><p>{scene.narration}</p><div className="caption-chip">“{scene.captionText}”</div><div className="scene-actions"><button onClick={(e) => { e.stopPropagation(); regenerateScene(scene); }} disabled={scene.approvalStatus === 'regenerating'}><RefreshCw /> Repaint</button><button className="approve" onClick={(e) => { e.stopPropagation(); updateScene(scene.id, { approvalStatus: scene.approvalStatus === 'approved' ? 'review' : 'approved' }); }}><Check /> {scene.approvalStatus === 'approved' ? 'Approved' : 'Approve'}</button></div></div>
            </article>)}</div>
          </>}
        </section>}

        {view === 'preview' && <section className="preview-page page-pad">{reel ? <><div className="preview-heading"><button onClick={() => openView('studio')}><ArrowLeft /> Back to Story Studio</button><div><em>FINAL PRODUCTION</em><h1>Voice, captions, motion, and export</h1></div></div><div className="player-shell"><ReelPlayer reel={reel} onEditStoryboard={() => openView('studio')} /></div></> : <EmptyStudio onBuild={() => openView('builder')} />}</section>}

        {view === 'projects' && <Projects onOpenActive={() => reel ? openView('studio') : openView('builder')} />}
        {view === 'settings' && <SettingsPanel />}
      </main>
      {notice && <div className="village-toast">{notice}</div>}
      {busy && <div className="busy-overlay"><div><RefreshCw className="spin" /><strong>{busy}</strong><span>The village is working scene by scene.</span></div></div>}
    </div>
  );
}

function EmptyStudio({ onBuild }: { onBuild: () => void }) {
  return <div className="empty-studio"><WandSparkles /><h1>Your Story Studio is waiting</h1><p>Build a story and its Character Bible first. Everything will arrive here as one connected production.</p><button onClick={onBuild}><BookOpen /> Open Story Builder</button></div>;
}

function Projects({ onOpenActive }: { onOpenActive: () => void }) {
  let projects: Array<Record<string, any>> = [];
  try { projects = JSON.parse(localStorage.getItem('toon-ai-village-projects') || '[]'); } catch {}
  return <section className="projects-page page-pad"><em>MY PROJECTS</em><h1>Your village stories</h1><p>Continue the latest production or start something new.</p><div className="project-grid">{projects.length ? projects.map((project) => <button key={project.id} onClick={onOpenActive}><div><ImageIcon /></div><strong>{project.title}</strong><span>{project.duration}s · {project.aspectRatio} · {project.sceneCount} scenes</span></button>) : <div className="no-projects"><FolderOpen /><strong>No saved stories yet</strong><span>Your first project will appear here.</span></div>}</div></section>;
}

function SettingsPanel() {
  return <section className="settings-page page-pad"><div className="village-card"><em>PRODUCTION SETTINGS</em><h1>Simple by design</h1><p>The server uses your configured Gemini key for Character Bibles, dimensional scene artwork, scripts, and voice. When no key is present, safe demo content keeps the workflow testable.</p><div className="settings-list"><div><Sparkles /><span><strong>Story intelligence</strong><small>One generator feeds Story Builder and Story Studio.</small></span></div><div><Save /><span><strong>Project continuity</strong><small>The active project stays available across navigation.</small></span></div><div><Mic2 /><span><strong>Voice and captions</strong><small>Production controls live in Preview & Export.</small></span></div></div></div></section>;
}

export { App };
export default App;
