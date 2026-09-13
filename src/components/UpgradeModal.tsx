import React, { useState } from 'react';
import { X, Zap, Crown, Building2, Check, Film } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgraded?: () => void;
}

interface Tier {
  id: 'free' | 'pro' | 'agency';
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  icon: React.ElementType;
  features: string[];
  cta: string;
  current?: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    highlight: false,
    icon: Film,
    current: true,
    cta: 'Current Plan',
    features: [
      '1 reel per month',
      '480p watermarked export',
      '7 cartoon mascot archetypes',
      '30-second reels only',
      'Standard voice personas',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: 'per month',
    highlight: true,
    icon: Zap,
    cta: 'Upgrade to Pro',
    features: [
      'Unlimited reels',
      '4K watermark-free export',
      'All cartoon styles & mascots',
      '30 / 60 / 90-second reels',
      'All 6 voice personas',
      'Firebase cloud save',
      'HitPaw AI toolkit access',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$49',
    period: 'per month',
    highlight: false,
    icon: Building2,
    cta: 'Go Agency',
    features: [
      'Everything in Pro',
      'Up to 10 client workspaces',
      'White-label exports',
      'Priority Gemini API access',
      'Custom mascot commissions',
      'Dedicated Slack support',
    ],
  },
];

export default function UpgradeModal({ onClose, onUpgraded }: UpgradeModalProps) {
  const [upgrading, setUpgrading] = useState<'pro' | 'agency' | null>(null);
  const [done, setDone] = useState(false);

  const handleUpgrade = (tier: 'pro' | 'agency') => {
    setUpgrading(tier);
    setTimeout(() => {
      try { localStorage.setItem('toonmark_v1_pro', '1'); } catch {}
      setDone(true);
      setUpgrading(null);
      setTimeout(() => {
        if (onUpgraded) onUpgraded();
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#070111]/90 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div className="w-full max-w-3xl bg-[#120521] rounded-3xl border border-purple-800/60 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-[#1d0a36] to-[#0f0522] border-b border-purple-800/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="upgrade-modal-title" className="text-lg font-black text-white">
                Unlock the full <span className="text-amber-400">ToneMark</span> studio
              </h2>
              <p className="text-xs text-purple-300 mt-0.5">
                4K exports, unlimited reels, all voices — no watermark.
              </p>
            </div>
          </div>
        </div>

        {/* Tier cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`flex flex-col rounded-2xl p-5 border transition ${
                  tier.highlight
                    ? 'border-amber-500 bg-gradient-to-b from-amber-500/10 to-purple-900/20 shadow-xl shadow-amber-500/10'
                    : 'border-purple-800/40 bg-[#1a0a2e]'
                }`}
              >
                {tier.highlight && (
                  <span className="self-start mb-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    tier.highlight ? 'bg-amber-500 text-slate-950' : 'bg-purple-900/60 text-purple-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{tier.name}</div>
                    <div className="text-[10px] text-purple-400">{tier.current ? 'your plan' : ''}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-purple-400 ml-1">{tier.period}</span>
                </div>

                <ul className="space-y-1.5 flex-1 mb-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2 text-xs text-purple-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (tier.id === 'free' || tier.current) return;
                    handleUpgrade(tier.id as 'pro' | 'agency');
                  }}
                  disabled={!!tier.current || upgrading !== null}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition ${
                    tier.current
                      ? 'bg-purple-900/40 text-purple-400 cursor-default'
                      : tier.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
                      : 'bg-purple-800/50 hover:bg-purple-700/60 text-purple-100 border border-purple-700/50'
                  }`}
                >
                  {upgrading === tier.id ? 'Activating…' : done && tier.id === 'pro' ? '✓ Activated!' : tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-5 text-center text-[11px] text-purple-500">
          Stripe billing coming soon · Upgrade activates instantly for preview
        </div>
      </div>
    </div>
  );
}
