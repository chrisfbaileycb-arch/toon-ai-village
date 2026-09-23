import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpen, Check, ChevronRight, Clock3, Film, FolderOpen, Home,
  Menu, Mic2, Monitor, Palette, Play, Plus, RefreshCw, Save, Settings,
  Sparkles, Square, UserRoundCheck, Video, WandSparkles, X
} from 'lucide-react';
import ReelPlayer from './components/ReelPlayer';
import type { AspectRatio, CartoonStyle, CharacterBible, MarketingGoal, MarketingReel, ReelDuration, ReelScene, VoicePersona } from './types';
import './village.css';

type View = 'home' | 'builder' | 'studio' | 'preview' | 'projects' | 'settings';
type CharacterId = 'cast-01' | 'cast-02' | 'cast-03' | 'cast-04' | 'cast-05' | 'cast-06';
type WorldId = 'shop' | 'app' | 'podcast' | 'stage';

interface Draft {
  name: string; description: string; audience: string; duration: ReelDuration;
  aspectRatio: AspectRatio; style: CartoonStyle; characterName: string;
  characterDescription: string; characterId: CharacterId; worldId: WorldId;
  goal: MarketingGoal; voice: VoicePersona; websiteUrl: string;
}

const CAST: Array<{ id: CharacterId; image: string; title: string; description: string }> = [
  { id: 'cast-01', image: '/village/cast-01.webp', title: 'Confident guide', description: 'Warm, polished, persuasive' },
  { id: 'cast-02', image: '/village/cast-02.webp', title: 'Friendly founder', description: 'Easygoing, clear, relatable' },
  { id: 'cast-03', image: '/village/cast-03.webp', title: 'Creative expert', description: 'Wise, imaginative, reassuring' },
  { id: 'cast-04', image: '/village/cast-04.webp', title: 'App educator', description: 'Bright, modern, energetic' },
  { id: 'cast-05', image: '/village/cast-05.webp', title: 'Fox presenter', description: 'Playful, quick, memorable' },
  { id: 'cast-06', image: '/village/cast-06.webp', title: 'Dragon sidekick', description: 'Curious, charming, surprising' },
];

const WORLDS: Array<{ id: WorldId; image: string; title: string; note: string; goal: MarketingGoal }> = [
  { id: 'shop', image: '/village/world-shop.webp', title: 'Main Street', note: 'Business stories & local marketing', goal: 'viral-reel' },
  { id: 'app', image: '/village/world-app.webp', title: 'App World', note: 'Walkthroughs & website explainers', goal: 'app-launch' },
  { id: 'podcast', image: '/village/world-podcast.webp', title: 'Podcast Lounge', note: 'Faceless shows & conversations', goal: 'youtube-explainer' },
  { id: 'stage', image: '/village/world-stage.webp', title: 'Big Idea Stage', note: 'How-tos, courses & business pitches', goal: 'saas-workflow' },
];

const DEFAULT_DRAFT: Draft = {
  name: '', description: '', audience: 'People who need a clear, friendly explanation', duration: 60,
  aspectRatio: '9:16', style: 'pixar-3d', characterName: '',
  characterDescription: CAST[0].description, characterId: 'cast-01', worldId: 'shop',
  goal: 'viral-reel', voice: 'Kore', websiteUrl: '',
};

function safeLoadReel(): MarketingReel | null {
  try { return JSON.parse(localStorage.getItem('toon-ai-village-active-story') || 'null'); } catch { return null; }
}

function saveReel(reel: MarketingReel) {
  try {
    localStorage.setItem('toon-ai-village-active-story', JSON.stringify(reel));
    const items = JSON.parse(localStorage.getItem('toon-ai-village-projects') || '[]') as Array<Record<string, unknown>>;
    localStorage.setItem('toon-ai-village-projects', JSON.stringify([
      { id: reel.id, title: reel.title, duration: reel.duration, aspectRatio: reel.aspectRatio, createdAt: reel.createdAt, sceneCount: reel.scenes.length, image: reel.scenes[0]?.imageUrl },
      ...items.filter((item) => item.id !== reel.id),
    ].slice(0, 20)));
  } catch (error) { console.warn('Project persistence unavailable.', error); }
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

  const selectedCharacter = CAST.find((item) => item.id === draft.characterId) || CAST[0];
  const selectedWorld = WORLDS.find((item) => item.id === draft.worldId) || WORLDS[0];
  const approved = useMemo(() => reel?.scenes.filter((scene) => scene.approvalStatus === 'approved').length || 0, [reel]);
  const allApproved = Boolean(reel?.scenes.length && approved === reel.scenes.length);

  useEffect(() => { if (reel) saveReel(reel); }, [reel]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3600); return () => clearTimeout(timer); }, [notice]);

  const openView = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const chooseCharacter = (id: CharacterId) => {
    const choice = CAST.find((item) => item.id === id) || CAST[0];
    setDraft((current) => ({ ...current, characterId: id, characterDescription: choice.description }));
    setCharacterBible(null);
  };
  const chooseWorld = (id: WorldId) => {
    const choice = WORLDS.find((item) => item.id === id) || WORLDS[0];
    setDraft((current) => ({ ...current, worldId: id, goal: choice.goal }));
  };

  const generateBible = async () => {
    if (!draft.characterName.trim()) { setNotice('Give your character a name first—this is your cast, not ours.'); return null; }
    setBusy(`Creating ${draft.characterName}'s Character Bible…`);
    try {
      const response = await fetch('/api/generate-character-bible', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draft.characterName, description: `${draft.characterDescription}. Cast reference: ${selectedCharacter.title}.`, style: draft.style, referenceImageUrl: selectedCharacter.image }),
      });
      if (!response.ok) throw new Error(`Character service returned ${response.status}`);
      const bible = await response.json() as CharacterBible;
      setCharacterBible(bible); setNotice(`${draft.characterName}'s look is locked across every scene.`); return bible;
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Character Bible could not be created.'); return null; }
    finally { setBusy(''); }
  };

  const buildStory = async () => {
    if (!draft.name.trim() || !draft.description.trim()) { setNotice('Add a story title and tell us what happens.'); return; }
    if (!draft.characterName.trim()) { setNotice('Name your main character before building the story.'); return; }
    let bible = characterBible;
    if (!bible) bible = await generateBible();
    if (!bible) return;
    setBusy('Writing your script and painting the first storyboard…');
    try {
      const response = await fetch('/api/generate-reel', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appNameOrProduct: draft.name, appDescription: `${draft.description}\nWorld: ${selectedWorld.title} — ${selectedWorld.note}.`,
          targetAudience: draft.audience, goal: draft.goal, duration: draft.duration, voicePersona: draft.voice,
          characterStyle: draft.style, aspectRatio: draft.aspectRatio, customKeywords: draft.websiteUrl,
          characterBible: bible, characterCartoonUrl: bible.referenceImageUrl || selectedCharacter.image,
        }),
      });
      if (!response.ok) throw new Error(`Story service returned ${response.status}`);
      const result = await response.json() as MarketingReel;
      setReel(result); setSelectedScene(0); setView('studio'); setNotice('Your first storyboard is ready to direct.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Story generation failed.'); }
    finally { setBusy(''); }
  };

  const updateScene = (sceneId: string, patch: Partial<ReelScene>) => {
    if (reel) setReel({ ...reel, scenes: reel.scenes.map((scene) => scene.id === sceneId ? { ...scene, ...patch } : scene) });
  };
  const regenerateScene = async (scene: ReelScene) => {
    if (!reel) return;
    updateScene(scene.id, { approvalStatus: 'regenerating' });
    try {
      const response = await fetch('/api/regenerate-scene', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `${scene.visualPrompt || scene.visualDescription}. Environment: ${selectedWorld.title}.`, style: reel.characterStyle, aspectRatio: reel.aspectRatio, characterBible: reel.characterBible }) });
      if (!response.ok) throw new Error(`Image service returned ${response.status}`);
      const result = await response.json(); updateScene(scene.id, { imageUrl: result.imageUrl, approvalStatus: 'review' }); setNotice('Scene repainted without changing the cast.');
    } catch (error) { updateScene(scene.id, { approvalStatus: 'review' }); setNotice(error instanceof Error ? error.message : 'Scene repaint failed.'); }
  };
  const approveAll = () => { if (reel) setReel({ ...reel, scenes: reel.scenes.map((scene) => ({ ...scene, approvalStatus: 'approved' })) }); };
  const newStory = () => { setCharacterBible(null); setReel(null); setDraft(DEFAULT_DRAFT); openView('home'); };

  if (view === 'home') return <Landing onCreate={() => openView('builder')} onProjects={() => openView('projects')} />;

  return <div className="village-app">
    <aside className={`village-sidebar ${menuOpen ? 'open' : ''}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
      <button className="village-brand" onClick={() => openView('home')}><span><Film /></span><strong>Toon AI<small>Village</small></strong></button>
      <nav>
        <button onClick={() => openView('home')}><Home /> Welcome</button>
        <button className={view === 'builder' ? 'active' : ''} onClick={() => openView('builder')}><BookOpen /> Build a Story</button>
        <button className={view === 'studio' ? 'active' : ''} onClick={() => openView('studio')}><WandSparkles /> Direct Scenes</button>
        <button className={view === 'preview' ? 'active' : ''} onClick={() => reel ? openView('preview') : setNotice('Build a story first.')}><Play /> Preview & Export</button>
        <button className={view === 'projects' ? 'active' : ''} onClick={() => openView('projects')}><FolderOpen /> My Cartoons</button>
        <button className={view === 'settings' ? 'active' : ''} onClick={() => openView('settings')}><Settings /> Settings</button>
      </nav>
      <div className="engine-ready"><Sparkles /><div><strong>Your story, your cast</strong><small>From one idea to a finished cartoon</small></div></div>
    </aside>

    <main className="village-main">
      <header className="village-topbar">
        <button className="menu-button" onClick={() => setMenuOpen(true)}><Menu /></button>
        <div><strong>{view === 'builder' ? 'Build a Story' : view === 'studio' ? 'Direct Your Scenes' : view === 'preview' ? 'Preview & Export' : view === 'projects' ? 'My Cartoons' : 'Studio Settings'}</strong><small>{reel?.title || 'Original cartoon stories made simple'}</small></div>
        <button className="new-story" onClick={newStory}><Plus /> New cartoon</button>
      </header>

      {view === 'builder' && <section className="builder-page page-pad">
        <div className="builder-intro">
          <div><em>YOUR CARTOON STARTS HERE</em><h1>Cast a character.<br/><span>Build their world.</span></h1><p>Bring one idea, script, website, or pitch. You stay the director while the Village builds the scenes.</p></div>
          <div className="builder-intro-art"><img src={selectedCharacter.image} alt="Selected cartoon character"/><div><span>NOW CASTING</span><strong>{draft.characterName || 'Name your star'}</strong><small>{selectedWorld.title}</small></div></div>
        </div>

        <div className="builder-flow">
          <section className="story-brief">
            <div className="chapter-heading"><span>01</span><div><em>THE BIG IDEA</em><h2>What are we making?</h2></div></div>
            <div className="brief-fields">
              <label><span>Cartoon title</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="The launch that changed everything"/></label>
              <label className="wide"><span>Tell us the story, paste a script, or describe the lesson</span><textarea rows={5} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Example: Show a bakery owner how to turn one weekly special into a month of social posts…"/></label>
              <label><span>Who is it for?</span><input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })}/></label>
              <label><span>Website or reference (optional)</span><input value={draft.websiteUrl} onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })} placeholder="https://"/></label>
            </div>
          </section>

          <section className="casting-section">
            <div className="chapter-heading"><span>02</span><div><em>CAST YOUR STORY</em><h2>Pick a look. You choose the name.</h2><p>No canned mascots. Every character becomes yours to define.</p></div></div>
            <div className="cast-layout">
              <div className="cast-grid">{CAST.map((character) => <button key={character.id} className={draft.characterId === character.id ? 'selected' : ''} onClick={() => chooseCharacter(character.id)}><img src={character.image} alt={character.title}/><span><strong>{character.title}</strong><small>{character.description}</small></span><i><Check/></i></button>)}</div>
              <aside className="name-your-star"><div className="star-portrait"><img src={characterBible?.referenceImageUrl || selectedCharacter.image} alt="Your selected character"/></div><em>YOUR MAIN CHARACTER</em><label><span>Name your character</span><input value={draft.characterName} onChange={(e) => { setDraft({ ...draft, characterName: e.target.value }); setCharacterBible(null); }} placeholder="You decide the name"/></label><label><span>Personality & appearance</span><textarea rows={3} value={draft.characterDescription} onChange={(e) => { setDraft({ ...draft, characterDescription: e.target.value }); setCharacterBible(null); }}/></label><button onClick={generateBible} disabled={Boolean(busy)}><UserRoundCheck/> {characterBible ? 'Character locked' : 'Lock this character'}</button></aside>
            </div>
          </section>

          <section className="world-section">
            <div className="chapter-heading"><span>03</span><div><em>SET THE STAGE</em><h2>Where does the story live?</h2></div></div>
            <div className="world-grid">{WORLDS.map((world) => <button key={world.id} className={draft.worldId === world.id ? 'selected' : ''} onClick={() => chooseWorld(world.id)}><img src={world.image} alt={world.title}/><span><strong>{world.title}</strong><small>{world.note}</small></span><i><Check/></i></button>)}</div>
          </section>

          <section className="finish-section">
            <div><div className="chapter-heading"><span>04</span><div><em>FINAL DETAILS</em><h2>Fit it to the screen.</h2></div></div><div className="finish-options"><div><strong>Length</strong>{([30,60,90] as ReelDuration[]).map((value) => <button className={draft.duration === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, duration: value })} key={value}><Clock3/>{value} sec</button>)}</div><div><strong>Format</strong>{(['9:16','1:1','16:9'] as AspectRatio[]).map((value) => <button className={draft.aspectRatio === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, aspectRatio: value })} key={value}>{value === '9:16' ? <Video/> : value === '1:1' ? <Square/> : <Monitor/>}{value}</button>)}</div></div></div>
            <button className="build-button" onClick={buildStory} disabled={Boolean(busy)}><Sparkles/><span><strong>Build my cartoon</strong><small>Script · scenes · voice · captions</small></span><ChevronRight/></button>
          </section>
        </div>
      </section>}

      {view === 'studio' && <section className="studio-page page-pad">{!reel ? <EmptyStudio onBuild={() => openView('builder')}/> : <>
        <div className="director-hero"><img src={reel.scenes[selectedScene]?.imageUrl || selectedWorld.image} alt="Current scene"/><div className="director-overlay"><em>DIRECTOR'S VIEW</em><h1>{reel.title}</h1><p>{reel.scenes[selectedScene]?.narration}</p><div><span>{reel.duration} sec</span><span>{reel.aspectRatio}</span><span>{reel.scenes.length} scenes</span></div></div><div className="cast-pin"><img src={reel.characterBible?.referenceImageUrl || selectedCharacter.image} alt="Locked character"/><span><small>CAST LOCKED</small><strong>{reel.characterBible?.name || draft.characterName}</strong></span><Check/></div></div>
        <div className="studio-toolbar"><div><em>YOUR STORYBOARD</em><h2>Direct every beat</h2><p>Choose a scene, approve it, or repaint only that moment.</p></div><div><button onClick={approveAll}><Check/> Approve all</button><button className="produce" disabled={!allApproved} onClick={() => openView('preview')}><Play/> Produce video</button></div></div>
        <div className="scene-ribbon">{reel.scenes.map((scene,index) => <button key={scene.id} className={`${selectedScene === index ? 'selected' : ''} ${scene.approvalStatus === 'approved' ? 'approved' : ''}`} onClick={() => setSelectedScene(index)}><img src={scene.imageUrl} alt={`Scene ${index+1}`}/><span>Scene {index+1}<small>{scene.durationSeconds}s</small></span>{scene.approvalStatus === 'approved' && <i><Check/></i>}</button>)}</div>
        {reel.scenes[selectedScene] && <section className="scene-director"><div className="scene-main-image"><img src={reel.scenes[selectedScene].imageUrl} alt={reel.scenes[selectedScene].title}/>{reel.scenes[selectedScene].approvalStatus === 'regenerating' && <div className="painting"><RefreshCw className="spin"/> Painting your scene…</div>}</div><div className="scene-script"><em>SCENE {selectedScene+1}</em><h2>{reel.scenes[selectedScene].title}</h2><label><span>Voiceover</span><textarea value={reel.scenes[selectedScene].narration} onChange={(e) => updateScene(reel.scenes[selectedScene].id,{narration:e.target.value})}/></label><label><span>On-screen caption</span><input value={reel.scenes[selectedScene].captionText} onChange={(e) => updateScene(reel.scenes[selectedScene].id,{captionText:e.target.value})}/></label><div className="scene-actions"><button onClick={() => regenerateScene(reel.scenes[selectedScene])}><RefreshCw/> Repaint scene</button><button className="approve" onClick={() => updateScene(reel.scenes[selectedScene].id,{approvalStatus:reel.scenes[selectedScene].approvalStatus === 'approved' ? 'review' : 'approved'})}><Check/> {reel.scenes[selectedScene].approvalStatus === 'approved' ? 'Approved' : 'Approve scene'}</button></div></div></section>}
      </>}</section>}

      {view === 'preview' && <section className="preview-page page-pad">{reel ? <><div className="preview-heading"><button onClick={() => openView('studio')}><ArrowLeft/> Back to directing</button><div><em>FINAL PRODUCTION</em><h1>Your cartoon is ready to play.</h1></div></div><div className="player-shell"><ReelPlayer reel={reel} onEditStoryboard={() => openView('studio')}/></div></> : <EmptyStudio onBuild={() => openView('builder')}/>}</section>}
      {view === 'projects' && <Projects onOpenActive={() => reel ? openView('studio') : openView('builder')}/>}
      {view === 'settings' && <SettingsPanel/>}
    </main>
    {notice && <div className="village-toast">{notice}</div>}
    {busy && <div className="busy-overlay"><div><RefreshCw className="spin"/><strong>{busy}</strong><span>The Village is working scene by scene.</span></div></div>}
  </div>;
}

function Landing({ onCreate, onProjects }: { onCreate: () => void; onProjects: () => void }) {
  return <main className="landing">
    <header className="landing-nav"><button className="landing-brand"><span><Film/></span><strong>Toon AI <b>Village</b></strong></button><nav><a href="#stories">What you can make</a><a href="#how">How it works</a></nav><div><button onClick={onProjects}>My cartoons</button><button className="nav-cta" onClick={onCreate}>Create a cartoon <ChevronRight/></button></div></header>
    <section className="landing-hero"><img src="/village/story-village-hero.webp" alt="A lively cartoon village where creators build animated stories"/><div className="hero-shade"/><div className="hero-copy"><em>YOUR IDEA HAS A WORLD WAITING</em><h1>Make people <span>stop.</span><br/>Make them <i>feel.</i></h1><p>Turn a business, app, lesson, podcast, or wild little idea into a character-led cartoon people remember.</p><div><button onClick={onCreate}><Sparkles/> Start creating</button><a href="#stories"><Play/> See what you can make</a></div><small>No animation experience needed. You direct. The Village builds.</small></div><div className="hero-ticket"><span>FROM IDEA TO CARTOON</span><div><strong>01</strong><p>Name your character</p></div><div><strong>02</strong><p>Choose their world</p></div><div><strong>03</strong><p>Direct every scene</p></div></div></section>
    <section className="story-types" id="stories"><div className="section-kicker">ONE VILLAGE. EVERY KIND OF STORY.</div><h2>What will your cartoon do?</h2><div>{WORLDS.map((world,index) => <button key={world.id} onClick={onCreate}><img src={world.image} alt=""/><span>0{index+1}</span><h3>{world.title}</h3><p>{world.note}</p><i><ChevronRight/></i></button>)}</div></section>
    <section className="how-it-works" id="how"><div><em>HOW IT WORKS</em><h2>A real production flow.<br/>Made human.</h2><p>Your character stays recognizable. Your scenes stay editable. Nothing leaves the studio until it feels right.</p><button onClick={onCreate}>Build your first story <ChevronRight/></button></div><div className="process-cards"><article><span>1</span><strong>Bring the idea</strong><p>Describe it, paste a script, or share a website.</p></article><article><span>2</span><strong>Cast your character</strong><p>Choose a visual direction and give them your own name.</p></article><article><span>3</span><strong>Direct the scenes</strong><p>Review, rewrite, repaint, approve, then export.</p></article></div></section>
  </main>;
}

function EmptyStudio({ onBuild }: { onBuild: () => void }) { return <div className="empty-studio"><img src="/village/cast-06.webp" alt="Cartoon dragon waiting"/><h1>Your cast is waiting.</h1><p>Start with a story, name your character, and choose the world they will bring to life.</p><button onClick={onBuild}><BookOpen/> Build a cartoon</button></div>; }

function Projects({ onOpenActive }: { onOpenActive: () => void }) {
  let projects: Array<Record<string, any>> = []; try { projects = JSON.parse(localStorage.getItem('toon-ai-village-projects') || '[]'); } catch {}
  return <section className="projects-page page-pad"><em>MY CARTOONS</em><h1>Every world you have built.</h1><p>Open the latest production and keep directing.</p><div className="project-grid">{projects.length ? projects.map((project) => <button key={project.id} onClick={onOpenActive}><div>{project.image ? <img src={project.image} alt=""/> : <img src="/village/world-stage.webp" alt=""/>}</div><strong>{project.title}</strong><span>{project.duration}s · {project.aspectRatio} · {project.sceneCount} scenes</span></button>) : <div className="no-projects"><img src="/village/cast-05.webp" alt=""/><strong>No cartoons yet</strong><span>Your first world will appear here.</span></div>}</div></section>;
}

function SettingsPanel() { return <section className="settings-page page-pad"><div className="village-card"><em>BEHIND THE CURTAIN</em><h1>One connected studio.</h1><p>The Village keeps character identity, scene art, script, captions, voice, approval, and export connected as one production.</p><div className="settings-list"><div><Sparkles/><span><strong>Story intelligence</strong><small>One brief feeds every production step.</small></span></div><div><Save/><span><strong>Character continuity</strong><small>The Character Bible follows every scene.</small></span></div><div><Mic2/><span><strong>Voice and captions</strong><small>Production controls stay with the project.</small></span></div><div><Palette/><span><strong>Original visual direction</strong><small>Created for this Village, never copied from another brand.</small></span></div></div></div></section>; }

export default App;
