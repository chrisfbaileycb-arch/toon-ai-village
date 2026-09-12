/**
 * Audio service handling Gemini TTS audio playback and browser SpeechSynthesis fallback
 */

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export async function playVoiceover(
  scriptText: string,
  audioBase64?: string,
  audioMimeType: string = 'audio/mp3',
  onEnded?: () => void,
  onBoundary?: (charIndex: number) => void
): Promise<() => void> {
  // Stop any currently playing audio
  stopVoiceover();

  if (audioBase64) {
    try {
      const audio = new Audio(`data:${audioMimeType};base64,${audioBase64}`);
      currentAudio = audio;
      if (onEnded) {
        audio.onended = onEnded;
      }
      await audio.play();
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    } catch (err) {
      console.warn('Playback of Gemini TTS base64 failed, falling back to Web Speech API:', err);
    }
  }

  // Web Speech API fallback
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(scriptText);
    currentUtterance = utterance;

    // Pick a natural sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.rate = 1.05; // brisk commercial tempo
    utterance.pitch = 1.02;

    if (onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          onBoundary(e.charIndex);
        }
      };
    }

    if (onEnded) {
      utterance.onend = onEnded;
      utterance.onerror = () => onEnded();
    }

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }

  return () => {};
}

export function stopVoiceover() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    currentUtterance = null;
  }
}

/**
 * Generate .SRT subtitle content from scenes
 */
export function generateSRT(
  scenes: { startSeconds: number; endSeconds: number; narration: string }[]
): string {
  function formatSRTTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    const pad = (n: number, z = 2) => String(n).padStart(z, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
  }

  return scenes
    .map((scene, idx) => {
      return `${idx + 1}\n${formatSRTTime(scene.startSeconds)} --> ${formatSRTTime(
        scene.endSeconds
      )}\n${scene.narration}\n`;
    })
    .join('\n');
}
