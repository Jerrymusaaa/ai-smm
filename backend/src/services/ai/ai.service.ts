import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../shared/utils/logger';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const YOYZIE_SYSTEM_PROMPT = `You are Yoyzie AI Assistant, the built-in AI for Yoyzie AI — Kenya's leading AI-powered social media management and influencer marketing platform.

You help Kenyan creators, businesses, and influencers with:
- Writing engaging social media captions optimized per platform
- Suggesting trending Kenyan hashtags and sounds (Twitter/X, TikTok, Instagram)
- Creating content calendars and posting strategies
- Analyzing campaign performance and giving actionable advice
- Writing influencer campaign proposals and briefs
- Suggesting best posting times for Kenyan audiences (EAT timezone)
- Helping with both English and Swahili/Sheng content
- Explaining platform features (wallet, marketplace, billing, analytics)

Personality: Friendly, professional, knowledgeable about the Kenyan social media scene and digital creator economy. Keep responses concise and actionable. Use emojis sparingly.`;

export class AIService {
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

Tailor your advice to their account type and plan. If they ask about a feature locked behind a higher plan, mention the upgrade naturally without being pushy.` : '';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 800,
      system: YOYZIE_SYSTEM_PROMPT + contextPrompt,
      messages,
    });

    return (message.content[0] as any).text;
  }

  async generateCaption(params: {
    platform: string; topic: string; tone: string;
    brandName?: string; includeHashtags?: boolean; includeEmojis?: boolean; language?: string;
  }): Promise<string> {
    const { platform, topic, tone, brandName, includeHashtags, includeEmojis, language } = params;
    const prompt = `Write a ${tone} social media caption for ${platform} about: "${topic}"
${brandName ? `Brand/Account: ${brandName}` : ''}
${includeHashtags ? 'Include 5-10 relevant Kenyan trending hashtags at the end.' : 'No hashtags.'}
${includeEmojis ? 'Include relevant emojis.' : 'No emojis.'}
${language === 'swahili' ? 'Write in Swahili.' : language === 'sheng' ? 'Write in Kenyan Sheng.' : 'Write in English.'}

Return ONLY the caption text, nothing else.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    return (message.content[0] as any).text;
  }

  async suggestHashtags(params: { topic: string; platform: string; niche?: string; includeKenyan?: boolean }): Promise<string[]> {
    const prompt = `Suggest 15 highly relevant hashtags for a ${params.platform} post about "${params.topic}"
${params.niche ? `Niche: ${params.niche}` : ''}
${params.includeKenyan ? 'Include popular Kenyan hashtags.' : ''}
Return ONLY a JSON array like: ["#tag1","#tag2"]`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = (message.content[0] as any).text;
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return text.match(/#\w+/g) || [];
    }
  }

  async getKenyanTrendSuggestions(params: { platform: string; niche?: string }): Promise<any> {
    const prompt = `What are effective content strategies for ${params.platform} in Kenya right now?
${params.niche ? `Niche: ${params.niche}` : ''}
Return JSON: {"topics":["t1"],"hashtags":["#tag1"],"formats":["f1"],"bestTimes":["7am"]}
Return ONLY the JSON.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      system: YOYZIE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = (message.content[0] as any).text;
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      return { error: 'parse_failed', raw: text };
    }
  }
}

export const aiService = new AIService();
