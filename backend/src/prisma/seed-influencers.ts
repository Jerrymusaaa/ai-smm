import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INFLUENCERS = [
  {
    name: 'Wairimu Njeri', email: 'wairimu@demo.yoyzie.ai',
    bio: 'Fashion & lifestyle content creator based in Nairobi. Helping Kenyan women feel confident and stylish.',
    niches: ['Fashion & Beauty', 'Lifestyle'],
    followers: 128000, engagement: 6.2, botScore: 96, ctv: 4.8,
    platforms: [{ platform: 'INSTAGRAM' as const, username: '@wairiumnjeri', followers: 98000 },
                { platform: 'TIKTOK' as const, username: '@wairiumnjeri', followers: 30000 }],
    priority: 3, verified: true, campaigns: 24, rating: 4.8,
  },
  {
    name: 'Brian Odhiambo', email: 'brian@demo.yoyzie.ai',
    bio: 'Tech reviewer and gadget enthusiast. Honest reviews of the latest tech hitting the Kenyan market.',
    niches: ['Tech & Gadgets', 'Gaming'],
    followers: 340000, engagement: 8.1, botScore: 91, ctv: 6.2,
    platforms: [{ platform: 'TIKTOK' as const, username: '@brianodhiambo', followers: 210000 },
                { platform: 'YOUTUBE' as const, username: '@brianodhiambo', followers: 130000 }],
    priority: 4, verified: true, campaigns: 41, rating: 4.9,
  },
  {
    name: 'Amina Hassan', email: 'amina@demo.yoyzie.ai',
    bio: 'Food blogger and recipe creator. Nairobi food scene explorer and home cooking enthusiast.',
    niches: ['Food & Lifestyle', 'Travel'],
    followers: 67000, engagement: 9.4, botScore: 98, ctv: 7.1,
    platforms: [{ platform: 'INSTAGRAM' as const, username: '@aminahassan_ke', followers: 52000 },
                { platform: 'TWITTER' as const, username: '@aminahassan_ke', followers: 15000 }],
    priority: 2, verified: false, campaigns: 12, rating: 4.6,
  },
  {
    name: 'Kevin Mwangi', email: 'kevin@demo.yoyzie.ai',
    bio: 'Finance educator breaking down investing, savings and wealth building for young Kenyans.',
    niches: ['Finance & Business', 'Education'],
    followers: 89000, engagement: 5.8, botScore: 94, ctv: 5.3,
    platforms: [{ platform: 'LINKEDIN' as const, username: '@kevinmwangi', followers: 45000 },
                { platform: 'TWITTER' as const, username: '@kevinmwangi_ke', followers: 44000 }],
    priority: 3, verified: true, campaigns: 18, rating: 4.7,
  },
  {
    name: 'Aisha Omar', email: 'aisha@demo.yoyzie.ai',
    bio: 'Fitness coach and wellness advocate. Helping Kenyans build healthy sustainable lifestyles.',
    niches: ['Health & Fitness', 'Wellness'],
    followers: 210000, engagement: 11.2, botScore: 89, ctv: 8.9,
    platforms: [{ platform: 'TIKTOK' as const, username: '@aishaomar_ke', followers: 160000 },
                { platform: 'INSTAGRAM' as const, username: '@aishaomar_ke', followers: 50000 }],
    priority: 3, verified: false, campaigns: 29, rating: 4.5,
  },
  {
    name: 'Dennis Kamau', email: 'dennis@demo.yoyzie.ai',
    bio: 'Entertainment and comedy content creator. Making Kenyans laugh one video at a time.',
    niches: ['Entertainment', 'Comedy'],
    followers: 520000, engagement: 4.3, botScore: 92, ctv: 3.8,
    platforms: [{ platform: 'YOUTUBE' as const, username: '@denniskamau', followers: 320000 },
                { platform: 'TIKTOK' as const, username: '@denniskamau', followers: 200000 }],
    priority: 4, verified: true, campaigns: 55, rating: 4.7,
  },
  {
    name: 'Grace Wanjiru', email: 'grace@demo.yoyzie.ai',
    bio: 'Parenting blogger and mum of 3. Real talk about raising kids in Kenya.',
    niches: ['Parenting & Family', 'Lifestyle'],
    followers: 43000, engagement: 12.1, botScore: 97, ctv: 9.2,
    platforms: [{ platform: 'INSTAGRAM' as const, username: '@gracewanjiru_mum', followers: 43000 }],
    priority: 2, verified: false, campaigns: 8, rating: 4.8,
  },
  {
    name: 'Samson Otieno', email: 'samson@demo.yoyzie.ai',
    bio: 'Travel content creator exploring Kenya and East Africa. Showcasing hidden gems and adventure spots.',
    niches: ['Travel & Adventure', 'Photography'],
    followers: 156000, engagement: 7.3, botScore: 93, ctv: 5.8,
    platforms: [{ platform: 'INSTAGRAM' as const, username: '@samsonotieno_travels', followers: 96000 },
                { platform: 'YOUTUBE' as const, username: '@samsonotieno', followers: 60000 }],
    priority: 3, verified: true, campaigns: 33, rating: 4.6,
  },
];

async function seed() {
  console.log('Seeding demo influencer accounts...');

  for (const inf of INFLUENCERS) {
    try {
      // Check if already exists
      const existing = await prisma.user.findUnique({ where: { email: inf.email } });
      if (existing) {
        console.log(`  ⚠️  Already exists: ${inf.name}`);
        continue;
      }

      const password = await bcrypt.hash('demo123456', 12);

      const user = await prisma.user.create({
        data: {
          email: inf.email,
          password,
          name: inf.name,
          bio: inf.bio,
          accountType: 'INFLUENCER',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          onboardingDone: true,
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
          aiMemory: { create: {} },
          influencerProfile: {
            create: {
              niches: inf.niches,
              botScore: inf.botScore,
              audienceAuthPct: inf.botScore,
              clickToViewRatio: inf.ctv,
              avgEngagementRate: inf.engagement,
              commissionRate: 25,
              verifiedBadge: inf.verified,
              priorityLevel: inf.priority,
              totalCampaigns: inf.campaigns,
              rating: inf.rating,
              walletBalance: 0,
              pendingBalance: 0,
              totalEarnings: 0,
            },
          },
        },
      });

      // Create social accounts
      for (const account of inf.platforms) {
        await prisma.socialAccount.create({
          data: {
            userId: user.id,
            platform: account.platform,
            platformUserId: `demo_${user.id}_${account.platform}`,
            username: account.username,
            displayName: inf.name,
            accessToken: 'demo_token',
            followers: account.followers,
            isActive: true,
          },
        });
      }

      console.log(`  ✅ Created: ${inf.name} (${inf.niches.join(', ')})`);
    } catch (error: any) {
      console.error(`  ❌ Failed: ${inf.name} — ${error.message}`);
    }
  }

  console.log('\n✅ Seeding complete!');
  await prisma.$disconnect();
}

seed();
