import React, { useState } from 'react';
import { Share2, Copy, Check, Hash, FileSpreadsheet, Download } from 'lucide-react';
import { MarketingReel } from '../types';
import { generateSRT } from '../lib/audioService';

interface MarketingCopyPanelProps {
  reel: MarketingReel;
}

export const MarketingCopyPanel: React.FC<MarketingCopyPanelProps> = ({ reel }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllHashtags = () => {
    const all = (reel.marketingCopy?.hashtags || []).join(' ');
    copyToClipboard('hashtags', all);
  };

  const downloadSRT = () => {
    const srt = generateSRT(reel.scenes);
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reel.title.replace(/\s+/g, '-').toLowerCase()}-subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-orange-400" />
              <span>Social Media & Distribution Marketing Package</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Pre-optimized viral hooks, multi-platform captions, and tags ready to paste into TikTok, Instagram, YouTube, and LinkedIn.
            </p>
          </div>

          <button
            id="download-srt-btn"
            onClick={downloadSRT}
            className="flex items-center space-x-1.5 rounded-xl bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-orange-400" />
            <span>Download .SRT Subtitles</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TikTok & IG Reel Hook */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                TikTok & Instagram Hook
              </span>
              <button
                id="copy-tiktok-hook-btn"
                onClick={() => copyToClipboard('tiktok', reel.marketingCopy?.tiktokHook || '')}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'tiktok' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'tiktok' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-200 font-medium leading-relaxed">
              &quot;{reel.marketingCopy?.tiktokHook}&quot;
            </p>
          </div>

          {/* YouTube Title & SEO */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                YouTube Video Title
              </span>
              <button
                id="copy-yt-title-btn"
                onClick={() => copyToClipboard('yt-title', reel.marketingCopy?.youtubeTitle || '')}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'yt-title' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'yt-title' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-200 font-medium leading-relaxed">
              {reel.marketingCopy?.youtubeTitle}
            </p>
          </div>

          {/* Instagram Post Caption */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Instagram Caption
              </span>
              <button
                id="copy-ig-caption-btn"
                onClick={() => copyToClipboard('ig-caption', reel.marketingCopy?.instagramCaption || '')}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'ig-caption' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'ig-caption' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-sans">
              {reel.marketingCopy?.instagramCaption}
            </p>
          </div>

          {/* LinkedIn Post Copy */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                LinkedIn Post
              </span>
              <button
                id="copy-linkedin-btn"
                onClick={() => copyToClipboard('linkedin', reel.marketingCopy?.linkedinPost || '')}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'linkedin' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-sans">
              {reel.marketingCopy?.linkedinPost}
            </p>
          </div>
        </div>

        {/* Viral Hashtags */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Optimized Viral Hashtags
              </span>
            </div>
            <button
              id="copy-all-hashtags-btn"
              onClick={copyAllHashtags}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
            >
              {copiedKey === 'hashtags' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'hashtags' ? 'Copied All' : 'Copy All'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(reel.marketingCopy?.hashtags || []).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCopyPanel;
