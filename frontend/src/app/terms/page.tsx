import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Terms of Service — Yoyzie AI' };

export default function TermsPage() {
  const updated = 'September 18, 2026';

  return (
    <div style={{ background: '#070A0F', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(201,168,76,0.12)', background: 'rgba(7,10,15,0.95)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.35)' }}>
            <Image src="/images/yoyzie-logo.jpg" alt="Yoyzie AI" width={32} height={32} className="object-cover" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }} className="text-lg font-bold">Yoyzie AI</span>
        </Link>
        <Link href="/" className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>← Back to home</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }} className="text-4xl font-bold mb-2">
          Terms of Service
        </h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: {updated}</p>

        {[
          {
            title: '1. Agreement to These Terms',
            content: `These Terms of Service ("**Terms**") form a binding legal agreement between you and **Yoyzie AI Ltd** ("**Yoyzie**", "we", "us"), a company registered in Kenya, governing your access to and use of the Yoyzie AI platform, website, APIs, and related services (together, the "**Service**").\n\nBy creating an account, clicking "I agree", connecting a social media account, or otherwise using the Service, you confirm that you have **read, understood, and accepted** these Terms and our Privacy Policy.\n\nIf you accept these Terms on behalf of a company or organisation, you represent that you have full authority to bind that entity, and "you" refers to that entity.`,
          },
          {
            title: '2. Eligibility',
            content: `You must be at least **18 years old** and legally able to enter into contracts to use the Service. By using the Service you represent and warrant that you meet this requirement and that all information you provide is accurate and complete.\n\nAccounts registered with false information, or by automated means without our written permission, may be suspended or terminated without notice.`,
          },
          {
            title: '3. Accounts & Registration',
            content: `**3.1 Your credentials.** You are responsible for keeping your password and account credentials confidential, for all activity that happens under your account, and for notifying us immediately at support@yoyzie.ai if you suspect unauthorised access.\n\n**3.2 Accurate information.** You must provide a valid email address and keep your account details current. We may use that email address for service communications, legal notices, and verification.\n\n**3.3 One person, one account.** You may not maintain multiple free accounts to circumvent plan limits, transfer your account to another person, or sell/rent access to your account.\n\n**3.4 Team seats.** Business and Enterprise plans may include multiple seats. As the account owner you are responsible for your team members' compliance with these Terms.\n\n**3.5 Account suspension.** We may suspend or restrict an account if we reasonably believe it has been compromised, is being used unlawfully, or breaches these Terms. Where practicable, we will notify you and give you an opportunity to remedy the issue.`,
          },
          {
            title: '4. Plans, Billing & Renewals',
            content: `**4.1 Plans.** The Service is offered on the plans described at signup (including Free, Individual, Influencer, Business/SME, and Enterprise tiers). Features, limits, and pricing differ per plan and are described on our pricing page.\n\n**4.2 Billing cycle.** Paid subscriptions are billed in advance on a monthly or annual basis in Kenyan Shillings (KES) unless expressly stated otherwise. Prices exclude applicable taxes (including VAT) unless stated; we will add taxes where legally required.\n\n**4.3 Automatic renewal.** Subscriptions renew automatically at the end of each billing period unless you cancel before the renewal date. You can cancel anytime from your account settings; cancellation stops future charges and your plan remains active until the end of the paid period.\n\n**4.4 Payment methods.** We accept payments via M-Pesa (processed by Safaricom Daraja) and cards (processed by Stripe), and may add or remove methods. You authorise us (and our processors) to charge your chosen method for the subscription and any applicable taxes.\n\n**4.5 Failed payments.** If a payment fails, we will retry and notify you. Continued failure may result in downgrading to the Free plan or suspending paid features until the balance is settled.\n\n**4.6 Free trials.** Where a free trial is offered, it converts to a paid subscription at the end of the trial unless cancelled beforehand. We may ask for a payment method upfront and will remind you before the trial ends.\n\n**4.7 Refunds.** Except where required by law, fees already paid are **non-refundable**, including for partially used billing periods. If we materially reduce a paid feature you rely on, we will offer a remedy proportionate to the remaining period. Nothing in this section limits your statutory consumer rights in Kenya.\n\n**4.8 Plan changes.** Upgrades take effect immediately (usually with a prorated charge); downgrades take effect at the next renewal.`,
          },
          {
            title: '5. Licence to Use the Service',
            content: `Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Service for its intended purpose — managing, creating, scheduling, and analysing social media content for accounts you own or are authorised to manage.\n\nYou may **not**:\n\n• Copy, modify, reverse-engineer, decompile, or create derivative works of the Service or its software\n• Scrape, harvest, or bulk-extract data from the Service other than through our official API within your plan's limits\n• Resell, sublicense, white-label, or provide the Service to third parties as a competing offering (Enterprise white-label arrangements are governed by a separate signed agreement)\n• Use the Service to build a competing product or service\n• Interfere with the Service's operation, probe or scan its infrastructure, or bypass security, rate limits, or access controls\n• Use the Service where prohibited by Kenyan law or the laws of your jurisdiction`,
          },
          {
            title: '6. Acceptable Use',
            content: `You agree **not** to use the Service to create, publish, schedule, or promote:\n\n• **Illegal content or activity** — anything violating Kenyan law (including the Computer Misuse and Cybercrimes Act, 2018) or the law of any jurisdiction you target\n• **Hate speech & harassment** — content that attacks people based on race, ethnicity, religion, disability, gender, age, or sexual orientation; bullying; threats; or targeted harassment\n• **Sexual content involving minors** or child sexual abuse material (we report this to authorities and NCMEC/child-protection bodies where applicable)\n• **Non-consensual intimate imagery** or sexual content without consent of all depicted persons\n• **Violence & extremism** — terrorist content, incitement to violence, or graphic gore\n• **Fraud & deception** — scams, phishing, pyramid schemes, fake engagement (purchased/bot followers, likes, comments), impersonation of people or brands, or false advertising\n• **Misinformation** — content you know to be materially false, including health or election misinformation, where intended to deceive\n• **Intellectual property infringement** — content that infringes copyright, trademark, privacy, publicity, or other rights of others\n• **Malware** — viruses, ransomware, or code designed to harm systems\n\n**Platform rules.** You must also comply with the terms, policies, and automation rules of every platform you publish to through Yoyzie (Meta, TikTok, X, LinkedIn, etc.). Violating a platform's rules may cause that platform to restrict your accounts or our API access; we are not liable for such consequences.\n\n**AI-generated content.** You are responsible for reviewing AI-generated captions, hashtags, media, and translations before publishing, including for accuracy, legal compliance, platform disclosure requirements (e.g. labelled AI or sponsored content), and brand safety. AI output can contain errors and should not be relied upon as professional advice.\n\nWe may investigate suspected violations and may suspend or terminate accounts, remove content, and report unlawful activity to law enforcement.`,
          },
          {
            title: '7. Your Content',
            content: `**7.1 Ownership.** You keep all ownership rights in the content you create, upload, or connect to the Service ("**Your Content**"). These Terms do not transfer ownership of Your Content to us.\n\n**7.2 Licence to us.** You grant us a worldwide, limited licence to host, store, reproduce, process, and transmit Your Content **solely to operate and provide the Service** at your direction (e.g. storing drafts, publishing scheduled posts, generating analytics). This licence ends when Your Content is deleted from the Service, except for backup copies deleted on our normal schedule and anonymised/aggregated statistics that no longer identify you.\n\n**7.3 AI personalisation.** You permit our AI to analyse Your Content (captions, hashtags, posting patterns) to learn your style and improve your personal suggestions. This analysis serves only your account; we do not use Your Content to train foundation models for other customers, and we do not sell it.\n\n**7.4 Responsibilities.** You represent and warrant that you own or have all necessary rights, licences, and consents for Your Content and for the accounts you connect — including permission to post on behalf of any brand or person featured. You are solely responsible for Your Content and its consequences once published.\n\n**7.5 Feedback.** If you send us suggestions or feedback, you grant us a perpetual, royalty-free licence to use it to improve the Service without obligation or attribution.`,
          },
          {
            title: '8. Third-Party Platforms & Integrations',
            content: `The Service integrates with third-party platforms via their official APIs. When you connect an account you authorise us to perform the specific actions you enable (publish, read insights, manage comments where supported).\n\n• We depend on those platforms' APIs remaining available and unchanged; if a platform changes its API, restricts access, or suspends your account, the related features may be limited or stop working — that is outside our control and not a breach of these Terms\n• Your use of each platform remains governed by that platform's own terms\n• Competitor tracking uses publicly available data only; you must designate only public profiles and use insights lawfully\n• Direct posting, scheduling, and analytics features depend on the permissions each platform grants; some platforms may require additional review or app approval before full functionality is available`,
          },
          {
            title: '9. Influencer Marketplace & Wallet',
            content: `These sections apply to influencer accounts participating in brand collaborations through Yoyzie.\n\n**9.1 Marketplace conduct.** Influencers must present themselves accurately (real audience, real engagement, honest niche and demographics). Fake engagement, purchased followers, or misrepresenting audience data is a material breach and grounds for immediate removal and forfeiture of pending earnings attributable to the fraud.\n\n**9.2 Campaigns.** When you accept a brand campaign, you must deliver the agreed content on time, meet the brief, and comply with **all applicable advertising-disclosure laws** (e.g. #ad / paid-partnership labels required by the Competition Authority of Kenya and platform rules).\n\n**9.3 Wallet & payouts.** Earnings accrue to your in-platform wallet after brand payment clears and the campaign is verified. Payouts are made to your chosen destination — **M-Pesa** (Safaricom Daraja), PayPal, or bank transfer — subject to the minimum amounts shown in the product and our payout schedule.\n\n**9.4 Commissions.** Yoyzie deducts a commission on marketplace earnings, at the rate shown for your plan (typically 10–25%), displayed before you accept a campaign.\n\n**9.5 Payout issues.** You are responsible for the accuracy of your payout details. Payments sent to an account you incorrectly designated are at your own risk; contact support immediately so we can attempt recovery. Chargebacks or reversed brand payments may result in adjustment of your wallet balance.\n\n**9.6 Taxes.** Payouts may be taxable income. You are responsible for your own tax obligations; on request we will provide earning statements.`,
          },
          {
            title: '10. Campaigns, Analytics & AI Features',
            content: `**10.1 Analytics accuracy.** Analytics and metrics displayed in the Service come from the connected platforms' APIs and our own tracking. We present them in good faith, but platform-reported numbers can be delayed, revised, or estimated by the platforms themselves. Where no accounts are connected, dashboards intentionally show empty states rather than sample data.\n\n**10.2 Posting times & trends.** Suggested posting times, trending hashtags, and sounds are data-driven estimates for the Kenyan market (EAT). They are not guarantees of performance.\n\n**10.3 A/B testing.** Variation features publish distinct content versions to measure performance. You are responsible for ensuring each variation complies with section 6.\n\n**10.4 Feature changes.** We may add, modify, or discontinue features (including AI providers) to improve the Service; material reductions to paid features will be handled per section 4.7.`,
          },
          {
            title: '11. Intellectual Property',
            content: `The Service — including its software, design, text, graphics, logos, the "Yoyzie" name and marks, and all related intellectual property — is owned by Yoyzie AI Ltd or its licensors and is protected by Kenyan and international law. Nothing in these Terms transfers any ownership of the Service to you. All rights not expressly granted are reserved.\n\nIf you believe content on the Service infringes your rights, contact legal@yoyzie.ai with details; we will investigate and, where appropriate, remove the content and act against repeat infringers.`,
          },
          {
            title: '12. Data Protection & Security',
            content: `Our collection, use, and protection of your personal data is described in the **Privacy Policy**, which forms part of these Terms. You agree to our processing of data as described there, and to complying with applicable data protection laws in your own use of the Service (including having a lawful basis for any personal data of third parties you import, such as consent when managing accounts for others).`,
          },
          {
            title: '13. Service Availability & Support',
            content: `We aim for high availability but do not guarantee uninterrupted or error-free operation. Maintenance, third-party outages, and events beyond our reasonable control (including internet failures, strikes, natural disasters, war, and government action — "**force majeure**") may affect the Service. We will restore service as soon as reasonably practicable and keep you informed for significant incidents.\n\nFree-plan availability and response times are best-effort. Paid plans include the support commitments shown on your plan page.`,
          },
          {
            title: '14. Disclaimers',
            content: `The Service is provided "**as is**" and "**as available**" without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, and non-insecurity, to the maximum extent permitted by law.\n\nWe do not warrant that: the Service will meet your requirements or achieve any particular growth or revenue outcome; AI-generated content will be accurate or error-free; analytics will be complete or real-time; or defects will be corrected. You use the Service at your own risk.\n\nNothing in this section limits liability that cannot be limited under Kenyan law, including for death or personal injury caused by negligence or for fraud.`,
          },
          {
            title: '15. Limitation of Liability',
            content: `To the maximum extent permitted by law, Yoyzie's total aggregate liability arising out of or relating to the Service or these Terms is limited to the greater of:\n\n• the fees you paid to us in the **12 months** before the event giving rise to the claim, or\n• **KES 10,000**.\n\nWe are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, data, goodwill, or business opportunities, however caused and on any theory of liability.\n\nWe are not liable for the acts or omissions of third-party platforms (including content removals, account restrictions, or API changes by Meta, TikTok, X, LinkedIn, Safaricom, Stripe, or others).\n\nThese limits do not apply to liability that cannot lawfully be limited, including for fraud, fraudulent misrepresentation, death or personal injury from negligence, or your liability for infringement of our intellectual property.`,
          },
          {
            title: '16. Indemnity',
            content: `You agree to indemnify and hold harmless Yoyzie AI Ltd, its directors, employees, and agents from claims, damages, losses, and reasonable legal costs arising from:\n\n• Your Content (including claims that it infringes third-party rights or violates law)\n• Your breach of these Terms, the Acceptable Use rules, or applicable law\n• Your use of third-party platforms through the Service in violation of their terms\n• Your infringement of our intellectual property\n\nWe will notify you promptly of any claim and give you reasonable control of the defence and settlement (we may participate with our own counsel). This indemnity does not apply to the extent a claim is caused by our breach of these Terms.`,
          },
          {
            title: '17. Termination',
            content: `**By you.** You may stop using the Service and delete your account at any time from Settings or via yoyzie.ai/data-deletion. Paid periods already charged are not refunded (see section 4.7).\n\n**By us.** We may suspend or terminate your access:\n\n• for material breach of these Terms (including the Acceptable Use rules) — with notice and a chance to remedy where the breach is curable and not serious\n• immediately, for serious breaches: illegal content, CSAM, fraud, fake engagement at scale, harassment, or security abuse\n• if required by law or a platform, or if we discontinue the Service (in which case we will give at least **30 days' notice** and refund prepaid, unused fees proportionately)\n\n**Effect of termination.** Your licence ends; we disable logins and sessions; scheduled posts stop. We retain data as described in the Privacy Policy (deletion within 30 days, legal-keeping exceptions). Sections that by their nature should survive termination (intellectual property, disclaimers, liability limits, indemnity, governing law) do so.`,
          },
          {
            title: '18. Changes to the Service or These Terms',
            content: `We may modify these Terms as the Service evolves. If a change materially reduces your rights or materially increases your obligations, we will notify you by email or in-product at least **14 days** before it takes effect. Other changes take effect when posted with an updated "Last updated" date.\n\nIf you do not agree to an updated version, you may cancel before it takes effect; continuing to use the Service after that date means you accept the updated Terms. To the extent an updated Term conflicts with a signed Enterprise agreement, that agreement prevails for that customer.`,
          },
          {
            title: '19. Governing Law & Dispute Resolution',
            content: `These Terms are governed by the laws of the **Republic of Kenya**, without regard to conflict-of-law rules.\n\n**Good-faith resolution.** Before starting formal proceedings, contact support@yoyzie.ai — we will try to resolve any dispute within 30 days.\n\n**Courts.** Any dispute not resolved amicably shall be subject to the **exclusive jurisdiction of the courts of Kenya**, seated in Nairobi. Either party may seek urgent injunctive relief in any competent court to protect intellectual property or confidential information.\n\n**Consumers.** If mandatory consumer-protection law in your country of residence gives you the right to bring proceedings locally, this section does not deprive you of that right.`,
          },
          {
            title: '20. General Provisions',
            content: `• **Entire agreement** — These Terms and the Privacy Policy are the entire agreement between us regarding the Service, superseding any prior terms.\n• **Severability** — If any provision is found unenforceable, it will be modified to the minimum extent necessary and the rest stays in force.\n• **No waiver** — Our failure to enforce a provision is not a waiver of it.\n• **Assignment** — You may not assign these Terms without our written consent; we may assign them as part of a merger or sale of the business (we will notify you).\n• **Notices** — Legal notices to Yoyzie go to legal@yoyzie.ai; notices to you go to your account email and are deemed received 24 hours after sending.\n• **Language** — These Terms are in English; any translations are for convenience only.\n• **Third-party beneficiaries** — No third party has rights to enforce these Terms.`,
          },
          {
            title: '21. Contact',
            content: `Questions about these Terms:\n\n• **Legal:** legal@yoyzie.ai\n• **Support:** support@yoyzie.ai\n• **Privacy:** privacy@yoyzie.ai\n• **Postal:** Yoyzie AI Ltd, Nairobi, Kenya`,
          },
        ].map(section => (
          <section key={section.title} className="mb-10">
            <h2 style={{ fontFamily: 'var(--font-display)', color: '#E8C96A' }}
              className="text-xl font-bold mb-4">{section.title}</h2>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {section.content.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('•') ? 'ml-4' : ''}
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:rgba(255,255,255,0.9)">$1</strong>')
                  }} />
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 pt-8 border-t flex flex-wrap gap-4 text-sm"
          style={{ borderColor: 'rgba(201,168,76,0.1)', color: 'rgba(255,255,255,0.4)' }}>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/data-deletion" className="hover:text-white transition-colors">Data Deletion</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to Yoyzie AI</Link>
        </div>
      </div>
    </div>
  );
}
