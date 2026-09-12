import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { motion, type Variants } from 'motion/react';
import {
  cartoonVariants,
  getCustomCartoonVariant,
} from '../animations/toonVariants';
import {
  type AnimationPresetName,
  type ToonAppearance,
  type ToonCharacterProps,
  type ToonHairStyle,
  type ToonAccessory,
} from '../types';

export interface ToonCustomizationContextValue {
  customizations: Record<string, ToonAppearance>;
  openCustomizer: (character: string) => void;
}

export const characterNames = ['Ava', 'Milo', 'Nova', 'Kai', 'Luna', 'Max'];

export const defaultAppearances: Record<string, ToonAppearance> = {
  Ava: {
    skinTone: '#8f5438',
    hairColor: '#24170f',
    clothingColor: '#ff9900',
    accentColor: '#ffd166',
    hairStyle: 'wave',
    accessory: 'glasses',
  },
  Milo: {
    skinTone: '#edb487',
    hairColor: '#6b3d21',
    clothingColor: '#4a6baf',
    accentColor: '#8db4ff',
    hairStyle: 'spikes',
    accessory: 'headphones',
  },
  Nova: {
    skinTone: '#6f3f2d',
    hairColor: '#1e1527',
    clothingColor: '#9b59b6',
    accentColor: '#d9a7ef',
    hairStyle: 'bob',
    accessory: 'earrings',
  },
  Kai: {
    skinTone: '#d69563',
    hairColor: '#161616',
    clothingColor: '#2e9d73',
    accentColor: '#7de2b8',
    hairStyle: 'short',
    accessory: 'none',
  },
  Luna: {
    skinTone: '#f1bd96',
    hairColor: '#b05b2d',
    clothingColor: '#d84d57',
    accentColor: '#ff9ca4',
    hairStyle: 'curl',
    accessory: 'glasses',
  },
  Max: {
    skinTone: '#a96845',
    hairColor: '#35251e',
    clothingColor: '#216f9b',
    accentColor: '#75c9f7',
    hairStyle: 'cap',
    accessory: 'headphones',
  },
};

export const skinTones = [
  '#f6d0b1',
  '#edb487',
  '#d69563',
  '#b97850',
  '#a96845',
  '#8f5438',
  '#6f3f2d',
  '#4b2b20',
];

export const hairColors = [
  '#161616',
  '#24170f',
  '#35251e',
  '#6b3d21',
  '#9a572f',
  '#b05b2d',
  '#d4a34d',
  '#6a4b83',
];

export const clothingColors = [
  '#ff9900',
  '#d84d57',
  '#9b59b6',
  '#4a6baf',
  '#216f9b',
  '#2e9d73',
  '#e6b83f',
  '#343b55',
];

export const hairStyles: Array<{ id: ToonHairStyle; label: string }> = [
  { id: 'wave', label: 'Wave' },
  { id: 'spikes', label: 'Spikes' },
  { id: 'bob', label: 'Bob' },
  { id: 'curl', label: 'Curl' },
  { id: 'short', label: 'Short' },
  { id: 'cap', label: 'Cap' },
];

export const accessories: Array<{ id: ToonAccessory; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'earrings', label: 'Earrings' },
];

const storageKey = 'tonemark-character-customizations';

const loadCustomizations = (): Record<string, ToonAppearance> => {
  if (typeof window === 'undefined') {
    return defaultAppearances;
  }
  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      return defaultAppearances;
    }
    const parsed = JSON.parse(storedValue);
    return {
      ...defaultAppearances,
      ...parsed,
    };
  } catch {
    return defaultAppearances;
  }
};

export const ToonCustomizationContext = createContext<ToonCustomizationContextValue>({
  customizations: defaultAppearances,
  openCustomizer: () => {},
});

export const ToonCustomizationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customizations, setCustomizations] =
    useState<Record<string, ToonAppearance>>(loadCustomizations);
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(customizations));
    } catch {
      // Ignore quota error
    }
  }, [customizations]);

  useEffect(() => {
    if (!editingCharacter) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditingCharacter(null);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingCharacter]);

  const updateAppearance = (
    character: string,
    updates: Partial<ToonAppearance>
  ) => {
    setCustomizations((current) => ({
      ...current,
      [character]: {
        ...(current[character] ?? defaultAppearances.Ava),
        ...updates,
      },
    }));
  };

  const resetAppearance = (character: string) => {
    setCustomizations((current) => ({
      ...current,
      [character]: defaultAppearances[character] ?? defaultAppearances.Ava,
    }));
  };

  const contextValue = useMemo<ToonCustomizationContextValue>(
    () => ({
      customizations,
      openCustomizer: setEditingCharacter,
    }),
    [customizations]
  );

  const selectedAppearance = editingCharacter
    ? customizations[editingCharacter] ?? defaultAppearances.Ava
    : defaultAppearances.Ava;

  return (
    <ToonCustomizationContext.Provider value={contextValue}>
      {children}

      {editingCharacter && (
        <div
          id="toon-customizer-modal"
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="toon-customizer-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setEditingCharacter(null);
            }
          }}
        >
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-[#2a1b4e]">
            <div className="bg-[#1a0b2e] px-6 py-5 md:px-8 flex items-start justify-between gap-5">
              <div>
                <p className="text-[#ff9900] text-xs font-bold uppercase tracking-[0.18em]">
                  Procedural Character Rig Studio
                </p>
                <h2
                  id="toon-customizer-title"
                  className="text-2xl md:text-3xl font-extrabold text-white mt-2"
                >
                  Customize {editingCharacter}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Adjust skin, hair, clothes, and accessories in real time across the studio.
                </p>
              </div>

              <button
                id="close-toon-customizer-btn"
                type="button"
                onClick={() => setEditingCharacter(null)}
                className="w-10 h-10 shrink-0 rounded-full border border-white/30 text-white hover:border-[#ff9900] hover:text-[#ff9900] transition-colors flex items-center justify-center text-xl font-bold"
                aria-label="Close character customization"
              >
                ×
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div
                className="flex gap-2 overflow-x-auto pb-2"
                role="tablist"
                aria-label="Select a toon to customize"
              >
                {characterNames.map((character) => {
                  const isSelected = character === editingCharacter;
                  return (
                    <button
                      key={character}
                      id={`toon-tab-${character.toLowerCase()}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setEditingCharacter(character)}
                      className={`shrink-0 rounded-full px-5 py-2 font-extrabold border-2 transition-colors ${
                        isSelected
                          ? 'bg-[#ff9900] border-[#ff9900] text-white shadow-md'
                          : 'bg-white border-gray-200 text-[#1a0b2e] hover:border-[#ff9900]'
                      }`}
                    >
                      {character}
                    </button>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 mt-7">
                <div className="bg-[#1a0b2e] rounded-3xl min-h-[360px] p-7 flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="absolute -right-12 -bottom-14 w-52 h-52 rounded-full border-[30px] border-[#3a2b5e]" />
                  <span className="absolute left-8 top-8 w-12 h-12 bg-[#ff9900] rounded-xl rotate-12" />

                  <ToonCharacter
                    character={editingCharacter}
                    action="wave"
                    className="relative z-10 w-48 h-60"
                  />

                  <span className="relative z-10 mt-3 bg-white rounded-full px-5 py-1.5 font-extrabold text-[#1a0b2e] shadow-lg text-sm">
                    {editingCharacter}
                  </span>
                </div>

                <div className="space-y-6">
                  <ColorSelector
                    label="Skin tone"
                    colors={skinTones}
                    value={selectedAppearance.skinTone}
                    onChange={(skinTone) =>
                      updateAppearance(editingCharacter, { skinTone })
                    }
                  />

                  <ColorSelector
                    label="Hair color"
                    colors={hairColors}
                    value={selectedAppearance.hairColor}
                    onChange={(hairColor) =>
                      updateAppearance(editingCharacter, { hairColor })
                    }
                  />

                  <ColorSelector
                    label="Clothing color"
                    colors={clothingColors}
                    value={selectedAppearance.clothingColor}
                    onChange={(clothingColor) =>
                      updateAppearance(editingCharacter, { clothingColor })
                    }
                  />

                  <ColorSelector
                    label="Accent color"
                    colors={clothingColors}
                    value={selectedAppearance.accentColor}
                    onChange={(accentColor) =>
                      updateAppearance(editingCharacter, { accentColor })
                    }
                  />

                  <OptionSelector
                    label="Hairstyle"
                    options={hairStyles}
                    value={selectedAppearance.hairStyle}
                    onChange={(hairStyle) =>
                      updateAppearance(editingCharacter, {
                        hairStyle: hairStyle as ToonHairStyle,
                      })
                    }
                  />

                  <OptionSelector
                    label="Accessory"
                    options={accessories}
                    value={selectedAppearance.accessory}
                    onChange={(accessory) =>
                      updateAppearance(editingCharacter, {
                        accessory: accessory as ToonAccessory,
                      })
                    }
                  />

                  <div className="pt-3 flex gap-3">
                    <button
                      id="reset-appearance-btn"
                      type="button"
                      onClick={() => resetAppearance(editingCharacter)}
                      className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Reset Defaults
                    </button>
                    <button
                      id="save-appearance-btn"
                      type="button"
                      onClick={() => setEditingCharacter(null)}
                      className="px-6 py-2.5 rounded-full bg-[#1a0b2e] text-xs font-bold text-white hover:bg-[#2a1b4e] transition-colors shadow-md"
                    >
                      Save & Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToonCustomizationContext.Provider>
  );
};

const ColorSelector: React.FC<{
  label: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}> = ({ label, colors, value, onChange }) => (
  <fieldset>
    <legend className="text-sm font-extrabold text-[#1a0b2e] mb-2">{label}</legend>
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => {
        const isSelected = color.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-9 h-9 rounded-full border-4 transition-transform hover:scale-110 ${
              isSelected
                ? 'border-[#ff9900] shadow-[0_0_0_2px_white,0_0_0_4px_#ff9900]'
                : 'border-white shadow-[0_0_0_1px_#d1d5db]'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select ${label.toLowerCase()} ${color}`}
            aria-pressed={isSelected}
          />
        );
      })}

      <label className="relative w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#ff9900] transition-colors">
        <span className="text-lg font-black text-gray-500">+</span>
        <span className="sr-only">Choose a custom {label.toLowerCase()}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  </fieldset>
);

const OptionSelector: React.FC<{
  label: string;
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <fieldset>
    <legend className="text-sm font-extrabold text-[#1a0b2e] mb-2">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={isSelected}
            className={`rounded-xl border-2 px-3.5 py-1.5 text-xs font-bold transition-colors ${
              isSelected
                ? 'border-[#ff9900] bg-[#fff6e8] text-[#d97900]'
                : 'border-gray-200 text-[#1a0b2e] hover:border-[#ff9900]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const Hair: React.FC<{ appearance: ToonAppearance; sway: number }> = ({
  appearance,
  sway,
}) => {
  const transform = `rotate(${sway * 0.4}deg) translate(${sway * 0.2}px, 0)`;

  if (appearance.hairStyle === 'spikes') {
    return (
      <path
        d="M34 48 29 27l12 7 4-14 9 12 10-15 3 17 14-8-5 24c-8-8-34-10-51-2Z"
        fill={appearance.hairColor}
        style={{ transformOrigin: '60px 48px', transform }}
      />
    );
  }

  if (appearance.hairStyle === 'bob') {
    return (
      <path
        d="M29 66c-8-30 5-48 31-48s39 18 31 48l-12-3V43c-9-9-29-9-38 0v20Z"
        fill={appearance.hairColor}
        style={{ transformOrigin: '60px 40px', transform }}
      />
    );
  }

  if (appearance.hairStyle === 'curl') {
    return (
      <path
        d="M29 52c-2-22 12-36 31-36s34 14 31 39c-7-4-8-12-9-18-4 4-9 6-14 7-10 3-20 1-27-5-1 8-4 12-12 13Z"
        fill={appearance.hairColor}
        style={{ transformOrigin: '60px 40px', transform }}
      />
    );
  }

  if (appearance.hairStyle === 'short') {
    return (
      <path
        d="M32 46c0-19 11-30 28-30 19 0 29 12 28 31-8-11-18-13-28-13-11 0-20 3-28 12Z"
        fill={appearance.hairColor}
        style={{ transformOrigin: '60px 35px', transform }}
      />
    );
  }

  if (appearance.hairStyle === 'cap') {
    return (
      <g style={{ transformOrigin: '60px 40px', transform }}>
        <path
          d="M31 42c2-18 13-27 29-27 17 0 28 10 29 27Z"
          fill={appearance.hairColor}
        />
        <path d="M54 38h43c-5 8-17 10-29 7Z" fill={appearance.accentColor} />
      </g>
    );
  }

  return (
    <path
      d="M28 55c-4-24 9-40 32-40 25 0 37 18 31 43-6-2-9-8-10-17-7 7-20 11-38 7-2 8-7 11-15 7Z"
      fill={appearance.hairColor}
      style={{ transformOrigin: '60px 40px', transform }}
    />
  );
};

const Accessory: React.FC<{ appearance: ToonAppearance }> = ({ appearance }) => {
  if (appearance.accessory === 'glasses') {
    return (
      <g fill="none" stroke="#25212d" strokeWidth="3">
        <rect x="39" y="42" width="19" height="14" rx="6" />
        <rect x="62" y="42" width="19" height="14" rx="6" />
        <path d="M58 48h4M38 47l-7-3M82 47l7-3" />
      </g>
    );
  }

  if (appearance.accessory === 'headphones') {
    return (
      <g>
        <path
          d="M31 49c0-22 12-34 29-34s29 12 29 34"
          fill="none"
          stroke={appearance.accentColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="25" y="45" width="12" height="22" rx="6" fill={appearance.clothingColor} />
        <rect x="83" y="45" width="12" height="22" rx="6" fill={appearance.clothingColor} />
      </g>
    );
  }

  if (appearance.accessory === 'earrings') {
    return (
      <g fill={appearance.accentColor} stroke="white" strokeWidth="1.5">
        <circle cx="33" cy="61" r="4" />
        <circle cx="87" cy="61" r="4" />
      </g>
    );
  }

  return null;
};

/**
 * Procedural ToonCharacter Component
 * Powered by kinematics engine with squash, stretch, and 12 Disney Principles
 */
export const ToonCharacter: React.FC<ToonCharacterProps> = ({
  character,
  action = 'idle',
  preset,
  customVariants,
  speedMultiplier = 1,
  squashIntensity = 1,
  showCartoonEffects = true,
  className = '',
  showName = false,
  appearance,
  playbackTime,
  mouthState = 'auto',
  expression = 'happy',
}) => {
  const { customizations, openCustomizer } = useContext(ToonCustomizationContext);
  const [internalTime, setInternalTime] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const isTimeDriven = playbackTime !== undefined;

  useEffect(() => {
    if (isTimeDriven) return;

    const start = performance.now();
    const loop = (now: number) => {
      setInternalTime((now - start) / 1000);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isTimeDriven]);

  const t = isTimeDriven ? playbackTime! : internalTime;

  const activePreset: AnimationPresetName = (preset || (action as AnimationPresetName) || 'idle') in cartoonVariants
    ? ((preset || action) as AnimationPresetName)
    : 'idle';

  const motionVariantToUse = useMemo(() => {
    if (customVariants) return customVariants;
    return getCustomCartoonVariant(activePreset, { speedMultiplier, squashIntensity });
  }, [customVariants, activePreset, speedMultiplier, squashIntensity]);

  if (character === 'No character') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="w-full aspect-square rounded-full border-4 border-dashed border-white/60 bg-white/10 flex items-center justify-center">
          <span className="text-white/80 text-xs font-black uppercase tracking-wider">
            No actor
          </span>
        </div>
      </div>
    );
  }

  const resolvedAppearance: ToonAppearance = {
    ...(customizations[character] ?? defaultAppearances.Ava),
    ...appearance,
  };

  // --- PROCEDURAL ANIMATION KINEMATICS ---
  const breathCycle = Math.sin(t * 3);
  const bodyBobY = Math.sin(t * 2.5) * 1.8;
  const headTilt = Math.sin(t * 1.8) * 3.5;
  const hairSway = Math.sin(t * 2.5) * 4;

  const blinkPhase = t % 3.2;
  const isBlinking = blinkPhase > 3.05 && blinkPhase < 3.2;

  const isTalking = action === 'talk' || activePreset === 'talk' || mouthState === 'open' || mouthState === 'wide';
  let mouthOpening = 0;
  if (mouthState === 'open') mouthOpening = 6;
  else if (mouthState === 'wide') mouthOpening = 9;
  else if (mouthState === 'round') mouthOpening = 7;
  else if (mouthState === 'closed') mouthOpening = 0;
  else if (isTalking) {
    mouthOpening = (Math.abs(Math.sin(t * 14)) * 0.6 + Math.abs(Math.sin(t * 9)) * 0.4) * 8;
  }

  const isWaving = action === 'wave' || activePreset === 'wave';
  const isCelebrating = action === 'celebrate' || activePreset === 'celebrate';
  const isWalking = action === 'walk' || activePreset === 'walk';
  const isSneaking = action === 'sneak' || activePreset === 'sneak';
  const isDancing = action === 'dance' || activePreset === 'dance';
  const isShocked = action === 'shock' || activePreset === 'shock';
  const isPresenting = action === 'present' || activePreset === 'present';
  const isJumping = action === 'jump' || activePreset === 'jump';

  let leftLegAngle = 0;
  let rightLegAngle = 0;
  let torsoShiftY = bodyBobY;
  let shadowScale = 1;

  if (isWalking) {
    leftLegAngle = Math.sin(t * 7) * 22;
    rightLegAngle = -Math.sin(t * 7) * 22;
    torsoShiftY = Math.abs(Math.sin(t * 7)) * 4 - 2;
  } else if (isSneaking) {
    leftLegAngle = Math.sin(t * 4.5) * 15;
    rightLegAngle = -Math.sin(t * 4.5) * 15;
    torsoShiftY = 4 + Math.abs(Math.sin(t * 4.5)) * 3;
  } else if (isDancing) {
    leftLegAngle = Math.sin(t * 9) * 18;
    rightLegAngle = -Math.sin(t * 9) * 18;
    torsoShiftY = Math.sin(t * 9) * 5;
  } else if (isShocked) {
    torsoShiftY = -10 + Math.sin(t * 30) * 1.5;
  } else if (isJumping || isCelebrating) {
    const jumpCycle = Math.abs(Math.sin(t * 4.5));
    torsoShiftY = -jumpCycle * 14;
    shadowScale = 1 - jumpCycle * 0.35;
  }

  let leftArmPath = 'M41 84 25 105 32 110';
  let rightArmPath = 'M79 84 94 105 87 110';

  if (isWaving) {
    const waveSin = Math.sin(t * 9);
    const handX = 20 + waveSin * 9;
    const handY = 48 + Math.cos(t * 9) * 5;
    leftArmPath = `M40 83 Q 26 68 ${handX} ${handY}`;
  } else if (isCelebrating || isJumping) {
    const cheerSin = Math.sin(t * 6) * 5;
    leftArmPath = `M41 83 Q 22 55 ${16 + cheerSin} 35`;
    rightArmPath = `M79 83 Q 98 55 ${104 - cheerSin} 35`;
  } else if (isSneaking) {
    const sneakArm = Math.sin(t * 4.5) * 6;
    leftArmPath = `M41 84 Q 30 92 ${28 + sneakArm} 96`;
    rightArmPath = `M79 84 Q 85 92 ${88 - sneakArm} 96`;
  } else if (isDancing) {
    const groove = Math.sin(t * 9) * 18;
    leftArmPath = `M41 83 Q 22 62 18 ${54 + groove}`;
    rightArmPath = `M79 83 Q 96 62 102 ${54 - groove}`;
  } else if (isShocked) {
    leftArmPath = 'M41 83 Q 18 64 14 50';
    rightArmPath = 'M79 83 Q 102 64 106 50';
  } else if (isPresenting) {
    const sweep = Math.sin(t * 3) * 6;
    rightArmPath = `M79 84 Q 98 75 ${110 + sweep} 60`;
  } else if (isWalking) {
    const swing = Math.sin(t * 7) * 16;
    leftArmPath = `M41 84 Q 28 95 ${25 - swing} 108`;
    rightArmPath = `M79 84 Q 92 95 ${94 + swing} 108`;
  } else if (isTalking) {
    const gesture = Math.sin(t * 5) * 6;
    rightArmPath = `M79 84 Q 96 90 ${98 + gesture} 90`;
  }

  return (
    <motion.div
      variants={motionVariantToUse}
      animate={isTimeDriven ? undefined : 'animate'}
      style={{ transformOrigin: 'bottom center' }}
      className={`relative flex flex-col items-center select-none ${className}`}
      role="img"
      aria-label={`${character} performing ${activePreset || action}`}
    >
      {showCartoonEffects && !isTimeDriven && (
        <>
          {isJumping && (
            <motion.div
              animate={{
                scale: [0, 1.4, 0],
                opacity: [0, 0.8, 0],
                y: [0, -6, -10],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.25,
                repeatDelay: 0.5,
                times: [0, 0.2, 1],
              }}
              className="absolute bottom-1 pointer-events-none flex gap-8 z-0"
            >
              <div className="w-5 h-2 rounded-full bg-white/40 blur-[1px]" />
              <div className="w-5 h-2 rounded-full bg-white/40 blur-[1px]" />
            </motion.div>
          )}

          {isCelebrating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute -top-4 pointer-events-none flex gap-8 z-30"
            >
              <span className="text-yellow-300 text-sm font-black">✦</span>
              <span className="text-amber-400 text-xs font-black">★</span>
            </motion.div>
          )}

          {isDancing && (
            <motion.div
              animate={{
                y: [-2, -20, -28],
                x: [-6, 8, 14],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.9],
              }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-4 right-1 pointer-events-none text-[#ff9900] text-sm font-black select-none z-30"
            >
              ♪
            </motion.div>
          )}

          {isShocked && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  y: [-6, -18, -14],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="absolute -top-7 pointer-events-none text-amber-300 text-lg font-black select-none z-30 drop-shadow"
              >
                ❗
              </motion.div>
              <motion.div
                animate={{
                  y: [0, 12, 16],
                  opacity: [0, 1, 0],
                  x: [18, 22, 24],
                }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'easeIn' }}
                className="absolute top-6 pointer-events-none text-cyan-300 text-xs font-black select-none z-30"
              >
                💧
              </motion.div>
            </>
          )}
        </>
      )}

      <svg
        viewBox="0 0 120 150"
        className="w-full h-full drop-shadow-xl overflow-visible"
        aria-hidden="true"
      >
        {/* Dynamic Floor Shadow */}
        <ellipse
          cx="60"
          cy="142"
          rx={35 * shadowScale}
          ry={6 * shadowScale}
          fill="rgba(0,0,0,0.2)"
        />

        {/* Root Character Rig with dynamic transform hierarchy */}
        <g
          style={{
            transform: `translate(0px, ${torsoShiftY}px)`,
            transformOrigin: '60px 140px',
            transition: isTimeDriven ? 'none' : 'transform 0.05s ease-out',
          }}
        >
          {/* Left Leg */}
          <g
            style={{
              transformOrigin: '48px 112px',
              transform: `rotate(${leftLegAngle}deg)`,
            }}
          >
            <path d="M45 112 40 140h13l7-26Z" fill="#263451" />
            <path d="M38 138h17v7H33c0-4 2-6 5-7Z" fill="#171c2a" />
          </g>

          {/* Right Leg */}
          <g
            style={{
              transformOrigin: '72px 112px',
              transform: `rotate(${rightLegAngle}deg)`,
            }}
          >
            <path d="m75 112 6 28H68l-8-26Z" fill="#263451" />
            <path d="M68 138h17c3 1 5 3 5 7H68Z" fill="#171c2a" />
          </g>

          {/* Left Arm */}
          <path
            d={leftArmPath}
            fill="none"
            stroke={resolvedAppearance.skinTone}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Arm */}
          <path
            d={rightArmPath}
            fill="none"
            stroke={resolvedAppearance.skinTone}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Torso & Clothing with subtle breathing scale */}
          <g
            style={{
              transformOrigin: '60px 110px',
              transform: `scale(${1 + breathCycle * 0.015}, ${1 + breathCycle * 0.02})`,
            }}
          >
            <path
              d="M41 76c5-8 33-8 38 0l8 43H33Z"
              fill={resolvedAppearance.clothingColor}
              stroke="white"
              strokeWidth="2.5"
            />
            <path d="M51 78h18l-9 12Z" fill={resolvedAppearance.accentColor} />
          </g>

          {/* Neck */}
          <rect
            x="53"
            y="62"
            width="14"
            height="18"
            rx="6"
            fill={resolvedAppearance.skinTone}
          />

          {/* Head Group with procedural tilt and breathing */}
          <g
            style={{
              transformOrigin: '60px 65px',
              transform: `rotate(${headTilt}deg) translate(0px, ${isTalking ? Math.sin(t * 12) * 1.5 : 0}px)`,
            }}
          >
            {/* Head Base */}
            <ellipse
              cx="60"
              cy="46"
              rx="28"
              ry="30"
              fill={resolvedAppearance.skinTone}
            />

            {/* Hair with responsive sway */}
            <Hair appearance={resolvedAppearance} sway={hairSway} />

            {/* Eyes (Blinking & Expressions) */}
            {isBlinking ? (
              <g stroke="#151219" strokeWidth="2.5" strokeLinecap="round">
                <path d="M46 48h7" />
                <path d="M67 48h7" />
              </g>
            ) : expression === 'winking' ? (
              <g>
                <ellipse cx="49" cy="48" rx="3.5" ry="4.5" fill="#151219" />
                <circle cx="50" cy="47" r="1" fill="white" />
                <path d="M67 48h7" stroke="#151219" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <ellipse cx="49" cy="48" rx="3.5" ry="4.5" fill="#151219" />
                <ellipse cx="71" cy="48" rx="3.5" ry="4.5" fill="#151219" />
                <circle cx="50" cy="47" r="1" fill="white" />
                <circle cx="72" cy="47" r="1" fill="white" />
              </g>
            )}

            {/* Eyebrows */}
            <g
              fill="none"
              stroke={resolvedAppearance.hairColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path
                d={
                  expression === 'surprised'
                    ? 'M43 38c4-5 8-5 12-2'
                    : 'M43 41c4-3 8-3 12-1'
                }
              />
              <path
                d={
                  expression === 'surprised'
                    ? 'M65 36c4-3 8-3 12 2'
                    : 'M65 40c4-2 8-2 12 1'
                }
              />
            </g>

            {/* Rosy Cheeks */}
            <circle cx="39" cy="57" r="4" fill="#e98780" opacity="0.45" />
            <circle cx="81" cy="57" r="4" fill="#e98780" opacity="0.45" />

            {/* Procedural Talking Mouth */}
            {mouthOpening > 1.5 ? (
              <g>
                <ellipse
                  cx="60"
                  cy={59 + mouthOpening * 0.3}
                  rx={6 + mouthOpening * 0.5}
                  ry={2 + mouthOpening * 0.8}
                  fill="#5c1a24"
                  stroke="#7c2837"
                  strokeWidth="1.5"
                />
                {mouthOpening > 4 && (
                  <path
                    d={`M${56 - mouthOpening * 0.2} ${58} h${8 + mouthOpening * 0.4}`}
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
                {mouthOpening > 5 && (
                  <ellipse
                    cx="60"
                    cy={60 + mouthOpening * 0.6}
                    rx="3.5"
                    ry="2"
                    fill="#e06377"
                  />
                )}
              </g>
            ) : expression === 'happy' ? (
              <path
                d="M51 58c5 6 13 6 18 0"
                fill="none"
                stroke="#7c2837"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M53 59h14"
                fill="none"
                stroke="#7c2837"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Accessories */}
            <Accessory appearance={resolvedAppearance} />
          </g>
        </g>
      </svg>

      {showName && (
        <div className="absolute -bottom-2 flex items-center gap-1.5 z-20">
          <span className="bg-white text-[#1a0b2e] border border-black/10 rounded-full px-3 py-1 text-xs font-extrabold shadow-md">
            {character}
          </span>
          <button
            id={`edit-rig-btn-${character.toLowerCase()}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openCustomizer(character);
            }}
            className="bg-[#ff9900] border-2 border-white text-white text-[10px] font-extrabold rounded-full px-2.5 py-1 shadow-lg hover:bg-[#e68700] transition-colors"
            aria-label={`Customize ${character}`}
          >
            Edit Rig
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ToonCharacter;
