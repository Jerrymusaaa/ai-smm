'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';

const PREVIEW_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
];

interface PostPreviewProps {
  caption: string;
  hashtags: string[];
  mediaUrl?: string;
}

export function PostPreview({ caption, hashtags, mediaUrl }: PostPreviewProps) {
  const [activePlatform, setActivePlatform] = useState('instagram');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white/70">Preview</label>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
          {PREVIEW_PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activePlatform === p.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phone mockup */}
      <div className="mx-auto max-w-[280px]">
        <div className="rounded-3xl border border-white/[0.1] overflow-hidden"
          style={{ background: '#0D0D0D' }}>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-[10px] text-white/40">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-white/30 relative">
                <div className="absolute inset-0.5 left-0.5 bg-white/50 rounded-sm w-2/3" />
              </div>
            </div>
          </div>

          {/* Instagram preview */}
          {activePlatform === 'instagram' && (
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 px-3 py-2 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E1306C] to-[#F77737] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">your_brand</div>
                  <div className="text-[10px] text-white/40">Sponsored</div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-white/40" />
              </div>

              {/* Image */}
              {mediaUrl ? (
                <img src={mediaUrl} alt="Post" className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-[#C9A84C]/20 to-[#E8C96A]/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🖼</div>
                    <div className="text-xs text-white/30">Your media here</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="px-3 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-white/70" />
                  <MessageCircle className="w-5 h-5 text-white/70" />
                  <Share className="w-5 h-5 text-white/70" />
                  <Bookmark className="w-5 h-5 text-white/70 ml-auto" />
                </div>
                <div className="text-[11px] font-semibold text-white/80 mb-1">1,247 likes</div>
                <div className="text-[11px] text-white/60 leading-relaxed line-clamp-3">
                  <span className="font-semibold text-white mr-1">your_brand</span>
                  {caption || 'Your caption will appear here...'}
                  {hashtags.length > 0 && (
                    <span className="text-[#C9A84C]"> {hashtags.slice(0, 3).join(' ')}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Twitter/X preview */}
          {activePlatform === 'twitter' && (
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-white">Your Brand</span>
                    <span className="text-[10px] text-white/40">@yourbrand · 1m</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed mb-2">
                    {caption || 'Your caption will appear here...'}
                    {hashtags.length > 0 && (
                      <span className="text-[#1DA1F2]"> {hashtags.slice(0, 2).join(' ')}</span>
                    )}
                  </p>
                  {mediaUrl && (
                    <img src={mediaUrl} alt="Post" className="w-full rounded-xl aspect-video object-cover mb-2" />
                  )}
                  <div className="flex items-center gap-4 text-white/30">
                    <div className="flex items-center gap-1 text-[10px]"><MessageCircle className="w-3 h-3" /> 24</div>
                    <div className="flex items-center gap-1 text-[10px]"><Share className="w-3 h-3" /> 142</div>
                    <div className="flex items-center gap-1 text-[10px]"><Heart className="w-3 h-3" /> 891</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn preview */}
          {activePlatform === 'linkedin' && (
            <div className="border-t border-white/[0.06]">
              <div className="flex items-start gap-2.5 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  Y
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Your Brand</div>
                  <div className="text-[10px] text-white/40">Company · 847 followers</div>
                  <div className="text-[10px] text-white/30">1m · 🌐</div>
                </div>
              </div>
              <p className="text-xs text-white/70 px-3 pb-2 leading-relaxed line-clamp-4">
                {caption || 'Your caption will appear here...'}
              </p>
              {hashtags.length > 0 && (
                <p className="text-xs text-[#0A66C2] px-3 pb-2">
                  {hashtags.slice(0, 3).join(' ')}
                </p>
              )}
              {mediaUrl && (
                <img src={mediaUrl} alt="Post" className="w-full aspect-video object-cover" />
              )}
              <div className="flex items-center gap-3 px-3 py-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1 text-[10px] text-white/40"><Heart className="w-3 h-3" /> Like</div>
                <div className="flex items-center gap-1 text-[10px] text-white/40"><MessageCircle className="w-3 h-3" /> Comment</div>
                <div className="flex items-center gap-1 text-[10px] text-white/40"><Share className="w-3 h-3" /> Share</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
