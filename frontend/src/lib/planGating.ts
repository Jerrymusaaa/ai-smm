export type PlanId =
  | 'free' | 'individual_pro' | 'creator' | 'power_user'
  | 'influencer_free' | 'influencer_starter' | 'influencer_pro' | 'creator_mode'
  | 'sme' | 'growing_base' | 'growing_max' | 'enterprise';

export type AccountCategory = 'individual' | 'influencer' | 'business' | 'enterprise';

export interface PlanFeatures {
  platforms: number;
  aiPostsPerMonth: number | 'unlimited';
  scheduledPostsPerMonth: number | 'unlimited';
  analyticsHistory: number;
  teamSeats: number;
  brandAccounts: number;
  influencerMarketplace: 'none' | 'browse' | 'full';
  campaignMarketplace: 'none' | 'post' | 'apply' | 'full';
  botDetection: 'none' | 'basic' | 'full';
  apiAccess: boolean;
  whitLabel: boolean;
  kenyaTrends: boolean;
  trialDays: number;
  commissionRate?: number;
}

const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free: { platforms: 3, aiPostsPerMonth: 3, scheduledPostsPerMonth: 10, analyticsHistory: 7, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'none', botDetection: 'none', apiAccess: false, whitLabel: false, kenyaTrends: false, trialDays: 0 },
  individual_pro: { platforms: 10, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'none', botDetection: 'none', apiAccess: false, whitLabel: false, kenyaTrends: true, trialDays: 7 },
  creator: { platforms: 10, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90, teamSeats: 1, brandAccounts: 3, influencerMarketplace: 'browse', campaignMarketplace: 'none', botDetection: 'basic', apiAccess: false, whitLabel: false, kenyaTrends: true, trialDays: 7 },
  power_user: { platforms: 23, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 3, brandAccounts: 5, influencerMarketplace: 'full', campaignMarketplace: 'full', botDetection: 'full', apiAccess: true, whitLabel: false, kenyaTrends: true, trialDays: 7 },
  influencer_free: { platforms: 3, aiPostsPerMonth: 5, scheduledPostsPerMonth: 5, analyticsHistory: 7, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'apply', botDetection: 'basic', apiAccess: false, whitLabel: false, kenyaTrends: false, trialDays: 0, commissionRate: 25 },
  influencer_starter: { platforms: 5, aiPostsPerMonth: 20, scheduledPostsPerMonth: 20, analyticsHistory: 30, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'apply', botDetection: 'basic', apiAccess: false, whitLabel: false, kenyaTrends: true, trialDays: 7, commissionRate: 20 },
  influencer_pro: { platforms: 10, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'apply', botDetection: 'full', apiAccess: false, whitLabel: false, kenyaTrends: true, trialDays: 7, commissionRate: 15 },
  creator_mode: { platforms: 23, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 1, brandAccounts: 1, influencerMarketplace: 'none', campaignMarketplace: 'apply', botDetection: 'full', apiAccess: false, whitLabel: false, kenyaTrends: true, trialDays: 7, commissionRate: 10 },
  sme: { platforms: 23, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 5, brandAccounts: 5, influencerMarketplace: 'full', campaignMarketplace: 'post', botDetection: 'full', apiAccess: true, whitLabel: false, kenyaTrends: true, trialDays: 10 },
  growing_base: { platforms: 23, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 10, brandAccounts: 10, influencerMarketplace: 'full', campaignMarketplace: 'post', botDetection: 'full', apiAccess: true, whitLabel: false, kenyaTrends: true, trialDays: 10 },
  growing_max: { platforms: 23, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 25, brandAccounts: 20, influencerMarketplace: 'full', campaignMarketplace: 'post', botDetection: 'full', apiAccess: true, whitLabel: false, kenyaTrends: true, trialDays: 10 },
  enterprise: { platforms: 999, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 999, teamSeats: 999, brandAccounts: 999, influencerMarketplace: 'full', campaignMarketplace: 'post', botDetection: 'full', apiAccess: true, whitLabel: true, kenyaTrends: true, trialDays: 10 },
};

export const PLAN_UPGRADE_REQUIRED: Record<string, { requiredPlan: PlanId; message: string }> = {
  influencer_marketplace: { requiredPlan: 'power_user', message: 'Upgrade to Power User to hire influencers and run campaigns' },
  campaign_marketplace_post: { requiredPlan: 'sme', message: 'Upgrade to SME plan to post campaign briefs' },
  bot_detection_full: { requiredPlan: 'creator', message: 'Upgrade to Creator plan to access full bot detection reports' },
  api_access: { requiredPlan: 'power_user', message: 'Upgrade to Power User for API access' },
  kenya_trends: { requiredPlan: 'individual_pro', message: 'Upgrade to Individual Pro for live Kenyan trending hashtags' },
  competitor_analysis: { requiredPlan: 'creator', message: 'Upgrade to Creator plan for competitor analysis' },
  team_seats: { requiredPlan: 'sme', message: 'Upgrade to SME plan to add team members' },
};

export function getPlanFeatures(planId: string): PlanFeatures {
  return PLAN_FEATURES[planId as PlanId] || PLAN_FEATURES['free'];
}

export function canAccess(planId: string, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(planId);
  const value = features[feature];
  if (typeof value === 'boolean') return value;
  if (value === 'none') return false;
  if (value === 'unlimited' || value === 'full' || value === 'browse' || value === 'apply' || value === 'post') return true;
  return (value as number) > 0;
}
