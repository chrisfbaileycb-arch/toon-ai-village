import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ToonCustomizationState {
  characterName: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  clothingColor: string;
  accentColor: string;
  accessory: string;
  expression: 'happy' | 'talking' | 'surprised' | 'serious' | 'winking';
  mouthShape: 'closed' | 'open' | 'wide' | 'round' | 'smile';
}

interface ToonCustomizationContextValue {
  customization: ToonCustomizationState;
  updateCustomization: (patch: Partial<ToonCustomizationState>) => void;
  resetCustomization: () => void;
  setCharacterName: (name: string) => void;
}

const defaultCustomization: ToonCustomizationState = {
  characterName: 'Ava',
  skinTone: '#ffd3b6',
  hairColor: '#4a2c11',
  hairStyle: 'bob',
  clothingColor: '#ff9900',
  accentColor: '#8a2be2',
  accessory: 'none',
  expression: 'happy',
  mouthShape: 'smile',
};

const STORAGE_KEY = 'tonemark_toon_customization_v1';

const ToonCustomizationContext = createContext<ToonCustomizationContextValue | null>(null);

export const ToonCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customization, setCustomization] = useState<ToonCustomizationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultCustomization, ...JSON.parse(saved) } : defaultCustomization;
    } catch {
      return defaultCustomization;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
    } catch {
      // ignore quota errors
    }
  }, [customization]);

  const updateCustomization = (patch: Partial<ToonCustomizationState>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  };

  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  const setCharacterName = (name: string) => {
    setCustomization((prev) => ({ ...prev, characterName: name }));
  };

  return (
    <ToonCustomizationContext.Provider
      value={{
        customization,
        updateCustomization,
        resetCustomization,
        setCharacterName,
      }}
    >
      {children}
    </ToonCustomizationContext.Provider>
  );
};

export const useToonCustomization = (): ToonCustomizationContextValue => {
  const context = useContext(ToonCustomizationContext);
  if (!context) {
    throw new Error('useToonCustomization must be used within a ToonCustomizationProvider');
  }
  return context;
};

export default ToonCustomizationContext;
