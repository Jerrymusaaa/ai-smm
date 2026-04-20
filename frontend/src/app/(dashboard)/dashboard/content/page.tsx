'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Settings2, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PlatformSelector, PLATFORMS } from '@/components/content/PlatformSelector';
import { MediaUpload } from '@/components/content/MediaUpload';
import { CaptionVariants } from '@/components/content/CaptionVariants';
import { PostPreview } from '@/components/content/PostPreview';
import { HashtagSuggestions } from '@/components/content/HashtagSuggestions';
import { ToneSelector } from '@/components/content/ToneSelector';

const HASHTAG_GROUPS = [
  {
    label: 'Trending now',
    color: '#FF6B35',
    tags: [
      { tag: '#AIMarketing', volume: '2.4M', trending: true },
      { tag: '#SocialMediaTips', volume: '8.1M', trending: true },
      { tag: '#ContentCreator', volume: '45M', trending: true },
      { tag: '#DigitalMarketing', volume: '32M', trending: false },
    ],
  },
  {
    label: 'Your niche',
    color: '#0066FF',
    tags: [
      { tag: '#MarketingAutomation', volume: '1.2M', trending: false },
      { tag: '#GrowthHacking', volume: '3.8M', trending: true },
      { tag: '#StartupMarketing', volume: '890K', trending: false },
      { tag: '#B2BMarketing', volume: '4.2M', trending: false },
      { tag: '#BrandStrategy', volume: '2.1M', trending: false },
    ],
  },
  {
    label: 'High engagement',
    color: '#00D4AA',
    tags: [
      { tag: '#Entrepreneur', volume: '89M', trending: false },
      { tag: '#BusinessTips', volume: '22M', trending: false },
      { tag: '#Success', volume: '120M', trending: false },
      { tag: '#Innovation', volume: '15M', trending: true },
    ],
  },
];

const MOCK_CAPTIONS = (platforms: string[], tone: string, prompt: string) =>
  platforms.slice(0, 4).map(pid => {
    const p = PLATFORMS.find(x => x.id === pid)!;
    const captions: Record<string, string> = {
      instagram: `${prompt ? `${prompt}\n\n` : ''}✨ Elevating your social media game with AI-powered precision. Every post, every platform, every time — optimized for maximum impact.\n\nOur users see an average 340% engagement increase. Ready to join them?`,
      tiktok: `POV: Your AI just wrote better captions than your entire marketing team 😭✨ ${prompt || 'This is the future of content creation and it\'s wild'}`,
      linkedin: `${prompt ? `${prompt}\n\n` : ''}Excited to share a milestone: after implementing AI-driven content strategy, our clients are seeing unprecedented engagement growth.\n\nKey findings from our latest data:\n→ 340% average engagement increase\n→ 85% reduction in content creation time\n→ 6.2x average campaign ROI\n\nThe future of social media management is here.`,
      twitter: `${prompt || 'The future of social media is AI-first.'} And the results speak for themselves 📊 +340% engagement. Zero extra effort. Thread below 👇`,
      facebook: `${prompt ? `${prompt}\n\n` : ''}We're revolutionizing how businesses manage their social media presence. AI-powered tools that work around the clock, so you don't have to.\n\nJoin 18,000+ teams already growing faster with Yoyzie AI.`,
      threads: `${prompt || 'Hot take: most brands spend 80% of their time on content creation and 20% on strategy.'} It should be the other way around. That's what we're fixing ✨`,
      youtube: `${prompt ? `${prompt}\n\n` : ''}In this video, we're diving deep into how AI is transforming social media management. From automated content creation to intelligent scheduling and real-time analytics — we'll show you exactly how to 10x your social media performance.`,
      pinterest: `${prompt ? `${prompt} | ` : ''}AI-Powered Social Media Tips & Strategies | Digital Marketing Tools | Content Creation Automation`,
    };
    return {
      id: `${pid}-${Date.now()}`,
      platform: p.label,
      platformColor: p.color,
      platformInitial: p.initial,
      caption: captions[pid] || captions.instagram,
      hashtags: ['#AIMarketing', '#SocialMediaTips', '#ContentCreator', '#DigitalMarketing', '#GrowthHacking'].slice(0, 5),
      tone: tone.charAt(0).toUpperCase() + tone.slice(1),
      charCount: (captions[pid] || '').length,
      score: Math.floor(72 + Math.random() * 26),
    };
  });

export default function ContentStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok', 'linkedin', 'twitter']);
  const [tone, setTone] = useState('casual');
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['#AIMarketing', '#SocialMediaTips']);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [postCount, setPostCount] = useState(1);

  const generate = async () => {
    if (selectedPlatforms.length === 0) return;
    setLoading(true);
    setVariants([]);
    await new Promise(r => setTimeout(r, 2000));
    setVariants(MOCK_CAPTIONS(selectedPlatforms, tone, prompt));
    setLoading(false);
  };

  const regenerateOne = async (id: string) => {
    setVariants(prev => prev.map(v =>
      v.id === id
        ? { ...v, caption: v.caption + ' [Regenerated]', score: Math.floor(72 + Math.random() * 26) }
        : v
    ));
  };

  const handleSchedule = (variant: any) => {
    alert(`Sending "${variant.platform}" post to scheduler...`);
  };

  const previewCaption = variants[0]?.caption || '';
  const previewMedia = mediaFiles[0]?.preview;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl sm:text-3xl font-bold text-white">
            Content Studio
          </h1>
          <p className="text-white/40 text-sm mt-1">
            AI-powered captions optimized for each platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#0066FF]/20">
            <Zap className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs text-white/60">
              <span className="text-[#0066FF] font-medium">247</span> captions generated today
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left panel: Input */}
        <div className="xl:col-span-2 space-y-5">

          {/* Prompt input */}
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <label className="text-sm font-medium text-white/70 block mb-3">
              What are you posting about?
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your post, product, announcement, or just give a topic... e.g. 'We just launched a new AI feature that automatically schedules posts at peak engagement times'"
                rows={4}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#0066FF]/40 focus:bg-white/[0.06] transition-all resize-none leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-xs text-white/20">
                {prompt.length} chars
              </div>
            </div>

            {/* Quick prompt chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                'Product launch announcement',
                'Behind the scenes',
                'Customer success story',
                'Tips & tricks thread',
                'Company milestone',
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => setPrompt(chip)}
                  className="px-3 py-1.5 rounded-full text-xs border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Platform selector */}
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <PlatformSelector
              selected={selectedPlatforms}
              onChange={setSelectedPlatforms}
            />
          </div>

          {/* Tone */}
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          {/* Advanced options */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Advanced options
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="px-5 pb-5 space-y-5 border-t border-white/[0.06]">
                <div className="pt-4">
                  <MediaUpload files={mediaFiles} onChange={setMediaFiles} />
                </div>

                {/* Variants count */}
                <div>
                  <label className="text-sm font-medium text-white/70 block mb-3">
                    Variants per platform: <span className="text-[#0066FF]">{postCount}</span>
                  </label>
                  <input
                    type="range" min={1} max={5} value={postCount}
                    onChange={e => setPostCount(Number(e.target.value))}
                    className="w-full accent-[#0066FF]"
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>1 variant</span>
                    <span>5 variants</span>
                  </div>
                </div>

                {/* Hashtags */}
                <HashtagSuggestions
                  selected={selectedHashtags}
                  onChange={setSelectedHashtags}
                  groups={HASHTAG_GROUPS}
                />
              </div>
            )}
          </div>

          {/* Generate button */}
          <Button
            size="xl"
            onClick={generate}
            loading={loading}
            disabled={selectedPlatforms.length === 0}
            className="w-full rounded-2xl gap-2 glow-blue"
          >
            {!loading && (
              <>
                <Sparkles className="w-5 h-5" />
                Generate captions for {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>

        {/* Right panel: Results + Preview */}
        <div className="xl:col-span-1 space-y-5">

          {/* Post preview */}
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <PostPreview
              caption={previewCaption}
              hashtags={selectedHashtags}
              mediaUrl={previewMedia}
            />
          </div>

          {/* AI tip */}
          <div className="rounded-2xl border border-[#00D4AA]/20 p-4"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,102,255,0.04))' }}>
            <div className="flex items-start gap-3">
              <Wand2 className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-white/70 mb-1">AI tip</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Posts with 3–5 hashtags get 18% more reach on Instagram. TikTok performs best with trending sounds and 3–4 niche hashtags.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated variants */}
      {(variants.length > 0 || loading) && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white">
              Generated captions
            </h2>
            {variants.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/20">
                {variants.length} variants ready
              </span>
            )}
          </div>
          <CaptionVariants
            variants={variants}
            loading={loading}
            onRegenerate={regenerateOne}
            onSchedule={handleSchedule}
          />
        </div>
      )}
    </div>
  );
}
