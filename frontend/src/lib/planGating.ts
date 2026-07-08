// ── Plan definitions ──────────────────────────────────────────────────────────

export type PlanId =
  | 'FREE' | 'INDIVIDUAL_PRO' | 'CREATOR' | 'POWER_USER'
  | 'INFLUENCER_FREE' | 'INFLUENCER_STARTER' | 'INFLUENCER_PRO' | 'CREATOR_MODE'
  | 'SME' | 'GROWING' | 'ENTERPRISE';

export type AccountType = 'INDIVIDUAL' | 'INFLUENCER' | 'BUSINESS' | 'ENTERPRISE';

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceKES: number;
  color: string;
  platforms: number;
  aiPostsPerMonth: number | 'unlimited';
  scheduledPostsPerMonth: number | 'unlimited';
  analyticsHistory: number;
  teamSeats: number;
  brandAccounts: number;
  influencerMarketplace: 'none' | 'browse' | 'full';
  campaignMarketplace: 'none' | 'apply' | 'post' | 'full';
  botDetection: 'none' | 'basic' | 'full';
  apiAccess: boolean;
  whiteLabel: boolean;
  kenyaTrends: boolean;
  trialDays: number;
  commissionRate?: number;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE:              { id:'FREE',             name:'Free',             priceKES:0,      color:'#888888', platforms:3,   aiPostsPerMonth:3,           scheduledPostsPerMonth:10,          analyticsHistory:7,   teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'none',  botDetection:'none',  apiAccess:false, whiteLabel:false, kenyaTrends:false, trialDays:0 },
  INDIVIDUAL_PRO:    { id:'INDIVIDUAL_PRO',   name:'Individual Pro',   priceKES:1999,   color:'#C9A84C', platforms:10,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:90,  teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'none',  botDetection:'none',  apiAccess:false, whiteLabel:false, kenyaTrends:true,  trialDays:7 },
  CREATOR:           { id:'CREATOR',          name:'Creator',          priceKES:4999,   color:'#E8C96A', platforms:10,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:90,  teamSeats:1,   brandAccounts:3,  influencerMarketplace:'browse', campaignMarketplace:'none',  botDetection:'basic', apiAccess:false, whiteLabel:false, kenyaTrends:true,  trialDays:7 },
  POWER_USER:        { id:'POWER_USER',       name:'Power User',       priceKES:9999,   color:'#C9A84C', platforms:23,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:365, teamSeats:3,   brandAccounts:5,  influencerMarketplace:'full',   campaignMarketplace:'full',  botDetection:'full',  apiAccess:true,  whiteLabel:false, kenyaTrends:true,  trialDays:7 },
  INFLUENCER_FREE:   { id:'INFLUENCER_FREE',  name:'Free Influencer',  priceKES:0,      color:'#888888', platforms:3,   aiPostsPerMonth:5,           scheduledPostsPerMonth:5,           analyticsHistory:7,   teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'apply', botDetection:'basic', apiAccess:false, whiteLabel:false, kenyaTrends:false, trialDays:0,  commissionRate:25 },
  INFLUENCER_STARTER:{ id:'INFLUENCER_STARTER',name:'Starter',         priceKES:1999,   color:'#C9A84C', platforms:5,   aiPostsPerMonth:20,          scheduledPostsPerMonth:20,          analyticsHistory:30,  teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'apply', botDetection:'basic', apiAccess:false, whiteLabel:false, kenyaTrends:true,  trialDays:7,  commissionRate:20 },
  INFLUENCER_PRO:    { id:'INFLUENCER_PRO',   name:'Influencer Pro',   priceKES:4999,   color:'#E8C96A', platforms:10,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:90,  teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'apply', botDetection:'full',  apiAccess:false, whiteLabel:false, kenyaTrends:true,  trialDays:7,  commissionRate:15 },
  CREATOR_MODE:      { id:'CREATOR_MODE',     name:'Creator Mode',     priceKES:9999,   color:'#C9A84C', platforms:23,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:365, teamSeats:1,   brandAccounts:1,  influencerMarketplace:'none',   campaignMarketplace:'apply', botDetection:'full',  apiAccess:false, whiteLabel:false, kenyaTrends:true,  trialDays:7,  commissionRate:10 },
  SME:               { id:'SME',              name:'SME',              priceKES:9999,   color:'#C9A84C', platforms:23,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:365, teamSeats:5,   brandAccounts:5,  influencerMarketplace:'full',   campaignMarketplace:'post',  botDetection:'full',  apiAccess:true,  whiteLabel:false, kenyaTrends:true,  trialDays:10 },
  GROWING:           { id:'GROWING',          name:'Growing Business', priceKES:29000,  color:'#E8C96A', platforms:23,  aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:365, teamSeats:25,  brandAccounts:20, influencerMarketplace:'full',   campaignMarketplace:'post',  botDetection:'full',  apiAccess:true,  whiteLabel:false, kenyaTrends:true,  trialDays:10 },
  ENTERPRISE:        { id:'ENTERPRISE',       name:'Enterprise',       priceKES:80000,  color:'#C9A84C', platforms:999, aiPostsPerMonth:'unlimited', scheduledPostsPerMonth:'unlimited', analyticsHistory:999, teamSeats:999, brandAccounts:999,influencerMarketplace:'full',   campaignMarketplace:'post',  botDetection:'full',  apiAccess:true,  whiteLabel:true,  kenyaTrends:true,  trialDays:10 },
};

// ── Helper functions ──────────────────────────────────────────────────────────

export function getPlan(planId: string): PlanConfig {
  const normalized = planId?.toUpperCase().replace(/ /g, '_') as PlanId;
  return PLANS[normalized] || PLANS['FREE'];
}

export function canAccess(planId: string, feature: keyof PlanConfig): boolean {
  const plan = getPlan(planId);
  const val = plan[feature];
  if (typeof val === 'boolean') return val;
  if (val === 'none') return false;
  if (typeof val === 'number') return val > 0;
  return true; // 'unlimited', 'browse', 'apply', 'post', 'full'
}

export function getInfluencerMarketplaceAccess(planId: string): 'none' | 'browse' | 'full' {
  return getPlan(planId).influencerMarketplace;
}

export function getCampaignMarketplaceAccess(planId: string): 'none' | 'apply' | 'post' | 'full' {
  return getPlan(planId).campaignMarketplace;
}

export function isAtLimit(planId: string, feature: 'aiPostsPerMonth' | 'scheduledPostsPerMonth', used: number): boolean {
  const plan = getPlan(planId);
  const limit = plan[feature];
  if (limit === 'unlimited') return false;
  return used >= (limit as number);
}

// Upgrade path — which plan is the next step up?
export const UPGRADE_PATHS: Record<PlanId, PlanId | null> = {
  FREE:               'INDIVIDUAL_PRO',
  INDIVIDUAL_PRO:     'CREATOR',
  CREATOR:            'POWER_USER',
  POWER_USER:         'SME',
  INFLUENCER_FREE:    'INFLUENCER_STARTER',
  INFLUENCER_STARTER: 'INFLUENCER_PRO',
  INFLUENCER_PRO:     'CREATOR_MODE',
  CREATOR_MODE:       null,
  SME:                'GROWING',
  GROWING:            'ENTERPRISE',
  ENTERPRISE:         null,
};

export function getUpgradePlan(currentPlanId: string): PlanConfig | null {
  const normalized = currentPlanId?.toUpperCase().replace(/ /g, '_') as PlanId;
  const nextId = UPGRADE_PATHS[normalized];
  return nextId ? PLANS[nextId] : null;
}

// Feature gate messages
export const GATE_MESSAGES = {
  influencer_marketplace_full:  { needed: 'Power User',       msg: 'Upgrade to Power User to hire influencers and post campaign briefs' },
  influencer_marketplace_browse:{ needed: 'Creator',          msg: 'Upgrade to Creator to browse the influencer marketplace' },
  campaign_marketplace_post:    { needed: 'SME',              msg: 'Upgrade to SME to post campaign briefs and hire influencers' },
  bot_detection_full:           { needed: 'Creator',          msg: 'Upgrade to Creator for full bot detection and audience analysis' },
  api_access:                   { needed: 'Power User',       msg: 'Upgrade to Power User for full API access' },
  kenya_trends:                 { needed: 'Individual Pro',   msg: 'Upgrade to Individual Pro for live Kenyan trending data' },
  team_seats:                   { needed: 'SME',              msg: 'Upgrade to SME to add team members' },
  advanced_analytics:           { needed: 'Individual Pro',   msg: 'Upgrade to Individual Pro for full analytics history' },
  competitor_analysis:          { needed: 'Creator',          msg: 'Upgrade to Creator for competitor benchmarking' },
};
