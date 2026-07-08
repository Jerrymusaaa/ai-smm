import { useAuthStore } from '@/store/auth.store';
import { getPlan, canAccess, getUpgradePlan, getInfluencerMarketplaceAccess, getCampaignMarketplaceAccess, PlanConfig } from '@/lib/planGating';

export function usePlan() {
  const { user } = useAuthStore();
  const planId = user?.plan || 'FREE';
  const accountType = user?.accountType || 'INDIVIDUAL';
  const plan = getPlan(planId);
  const upgradePlan = getUpgradePlan(planId);

  return {
    plan,
    planId,
    accountType,
    upgradePlan,
    isInfluencer: accountType === 'INFLUENCER',
    isBusiness: accountType === 'BUSINESS' || accountType === 'ENTERPRISE',
    isFree: planId === 'FREE' || planId === 'INFLUENCER_FREE',
    can: (feature: keyof PlanConfig) => canAccess(planId, feature),
    influencerMarketplace: getInfluencerMarketplaceAccess(planId),
    campaignMarketplace: getCampaignMarketplaceAccess(planId),
  };
}
