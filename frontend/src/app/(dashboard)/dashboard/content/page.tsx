'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Settings2, ChevronDown, ChevronUp, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PlatformSelector, PLATFORMS } from '@/components/content/PlatformSelector';
import { MediaUpload } from '@/components/content/MediaUpload';
import { CaptionVariants } from '@/components/content/CaptionVariants';
import { PostPreview } from '@/components/content/PostPreview';
import { HashtagSuggestions } from '@/components/content/HashtagSuggestions';
import { ToneSelector } from '@/components/content/ToneSelector';
import api from '@/lib/api';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchCaption(params: {
  platform: string; topic: string; tone: string;
  includeHashtags: boolean; includeEmojis: boolean; language: string;
}): Promise<string> {
  const res = await api.instance.post('/api/ai/caption', params);
  return res.data?.data?.caption || '';
}

async function fetchHashtags(topic: string, platform: string): Promise<string[]> {
  const res = await api.instance.post('/api/ai/hashtags', {
    topic,
    platform,
    includeKenyan: true,
  });
  return res.data?.data?.hashtags || [];
}

async function fetchTrends(platform: string): Promise<any> {
  const res = await api.instance.get(`/api/ai/trends?platform=${platform}`);
  return res.data?.data || {};
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ContentStudioPage() {
  const [prompt, setPrompt]                   = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok', 'linkedin', 'twitter']);
  const [tone, setTone]                       = useState('casual');
  const [mediaFiles, setMediaFiles]           = useState<any[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [variants, setVariants]               = useState<any[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [hashtagLoading, setHashtagLoading]   = useState(false);
  const [trendLoading, setTrendLoading]       = useState(false);
  const [showAdvanced, setShowAdvanced]       = useState(false);
  const [language, setLanguage]               = useState('english');
  const [includeEmojis, setIncludeEmojis]     = useState(true);
  const [activePreview, setActivePreview]     = useState(0);
  const [error, setError]                     = useState('');

  // AI-generated hashtag groups (replaces static HASHTAG_GROUPS)
  const [hashtagGroups, setHashtagGroups] = useState([
    {
      label: 'Trending in Kenya',
      color: '#C9A84C',
      tags: [
        { tag: '#NairobiTwitter', volume: '45K', trending: true },
        { tag: '#KenyaTwitter', volume: '120K', trending: true },
        { tag: '#MadeInKenya', volume: '38K', trending: false },
        { tag: '#KenyanContent', volume: '22K', trending: true },
      ],
    },
    {
      label: 'Your niche',
      color: '#E8C96A',
      tags: [
        { tag: '#ContentCreator', volume: '45M', trending: true },
        { tag: '#DigitalMarketing', volume: '32M', trending: false },
        { tag: '#SocialMediaTips', volume: '8.1M', trending: true },
        { tag: '#MarketingKenya', volume: '2.1M', trending: false },
      ],
    },
  ]);

  // ── Generate captions via Claude ────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you want to post about');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setError('');
    setLoading(true);
    setVariants([]);

    try {
      // Generate captions for all selected platforms in parallel
      const results = await Promise.all(
        selectedPlatforms.map(async (platformId) => {
          const platform = PLATFORMS.find(p => p.id === platformId);
          if (!platform) return null;

          const caption = await fetchCaption({
            platform: platform.label,
            topic: prompt,
            tone,
            includeHashtags: false, // we handle hashtags separately
            includeEmojis,
            language,
          });

          return {
            id: `${platformId}-${Date.now()}`,
            platform: platform.label,
            platformColor: platform.color,
            platformInitial: platform.initial,
            caption,
            hashtags: selectedHashtags.slice(0, 5),
            tone: tone.charAt(0).toUpperCase() + tone.slice(1),
            charCount: caption.length,
            score: Math.floor(72 + Math.random() * 26), // scoring is cosmetic for now
          };
        })
      );

      setVariants(results.filter(Boolean));

      // Auto-fetch hashtags if none selected
      if (selectedHashtags.length === 0) {
        handleRefreshHashtags();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate captions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Refresh hashtags via Claude ─────────────────────────────────────────────
  const handleRefreshHashtags = async () => {
    if (!prompt.trim() && selectedPlatforms.length === 0) return;
    setHashtagLoading(true);
    try {
      const platform = PLATFORMS.find(p => p.id === selectedPlatforms[0])?.label || 'instagram';
      const tags = await fetchHashtags(prompt || 'social media content', platform);

      // Split into two groups: first 8 Kenyan-style, rest as niche
      const kenyanTags = tags.slice(0, 7).map(t => ({ tag: t, volume: '', trending: true }));
      const nicheTags = tags.slice(7).map(t => ({ tag: t, volume: '', trending: false }));

      setHashtagGroups([
        { label: 'AI suggested for your topic', color: '#C9A84C', tags: kenyanTags },
        { label: 'Additional tags', color: '#E8C96A', tags: nicheTags },
      ]);
    } catch {
      // keep existing hashtags on error
    } finally {
      setHashtagLoading(false);
    }
  };

  // ── Fetch Kenyan trends ─────────────────────────────────────────────────────
  const handleGetTrends = async () => {
    setTrendLoading(true);
    try {
      const platform = PLATFORMS.find(p => p.id === selectedPlatforms[0])?.label || 'instagram';
      const trends = await fetchTrends(platform.toLowerCase());

      if (trends.hashtags?.length) {
        setHashtagGroups([
          {
            label: `Trending on ${platform} in Kenya`,
            color: '#C9A84C',
            tags: trends.hashtags.slice(0, 8).map((t: string) => ({ tag: t, volume: '', trending: true })),
          },
          {
            label: 'Suggested topics',
            color: '#E8C96A',
            tags: (trends.topics || []).slice(0, 4).map((t: string) => ({ tag: t, volume: '', trending: false })),
          },
        ]);
      }

      if (trends.bestTimes?.length) {
        // Could surface best times somewhere in the UI
      }
    } catch {
      // keep existing
    } finally {
      setTrendLoading(false);
    }
  };

  // ── Regenerate single caption ───────────────────────────────────────────────
  const handleRegenerateCaption = async (index: number) => {
    const variant = variants[index];
    if (!variant) return;

    const platform = PLATFORMS.find(p => p.label === variant.platform);
    if (!platform) return;

    try {
      const caption = await fetchCaption({
        platform: variant.platform,
        topic: prompt,
        tone,
        includeHashtags: false,
        includeEmojis,
        language,
      });

      setVariants(prev => prev.map((v, i) => i === index ? { ...v, caption, charCount: caption.length } : v));
    } catch {
      // keep existing
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Content Studio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            AI-powered content creation for all your platforms
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
          style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.15)' }}>
          <Zap className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
          <span className="text-xs font-medium" style={{ color: '#E8C96A' }}>
            Powered by Claude
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column — inputs */}
        <div className="xl:col-span-2 space-y-5">

          {/* Platform selector */}
          <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}
              className="text-sm font-bold text-white mb-4">
              Select platforms
            </h3>
            <PlatformSelector
              selected={selectedPlatforms}
              onChange={setSelectedPlatforms}
            />
          </div>

          {/* Prompt input */}
          <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontFamily: 'var(--font-display)' }}
                className="text-sm font-bold text-white">
                What do you want to post about?
              </h3>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {prompt.length}/500
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value.slice(0, 500))}
              placeholder="e.g. Launching our new Nairobi store this Saturday, special opening discounts, exciting new product range..."
              rows={4}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm text-white outline-none border transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(201,168,76,0.15)',
              }}
            />

            {error && (
              <p className="mt-2 text-xs" style={{ color: '#EF4444' }}>{error}</p>
            )}

            {/* Tone selector */}
            <div className="mt-4">
              <ToneSelector selected={tone} onChange={setTone} />
            </div>

            {/* Advanced options */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 mt-4 text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Settings2 className="w-3.5 h-3.5" />
              Advanced options
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Language */}
                <div>
                  <label className="text-xs block mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Language
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: 'english', label: 'English' },
                      { id: 'swahili', label: 'Swahili' },
                      { id: 'sheng', label: 'Sheng' },
                    ].map(lang => (
                      <button key={lang.id} onClick={() => setLanguage(lang.id)}
                        className="px-3 py-1.5 rounded-xl text-xs border transition-all"
                        style={{
                          borderColor: language === lang.id ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
                          background: language === lang.id ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.02)',
                          color: language === lang.id ? '#E8C96A' : 'rgba(255,255,255,0.5)',
                        }}>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emojis toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white">Include emojis</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Add relevant emojis to your captions
                    </p>
                  </div>
                  <button
                    onClick={() => setIncludeEmojis(!includeEmojis)}
                    className="w-10 h-6 rounded-full transition-all relative flex-shrink-0"
                    style={{ background: includeEmojis ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'rgba(255,255,255,0.1)' }}>
                    <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                      style={{ left: includeEmojis ? '22px' : '4px' }} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Media upload */}
          <div className="glass rounded-2xl border p-5" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}
              className="text-sm font-bold text-white mb-4">
              Media (optional)
            </h3>
            <MediaUpload files={mediaFiles} onChange={setMediaFiles} />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold transition-all disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg,#C9A84C,#E8C96A)',
              color: '#0A0A0A',
              boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
            }}>
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating {selectedPlatforms.length} caption{selectedPlatforms.length !== 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate AI captions
              </>
            )}
          </button>

          {/* Caption variants */}
          {variants.length > 0 && (
            <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
                  Generated captions
                </h3>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40"
                  style={{ color: '#C9A84C' }}>
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate all
                </button>
              </div>
              <CaptionVariants
                variants={variants}
                selectedHashtags={selectedHashtags}
                onRegenerateCaption={handleRegenerateCaption}
              />
            </div>
          )}
        </div>

        {/* Right column — preview and hashtags */}
        <div className="space-y-5">
          {/* Post preview */}
          {variants.length > 0 && (
            <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-white">
                  Preview
                </h3>
                {variants.length > 1 && (
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {variants.map((v, i) => (
                      <button key={v.id} onClick={() => setActivePreview(i)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all"
                        style={{
                          borderColor: activePreview === i ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)',
                          background: activePreview === i ? 'rgba(201,168,76,0.1)' : 'transparent',
                          color: activePreview === i ? '#E8C96A' : 'rgba(255,255,255,0.4)',
                        }}>
                        {v.platform}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                {variants[activePreview] && (
                  <PostPreview variant={variants[activePreview]} />
                )}
              </div>
            </div>
          )}

          {/* Hashtags */}
          <div className="glass rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-white">
                Hashtags
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleGetTrends}
                  disabled={trendLoading}
                  className="text-xs transition-colors disabled:opacity-40 flex items-center gap-1"
                  style={{ color: '#C9A84C' }}>
                  {trendLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  🇰🇪 KE trends
                </button>
                <button
                  onClick={handleRefreshHashtags}
                  disabled={hashtagLoading}
                  className="text-xs transition-colors disabled:opacity-40 flex items-center gap-1"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {hashtagLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Refresh
                </button>
              </div>
            </div>
            <div className="p-4">
              <HashtagSuggestions
                groups={hashtagGroups}
                selected={selectedHashtags}
                onChange={setSelectedHashtags}
              />
              {selectedHashtags.length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Selected ({selectedHashtags.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHashtags.map(tag => (
                      <span key={tag}
                        className="text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all"
                        style={{ background: 'rgba(201,168,76,0.15)', color: '#E8C96A' }}
                        onClick={() => setSelectedHashtags(prev => prev.filter(t => t !== tag))}>
                        {tag} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kenyan timing tip */}
          <div className="rounded-2xl border p-4"
            style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-xs font-semibold" style={{ color: '#E8C96A' }}>
                Best times for Kenyan audience
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                { platform: 'Instagram', time: '7am – 9am & 7pm – 9pm EAT' },
                { platform: 'TikTok', time: '6pm – 10pm EAT' },
                { platform: 'Twitter/X', time: '8am – 10am & 12pm – 1pm EAT' },
                { platform: 'LinkedIn', time: 'Tue–Thu, 8am – 10am EAT' },
              ].map(item => (
                <div key={item.platform} className="flex justify-between text-[10px]">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.platform}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
