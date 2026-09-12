import React from 'react';
import { motion } from 'motion/react';

export type CartoonArchetype =
  | 'robot_mascot'
  | 'bunny_critter'
  | 'anime_hero'
  | 'clay_bear'
  | 'cyber_fox'
  | 'retro_90s'
  | 'flat_vector';

export interface VectorCartoonRigProps {
  archetype?: CartoonArchetype;
  action?: 'idle' | 'talk' | 'wave' | 'celebrate' | 'walk' | 'present';
  expression?: 'happy' | 'talking' | 'surprised' | 'serious' | 'winking';
  mouthShape?: 'closed' | 'open' | 'wide' | 'round' | 'smile' | 'talking';
  skinTone?: string;
  clothingColor?: string;
  accentColor?: string;
  accessory?: string;
  className?: string;
  scale?: number;
  interactive?: boolean;
}

export const VectorCartoonRig: React.FC<VectorCartoonRigProps> = ({
  archetype = 'robot_mascot',
  action = 'idle',
  expression = 'happy',
  mouthShape = 'talking',
  skinTone = '#ffd3b6',
  clothingColor = '#ff9900',
  accentColor = '#8b5cf6',
  accessory = 'none',
  className = '',
  scale = 1,
}) => {
  // Eye variations
  const renderEyes = () => {
    switch (expression) {
      case 'winking':
        return (
          <>
            {/* Left eye open */}
            <circle cx="85" cy="85" r="9" fill="#1e1e2f" />
            <circle cx="83" cy="82" r="3.5" fill="#ffffff" />
            {/* Right eye wink */}
            <path d="M 108 86 Q 118 78 128 86" stroke="#1e1e2f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="85" cy="82" r="13" fill="#ffffff" stroke="#1e1e2f" strokeWidth="3" />
            <circle cx="85" cy="82" r="6" fill="#1e1e2f" />
            <circle cx="83" cy="80" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="82" r="13" fill="#ffffff" stroke="#1e1e2f" strokeWidth="3" />
            <circle cx="120" cy="82" r="6" fill="#1e1e2f" />
            <circle cx="118" cy="80" r="2.5" fill="#ffffff" />
          </>
        );
      case 'serious':
        return (
          <>
            <path d="M 75 75 L 96 79" stroke="#1e1e2f" strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="86" r="7" fill="#1e1e2f" />
            <path d="M 128 75 L 108 79" stroke="#1e1e2f" strokeWidth="3" strokeLinecap="round" />
            <circle cx="118" cy="86" r="7" fill="#1e1e2f" />
          </>
        );
      case 'happy':
      default:
        return (
          <>
            <ellipse cx="85" cy="84" rx="8.5" ry="11" fill="#181829" />
            <circle cx="83" cy="80" r="3.5" fill="#ffffff" />
            <circle cx="88" cy="87" r="1.5" fill="#ffffff" />
            <ellipse cx="120" cy="84" rx="8.5" ry="11" fill="#181829" />
            <circle cx="118" cy="80" r="3.5" fill="#ffffff" />
            <circle cx="123" cy="87" r="1.5" fill="#ffffff" />
            {/* Rosy cheeks */}
            <circle cx="72" cy="94" r="7" fill="#ff7a90" opacity="0.45" />
            <circle cx="132" cy="94" r="7" fill="#ff7a90" opacity="0.45" />
          </>
        );
    }
  };

  // Mouth visemes
  const renderMouth = () => {
    switch (mouthShape) {
      case 'closed':
        return <path d="M 94 105 Q 102 108 110 105" stroke="#1e1e2f" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'open':
        return (
          <path
            d="M 93 103 Q 102 118 111 103 Z"
            fill="#d93838"
            stroke="#1e1e2f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      case 'round':
        return (
          <ellipse
            cx="102"
            cy="106"
            rx="6"
            ry="9"
            fill="#a61b1b"
            stroke="#1e1e2f"
            strokeWidth="2.5"
          />
        );
      case 'wide':
        return (
          <g>
            <path
              d="M 88 100 Q 102 126 116 100 Z"
              fill="#d93838"
              stroke="#1e1e2f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M 94 112 Q 102 110 110 112" stroke="#ff7a90" strokeWidth="4" fill="none" />
          </g>
        );
      case 'talking':
        return (
          <motion.path
            d="M 92 102 Q 102 120 112 102 Z"
            fill="#d93838"
            stroke="#1e1e2f"
            strokeWidth="2.5"
            animate={{
              d: [
                "M 92 102 Q 102 108 112 102 Z",
                "M 90 102 Q 102 122 114 102 Z",
                "M 93 103 Q 102 112 111 103 Z",
                "M 90 102 Q 102 124 114 102 Z",
              ],
            }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          />
        );
      case 'smile':
      default:
        return (
          <path
            d="M 92 102 Q 102 116 112 102"
            stroke="#1e1e2f"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  // Body and head animation variant based on action
  const bodyVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 0.8, -0.8, 0],
      transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
    },
    talk: {
      y: [0, -4, 2, -2, 0],
      rotate: [0, -2, 2, -1, 0],
      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
    },
    wave: {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
    },
    celebrate: {
      y: [0, -18, 0],
      scale: [1, 1.05, 0.98, 1],
      transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" },
    },
    walk: {
      x: [-6, 6, -6],
      y: [0, -5, 0],
      rotate: [-3, 3, -3],
      transition: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
    },
    present: {
      y: [0, -4, 0],
      rotate: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
    },
  };

  const rightArmVariants = {
    wave: {
      rotate: [0, -45, 10, -40, 5, 0],
      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
    },
    celebrate: {
      rotate: [-70, -85, -70],
      transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
    },
    present: {
      rotate: [-55, -50, -55],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
    },
    idle: {
      rotate: [0, -5, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    },
    talk: {
      rotate: [-10, 5, -10],
      transition: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
    },
    walk: {
      rotate: [20, -20, 20],
      transition: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
    },
  };

  const leftArmVariants = {
    celebrate: {
      rotate: [70, 85, 70],
      transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
    },
    walk: {
      rotate: [-20, 20, -20],
      transition: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
    },
    idle: {
      rotate: [0, 5, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    },
    talk: {
      rotate: [5, -5, 5],
      transition: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
    },
    wave: {
      rotate: [0, 5, 0],
      transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
    },
    present: {
      rotate: [10, 5, 10],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <motion.svg
        viewBox="0 0 200 230"
        className="w-full h-full max-w-[280px] drop-shadow-xl"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          <linearGradient id={`toon-glow-${archetype}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={clothingColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
          <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id="toon-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Soft Cartoon Ground Shadow */}
        <ellipse cx="100" cy="218" rx="48" ry="8" fill="#000000" opacity="0.3" />

        {/* Full Cartoon Animated Rig Body */}
        <motion.g animate={action} variants={bodyVariants}>
          {/* ARCHETYPE 1: ROBOT MASCOT (3D Pixar Style) */}
          {archetype === 'robot_mascot' && (
            <g id="rig-robot">
              {/* Antenna with glowing pulse orb */}
              <line x1="102" y1="42" x2="102" y2="24" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              <motion.circle
                cx="102"
                cy="20"
                r="7"
                fill="#ff9900"
                stroke="#ffffff"
                strokeWidth="2"
                animate={{ r: [6, 9, 6], fill: ['#ff9900', '#00f2fe', '#ff9900'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              {/* Robot Floating Feet */}
              <ellipse cx="78" cy="208" rx="14" ry="7" fill="#475569" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="126" cy="208" rx="14" ry="7" fill="#475569" stroke="#1e293b" strokeWidth="2.5" />
              {/* Blue Jet thruster flame when celebrating or jumping */}
              {action === 'celebrate' && (
                <>
                  <polygon points="73,212 83,212 78,228" fill="#38bdf8" />
                  <polygon points="121,212 131,212 126,228" fill="#38bdf8" />
                </>
              )}

              {/* Robot Torso / Chassis */}
              <rect
                x="68"
                y="120"
                width="68"
                height="68"
                rx="20"
                fill="url(#metal-grad)"
                stroke="#334155"
                strokeWidth="3.5"
              />
              {/* Torso Screen / Battery Heart */}
              <rect x="78" y="132" width="48" height="32" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <motion.path
                d="M 84 148 L 92 148 L 96 140 L 102 154 L 108 144 L 112 148 L 120 148"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ stroke: ['#10b981', '#38bdf8', '#10b981'] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />

              {/* Left Arm */}
              <motion.g
                variants={leftArmVariants}
                style={{ transformOrigin: '68px 135px' }}
              >
                <path d="M 68 135 Q 46 150 50 172" stroke="#64748b" strokeWidth="8" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="174" r="9" fill={accentColor} stroke="#1e293b" strokeWidth="2.5" />
              </motion.g>

              {/* Right Arm */}
              <motion.g
                variants={rightArmVariants}
                style={{ transformOrigin: '136px 135px' }}
              >
                <path d="M 136 135 Q 158 150 154 172" stroke="#64748b" strokeWidth="8" strokeLinecap="round" fill="none" />
                <circle cx="154" cy="174" r="9" fill={clothingColor} stroke="#1e293b" strokeWidth="2.5" />
              </motion.g>

              {/* Robot Head */}
              <rect
                x="56"
                y="42"
                width="92"
                height="74"
                rx="24"
                fill="url(#metal-grad)"
                stroke="#334155"
                strokeWidth="3.5"
              />
              {/* Ear bolts */}
              <rect x="48" y="65" width="8" height="18" rx="3" fill={accentColor} stroke="#334155" strokeWidth="2" />
              <rect x="148" y="65" width="8" height="18" rx="3" fill={accentColor} stroke="#334155" strokeWidth="2" />

              {/* Glowing Visor Screen */}
              <rect x="66" y="56" width="72" height="46" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2" />

              {/* Visor Eyes */}
              <g>{renderEyes()}</g>

              {/* Mouth Display */}
              <g>{renderMouth()}</g>
            </g>
          )}

          {/* ARCHETYPE 2: BUNNY CRITTER / CHIBI MASCOT */}
          {archetype === 'bunny_critter' && (
            <g id="rig-bunny">
              {/* Bunny Long Ears with bounce */}
              <motion.g
                animate={{ rotate: [-2, 4, -2] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{ transformOrigin: '72px 55px' }}
              >
                <path d="M 64 55 C 50 10, 74 -10, 82 45 Z" fill="#ffccd5" stroke="#4a1525" strokeWidth="3" />
                <path d="M 68 45 C 58 12, 74 2, 78 40 Z" fill="#ff758f" />
              </motion.g>
              <motion.g
                animate={{ rotate: [3, -3, 3] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                style={{ transformOrigin: '132px 55px' }}
              >
                <path d="M 140 55 C 154 10, 130 -10, 122 45 Z" fill="#ffccd5" stroke="#4a1525" strokeWidth="3" />
                <path d="M 136 45 C 146 12, 130 2, 126 40 Z" fill="#ff758f" />
              </motion.g>

              {/* Feet */}
              <ellipse cx="80" cy="204" rx="16" ry="10" fill="#ffffff" stroke="#4a1525" strokeWidth="3" />
              <ellipse cx="124" cy="204" rx="16" ry="10" fill="#ffffff" stroke="#4a1525" strokeWidth="3" />

              {/* Fluffy Hoodie Body */}
              <ellipse cx="102" cy="154" rx="42" ry="38" fill={clothingColor} stroke="#4a1525" strokeWidth="3.5" />
              {/* Belly pouch */}
              <ellipse cx="102" cy="158" rx="24" ry="22" fill="#ffffff" opacity="0.9" />

              {/* Left Arm / Paw */}
              <motion.g variants={leftArmVariants} style={{ transformOrigin: '65px 145px' }}>
                <circle cx="56" cy="154" r="12" fill="#ffffff" stroke="#4a1525" strokeWidth="3" />
              </motion.g>

              {/* Right Arm / Paw */}
              <motion.g variants={rightArmVariants} style={{ transformOrigin: '139px 145px' }}>
                <circle cx="148" cy="154" r="12" fill="#ffffff" stroke="#4a1525" strokeWidth="3" />
              </motion.g>

              {/* Big Cute Head */}
              <ellipse cx="102" cy="90" rx="48" ry="42" fill="#ffffff" stroke="#4a1525" strokeWidth="3.5" />
              {/* Cute Bunny Nose */}
              <polygon points="98,96 106,96 102,101" fill="#ff758f" />

              <g>{renderEyes()}</g>
              <g>{renderMouth()}</g>
            </g>
          )}

          {/* ARCHETYPE 3: ANIME HERO TOON */}
          {archetype === 'anime_hero' && (
            <g id="rig-anime">
              {/* Spiky Anime Hair Behind */}
              <path d="M 50 70 L 30 40 L 65 50 L 80 15 L 102 45 L 125 15 L 140 50 L 175 40 L 155 75 Z" fill={accentColor} stroke="#1e1e2f" strokeWidth="3.5" strokeLinejoin="round" />

              {/* Shoes */}
              <rect x="72" y="196" width="20" height="14" rx="5" fill="#ef4444" stroke="#1e1e2f" strokeWidth="2.5" />
              <rect x="112" y="196" width="20" height="14" rx="5" fill="#ef4444" stroke="#1e1e2f" strokeWidth="2.5" />

              {/* Hero Gi / Outfit */}
              <path d="M 68 126 L 136 126 L 128 196 L 76 196 Z" fill={clothingColor} stroke="#1e1e2f" strokeWidth="3" />
              {/* Belt / Sash */}
              <rect x="74" y="160" width="56" height="10" rx="3" fill="#1e1e2f" />

              {/* Left Arm */}
              <motion.g variants={leftArmVariants} style={{ transformOrigin: '68px 135px' }}>
                <path d="M 68 135 L 48 160" stroke="#fcd34d" strokeWidth="12" strokeLinecap="round" />
                <circle cx="46" cy="164" r="7" fill={skinTone} stroke="#1e1e2f" strokeWidth="2.5" />
              </motion.g>

              {/* Right Arm */}
              <motion.g variants={rightArmVariants} style={{ transformOrigin: '136px 135px' }}>
                <path d="M 136 135 L 156 160" stroke="#fcd34d" strokeWidth="12" strokeLinecap="round" />
                <circle cx="158" cy="164" r="7" fill={skinTone} stroke="#1e1e2f" strokeWidth="2.5" />
              </motion.g>

              {/* Anime Head */}
              <path d="M 60 70 Q 102 60 144 70 Q 144 110 102 125 Q 60 110 60 70 Z" fill={skinTone} stroke="#1e1e2f" strokeWidth="3.5" />

              {/* Headband */}
              <rect x="60" y="65" width="84" height="14" rx="4" fill="#3b82f6" stroke="#1e1e2f" strokeWidth="2.5" />
              <circle cx="102" cy="72" r="5" fill="#f59e0b" />

              <g>{renderEyes()}</g>
              <g>{renderMouth()}</g>
            </g>
          )}

          {/* ARCHETYPE 4: CYBER FOX TOON */}
          {archetype === 'cyber_fox' && (
            <g id="rig-cyberfox">
              {/* Pointed Fox Ears */}
              <polygon points="62,56 45,8 88,42" fill="#ea580c" stroke="#1e1e2f" strokeWidth="3" />
              <polygon points="60,48 50,18 78,38" fill="#fef08a" />
              <polygon points="142,56 159,8 116,42" fill="#ea580c" stroke="#1e1e2f" strokeWidth="3" />
              <polygon points="144,48 154,18 126,38" fill="#fef08a" />

              {/* Cybernetic Fox Tail with waving animation */}
              <motion.path
                d="M 65 170 Q 20 150 30 110 Q 55 120 60 155 Z"
                fill="#ea580c"
                stroke="#1e1e2f"
                strokeWidth="3"
                animate={{ rotate: [-6, 8, -6] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                style={{ transformOrigin: '65px 170px' }}
              />

              {/* Futuristic Cyber Body */}
              <rect x="70" y="125" width="64" height="65" rx="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
              {/* Neon Chest line */}
              <line x1="82" y1="145" x2="122" y2="145" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              <line x1="92" y1="155" x2="112" y2="155" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

              {/* Fox Head */}
              <path d="M 58 65 Q 102 55 146 65 Q 152 105 102 124 Q 52 105 58 65 Z" fill="#ea580c" stroke="#1e1e2f" strokeWidth="3.5" />
              {/* White Muzzle */}
              <path d="M 80 90 Q 102 82 124 90 Q 116 118 102 122 Q 88 118 80 90 Z" fill="#ffffff" stroke="#1e1e2f" strokeWidth="2" />
              {/* Black Nose */}
              <polygon points="98,98 106,98 102,103" fill="#1e1e2f" />

              {/* Glowing Holographic Goggles */}
              <rect x="68" y="74" width="68" height="18" rx="8" fill="#06b6d4" opacity="0.85" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="72" y1="83" x2="132" y2="83" stroke="#ffffff" strokeWidth="2" opacity="0.7" strokeDasharray="6 3" />

              <g>{renderMouth()}</g>
            </g>
          )}

          {/* ARCHETYPE 5: RETRO 90S RUBBER HOSE TOON */}
          {archetype === 'retro_90s' && (
            <g id="rig-retro">
              {/* Oversized Clown/Toon Shoes */}
              <ellipse cx="74" cy="204" rx="20" ry="12" fill="#eab308" stroke="#000000" strokeWidth="3.5" />
              <ellipse cx="130" cy="204" rx="20" ry="12" fill="#eab308" stroke="#000000" strokeWidth="3.5" />

              {/* Rubber Hose Legs */}
              <path d="M 84 175 Q 74 190 76 200" stroke="#000000" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 120 175 Q 130 190 128 200" stroke="#000000" strokeWidth="10" strokeLinecap="round" fill="none" />

              {/* Round Toon Belly in Suspenders / Shorts */}
              <circle cx="102" cy="150" r="32" fill="#ef4444" stroke="#000000" strokeWidth="3.5" />
              {/* Big White Buttons */}
              <ellipse cx="92" cy="148" rx="4" ry="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <ellipse cx="112" cy="148" rx="4" ry="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />

              {/* Rubber Hose Arms with 4-finger cartoon gloves */}
              <motion.g variants={leftArmVariants} style={{ transformOrigin: '76px 140px' }}>
                <path d="M 76 140 Q 40 145 44 165" stroke="#000000" strokeWidth="9" strokeLinecap="round" fill="none" />
                <circle cx="44" cy="168" r="10" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
              </motion.g>

              <motion.g variants={rightArmVariants} style={{ transformOrigin: '128px 140px' }}>
                <path d="M 128 140 Q 164 145 160 165" stroke="#000000" strokeWidth="9" strokeLinecap="round" fill="none" />
                <circle cx="160" cy="168" r="10" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
              </motion.g>

              {/* Big Round Head */}
              <circle cx="102" cy="85" r="38" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />

              {/* Classic Pie Eyes */}
              <ellipse cx="88" cy="80" rx="9" ry="14" fill="#000000" />
              <polygon points="88,80 97,76 95,84" fill="#ffffff" />
              <ellipse cx="116" cy="80" rx="9" ry="14" fill="#000000" />
              <polygon points="116,80 125,76 123,84" fill="#ffffff" />

              {/* Rubber Hose Wide Smile */}
              <path d="M 76 96 Q 102 128 128 96 Z" fill="#d93838" stroke="#000000" strokeWidth="3" />
              <path d="M 88 112 Q 102 110 116 112" stroke="#ff7a90" strokeWidth="4" fill="none" />
            </g>
          )}

          {/* ARCHETYPE 6: CLAY BEAR / STOP MOTION */}
          {archetype === 'clay_bear' && (
            <g id="rig-claybear">
              {/* Round Bear Ears */}
              <circle cx="68" cy="55" r="16" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
              <circle cx="68" cy="55" r="9" fill="#fde047" opacity="0.7" />
              <circle cx="136" cy="55" r="16" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
              <circle cx="136" cy="55" r="9" fill="#fde047" opacity="0.7" />

              {/* Clay Body */}
              <ellipse cx="102" cy="154" rx="44" ry="40" fill="#854d0e" stroke="#451a03" strokeWidth="3.5" />
              {/* Knitted Scarf */}
              <rect x="74" y="118" width="56" height="14" rx="6" fill={clothingColor} stroke="#451a03" strokeWidth="2.5" />
              <rect x="110" y="126" width="12" height="28" rx="4" fill={clothingColor} stroke="#451a03" strokeWidth="2" />

              {/* Left Paw */}
              <motion.g variants={leftArmVariants} style={{ transformOrigin: '65px 145px' }}>
                <circle cx="54" cy="152" r="14" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
              </motion.g>

              {/* Right Paw */}
              <motion.g variants={rightArmVariants} style={{ transformOrigin: '139px 145px' }}>
                <circle cx="150" cy="152" r="14" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
              </motion.g>

              {/* Clay Head */}
              <circle cx="102" cy="88" r="40" fill="#854d0e" stroke="#451a03" strokeWidth="3.5" />
              {/* Snout */}
              <ellipse cx="102" cy="98" rx="20" ry="15" fill="#fde047" stroke="#451a03" strokeWidth="2.5" />
              <ellipse cx="102" cy="92" rx="6" ry="4" fill="#1c1917" />

              <g>{renderEyes()}</g>
              <g>{renderMouth()}</g>
            </g>
          )}

          {/* ARCHETYPE 7: FLAT VECTOR SAAS MASCOT */}
          {archetype === 'flat_vector' && (
            <g id="rig-flatvector">
              {/* Minimal Geometric Antennas */}
              <line x1="88" y1="52" x2="80" y2="30" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="28" r="5" fill={accentColor} />
              <line x1="116" y1="52" x2="124" y2="30" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="124" cy="28" r="5" fill={accentColor} />

              {/* Floating Pill Body */}
              <rect x="72" y="124" width="60" height="70" rx="30" fill={clothingColor} stroke="#1e1b4b" strokeWidth="3" />
              {/* Gradient Accent Badge */}
              <circle cx="102" cy="155" r="12" fill={accentColor} />

              {/* Left/Right Floating Dots */}
              <motion.circle cx="50" cy="155" r="9" fill={accentColor} variants={leftArmVariants} />
              <motion.circle cx="154" cy="155" r="9" fill={accentColor} variants={rightArmVariants} />

              {/* Smooth Geometric Head */}
              <rect x="62" y="52" width="80" height="70" rx="35" fill="#ffffff" stroke="#1e1b4b" strokeWidth="3.5" />

              <g>{renderEyes()}</g>
              <g>{renderMouth()}</g>
            </g>
          )}

          {/* Optional Accessories */}
          {accessory === 'crown' && (
            <polygon points="86,40 94,22 102,36 110,22 118,40" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          )}
          {accessory === 'headphones' && (
            <g>
              <path d="M 52 82 C 52 35 152 35 152 82" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="none" />
              <rect x="46" y="74" width="10" height="20" rx="4" fill="#1d4ed8" />
              <rect x="148" y="74" width="10" height="20" rx="4" fill="#1d4ed8" />
            </g>
          )}
          {accessory === 'bow_tie' && (
            <polygon points="90,122 114,122 102,128" fill="#ec4899" stroke="#831843" strokeWidth="1.5" />
          )}
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default VectorCartoonRig;
