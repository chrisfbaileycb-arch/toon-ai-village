import { ToonAppearance, AnimationScene } from '../types';

export interface CharacterProfile {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  defaultAppearance: ToonAppearance;
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    name: 'Ava',
    role: 'Creative Explorer',
    bio: 'Energetic, optimistic host with wavy hair and vibrant amber style.',
    avatarColor: '#f97316',
    defaultAppearance: {
      skinTone: '#ffd3b6',
      hairColor: '#4a2c11',
      clothingColor: '#f97316',
      accentColor: '#38bdf8',
      hairStyle: 'wave',
      accessory: 'glasses',
    },
  },
  {
    name: 'Milo',
    role: 'Tech Innovator',
    bio: 'Analytical problem solver with spike hair and smart headphones.',
    avatarColor: '#3b82f6',
    defaultAppearance: {
      skinTone: '#f3c99f',
      hairColor: '#1e293b',
      clothingColor: '#2563eb',
      accentColor: '#10b981',
      hairStyle: 'spikes',
      accessory: 'headphones',
    },
  },
  {
    name: 'Nova',
    role: 'Starlight Guide',
    bio: 'Charismatic storyteller with sleek bob hair and futuristic glow.',
    avatarColor: '#ec4899',
    defaultAppearance: {
      skinTone: '#ffdfba',
      hairColor: '#9333ea',
      clothingColor: '#db2777',
      accentColor: '#facc15',
      hairStyle: 'bob',
      accessory: 'earrings',
    },
  },
  {
    name: 'Kai',
    role: 'Action Adventurer',
    bio: 'Fearless dynamic leader rocking sporty curls and athletic streetwear.',
    avatarColor: '#10b981',
    defaultAppearance: {
      skinTone: '#8d5524',
      hairColor: '#18181b',
      clothingColor: '#059669',
      accentColor: '#f97316',
      hairStyle: 'curl',
      accessory: 'none',
    },
  },
  {
    name: 'Luna',
    role: 'Gentle Visionary',
    bio: 'Thoughtful philosopher with flowing hair and tranquil pastel tones.',
    avatarColor: '#8b5cf6',
    defaultAppearance: {
      skinTone: '#fbe7d0',
      hairColor: '#6366f1',
      clothingColor: '#7c3aed',
      accentColor: '#ec4899',
      hairStyle: 'wave',
      accessory: 'glasses',
    },
  },
  {
    name: 'Max',
    role: 'Bold Cap Mascot',
    bio: 'Upbeat hype master wearing a turned cap and playful casual streetwear.',
    avatarColor: '#eab308',
    defaultAppearance: {
      skinTone: '#e0ac69',
      hairColor: '#3f2e18',
      clothingColor: '#ca8a04',
      accentColor: '#ef4444',
      hairStyle: 'cap',
      accessory: 'headphones',
    },
  },
];

export const DEFAULT_ANIMATION_SCENES: AnimationScene[] = [
  {
    id: 'toon-s1',
    title: 'Welcome & Introduction',
    character: 'Ava',
    action: 'wave',
    caption: 'Hey there creators! Welcome to ToneMark AI Animation Studio!',
    duration: 3,
    background: 'Studio purple',
    transition: 'fade',
  },
  {
    id: 'toon-s2',
    title: 'The Challenge',
    character: 'Milo',
    action: 'talk',
    caption: 'Traditional 2D animation took weeks of keyframing and manual rigging.',
    duration: 4,
    background: 'Creative office',
    transition: 'slide',
  },
  {
    id: 'toon-s3',
    title: 'The AI Breakthrough',
    character: 'Nova',
    action: 'jump',
    caption: 'Now, with Gemini AI + 12 Disney Principles, you create animated magic in seconds!',
    duration: 4,
    background: 'Sunny park',
    transition: 'zoom',
  },
  {
    id: 'toon-s4',
    title: 'Celebration & Export',
    character: 'Kai',
    action: 'celebrate',
    caption: 'Export 60fps vertical reels, cartoon shorts, and interactive web avatars!',
    duration: 4,
    background: 'Warm stage',
    transition: 'wipe',
  },
];
