import OpenAI from 'openai';
import { logger } from '../../shared/utils/logger';
import { prisma } from '../../shared/config/database';

// Supports both DeepSeek (cheap, for MVP) and Anthropic (production)
// Switch by setting AI_PROVIDER=deepseek or AI_PROVIDER=anthropic in .env

const isDeepSeek = process.env.AI_PROVIDER === 'deepseek' || !process.env.ANTHROPIC_API_KEY;

const client = isDeepSeek
  ? new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || 'placeholder',
      baseURL: 'https://api.deepseek.com/v1',
    })
  : new OpenAI({
      apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder',
      baseURL: 'https://api.anthropic.com/v1',
    });

const MODEL = isDeepSeek ? 'deepseek-chat' : 'claude-sonnet-4-5';

logger.info(`AI Provider: ${isDeepSeek ? 'DeepSeek' : 'Anthropic'} (${MODEL})`);

const SYSTEM_PROMPT = `You are Yoyzie AI Assistant, the built-in AI for Yoyzie AI — Kenya's leading AI-powered social media management and influencer marketing platform.

You help Kenyan creators, businesses, and influencers with:
- Writing engaging social media captions optimized per platform (Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Facebook)
- Suggesting trending Kenyan hashtags and TikTok/Reels sounds
- Creating content calendars and posting strategies for the Kenyan market
- Analyzing campaign performance and giving actionable advice
- Writing influencer campaign proposals and briefs
- Suggesting best posting times for Kenyan audiences (EAT timezone)
- Helping with English, Swahili, and Sheng content
- Understanding Kenyan culture, local brands, and the digital creator economy

Personality: Friendly, professional, knowledgeable about Kenya's social media scene. Keep responses concise and actionable.`;

async function callAI(messages: Array<{ role: string; content: string }>, systemPrompt?: string, maxTokens = 800): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt || SYSTEM_PROMPT },
        ...messages as any,
      ],
    });
    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    logger.error(`AI call failed (${MODEL}):`, error.message);
    throw new Error(`AI service unavailable: ${error.message}`);
  }
}

export class AIService {
  async chat(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    userContext?: { name?: string; accountType?: string; plan?: string; connectedPlatforms?: string[] };
  }): Promise<string> {
    const { messages, userContext } = params;
    const contextNote = userContext ? `\n\nUser: ${userContext.name || 'Unknown'} | Type: ${userContext.accountType || 'Individual'} | Plan: ${userContext.plan || 'Free'}` : '';
    return callAI(messages, SYSTEM_PROMPT + contextNote);
  }

  async generateCaption(params: {
    platform: string; topic: string; tone: string;
    brandName?: string; includeHashtags?: boolean; includeEmojis?: boolean; language?: string;
    useStyle?: boolean; userId?: string;
  }): Promise<string> {
    const { platform, topic, tone, brandName, includeHashtags, includeEmojis, language } = params;

    // Style personalisation: inject the user's learned voice if available
    let styleBlock = '';
    if (params.useStyle && params.userId) {
      const memory = await prisma.aIMemory.findUnique({ where: { userId: params.userId } }).catch(() => null);
      if (memory?.captionStyle) {
        try {
          const style = JSON.parse(memory.captionStyle);
          if (style?.summary) {
            styleBlock = `\nWrite in THIS user's authentic voice: ${style.summary}
${style.vocabulary ? `Vocabulary/phrases they use: ${style.vocabulary}.` : ''}
Match their natural style closely while keeping it appropriate for ${platform}.`;
          }
        } catch { /* unparseable style — ignore */ }
      }
    }

    const prompt = `Write a ${tone} ${platform} caption about: "${topic}"
${brandName ? `Brand: ${brandName}` : ''}
${includeHashtags ? 'Include 5-8 relevant Kenyan hashtags.' : ''}
${includeEmojis ? 'Include emojis.' : 'No emojis.'}
${language === 'swahili' ? 'Write in Swahili.' : language === 'sheng' ? 'Write in Kenyan Sheng.' : 'Write in English.'}${styleBlock}
Platform character limits: Instagram=2200, TikTok=150, Twitter=280, LinkedIn=1300.
Return ONLY the caption text.`;
    return callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 500);
  }

  /**
   * Learn the user's authentic voice from their own published posts and
   * connected accounts, then persist it to AIMemory for caption generation.
   */
  async learnUserStyle(userId: string): Promise<any> {
    const posts = await prisma.post.findMany({
      where: { userId, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 30,
      select: { content: true, platform: true, likes: true, comments: true, shares: true, engagementRate: true, publishedAt: true },
    });

    if (posts.length === 0) {
      throw new Error('No published posts yet — publish or import a few posts first so the AI can learn your style.');
    }

    const samples = posts.slice(0, 20).map((p, i) => `[Post ${i + 1} · ${p.platform}${p.engagementRate ? ` · eng ${p.engagementRate.toFixed(1)}%` : ''}]\n${p.content}`).join('\n\n');

    const prompt = `Analyse this creator's authentic writing voice from their published social posts.

${samples}

Return ONLY JSON:
{"summary":"2-3 sentence description of their voice, tone, sentence length, emoji and punctuation habits","vocabulary":"notable recurring words, phrases or sheng/slang they use","niche":"their apparent content niche","avgLength":"short|medium|long","emojiUse":"none|light|heavy"}`;

    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 500);
    let style: any;
    try {
      style = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      style = { summary: text.slice(0, 400), vocabulary: '', niche: '', avgLength: 'medium', emojiUse: 'light' };
    }

    const bestHours = computeBestHours(posts);

    await prisma.aIMemory.upsert({
      where: { userId },
      update: { captionStyle: JSON.stringify(style), postingPatterns: { bestHours } as any },
      create: { userId, captionStyle: JSON.stringify(style), postingPatterns: { bestHours } as any },
    });

    logger.info(`AI style learned for user ${userId} from ${posts.length} posts`);
    return { style, samplesAnalyzed: posts.length };
  }

  async getStoredStyle(userId: string): Promise<any> {
    const memory = await prisma.aIMemory.findUnique({ where: { userId } }).catch(() => null);
    if (!memory?.captionStyle) return null;
    try {
      return { style: JSON.parse(memory.captionStyle), postingPatterns: memory.postingPatterns, updatedAt: memory.updatedAt };
    } catch {
      return null;
    }
  }

  /** Trending Kenyan sounds for Reels/TikTok in the creator's niche. */
  async getTrendingSounds(params: { platform: string; niche?: string }): Promise<any> {
    const prompt = `List 8 trending ${params.platform === 'tiktok' ? 'TikTok' : 'Instagram Reels'} sounds/audio ${params.niche ? `for the ${params.niche} niche ` : ''}popular with Kenyan creators right now.
For each: name, artist, why it works, and content idea it fits.
Return ONLY JSON: {"sounds":[{"name":"...","artist":"...","vibe":"...","useFor":"..."}]}`;
    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 600);
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return { sounds: [] };
    }
  }

  /** A/B testing variations: distinct strategic angles for the same message. */
  async generateABVariations(params: {
    platform: string; topic: string; count?: number; userId?: string;
  }): Promise<any[]> {
    const count = Math.min(params.count || 3, 4);

    let styleBlock = '';
    if (params.userId) {
      const memory = await prisma.aIMemory.findUnique({ where: { userId: params.userId } }).catch(() => null);
      if (memory?.captionStyle) {
        try {
          const style = JSON.parse(memory.captionStyle);
          if (style?.summary) styleBlock = `\nThe creator's authentic voice: ${style.summary}`;
        } catch { /* ignore */ }
      }
    }

    const prompt = `Create ${count} DISTINCT A/B test variations of a ${params.platform} post about: "${params.topic}"
Each variation must use a genuinely different strategy: e.g. (1) bold hook/question first, (2) story/relatable angle, (3) direct benefit/CTA-led.${styleBlock}
Platform character limits: Instagram=2200, TikTok=150, Twitter=280, LinkedIn=1300.
Return ONLY JSON: {"variations":[{"label":"A — Hook","caption":"...","hypothesis":"why this may win"}]}`;

    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 900);
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      return parsed.variations || [];
    } catch {
      return [];
    }
  }

  /**
   * Best posting times: combines the creator's REAL published-post engagement
   * by hour with curated Kenyan (EAT) engagement windows.
   */
  async getBestPostingTimes(userId: string, platform?: string): Promise<any> {
    const posts = await prisma.post.findMany({
      where: { userId, status: 'PUBLISHED', ...(platform ? { platform: platform.toUpperCase() as any } : {}) },
      orderBy: { publishedAt: 'desc' },
      take: 100,
      select: { publishedAt: true, engagementRate: true, likes: true, comments: true, shares: true, platform: true },
    });

    const hourly = computeHourlyEngagement(posts);

    const prompt = `Give the best posting times in East Africa Time (EAT) for ${platform || 'a Kenyan audience'} across Instagram, TikTok, X and LinkedIn.
Base it on Kenyan social media rhythms (commute ~7-9am, lunch ~12-2pm, evening peak ~7-10pm EAT).
Return ONLY JSON: {"windows":[{"platform":"Instagram","times":"7-9am & 7-9pm EAT","why":"short reason"}]}`;
    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 500);
    let windows: any[] = [];
    try {
      windows = JSON.parse(text.replace(/```json|```/g, '').trim()).windows || [];
    } catch { /* fall through */ }

    return {
      windows,
      personalData: {
        postsAnalyzed: posts.length,
        hourly,
        yourBestHour: hourly.length ? hourly.reduce((a, b) => (b.engagement > a.engagement ? b : a)).hour : null,
      },
    };
  }

  async suggestHashtags(params: { topic: string; platform: string; niche?: string; includeKenyan?: boolean }): Promise<string[]> {
    const prompt = `Suggest 15 relevant hashtags for a ${params.platform} post about "${params.topic}".
${params.includeKenyan ? 'Include popular Kenyan hashtags.' : ''}
Return ONLY a JSON array: ["#tag1","#tag2"]`;
    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 300);
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return text.match(/#\w+/g) || [];
    }
  }

  async getKenyanTrendSuggestions(params: { platform: string; niche?: string }): Promise<any> {
    const prompt = `What content strategies work for ${params.platform} in Kenya?
Return JSON: {"topics":["t1"],"hashtags":["#tag1"],"formats":["f1"],"bestTimes":["7am EAT"]}`;
    const text = await callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 500);
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return { topics: [], hashtags: [], formats: [], bestTimes: ['7am', '12pm', '7pm'] };
    }
  }
}

export const aiService = new AIService();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Bucket published posts by local hour, weighted by engagement. */
function computeHourlyEngagement(posts: Array<{ publishedAt: Date | null; likes: number; comments: number; shares: number }>): { hour: number; engagement: number; posts: number }[] {
  const buckets = new Map<number, { engagement: number; posts: number }>();
  for (const p of posts) {
    if (!p.publishedAt) continue;
    const hour = new Date(p.publishedAt).getUTCHours() + 3; // EAT = UTC+3
    const h = ((hour % 24) + 24) % 24;
    const eng = (p.likes || 0) + (p.comments || 0) + (p.shares || 0);
    const cur = buckets.get(h) || { engagement: 0, posts: 0 };
    cur.engagement += eng;
    cur.posts += 1;
    buckets.set(h, cur);
  }
  return Array.from(buckets.entries())
    .map(([hour, v]) => ({ hour, engagement: v.posts ? Math.round(v.engagement / v.posts) : 0, posts: v.posts }))
    .sort((a, b) => a.hour - b.hour);
}

function computeBestHours(posts: Array<{ publishedAt: Date | null; likes: number; comments: number; shares: number }>): number[] {
  return computeHourlyEngagement(posts)
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3)
    .map(h => h.hour);
}
