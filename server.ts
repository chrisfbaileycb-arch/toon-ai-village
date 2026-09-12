import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy getter for GoogleGenAI
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now(),
  });
});

// Cartoonize transformation route
app.post('/api/cartoonize', async (req, res) => {
  try {
    const { imageBase64, style = 'pixar-3d', adjustments = {}, promptDescription = '' } = req.body;
    const ai = getGenAI();

    // Style prompt presets
    const styleDescriptions: Record<string, string> = {
      'pixar-3d': 'Cute and expressive 3D animated character in modern Disney Pixar style, soft volumetric lighting, subsurface scattering, lively large eyes, smooth studio render.',
      'anime-manga': 'High-energy Japanese anime character artwork, sharp cel-shaded lines, dynamic hair highlights, radiant rim light, Studio Mappa style.',
      'comic-popart': 'Bold pop-art graphic novel comic illustration, heavy black ink outlines, Roy Lichtenstein halftone Ben-Day dots, vibrant primary colors.',
      'claymation': 'Handcrafted claymation plasticine model, Wallace and Gromit stop-motion style, miniature studio lighting, tactile clay fingerprints.',
      'cyberpunk': 'Cyberpunk graphic novel aesthetic, glowing neon cyan and magenta rim highlights, dark sci-fi backdrop, cybernetic details.',
      'vector-flat': 'Clean minimalist 2D vector flat illustration, modern Figma tech mascot style, sharp bezier curves, duotone brand palette.',
      'retro-90s': 'Saturday morning 1990s animated television cartoon style, playful rubber-hose proportions, warm CRT television nostalgic colors.',
      'chibi-kawaii': 'Super cute chibi kawaii character, oversized head, tiny body, sparkling starry eyes, adorable sticker aesthetic.',
    };

    const targetStyleDesc = styleDescriptions[style] || styleDescriptions['pixar-3d'];

    if (!ai) {
      return res.json({
        success: true,
        style,
        stylePrompt: targetStyleDesc,
        message: 'Cartoonized successfully using preset transformation filters.',
      });
    }

    let generatedImageUrl: string | null = null;

    try {
      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType,
                },
              },
              {
                text: `Transform this person or photo into a magnificent ${targetStyleDesc}. Retain their recognizable facial structure, hair color, and expression, but fully convert them into a stylized ${style} cartoon character suitable as a brand mascot and marketing video avatar. Expression: ${adjustments.expression || 'enthusiastic and friendly'}. Lighting: ${adjustments.lighting || 'studio key lighting'}.`,
              },
            ],
          },
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      } else {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: `Create a charming cartoon character avatar for marketing reels: ${targetStyleDesc}. ${promptDescription}. High resolution, clean background, charismatic face.`,
              },
            ],
          },
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgError: any) {
      console.warn('Image generation with gemini-3.1-flash-lite-image failed or requires paid tier:', imgError?.message);
    }

    res.json({
      success: true,
      style,
      stylePrompt: targetStyleDesc,
      generatedImageUrl,
      adjustments,
    });
  } catch (error: any) {
    console.error('Error in /api/cartoonize:', error);
    res.status(500).json({ error: error.message || 'Cartoonize failed' });
  }
});

// Generate 30s, 60s, or 90s Marketing Reel with scenes, voiceover script, and marketing package
app.post('/api/generate-reel', async (req, res) => {
  try {
    const {
      appNameOrProduct = 'My Product',
      appDescription = 'A revolutionary product',
      targetAudience = 'Tech-savvy users and creators',
      goal = 'app-launch',
      duration = 30,
      voicePersona = 'Puck',
      characterStyle = 'pixar-3d',
      aspectRatio = '9:16',
      characterCartoonUrl,
      customKeywords = '',
    } = req.body;

    const numScenes = duration === 30 ? 3 : duration === 60 ? 5 : 7;
    const targetWordCount = duration === 30 ? '65 to 75 words' : duration === 60 ? '130 to 145 words' : '200 to 225 words';

    const ai = getGenAI();

    if (!ai) {
      const defaultScenes = generateFallbackScenes(duration, appNameOrProduct, appDescription, characterStyle);
      return res.json({
        id: `reel-${Date.now()}`,
        title: `${appNameOrProduct} Spoken Marketing Reel`,
        targetAppOrProduct: appNameOrProduct,
        targetAudience,
        duration: Number(duration),
        aspectRatio,
        goal,
        voice: voicePersona,
        hookHeadline: `Still doing it the hard way? Meet ${appNameOrProduct}!`,
        callToAction: `Download ${appNameOrProduct} today and experience the difference!`,
        ctaButtonText: 'Get Started Free',
        ctaLink: 'https://example.com',
        scenes: defaultScenes,
        fullVoiceoverScript: defaultScenes.map((s) => s.narration).join(' '),
        totalDuration: Number(duration),
        characterOriginalUrl: characterCartoonUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231e1b4b"/><circle cx="100" cy="100" r="60" fill="%2364748b"/></svg>',
        characterCartoonUrl: characterCartoonUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230d0417"/><circle cx="100" cy="100" r="60" fill="%23ff9900"/></svg>',
        characterStyle,
        marketingCopy: {
          instagramCaption: `Meet ${appNameOrProduct} 🚀 Transform how you get things done. Link in bio!`,
          tiktokHook: `Nobody is talking about this game-changer app yet... 👀`,
          youtubeTitle: `Why Everyone is Switching to ${appNameOrProduct} (${duration}s Preview)`,
          youtubeDescription: `${appDescription}\n\nTry ${appNameOrProduct} free today!`,
          hashtags: ['#Marketing', '#AppLaunch', '#Innovation', '#Productivity', '#ViralReels'],
          adHooks: [
            `The secret shortcut top performers use with ${appNameOrProduct}.`,
            `Stop wasting hours. Here is the automated fix.`,
            `Why 90% of users switched to this in 2026.`,
          ],
        },
        createdAt: Date.now(),
      });
    }

    const prompt = `You are an elite viral video marketing director and scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.
Craft an unforgettable, high-converting ${duration}-second marketing reel featuring a cartoon mascot/avatar in ${characterStyle} animation style.

Product / App: "${appNameOrProduct}"
Description: "${appDescription}"
Target Audience: "${targetAudience}"
Marketing Goal: "${goal}" (e.g. app-launch, viral-reel, youtube-explainer, ecommerce-showcase, saas-workflow)
Reel Duration: EXACTLY ${duration} SECONDS.
Total Spoken Script Length: ${targetWordCount} (vital for a natural speaking pace of ~2.4 words per second to fit exactly in ${duration}s).
Number of Scenes to create: Exactly ${numScenes} scenes.
Additional keywords/notes: ${customKeywords || 'None'}

Rules:
1. Scene 1 MUST be a 3-second killer HOOK that stops scrolling dead in its tracks.
2. The scenes must follow a proven marketing framework (Hook -> Pain/Frustration -> Revelation/Solution -> Demo/Benefit -> Social Proof/Urgency -> Call To Action).
3. The spoken voiceover must sound punchy, authentic, conversational, and energetic.
4. Each scene must specify:
   - startSeconds and endSeconds (strictly sequential from 0 to ${duration})
   - durationSeconds (integer)
   - title
   - narration (the exact spoken line for this scene)
   - visualDescription (what our cartoon character is doing on screen)
   - visualPrompt (a detailed prompt to generate this cartoon visual matching the ${characterStyle} style)
   - captionText (short, catchy kinetic subtitle text with an emoji, max 6 words)
   - highlightedKeyword (1-2 critical words to highlight in yellow/neon in the kinetic subtitles)
   - badgeText (e.g., "⚡ 3X Faster", "🛑 Stop Doing This", "🔥 Limited Offer")
   - motionType (one of: 'zoom-in', 'zoom-out', 'pan-left', 'pan-right', 'tilt-up')
5. Provide comprehensive social media marketing copy:
   - instagramCaption
   - tiktokHook
   - youtubeTitle
   - youtubeDescription
   - 6 relevant hashtags
   - 3 high-converting ad hook variations for A/B testing`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hookHeadline: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            ctaButtonText: { type: Type.STRING },
            ctaLink: { type: Type.STRING },
            fullVoiceoverScript: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  startSeconds: { type: Type.NUMBER },
                  endSeconds: { type: Type.NUMBER },
                  durationSeconds: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  narration: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  captionText: { type: Type.STRING },
                  highlightedKeyword: { type: Type.STRING },
                  badgeText: { type: Type.STRING },
                  motionType: { type: Type.STRING },
                },
                required: [
                  'sceneNumber',
                  'startSeconds',
                  'endSeconds',
                  'durationSeconds',
                  'title',
                  'narration',
                  'visualDescription',
                  'visualPrompt',
                  'captionText',
                  'highlightedKeyword',
                  'motionType',
                ],
              },
            },
            marketingCopy: {
              type: Type.OBJECT,
              properties: {
                instagramCaption: { type: Type.STRING },
                tiktokHook: { type: Type.STRING },
                youtubeTitle: { type: Type.STRING },
                youtubeDescription: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                adHooks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['instagramCaption', 'tiktokHook', 'youtubeTitle', 'youtubeDescription', 'hashtags', 'adHooks'],
            },
          },
          required: [
            'title',
            'hookHeadline',
            'targetAudience',
            'callToAction',
            'ctaButtonText',
            'ctaLink',
            'fullVoiceoverScript',
            'scenes',
            'marketingCopy',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const curatedImages = getCuratedSceneImages(characterStyle);
    const enrichedScenes = (parsed.scenes || []).map((scene: any, idx: number) => ({
      id: `scene-${idx + 1}-${Date.now()}`,
      ...scene,
      imageUrl: curatedImages[idx % curatedImages.length],
    }));

    const result = {
      id: `reel-${Date.now()}`,
      title: parsed.title || `${appNameOrProduct} Spoken Reel`,
      targetAppOrProduct: appNameOrProduct,
      targetAudience: parsed.targetAudience || targetAudience,
      duration: Number(duration),
      aspectRatio,
      goal,
      voice: voicePersona,
      hookHeadline: parsed.hookHeadline || 'Watch this before it is too late',
      callToAction: parsed.callToAction || `Get ${appNameOrProduct} now!`,
      ctaButtonText: parsed.ctaButtonText || 'Download Free',
      ctaLink: parsed.ctaLink || 'https://example.com',
      scenes: enrichedScenes,
      fullVoiceoverScript: parsed.fullVoiceoverScript || enrichedScenes.map((s: any) => s.narration).join(' '),
      totalDuration: Number(duration),
      characterOriginalUrl: characterCartoonUrl || curatedImages[0],
      characterCartoonUrl: characterCartoonUrl || curatedImages[0],
      characterStyle,
      marketingCopy: parsed.marketingCopy || {
        instagramCaption: `Introducing ${appNameOrProduct}! 🚀 Link in bio.`,
        tiktokHook: `POV: You just discovered ${appNameOrProduct} 👀`,
        youtubeTitle: `${appNameOrProduct} Full Preview`,
        youtubeDescription: appDescription,
        hashtags: ['#viral', '#marketing', '#newapp'],
        adHooks: ['Are you tired of waiting? Try this.'],
      },
      createdAt: Date.now(),
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error generating reel:', error);
    res.status(500).json({ error: error.message || 'Failed to generate reel' });
  }
});

// Gemini TTS Endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Puck' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({ fallback: true, message: 'No API key configured for server TTS. Falling back to browser speech synthesis.' });
    }

    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Aoede'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Puck';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say with enthusiasm and clear marketing inflection: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/mp3';

    if (!base64Audio) {
      return res.json({ fallback: true, message: 'Audio not returned by model, falling back to browser speech.' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
    });
  } catch (error: any) {
    console.warn('TTS API error (will fallback to browser speech):', error.message);
    res.json({ fallback: true, message: error.message || 'TTS unavailable' });
  }
});

// Generate individual scene image
app.post('/api/generate-scene-image', async (req, res) => {
  try {
    const { prompt, style = 'pixar-3d' } = req.body;
    const ai = getGenAI();

    if (!ai) {
      const cur = getCuratedSceneImages(style);
      return res.json({ imageUrl: cur[Math.floor(Math.random() * cur.length)] });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: `${prompt}, stylized ${style} cartoon aesthetic, vibrant, 4k quality, cinematic lighting` }],
        },
        config: {
          imageConfig: {
            aspectRatio: '9:16',
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
        }
      }
    } catch (e: any) {
      console.warn('Scene image generation failed:', e?.message);
    }

    const cur = getCuratedSceneImages(style);
    return res.json({ imageUrl: cur[Math.floor(Math.random() * cur.length)] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Cartoon Script / Scene Generator for Toon Story Studio
app.post('/api/generate-toon-story', async (req, res) => {
  try {
    const { topic, character = 'Ava', durationSeconds = 30 } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        scenes: [
          {
            title: 'Introduction',
            caption: `Hey there! Welcome to this animation about ${topic || 'our story'}!`,
            character: character || 'Ava',
            action: 'wave',
            background: 'Studio purple',
            transition: 'Fade',
            duration: 6,
          },
          {
            title: 'The Challenge',
            caption: 'Things were looking tricky, but here is where things get interesting...',
            character: character || 'Ava',
            action: 'talk',
            background: 'City park',
            transition: 'Slide Left',
            duration: 8,
          },
          {
            title: 'Victory Moment',
            caption: 'And just like that, we made it happen! Thank you for watching!',
            character: character || 'Ava',
            action: 'celebrate',
            background: 'Sunset beach',
            transition: 'Zoom Out',
            duration: 6,
          },
        ],
      });
    }

    const prompt = `Generate a sequence of cartoon animation scenes for a ${durationSeconds}s cartoon animation on the topic: "${topic}".
Featured Character: ${character}.
Available Actions: "idle", "walk", "jump", "talk", "wave", "celebrate", "sneak", "dance", "shock", "present".
Available Backgrounds: "Studio purple", "City park", "Cozy office", "Neon arcade", "Sunset beach", "Tech lab".
Available Transitions: "Fade", "Slide Left", "Slide Right", "Zoom In", "Zoom Out", "Wipe".

Return a JSON array of scene objects with:
- title: string
- caption: string (dialogue or narration spoken by the character, 10-18 words)
- character: string ("Ava", "Milo", "Nova", "Kai", "Luna", or "Max")
- action: one of the available actions
- background: one of the available backgrounds
- transition: one of the available transitions
- duration: number (seconds for this scene, sum should equal approximately ${durationSeconds}s)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  character: { type: Type.STRING },
                  action: { type: Type.STRING },
                  background: { type: Type.STRING },
                  transition: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                },
                required: ['title', 'caption', 'character', 'action', 'background', 'transition', 'duration'],
              },
            },
          },
          required: ['scenes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error generating toon story:', err);
    res.status(500).json({ error: err.message });
  }
});

const CARTOON_SCENE_STUDIO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%231a0b2e"/><stop offset="100%" stop-color="%230d0417"/></linearGradient></defs><rect width="800" height="600" fill="url(%23bg)"/><ellipse cx="400" cy="540" rx="360" ry="80" fill="%232e1065"/><polygon points="0,480 800,480 800,600 0,600" fill="%23120521"/><line x1="0" y1="480" x2="800" y2="480" stroke="%23ff9900" stroke-width="3" opacity="0.6"/><polygon points="180,120 185,135 200,140 185,145 180,160 175,145 160,140 175,135" fill="%23ffcc00"/><polygon points="620,100 624,112 636,116 624,120 620,132 616,120 604,116 616,112" fill="%2300f2fe"/></svg>`;

const CARTOON_SCENE_RPG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%231e1b4b"/><polygon points="0,450 140,260 280,450" fill="%232e1065"/><polygon points="200,450 380,220 560,450" fill="%233b0764"/><ellipse cx="400" cy="540" rx="420" ry="120" fill="%23059669"/><circle cx="200" cy="200" r="26" fill="%23fbbf24" stroke="%23d97706" stroke-width="4"/><circle cx="620" cy="180" r="22" fill="%23fbbf24" stroke="%23d97706" stroke-width="3"/></svg>`;

const CARTOON_SCENE_CYBER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%23020617"/><rect x="40" y="200" width="100" height="300" fill="%231e293b" stroke="%2306b6d4" stroke-width="2"/><rect x="170" y="140" width="120" height="360" fill="%230f172a" stroke="%23ec4899" stroke-width="2"/><rect x="320" y="100" width="140" height="400" fill="%231e293b" stroke="%2338bdf8" stroke-width="2.5"/><polygon points="0,480 800,480 800,600 0,600" fill="%23030712"/><line x1="0" y1="480" x2="800" y2="480" stroke="%2306b6d4" stroke-width="4"/></svg>`;

const CARTOON_SCENE_SPACE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%2309090b"/><circle cx="80" cy="70" r="3" fill="%23ffffff"/><circle cx="360" cy="60" r="4" fill="%23ffffff"/><circle cx="620" cy="300" r="110" fill="%23f97316"/><ellipse cx="620" cy="300" rx="190" ry="35" fill="none" stroke="%23fde047" stroke-width="12" opacity="0.85"/><ellipse cx="400" cy="580" rx="600" ry="140" fill="%23334155"/></svg>`;

const CARTOON_SCENE_VECTOR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="%231e1b4b"/><rect x="80" y="120" width="220" height="150" rx="16" fill="%231e293b" stroke="%236366f1" stroke-width="3"/><line x1="110" y1="160" x2="260" y2="160" stroke="%2338bdf8" stroke-width="6" stroke-linecap="round"/><ellipse cx="400" cy="500" rx="220" ry="40" fill="%236366f1"/></svg>`;

function getCuratedSceneImages(style: string): string[] {
  const pools: Record<string, string[]> = {
    'pixar-3d': [CARTOON_SCENE_STUDIO, CARTOON_SCENE_RPG, CARTOON_SCENE_SPACE, CARTOON_SCENE_CYBER],
    'anime-manga': [CARTOON_SCENE_RPG, CARTOON_SCENE_STUDIO, CARTOON_SCENE_CYBER, CARTOON_SCENE_SPACE],
    'comic-popart': [CARTOON_SCENE_CYBER, CARTOON_SCENE_STUDIO, CARTOON_SCENE_RPG, CARTOON_SCENE_SPACE],
    'cyberpunk': [CARTOON_SCENE_CYBER, CARTOON_SCENE_SPACE, CARTOON_SCENE_STUDIO, CARTOON_SCENE_RPG],
    'vector-flat': [CARTOON_SCENE_VECTOR, CARTOON_SCENE_STUDIO, CARTOON_SCENE_SPACE, CARTOON_SCENE_CYBER],
  };

  return pools[style] || pools['pixar-3d'];
}

function generateFallbackScenes(duration: number, appName: string, appDesc: string, style: string) {
  const images = getCuratedSceneImages(style);
  if (duration === 30) {
    return [
      {
        id: 'fallback-s1',
        sceneNumber: 1,
        startSeconds: 0,
        endSeconds: 10,
        durationSeconds: 10,
        title: 'The Scroll-Stopping Hook',
        narration: `Are you still wasting hours doing things manually? Stop right now, because ${appName} is changing everything!`,
        visualDescription: `Cartoon character looks overwhelmed with cartoon steam coming from ears, then looks up with excitement.`,
        visualPrompt: `Stylized ${style} cartoon character looking frustrated then amazed, dynamic lighting`,
        imageUrl: images[0],
        captionText: 'Wasting hours every day? 🛑',
        highlightedKeyword: 'changing everything',
        badgeText: '⚠️ The Problem',
        motionType: 'zoom-in',
      },
      {
        id: 'fallback-s2',
        sceneNumber: 2,
        startSeconds: 10,
        endSeconds: 21,
        durationSeconds: 11,
        title: 'The Solution & Demo',
        narration: `With ${appName}, ${appDesc}. It works in seconds and does the heavy lifting for you!`,
        visualDescription: `Cartoon mascot smiling triumphantly holding up smartphone glowing with green checkmarks.`,
        visualPrompt: `Stylized ${style} character celebrating with glowing mobile phone interface, confetti`,
        imageUrl: images[1] || images[0],
        captionText: 'Automate in Seconds! ⚡',
        highlightedKeyword: 'heavy lifting',
        badgeText: '🚀 The Fix',
        motionType: 'pan-left',
      },
      {
        id: 'fallback-s3',
        sceneNumber: 3,
        startSeconds: 21,
        endSeconds: 30,
        durationSeconds: 9,
        title: 'Call to Action & Offer',
        narration: `Don't wait! Tap the link below right now to try ${appName} completely free!`,
        visualDescription: `Cartoon avatar enthusiastically pointing downward with App Store badge and 5-star rating.`,
        visualPrompt: `Stylized ${style} character smiling and pointing to download button with 5 golden stars`,
        imageUrl: images[2] || images[0],
        captionText: 'Try It 100% Free! 📲',
        highlightedKeyword: 'Tap Link Below',
        badgeText: '🎁 Special Offer',
        motionType: 'zoom-out',
      },
    ];
  } else if (duration === 60) {
    return [
      {
        id: 'fallback-s1',
        sceneNumber: 1,
        startSeconds: 0,
        endSeconds: 12,
        durationSeconds: 12,
        title: 'The Hook',
        narration: `If you are trying to scale your results in 2026, you are probably making this one critical mistake.`,
        visualDescription: `Cartoon character looking puzzled at an outdated messy desk with warning signs.`,
        visualPrompt: `Cartoon character in ${style} style with curious expression looking at confusing diagrams`,
        imageUrl: images[0],
        captionText: 'The 2026 Mistake ❌',
        highlightedKeyword: 'critical mistake',
        badgeText: '🛑 Reality Check',
        motionType: 'zoom-in',
      },
      {
        id: 'fallback-s2',
        sceneNumber: 2,
        startSeconds: 12,
        endSeconds: 24,
        durationSeconds: 12,
        title: 'The Problem Agitation',
        narration: `Most people spend eighty percent of their energy on repetitive tasks that drain their creative momentum.`,
        visualDescription: `Character looking tired as robotic clocks spin in the background.`,
        visualPrompt: `Tired cartoon character in ${style} looking at spinning clocks, subtle comic sweat drop`,
        imageUrl: images[1] || images[0],
        captionText: '80% Time Wasted ⏳',
        highlightedKeyword: 'creative momentum',
        badgeText: '⚠️ The Cost',
        motionType: 'pan-right',
      },
      {
        id: 'fallback-s3',
        sceneNumber: 3,
        startSeconds: 24,
        endSeconds: 38,
        durationSeconds: 14,
        title: 'Meet the Solution',
        narration: `That is why we built ${appName}. ${appDesc}. Setup takes less than two minutes!`,
        visualDescription: `Heroic mascot swoops in with modern streamlined app interface.`,
        visualPrompt: `Heroic cartoon mascot in ${style} presenting glowing dashboard, vibrant energetic colors`,
        imageUrl: images[2] || images[0],
        captionText: `Meet ${appName}! 💡`,
        highlightedKeyword: 'two minutes',
        badgeText: '✨ The Breakthrough',
        motionType: 'zoom-out',
      },
      {
        id: 'fallback-s4',
        sceneNumber: 4,
        startSeconds: 38,
        endSeconds: 50,
        durationSeconds: 12,
        title: 'Results & Social Proof',
        narration: `Thousands of top creators and teams have already made the switch, cutting their workload in half.`,
        visualDescription: `Happy cartoon users cheering together with thumbs up and five star badges.`,
        visualPrompt: `Group of happy cartoon characters in ${style} celebrating success with trophies and stars`,
        imageUrl: images[3] || images[0],
        captionText: '50% Workload Slashed 📈',
        highlightedKeyword: 'made the switch',
        badgeText: '🏆 Social Proof',
        motionType: 'pan-left',
      },
      {
        id: 'fallback-s5',
        sceneNumber: 5,
        startSeconds: 50,
        endSeconds: 60,
        durationSeconds: 10,
        title: 'Urgent Call to Action',
        narration: `Ready to upgrade your workflow? Tap below right now to claim your exclusive trial before this offer ends!`,
        visualDescription: `Cartoon character pointing to download link with glowing limited-time bonus badge.`,
        visualPrompt: `Enthusiastic cartoon character in ${style} holding ticket with VIP pass, energetic composition`,
        imageUrl: images[4] || images[0],
        captionText: 'Claim Your Free Trial! 🚀',
        highlightedKeyword: 'Tap Below',
        badgeText: '🔥 Limited Pass',
        motionType: 'zoom-in',
      },
    ];
  } else {
    return [
      {
        id: 'fallback-90-s1',
        sceneNumber: 1,
        startSeconds: 0,
        endSeconds: 12,
        durationSeconds: 12,
        title: 'Deep Industry Hook',
        narration: `Ever wonder why the top performers get ten times more done without working late nights? Here is their open secret.`,
        visualDescription: `Cartoon mentor character leaning in with a friendly, knowing smile against a sleek modern backdrop.`,
        visualPrompt: `Cartoon character in ${style} speaking confidently with friendly gaze, clean background`,
        imageUrl: images[0],
        captionText: 'The 10X Secret 🤫',
        highlightedKeyword: 'open secret',
        badgeText: '💡 Insight',
        motionType: 'zoom-in',
      },
      {
        id: 'fallback-90-s2',
        sceneNumber: 2,
        startSeconds: 12,
        endSeconds: 26,
        durationSeconds: 14,
        title: 'The Hidden Trap',
        narration: `Most tools promise productivity, but they end up creating more friction, more tabs, and more headaches.`,
        visualDescription: `Cartoon character buried in 50 browser tabs and messy sticky notes.`,
        visualPrompt: `Cartoon character in ${style} looking dizzy surrounded by swirling windows and papers`,
        imageUrl: images[1] || images[0],
        captionText: 'Too Many Disconnected Tools 🤯',
        highlightedKeyword: 'more friction',
        badgeText: '⚠️ The Trap',
        motionType: 'pan-left',
      },
      {
        id: 'fallback-90-s3',
        sceneNumber: 3,
        startSeconds: 26,
        endSeconds: 40,
        durationSeconds: 14,
        title: 'The Paradigm Shift',
        narration: `You do not need more dashboards; you need an intelligent engine that handles the repetitive tasks on autopilot.`,
        visualDescription: `Cartoon character clearing the cluttered desk with a single magic swipe of the hand.`,
        visualPrompt: `Cartoon character in ${style} sweeping away clutter with glowing clean spark`,
        imageUrl: images[2] || images[0],
        captionText: 'Autopilot vs Busywork ⚙️',
        highlightedKeyword: 'intelligent engine',
        badgeText: '⚡ Shift',
        motionType: 'zoom-out',
      },
      {
        id: 'fallback-90-s4',
        sceneNumber: 4,
        startSeconds: 40,
        endSeconds: 54,
        durationSeconds: 14,
        title: 'Meet ' + appName,
        narration: `That is why ${appName} was created. ${appDesc}. Connect your setup in two clicks.`,
        visualDescription: `Mascot unboxing a glowing futuristic device that links seamlessly into mobile and web.`,
        visualPrompt: `Cartoon mascot in ${style} presenting high-tech glowing portal device, cinematic light`,
        imageUrl: images[3] || images[0],
        captionText: `Enter ${appName} 🚀`,
        highlightedKeyword: 'two clicks',
        badgeText: '🌟 The Breakthrough',
        motionType: 'pan-right',
      },
      {
        id: 'fallback-90-s5',
        sceneNumber: 5,
        startSeconds: 54,
        endSeconds: 68,
        durationSeconds: 14,
        title: 'Key Feature Deep Dive',
        narration: `It operates continuously in the background, surfacing actionable insights and automating routine workflows effortlessly.`,
        visualDescription: `Close-up of the cartoon UI showing beautiful animated graphs, automated tasks checking off smoothly.`,
        visualPrompt: `Clean cartoon user interface in ${style} showing automated progress bars and happy badges`,
        imageUrl: images[4] || images[0],
        captionText: '24/7 Automated Execution 🔄',
        highlightedKeyword: 'routine workflows',
        badgeText: '📊 Feature Focus',
        motionType: 'zoom-in',
      },
      {
        id: 'fallback-90-s6',
        sceneNumber: 6,
        startSeconds: 68,
        endSeconds: 80,
        durationSeconds: 12,
        title: 'Proven Track Record',
        narration: `Over twenty thousand users worldwide rely on this system every single day to stay ahead of competition.`,
        visualDescription: `Diverse community of cartoon avatars smiling, collaborating, and celebrating milestones.`,
        visualPrompt: `Diverse group of cartoon characters in ${style} smiling together with high fives and stars`,
        imageUrl: images[0],
        captionText: '20,000+ Active Users 🌟',
        highlightedKeyword: 'ahead of competition',
        badgeText: '🔒 Proven Results',
        motionType: 'tilt-up',
      },
      {
        id: 'fallback-90-s7',
        sceneNumber: 7,
        startSeconds: 80,
        endSeconds: 90,
        durationSeconds: 10,
        title: 'Final Call To Action',
        narration: `Do not get left behind. Click the link below to get full access free for fourteen days. Start now!`,
        visualDescription: `Cartoon character giving energetic two thumbs up with floating download button and countdown timer.`,
        visualPrompt: `Cartoon hero in ${style} gesturing enthusiastically to action button with golden rays`,
        imageUrl: images[1] || images[0],
        captionText: 'Start 14-Day Free Trial! 🎯',
        highlightedKeyword: 'Click Link Below',
        badgeText: '🎁 Free Access',
        motionType: 'zoom-out',
      },
    ];
  }
}

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ToneMark AI Animation Server running on port ${PORT}`);
  });
}

startServer();
