import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clapperboard,
  Clock3,
  LayoutTemplate,
  Layers3,
  Sparkles,
  Target,
  Youtube,
  Zap,
  Volume2,
  Scissors,
  Smile,
  Wand2,
  Tv,
  Smartphone,
  Square,
  ShieldCheck,
} from 'lucide-react';
import {
  HitPawAspectRatio,
  HitPawFormSettings,
  defaultHitPawSettings,
} from '../types';

export type OnboardingDuration = '30 sec' | '60 sec' | '90 sec' | '3 min max';

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

interface Choice {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tag?: string;
}

const durationChoices: Array<{
  value: OnboardingDuration;
  title: string;
  description: string;
}> = [
  { value: '30 sec', title: '30 seconds', description: 'Quick animated social content.' },
  { value: '60 sec', title: '60 seconds', description: 'Explainers and focused stories.' },
  { value: '90 sec', title: '90 seconds', description: 'Detailed campaign animations.' },
  { value: '3 min max', title: 'Up to 3 minutes', description: 'Cartoon episodes and YouTube.' },
];

const aspectRatioChoices: Array<{
  value: HitPawAspectRatio;
  title: string;
  platform: string;
  icon: React.ElementType;
}> = [
  { value: '16:9', title: 'Landscape (16:9)', platform: 'YouTube / Web / TV', icon: Tv },
  { value: '9:16', title: 'Vertical (9:16)', platform: 'TikTok / Reels / Shorts', icon: Smartphone },
  { value: '1:1', title: 'Square (1:1)', platform: 'Instagram / Feed Ads', icon: Square },
  { value: '4:5', title: 'Portrait (4:5)', platform: 'Social Posts / Carousel', icon: Smartphone },
];

const templateChoices: Choice[] = [
  {
    id: 'photo_to_video',
    title: 'Photo to Video & Face Animator',
    description: 'Turn still portraits into talking faces or dancing cartoon videos.',
    icon: Wand2,
    tag: 'HitPaw AI',
  },
  {
    id: 'ai_style',
    title: 'AI Video Stylizer',
    description: 'Generate stylized video in 3D Pixar, Ghibli Anime, or Claymation.',
    icon: Sparkles,
    tag: 'HitPaw AI',
  },
  {
    id: 'explainer',
    title: 'Product Explainer',
    description: 'Explain an offer with animated scenes.',
    icon: Clapperboard,
  },
  {
    id: 'social',
    title: 'Social Media Promo',
    description: 'High-energy hook and call to action.',
    icon: Sparkles,
  },
  {
    id: 'story',
    title: 'Character Story',
    description: 'Narrative episode with multiple beats.',
    icon: Layers3,
  },
];

const goalChoices: Choice[] = [
  {
    id: 'youtube',
    title: 'YouTube / Long Form',
    description: '16:9 widescreen broadcast with full subtitles.',
    icon: Youtube,
  },
  {
    id: 'social-channels',
    title: 'TikTok, Shorts, & Reels',
    description: '9:16 vertical fast-paced hook.',
    icon: Target,
  },
  {
    id: 'landing-page',
    title: 'Website & App Demo',
    description: 'Clean showcase of your product.',
    icon: LayoutTemplate,
  },
];

export const FirstProjectOnboarding: React.FC<FirstProjectOnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [duration, setDuration] = useState<OnboardingDuration>('60 sec');
  const [templateId, setTemplateId] = useState('explainer');
  const [exportGoal, setExportGoal] = useState('social-channels');
  const [aspectRatio, setAspectRatio] = useState<HitPawAspectRatio>('9:16');

  const selectedTemplate = useMemo(
    () => templateChoices.find((t) => t.id === templateId) || templateChoices[0],
    [templateId]
  );

  const sceneCount = useMemo(() => {
    switch (duration) {
      case '30 sec':
        return 4;
      case '60 sec':
        return 6;
      case '90 sec':
        return 9;
      case '3 min max':
        return 16;
      default:
        return 6;
    }
  }, [duration]);

  const handleFinish = () => {
    onComplete({
      duration,
      templateId,
      templateTitle: selectedTemplate.title,
      scenes: sceneCount,
      exportGoal,
      hitpawSettings: {
        ...defaultHitPawSettings,
        aspectRatio,
      },
    });
  };

  return (
    <div id="first-project-onboarding" className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#1a0b2e] px-8 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#ff9900]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Production Setup Wizard
              </span>
            </div>
            <h2 className="text-white font-extrabold text-2xl mt-1">
              Step {step} of 4:{' '}
              {step === 1 && 'Target Duration'}
              {step === 2 && 'Video Aspect Ratio'}
              {step === 3 && 'Storyboard Template'}
              {step === 4 && 'Primary Distribution Channel'}
            </h2>
          </div>

          <button
            id="skip-onboarding-btn"
            type="button"
            onClick={onSkip}
            className="text-gray-400 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            Skip Wizard
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex h-1.5 bg-gray-100">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-[#ff9900] to-[#ff5500]' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>

        {/* Wizard Step Content */}
        <div className="p-8 space-y-6">
          {/* STEP 1: DURATION */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Choose the intended runtime of your animated campaign:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {durationChoices.map((c) => {
                  const isSelected = duration === c.value;
                  return (
                    <button
                      key={c.value}
                      id={`onboarding-dur-${c.value.replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setDuration(c.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-lg font-extrabold text-gray-900 block">
                          {c.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {c.description}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#ff9900]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ASPECT RATIO */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Select your video aspect ratio for optimal social media viewing:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {aspectRatioChoices.map((c) => {
                  const isSelected = aspectRatio === c.value;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.value}
                      id={`onboarding-ratio-${c.value.replace(':', '-')}`}
                      type="button"
                      onClick={() => setAspectRatio(c.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition flex items-start gap-4 cursor-pointer ${
                        isSelected
                          ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#ff9900] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-base font-extrabold text-gray-900 block">
                          {c.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          {c.platform}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#ff9900]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: STORYBOARD TEMPLATE */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Choose a narrative template to pre-populate scene beats:
              </p>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {templateChoices.map((c) => {
                  const isSelected = templateId === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      id={`onboarding-tmpl-${c.id}`}
                      type="button"
                      onClick={() => setTemplateId(c.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#ff9900] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-gray-900 block">
                            {c.title}
                          </span>
                          {c.tag && (
                            <span className="bg-orange-100 text-[#ff9900] text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {c.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          {c.description}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#ff9900]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DISTRIBUTION GOAL */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Where will this animation primarily be published?
              </p>
              <div className="grid sm:grid-cols-3 gap-3.5">
                {goalChoices.map((c) => {
                  const isSelected = exportGoal === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      id={`onboarding-goal-${c.id}`}
                      type="button"
                      onClick={() => setExportGoal(c.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between min-h-[130px] cursor-pointer ${
                        isSelected
                          ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#ff9900] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#ff9900]" />}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-gray-900 block">
                          {c.title}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5 block">
                          {c.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Nav Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                id="onboarding-prev-step-btn"
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                id="onboarding-next-step-btn"
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff5500] text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="onboarding-finish-create-btn"
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-xl hover:bg-emerald-600 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Animation Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstProjectOnboarding;
