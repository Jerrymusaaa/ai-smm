import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../shared/utils/logger';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const YOYZIE_SYSTEM_PROMPT = `You are Yoyzie AI Assistant, the built-in AI for the Yoyzie AI social media management platform — Kenya's leading AI-powered social media tool.

You help Kenyan creators, businesses, and influencers with:
- Writing engaging social media captions optimized per platform
- Suggesting trending Kenyan hashtags (you know about Kenyan Twitter/X, TikTok, Instagram trends)
- Creating content calendars and posting strategies
- Analyzing campaign performance and giving actionable advice
- Writing influencer campaign proposals and briefs
- Suggesting the best posting times for Kenyan audiences
- Helping with both English and Swahili/Sheng content

Personality: Friendly, professional, knowledgeable about the Kenyan social media scene. 
You understand Kenyan culture, local brands, trending topics, and the digital creator economy in Kenya.
Keep responses concise and actionable. Use emojis sparingly but appropriately.`;

export class AIService {

  // ── Caption generation ────────────────────────────────────────
  async generateCaption(params: {
    platform: string;
    topic: string;
    tone: string;
    brandName?: string;
    includeHashtags?: boolean;
    includeEmojis?: boolean;
    language?: string;
  }): Promise<string> {
    const { platform, topic, tone, brandName, includeHashtags, includeEmojis, language } = params;

    const prompt = `Write a ${tone} social media caption for ${platform} about: "${topic}"
${brandName ? `Brand/Account: ${brandName}` : ''}
${includeHashtags ? 'Include 5-10 relevant Kenyan trending hashtags at the end.' : 'No hashtags.'}
${includeEmojis ? 'Include relevant emojis.' : 'No emojis.'}
${language === 'swahili' ? 'Write in Swahili.' : language === 'sheng' ? 'Write in Kenyan Sheng.' : 'Write in English.'}

Platform requirements:
- Instagram: Up to 2200 chars, storytelling style, strong hook first line
- TikTok: Short punchy, under 150 chars, use trending phrases  
- Twitter/X: Under 280 chars, direct and engaging
- LinkedIn: Professional tone, insights-driven, 1300 chars max
- Facebook: Conversational, 400-500 chars ideal

Return ONLY the caption text, nothing else.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    return (message.content[0] as any).text;
  }

  // ── Hashtag suggestions ───────────────────────────────────────
  async suggestHashtags(params: {
    topic: string;
    platform: string;
    niche?: string;
    includeKenyan?: boolean;
  }): Promise<string[]> {
    const { topic, platform, niche, includeKenyan } = params;

    const prompt = `Suggest 15 highly relevant hashtags for a ${platform} post about "${topic}"
${niche ? `Niche: ${niche}` : ''}
${includeKenyan ? 'Include popular Kenyan hashtags that are currently trending or commonly used in Kenya.' : ''}

Mix of: broad popular hashtags, niche-specific ones, and Kenyan local ones.
Return ONLY a JSON array of hashtag strings like: ["#hashtag1", "#hashtag2"]
No explanation, just the JSON array.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as any).text;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      // fallback: extract hashtags from text
      return text.match(/#\w+/g) || [];
    }
  }

  // ── Content calendar ──────────────────────────────────────────
  async generateContentCalendar(params: {
    brandName: string;
    niche: string;
    platforms: string[];
    postsPerWeek: number;
    goals: string;
  }): Promise<any> {
    const { brandName, niche, platforms, postsPerWeek, goals } = params;

    const prompt = `Create a 1-week social media content calendar for:
Brand: ${brandName}
Niche: ${niche}
Platforms: ${platforms.join(', ')}
Posts per week: ${postsPerWeek}
Goals: ${goals}

Focus on Kenyan audience and timing (EAT timezone).
Return a JSON object with this structure:
{
  "week": [
    {
      "day": "Monday",
      "posts": [
        {
          "platform": "Instagram",
          "time": "7:00 AM",
          "type": "Reel",
          "topic": "...",
          "caption_idea": "...",
          "hashtags": ["#tag1"]
        }
      ]
    }
  ]
}
Return ONLY the JSON, no explanation.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as any).text;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return { error: 'Could not parse calendar', raw: text };
    }
  }

  // ── Campaign strategy ─────────────────────────────────────────
  async generateCampaignStrategy(params: {
    campaignName: string;
    objective: string;
    targetAudience: string;
    budget: string;
    platforms: string[];
    duration: string;
  }): Promise<string> {
    const prompt = `Create a detailed social media campaign strategy for:
Campaign: ${params.campaignName}
Objective: ${params.objective}
Target audience: ${params.targetAudience}
Budget: ${params.budget}
Platforms: ${params.platforms.join(', ')}
Duration: ${params.duration}

Focus on the Kenyan market. Include:
1. Campaign angle and key message
2. Content pillars (3-4 themes)
3. Posting frequency per platform
4. KPIs to track
5. Suggested influencer tier (if applicable)
6. Best posting times for Kenyan audience

Keep it practical and actionable.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    return (message.content[0] as any).text;
  }

  // ── Analytics insights ────────────────────────────────────────
  async generateAnalyticsInsights(analyticsData: {
    followers: number;
    engagement: number;
    reach: number;
    topPosts: any[];
    period: string;
  }): Promise<string> {
    const prompt = `Analyze this social media performance data and give actionable insights:
Period: ${analyticsData.period}
Followers: ${analyticsData.followers.toLocaleString()}
Total engagement: ${analyticsData.engagement.toLocaleString()}
Reach: ${analyticsData.reach.toLocaleString()}
Engagement rate: ${((analyticsData.engagement / analyticsData.reach) * 100).toFixed(2)}%

Give 3-5 specific, actionable recommendations to improve performance.
Context: This is a Kenyan social media account.
Keep it concise and practical.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    return (message.content[0] as any).text;
  }

  // ── Influencer proposal writer ────────────────────────────────
  async writeInfluencerProposal(params: {
    influencerName: string;
    niche: string;
    followers: string;
    campaignBrief: string;
    proposedRate: number;
  }): Promise<string> {
    const prompt = `Write a professional influencer campaign proposal for:
Influencer: ${params.influencerName}
Niche: ${params.niche}
Followers: ${params.followers}
Proposed rate: KES ${params.proposedRate.toLocaleString()}

Campaign brief: ${params.campaignBrief}

Write a compelling 150-200 word proposal that:
- Shows understanding of the campaign
- Highlights why this influencer is a good fit
- States deliverables clearly
- Sounds professional but personal
- Is tailored to the Kenyan market`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    return (message.content[0] as any).text;
  }

  // ── AI Chatbot (multi-turn conversation) ──────────────────────
  async chat(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    userContext?: {
      name?: string;
      accountType?: string;
      plan?: string;
      connectedPlatforms?: string[];
    };
  }): Promise<string> {
    const { messages, userContext } = params;

    const contextPrompt = userContext ? `
Current user context:
- Name: ${userContext.name || 'User'}
- Account type: ${userContext.accountType || 'Individual'}
- Plan: ${userContext.plan || 'Free'}
- Connected platforms: ${userContext.connectedPlatforms?.join(', ') || 'None yet'}
` : '';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 800,
      system: YOYZIE_SYSTEM_PROMPT + contextPrompt,
      messages: messages,
    });

    return (message.content[0] as any).text;
  }

  // ── Kenyan trend suggestions ──────────────────────────────────
  async getKenyanTrendSuggestions(params: {
    platform: string;
    niche?: string;
  }): Promise<any> {
    const prompt = `What are the most effective content strategies and hashtag patterns for ${params.platform} in Kenya right now?
${params.niche ? `Niche: ${params.niche}` : ''}

Based on your knowledge of Kenyan social media, provide:
1. 5 content topics currently performing well in Kenya
2. 10 hashtags commonly used by Kenyan creators in this space
3. 2-3 trending content formats on this platform in Kenya
4. Best posting times for Kenyan audience (EAT timezone)

Return as JSON:
{
  "topics": ["topic1"],
  "hashtags": ["#tag1"],
  "formats": ["format1"],
  "bestTimes": ["7am", "12pm"]
}
Return ONLY the JSON.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as any).text;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return { error: 'Could not parse trends', raw: text };
    }
  }
}

export const aiService = new AIService();
