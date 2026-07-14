import OpenAI from 'openai';
import { logger } from '../../shared/utils/logger';

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
  }): Promise<string> {
    const { platform, topic, tone, brandName, includeHashtags, includeEmojis, language } = params;
    const prompt = `Write a ${tone} ${platform} caption about: "${topic}"
${brandName ? `Brand: ${brandName}` : ''}
${includeHashtags ? 'Include 5-8 relevant Kenyan hashtags.' : ''}
${includeEmojis ? 'Include emojis.' : 'No emojis.'}
${language === 'swahili' ? 'Write in Swahili.' : language === 'sheng' ? 'Write in Kenyan Sheng.' : 'Write in English.'}
Platform character limits: Instagram=2200, TikTok=150, Twitter=280, LinkedIn=1300.
Return ONLY the caption text.`;
    return callAI([{ role: 'user', content: prompt }], SYSTEM_PROMPT, 500);
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
