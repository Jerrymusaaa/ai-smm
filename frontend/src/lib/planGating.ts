export type PlanId =
  | 'free' | 'individual_pro' | 'creator' | 'power_user'
  | 'influencer_free' | 'influencer_starter' | 'influencer_pro' | 'creator_mode'
  | 'sme' | 'growing_base' | 'growing_max' | 'enterprise';

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
  whiteLabel: boolean;
  kenyaTrends: boolean;
  trialDays: number;
  commissionRate?: number;
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free:              { platforms: 3,   aiPostsPerMonth: 3,           scheduledPostsPerMonth: 10,          analyticsHistory: 7,   teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'none',  botDetection: 'none',  apiAccess: false, whiteLabel: false, kenyaTrends: false, trialDays: 0 },
  individual_pro:    { platforms: 10,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90,  teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'none',  botDetection: 'none',  apiAccess: false, whiteLabel: false, kenyaTrends: true,  trialDays: 7 },
  creator:           { platforms: 10,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90,  teamSeats: 1,   brandAccounts: 3,  influencerMarketplace: 'browse', campaignMarketplace: 'none',  botDetection: 'basic', apiAccess: false, whiteLabel: false, kenyaTrends: true,  trialDays: 7 },
  power_user:        { platforms: 23,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 3,   brandAccounts: 5,  influencerMarketplace: 'full',   campaignMarketplace: 'full',  botDetection: 'full',  apiAccess: true,  whiteLabel: false, kenyaTrends: true,  trialDays: 7 },
  influencer_free:   { platforms: 3,   aiPostsPerMonth: 5,           scheduledPostsPerMonth: 5,           analyticsHistory: 7,   teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'apply', botDetection: 'basic', apiAccess: false, whiteLabel: false, kenyaTrends: false, trialDays: 0,  commissionRate: 25 },
  influencer_starter:{ platforms: 5,   aiPostsPerMonth: 20,          scheduledPostsPerMonth: 20,          analyticsHistory: 30,  teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'apply', botDetection: 'basic', apiAccess: false, whiteLabel: false, kenyaTrends: true,  trialDays: 7,  commissionRate: 20 },
  influencer_pro:    { platforms: 10,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 90,  teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'apply', botDetection: 'full',  apiAccess: false, whiteLabel: false, kenyaTrends: true,  trialDays: 7,  commissionRate: 15 },
  creator_mode:      { platforms: 23,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 1,   brandAccounts: 1,  influencerMarketplace: 'none',   campaignMarketplace: 'apply', botDetection: 'full',  apiAccess: false, whiteLabel: false, kenyaTrends: true,  trialDays: 7,  commissionRate: 10 },
  sme:               { platforms: 23,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 5,   brandAccounts: 5,  influencerMarketplace: 'full',   campaignMarketplace: 'post',  botDetection: 'full',  apiAccess: true,  whiteLabel: false, kenyaTrends: true,  trialDays: 10 },
  growing_base:      { platforms: 23,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 10,  brandAccounts: 10, influencerMarketplace: 'full',   campaignMarketplace: 'post',  botDetection: 'full',  apiAccess: true,  whiteLabel: false, kenyaTrends: true,  trialDays: 10 },
  growing_max:       { platforms: 23,  aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 365, teamSeats: 25,  brandAccounts: 20, influencerMarketplace: 'full',   campaignMarketplace: 'post',  botDetection: 'full',  apiAccess: true,  whiteLabel: false, kenyaTrends: true,  trialDays: 10 },
  enterprise:        { platforms: 999, aiPostsPerMonth: 'unlimited', scheduledPostsPerMonth: 'unlimited', analyticsHistory: 999, teamSeats: 999, brandAccounts: 999,influencerMarketplace: 'full',   campaignMarketplace: 'post',  botDetection: 'full',  apiAccess: true,  whiteLabel: true,  kenyaTrends: true,  trialDays: 10 },
};

export function getPlanFeatures(planId: string): PlanFeatures {
  return PLAN_FEATURES[planId as PlanId] || PLAN_FEATURES['free'];
}

export function canAccess(planId: string, feature: keyof PlanFeatures): boolean {
  const f = getPlanFeatures(planId);
  const v = f[feature];
  if (typeof v === 'boolean') return v;
  if (v === 'none') return false;
  return true;
}

export const UPGRADE_MESSAGES: Record<string, { needed: string; message: string }> = {
  influencer_marketplace_full: { needed: 'Power User',    message: 'Upgrade to Power User to hire influencers and run campaigns' },
  influencer_marketplace_browse:{ needed: 'Creator',      message: 'Upgrade to Creator to browse the influencer marketplace' },
  campaign_marketplace:        { needed: 'SME',           message: 'Upgrade to SME to post campaign briefs and hire influencers' },
  bot_detection_full:          { needed: 'Creator',       message: 'Upgrade to Creator for full bot detection reports' },
  api_access:                  { needed: 'Power User',    message: 'Upgrade to Power User for API access' },
  kenya_trends:                { needed: 'Individual Pro', message: 'Upgrade to Individual Pro for live Kenyan trending data' },
  team_seats:                  { needed: 'SME',           message: 'Upgrade to SME to add team members' },
};
