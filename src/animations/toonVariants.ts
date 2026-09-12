import { type Variants } from 'motion/react';
import { type AnimationPresetName, type AnimationPresetMeta } from '../types';

export type { AnimationPresetName, AnimationPresetMeta };

export const ANIMATION_PRESET_METADATA: Record<AnimationPresetName, AnimationPresetMeta> = {
  idle: {
    id: 'idle',
    name: 'Idle Breathing & Sway',
    category: 'expressive',
    description: 'Gentle organic breathing with subtle head and shoulder weight shifts.',
    principles: ['Squash & Stretch', 'Secondary Action'],
    defaultDuration: 3.2,
    iconName: 'Sparkles',
  },
  walk: {
    id: 'walk',
    name: 'Cartoon Walk Cycle',
    category: 'locomotion',
    description: 'Classic bouncy cartoon stride with footfall squash, airborne stretch, and hip sway.',
    principles: ['Squash & Stretch', 'Arcs', 'Rhythm & Timing'],
    defaultDuration: 0.9,
    iconName: 'Footprints',
  },
  jump: {
    id: 'jump',
    name: 'Dynamic Leap & Land',
    category: 'locomotion',
    description: 'Anticipation crouch squash, explosive rocket stretch leap, peak hang-time, and elastic settle.',
    principles: ['Anticipation', 'Squash & Stretch', 'Follow-Through', 'Exaggeration'],
    defaultDuration: 1.25,
    iconName: 'ArrowUpCircle',
    soundEffect: 'jump',
  },
  talk: {
    id: 'talk',
    name: 'Expressive Dialogue',
    category: 'expressive',
    description: 'Lively speech cadence with head nods, conversational body tilt, and rhythmic emphasis.',
    principles: ['Secondary Action', 'Timing', 'Staging'],
    defaultDuration: 1.6,
    iconName: 'MessageSquare',
    soundEffect: 'talk',
  },
  wave: {
    id: 'wave',
    name: 'Friendly Hand Wave',
    category: 'expressive',
    description: 'Joyful greeting with body lean, welcoming arm oscillation, and friendly bounce.',
    principles: ['Arcs', 'Follow-Through'],
    defaultDuration: 1.4,
    iconName: 'Hand',
    soundEffect: 'wave',
  },
  celebrate: {
    id: 'celebrate',
    name: 'Victory Celebration',
    category: 'action',
    description: 'Triumphant double bounce, victory stretch jump, celebratory rotation, and star flair.',
    principles: ['Exaggeration', 'Appeal', 'Squash & Stretch'],
    defaultDuration: 1.15,
    iconName: 'Flame',
    soundEffect: 'fanfare',
  },
  sneak: {
    id: 'sneak',
    name: 'Tip-Toe Sneak',
    category: 'locomotion',
    description: 'Low creeping crouch, cautious stealth stride, suspensive pauses, and comedic alert peeks.',
    principles: ['Anticipation', 'Staging', 'Timing'],
    defaultDuration: 2.4,
    iconName: 'Footprints',
  },
  dance: {
    id: 'dance',
    name: 'Groovy Cartoon Boogie',
    category: 'action',
    description: 'High-energy cartoon rhythm, syncopated hip swings, head bobbing, and elastic pops.',
    principles: ['Rhythm & Timing', 'Exaggeration', 'Arcs'],
    defaultDuration: 0.95,
    iconName: 'Music',
    soundEffect: 'fanfare',
  },
  shock: {
    id: 'shock',
    name: 'Cartoon Shock / Take',
    category: 'reaction',
    description: 'Classic double-take: sudden freeze, jaw-drop stretch, frantic shivering vibration, and recoil.',
    principles: ['Anticipation', 'Exaggeration', 'Squash & Stretch'],
    defaultDuration: 1.4,
    iconName: 'AlertCircle',
  },
  present: {
    id: 'present',
    name: 'Hero Presentation',
    category: 'expressive',
    description: 'Polished showman flourish, dynamic side reveal, and stable focal pose.',
    principles: ['Staging', 'Appeal'],
    defaultDuration: 2.2,
    iconName: 'Sparkles',
  },
};

export const PRESET_LIST: AnimationPresetMeta[] = Object.values(ANIMATION_PRESET_METADATA);

/**
 * Reusable Framer Motion Variants for ToonCharacter
 * Implements the 12 Principles of Cartoon Animation
 */
export const cartoonVariants: Record<AnimationPresetName, Variants> = {
  // 1. IDLE: Natural breathing, subtle squash-and-stretch on torso/root
  idle: {
    animate: {
      y: [0, -3.5, 0, -1.5, 0],
      scaleY: [1, 1.025, 0.985, 1.015, 1],
      scaleX: [1, 0.985, 1.02, 0.99, 1],
      rotate: [0, 0.8, -0.8, 0.4, 0],
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 2. WALK: Classic cartoon walk cycle with footfall squash and airborne stretch
  walk: {
    animate: {
      y: [0, -10, 0, -10, 0],
      x: [-4, 4, -4],
      rotate: [-2, 2, -2],
      scaleY: [0.94, 1.06, 0.94, 1.06, 0.94],
      scaleX: [1.06, 0.94, 1.06, 0.94, 1.06],
      transition: {
        duration: 0.9,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 3. JUMP: 5-stage cartoon physics: Crouch Anticipation -> Rocket Leap -> Float -> Impact Squash -> Settle
  jump: {
    animate: {
      y: [0, 12, -48, -52, 4, -6, 0],
      scaleY: [1, 0.78, 1.32, 1.15, 0.82, 1.06, 1],
      scaleX: [1, 1.25, 0.8, 0.9, 1.22, 0.96, 1],
      rotate: [0, -2, 3, -1, 0, 0, 0],
      transition: {
        duration: 1.25,
        repeat: Infinity,
        repeatDelay: 0.5,
        times: [0, 0.18, 0.45, 0.55, 0.78, 0.88, 1],
        ease: ['easeInOut', 'easeOut', 'easeInOut', 'easeIn', 'easeOut', 'easeOut'],
      },
    },
  },

  // 4. TALK: Conversational bounce, subtle emphasis pops and expressive head tilts
  talk: {
    animate: {
      y: [0, -4, 0, -6, -2, -5, 0],
      rotate: [0, 2.5, -2, 1.5, -1, 2, 0],
      scaleY: [1, 1.03, 0.98, 1.04, 0.99, 1.02, 1],
      scaleX: [1, 0.98, 1.02, 0.97, 1.01, 0.99, 1],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 5. WAVE: Joyful greeting lean, friendly arm-lift anticipation and bounce
  wave: {
    animate: {
      y: [0, -3, 0, -4, 0],
      rotate: [0, -3.5, 3.5, -3.5, 0],
      scaleY: [1, 1.02, 0.99, 1.02, 1],
      scaleX: [1, 0.98, 1.01, 0.98, 1],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 6. CELEBRATE: High-energy star leaps, rotational flair, and celebratory squash
  celebrate: {
    animate: {
      y: [0, 8, -36, 6, -24, 4, 0],
      rotate: [0, -8, 10, -6, 8, -3, 0],
      scaleY: [1, 0.82, 1.25, 0.88, 1.18, 0.94, 1],
      scaleX: [1, 1.2, 0.85, 1.14, 0.88, 1.06, 1],
      transition: {
        duration: 1.15,
        repeat: Infinity,
        repeatDelay: 0.25,
        times: [0, 0.15, 0.42, 0.6, 0.78, 0.9, 1],
        ease: 'easeInOut',
      },
    },
  },

  // 7. SNEAK: Classic cartoon tip-toe stealth, low crouch, rhythmic pauses
  sneak: {
    animate: {
      y: [6, 2, 6, 2, 6],
      x: [-14, -7, 0, 7, 14, 7, 0, -7, -14],
      rotate: [-3, 1, -3, 1, -3],
      scaleY: [0.88, 0.93, 0.88, 0.93, 0.88],
      scaleX: [1.12, 1.07, 1.12, 1.07, 1.12],
      transition: {
        duration: 2.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 8. DANCE: Syncopated cartoon groove, hip swing, side-to-side pop
  dance: {
    animate: {
      y: [0, -14, 2, -14, 0],
      x: [-6, 6, -6],
      rotate: [-9, 9, -9],
      scaleY: [0.92, 1.08, 0.94, 1.08, 0.92],
      scaleX: [1.08, 0.92, 1.06, 0.92, 1.08],
      transition: {
        duration: 0.95,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // 9. SHOCK: Frantic double-take freeze, vertical stretch, shivering vibration
  shock: {
    animate: {
      y: [0, 6, -26, -24, -26, -24, -26, 0],
      x: [0, 0, -3, 3, -3, 3, 0, 0],
      rotate: [0, -4, 4, -4, 4, -2, 0, 0],
      scaleY: [1, 0.85, 1.35, 1.3, 1.35, 1.3, 1.2, 1],
      scaleX: [1, 1.18, 0.78, 0.82, 0.78, 0.82, 0.88, 1],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        repeatDelay: 0.8,
        times: [0, 0.1, 0.28, 0.4, 0.52, 0.64, 0.8, 1],
        ease: 'easeInOut',
      },
    },
  },

  // 10. PRESENT: Showman stance with subtle confident buoyancy
  present: {
    animate: {
      y: [0, -4, 0, -2, 0],
      rotate: [0, 2, -1, 1, 0],
      scaleY: [1, 1.02, 0.99, 1.01, 1],
      scaleX: [1, 0.99, 1.01, 0.99, 1],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

/**
 * Entrance and Exit Cartoon Motion Variants
 */
export const cartoonEntranceVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    y: 40,
    rotate: -15,
  },
  visible: {
    scale: [0, 1.25, 0.92, 1.06, 1],
    opacity: [0, 1, 1, 1, 1],
    y: [40, -12, 4, -2, 0],
    rotate: [-15, 6, -3, 1, 0],
    transition: {
      duration: 0.65,
      ease: [0.175, 0.885, 0.32, 1.275], // Elastic cartoon spring
    },
  },
};

/**
 * Helper to build custom variants with adjusted speed and squash intensity
 */
export function getCustomCartoonVariant(
  preset: AnimationPresetName,
  options?: {
    speedMultiplier?: number;
    squashIntensity?: number; // 0 (rigid) to 1.5 (hyper-cartoon)
  }
): Variants {
  const base = cartoonVariants[preset] || cartoonVariants.idle;
  const speed = options?.speedMultiplier ?? 1;
  const intensity = options?.squashIntensity ?? 1;

  if (speed === 1 && intensity === 1) {
    return base;
  }

  const cloned = JSON.parse(JSON.stringify(base)) as Variants;
  const anim = cloned.animate as Record<string, unknown>;

  if (anim && typeof anim === 'object') {
    const transition = anim.transition as Record<string, unknown>;
    if (transition && typeof transition.duration === 'number') {
      transition.duration = Math.max(0.2, transition.duration / speed);
    }

    if (Array.isArray(anim.scaleY) && intensity !== 1) {
      anim.scaleY = anim.scaleY.map((val: number) => 1 + (val - 1) * intensity);
    }
    if (Array.isArray(anim.scaleX) && intensity !== 1) {
      anim.scaleX = anim.scaleX.map((val: number) => 1 + (val - 1) * intensity);
    }
    if (Array.isArray(anim.y) && intensity !== 1) {
      anim.y = anim.y.map((val: number) => val * intensity);
    }
  }

  return cloned;
}
