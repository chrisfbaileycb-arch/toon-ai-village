import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Download,
  Film,
  Globe,
  Image,
  Linkedin,
  Lock,
  Package,
  Share2,
  Smartphone,
  Twitter,
  Youtube,
  X,
  Zap,
} from 'lucide-react';
import {
  RenderJob,
  DeliveryOption,
  deliveryOptions,
  formatDuration,
} from '../lib/workflowEngine';
import { updateProjectWorkflowState } from '../lib/projectService';
import UpgradeModal from './UpgradeModal';

interface DeliveryModalProps {
  renderJob: RenderJob;
  projectName: string;
  projectId?: string;
  onClose: () => void;
  onDelivered?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  youtube: Youtube,
  globe: Globe,
  image: Image,
};

// First delivery option is always free; the rest require Pro.
const FREE_IDX = 0;

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  renderJob,
  projectName,
  projectId,
  onClose,
  onDelivered,
}) => {
  const isPro = useMemo(() => {
    try { return localStorage.getItem('toonmark_v1_pro') === '1'; } catch { return false; }
  }, []);

  const [selectedOption, setSelectedOption] = useState<DeliveryOption>(deliveryOptions[FREE_IDX]);
  const [delivered, setDelivered] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Just created a cartoon marketing reel for \"${projectName}\" with ToneMark AI Animation Studio 🎬✨`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleDeliver = async () => {
    setDelivered(true);
    if (projectId) {
      try {
        await updateProjectWorkflowState(
          projectId,
          'delivery_ready',
          100,
          `Delivered animation package as ${selectedOption.format} (${selectedOption.resolution})`,
          renderJob
        );
      } catch (err) {
        console.warn('Delivery state update error:', err);
      }
    }
    if (onDelivered) onDelivered();
  };

  const handleOptionSelect = (opt: DeliveryOption, idx: number) => {
    if (!isPro && idx > FREE_IDX) {
      setShowUpgrade(true);
      return;
    }
    setSelectedOption(opt);
  };

  const handleUpgraded = () => {
    // isPro is now set in localStorage — user needs to re-open to reflect,
    // but we can just show all options without reload by re-checking.
    window.location.reload();
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ToneMark Reel', text: shareText, url: shareUrl });
      } catch {}
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onUpgraded={handleUpgraded}
        />
      )}

      <div
        id="delivery-export-modal"
        className="fixed inset-0 z-50 bg-[#120820]/80 backdrop-blur-sm p-4 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onClose();
        }}
      >
        <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-[#2a1b4e]">
          {/* Header */}
          <div className="bg-[#1a0b2e] px-6 py-5 md:px-8 flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-[#ff9900]">
                <Package className="w-5 h-5" aria-hidden="true" />
                <h2
                  id="delivery-modal-title"
                  className="font-bold uppercase tracking-[0.16em] text-xs"
                >
                  Delivery &amp; Export Package
                </h2>
              </div>
              <p className="text-white font-extrabold text-2xl mt-2">{projectName}</p>
              <p className="text-gray-300 text-sm mt-1">
                Duration: {formatDuration(renderJob.duration)} &middot; Format: {renderJob.outputFormat}
              </p>
            </div>
            <button
              id="close-delivery-modal-btn"
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              aria-label="Close delivery modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Channel selector */}
            <div>
              <h3 className="text-gray-900 font-extrabold text-base mb-1">
                Select Output Channel &amp; Platform Target
              </h3>
              <p className="text-gray-500 text-sm">
                Your cartoon scenes and character rigs are optimized for instantaneous deployment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {deliveryOptions.map((opt, idx) => {
                const Icon = iconMap[opt.icon] || Film;
                const isSelected = selectedOption.id === opt.id;
                const locked = !isPro && idx > FREE_IDX;
                return (
                  <button
                    key={opt.id}
                    id={`delivery-opt-${opt.id}`}
                    type="button"
                    onClick={() => handleOptionSelect(opt, idx)}
                    className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer relative overflow-hidden ${
                      locked
                        ? 'border-gray-200 bg-gray-50/50 opacity-80'
                        : isSelected
                        ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {locked && (
                      <div className="absolute top-2 right-2 p-1 rounded-md bg-amber-100 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-600" />
                      </div>
                    )}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        locked
                          ? 'bg-gray-200 text-gray-400'
                          : isSelected
                          ? 'bg-[#ff9900] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                      <span className="inline-block mt-2 font-mono text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold">
                        {opt.resolution} &middot; {opt.format}
                      </span>
                      {locked && (
                        <span className="inline-flex items-center gap-1 ml-2 mt-2 font-mono text-[10px] bg-amber-100 border border-amber-200 px-2 py-0.5 rounded text-amber-700 font-bold">
                          <Zap className="w-2.5 h-2.5" /> Pro
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Upgrade banner for free users */}
            {!isPro && (
              <button
                type="button"
                onClick={() => setShowUpgrade(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600/10 to-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900">Unlock 4K watermark-free exports</p>
                  <p className="text-xs text-gray-500 mt-0.5">ToneMark Pro · $19/mo · Unlimited reels &amp; all voices</p>
                </div>
                <span className="text-xs font-black text-amber-600 group-hover:text-amber-700 whitespace-nowrap">Upgrade &rarr;</span>
              </button>
            )}

            {/* Delivered success + share row */}
            {delivered && (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Export package delivered as{' '}
                    <strong>{selectedOption.format} ({selectedOption.resolution})</strong>.
                    {!isPro && ' Free tier — watermark applied.'}
                  </span>
                </div>

                {/* Social share */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Share your reel</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={shareToTwitter}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      <span>Post on X</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareToLinkedIn}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a66c2] text-white text-xs font-bold hover:bg-[#0958a8] transition"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>Share on LinkedIn</span>
                    </button>
                    {hasNativeShare && (
                      <button
                        type="button"
                        onClick={nativeShare}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy link'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <button
                id="cancel-delivery-btn"
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>

              {!isPro && !delivered ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeliver}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-bold text-xs hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download (watermarked)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpgrade(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Get 4K Pro Export</span>
                  </button>
                </div>
              ) : (
                <button
                  id="confirm-deliver-btn"
                  type="button"
                  onClick={handleDeliver}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-extrabold text-xs shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{delivered ? 'Export Another Copy' : 'Download Animation Package'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryModal;
