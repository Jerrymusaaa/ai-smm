import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Privacy Policy — Yoyzie AI' };

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Last updated: {updated}</p>

        {[
          {
            title: '1. Who We Are (Data Controller)',
            content: `Yoyzie AI ("we", "our", "us", "Yoyzie") is a Kenya-based AI-powered social media management and influencer marketing platform operated by **Yoyzie AI Ltd**, a company registered in the Republic of Kenya, with its principal place of business in Nairobi, Kenya.\n\nFor the purposes of the Kenya Data Protection Act, 2019 ("**DPA**"), the EU General Data Protection Regulation ("**GDPR**"), and other applicable data protection laws, Yoyzie AI Ltd is the **data controller** of your personal data described in this policy.\n\nYou can contact us for any privacy matter at **privacy@yoyzie.ai** (see section 19 for full contact details and our Data Protection Officer contact).`,
          },
          {
            title: '2. Scope of This Policy',
            content: `This policy applies to:\n\n• Visitors to our website at yoyzie.ai and any subdomains\n• Registered users of the Yoyzie AI platform (individuals, influencers, businesses, and enterprises)\n• Influencers who join our marketplace and receive payouts through their Yoyzie wallet\n• Anyone who contacts our support, sales, or privacy teams\n\nIt covers all personal data we collect through the platform, our website, emails, support channels, and integrations you connect. It does **not** cover the practices of third-party platforms (such as Instagram, TikTok, X/Twitter, LinkedIn, Safaricom, or Stripe) — those are governed by their own privacy policies, which we encourage you to read.`,
          },
          {
            title: '3. The Data We Collect',
            content: `We collect only the data we need to operate the platform. The categories below describe **what** we collect, **where** it comes from, and **why**.\n\n**3.1 Account Data** (collected from you at registration)\nFull name, email address, password (stored only as a bcrypt hash — never in plain text), account type (individual, influencer, business, enterprise), selected plan, company name, profile photo, phone number (optional), timezone, language preference, and your acceptance record of our Terms of Service and Privacy Policy (including the date and time you accepted).\n\n**3.2 Profile & Public Data** (collected from you or the platforms you connect)\nDisplay name, bio, website, social handles, and avatar.\n\n**3.3 Social Media Connection Data** (collected from the platforms you connect)\nWhen you connect a social account (Instagram, TikTok, X/Twitter, LinkedIn, Facebook, YouTube, and others we support), we receive OAuth access and refresh tokens, your platform user ID, username, display name, follower/following counts, and basic profile fields. With your authorisation we also read post-level metrics (likes, comments, shares, impressions, reach) and account insights for the accounts you connect. We request the **minimum permissions (OAuth scopes)** needed to provide posting, scheduling, and analytics features.\n\n**3.4 Content Data** (created by you)\nDrafts, captions, hashtags, scheduled and published posts, media files you upload, AI prompts you submit, and AI-generated outputs produced for you.\n\n**3.5 AI Training & Personalisation Data**\nTo make AI output sound like you, our AI analyses the captions and content styles of your connected accounts (your "voice"). This analysis happens on your own content only, for your benefit only, and is not used to train foundation models that serve other customers.\n\n**3.6 Usage & Technical Data** (collected automatically)\nIP address, device and browser type, operating system, pages visited, features used, session timestamps, referral source, and error logs. Some of this is collected via cookies and similar technologies (see section 11).\n\n**3.7 Billing & Payment Data**\nSubscription plan, billing history, invoices, and payment status. Card payments are processed by **Stripe** and mobile money payments are processed by **Safaricom's M-Pesa (Daraja)**. We do **not** store full card numbers or M-Pesa PINs on our servers; we receive only tokens, transaction references, and status confirmations.\n\n**3.8 Influencer Wallet & Payout Data**\nFor influencer accounts: wallet balance, earnings, pending commissions, withdrawal history, and payout destinations (M-Pesa number, PayPal email, or bank account details) needed to send you money.\n\n**3.9 Communications Data**\nEmails you send us and our replies, support conversations, verification emails, password-reset emails, and transactional notifications. If you contact us, we keep a record of that correspondence.\n\n**3.10 Competitor Tracking Data**\nIf you use competitor-tracking features, we process **publicly available** metrics of the public profiles you designate (e.g. public follower counts and public post engagement). We do not access private data of non-users and we do not scrape private pages or gated content.`,
          },
          {
            title: '4. How We Use Your Data',
            content: `We use your personal data to:\n\n• Create and administer your account and authenticate you securely\n• Provide core features: AI caption and hashtag generation, content scheduling, publishing to your connected accounts, analytics dashboards, and campaigns\n• Personalise AI output to your niche, audience, and writing style, and to identify relevant trends (hashtags, sounds, posting times) for your connected accounts\n• Enable A/B testing of post variations and display the results\n• Process subscription payments, invoices, refunds, and influencer payouts via M-Pesa, PayPal, or bank transfer\n• Send transactional communications: email verification, password resets, security alerts, receipts, payout confirmations, and service announcements\n• Send marketing communications **only where you have opted in** — every marketing email contains an unsubscribe link\n• Detect and prevent fraud, spam, fake engagement, bot activity, account takeover, and platform abuse\n• Provide customer support and respond to your requests\n• Monitor aggregate usage trends to maintain and improve the service (using anonymised or aggregated data where possible)\n• Comply with our legal, tax, and regulatory obligations in Kenya and elsewhere\n• Enforce our Terms of Service and protect the rights, property, and safety of Yoyzie, our users, and the public`,
          },
          {
            title: '5. Legal Bases for Processing',
            content: `Under the DPA and GDPR we rely on the following legal bases:\n\n**Contract (performance of a contract):** processing necessary to provide the services you signed up for — account management, AI generation, scheduling, publishing, analytics, billing, and payouts.\n\n**Legitimate interests:** securing our platform, preventing fraud and abuse, maintaining service logs, improving our product, and communicating about service changes — balanced against your rights and expectations.\n\n**Consent:** non-essential cookies, marketing emails, and any optional data uses we present to you as optional. You may withdraw consent at any time without affecting the lawfulness of processing already carried out.\n\n**Legal obligation:** retaining invoices for tax purposes, responding to lawful requests from Kenyan authorities or courts, and other statutory duties.\n\n**Vital interests:** in the rare case of an emergency involving risk to life.\n\nWhere we rely on consent for a specific purpose, we will ask for it clearly and separately from this policy.`,
          },
          {
            title: '6. Social Media Platform Data — Special Terms',
            content: `Connecting a social media account is entirely your choice. When you do:\n\n• We store OAuth access tokens **encrypted at rest** and refresh them only to keep your connection working\n• We act on the platform only within the permissions you granted (e.g. publish posts, read insights)\n• We never sell, rent, or share your platform credentials with third parties\n• We post only what you (or a team member you authorise) create or approve — we never post without your instruction\n• When you disconnect an account, we delete its tokens immediately and stop reading its data\n• Deleting your Yoyzie account deletes all stored platform tokens and connected-account data\n\nYour use of each connected platform remains governed by that platform's terms and privacy policy. **You are responsible** for complying with each platform's rules (including their automation and AI-content disclosure rules) when publishing through Yoyzie. If a platform changes or revokes our API access, features that depend on it may be reduced or suspended.`,
          },
          {
            title: '7. How We Share Your Data',
            content: `We do **not** sell your personal data. We share it only in these limited circumstances:\n\n**Service providers (processors):** companies that process data on our behalf under contract, including:\n\n• **Render** — application hosting and cloud infrastructure\n• **Database & cache providers** — storing your account and content data\n• **Resend** — transactional email delivery on our behalf\n• **DeepSeek / Anthropic** — AI language model providers that generate captions, hashtags, and insights when you use AI features. Prompts are transmitted to the active provider to generate a response; we instruct providers not to use customer data to train their models where such controls are available\n• **Stripe** — card payment processing\n• **Safaricom (M-Pesa Daraja)** — mobile money payment and payout processing\n• **PayPal / banks** — payout processing when you choose those methods\n• **Google / Meta / TikTok / X / LinkedIn and other platforms** — receiving content and API calls you authorise when publishing or reading analytics\n\n**Professional advisers:** auditors, accountants, and lawyers, under confidentiality obligations.\n\n**Business transfers:** if Yoyzie is merged, acquired, or restructured, your data may be transferred as part of that transaction, subject to this policy being honoured (we will notify you).\n\n**Legal requirements:** where compelled by law, court order, or lawful request by Kenyan or foreign authorities, or to protect the rights, property, or safety of Yoyzie, our users, or others. We publish transparency statistics where practical and challenge overbroad requests.\n\n**With your consent:** any other sharing will happen only with your explicit instruction.\n\nWhen processors act on our behalf, we sign **data processing agreements** that restrict how they may use your data and require appropriate security.`,
          },
          {
            title: '8. International Data Transfers',
            content: `Your data may be processed outside Kenya — for example by our hosting provider, AI providers, and payment processors whose infrastructure may be located in the United States, the European Union, or elsewhere.\n\nWhere data is transferred out of Kenya or the EEA, we use safeguards recognised by applicable law, which may include:\n\n• Adequacy determinations by the relevant regulator\n• Standard Contractual Clauses ("SCCs") approved by the European Commission, with supplementary measures where needed\n• Transfer Impact Assessments for higher-risk transfers\n\nYou may request details of the safeguards used for your data by contacting privacy@yoyzie.ai.`,
          },
          {
            title: '9. Data Retention — How Long We Keep Things',
            content: `We keep personal data only as long as needed for the purposes in this policy, then delete or anonymise it:\n\n• **Account & profile data:** for the life of your account. If you delete your account, we erase it within 30 days, except where retention is legally required\n• **Connected social tokens:** deleted immediately on disconnection; within 30 days of account deletion at the latest\n• **Content data (posts, drafts, AI outputs):** for the life of your account; deleted within 30 days of account deletion unless you asked us to keep it\n• **Invoices & billing records:** **7 years**, as required by Kenyan tax law\n• **Wallet & payout records:** **7 years**, for tax and anti-fraud purposes\n• **Support communications:** up to **3 years** after your last interaction\n• **Security & audit logs:** up to **24 months**\n• **Marketing consent records:** for the life of the consent plus 2 years, as evidence\n• **Aggregated/anonymised statistics:** kept indefinitely — this data no longer identifies you\n\nIf a legal dispute or investigation requires it, we may retain specific data until the matter closes (we will restrict its use meanwhile).`,
          },
          {
            title: '10. Your Privacy Rights',
            content: `Depending on your location, you have the following rights over your personal data:\n\n• **Access** — get a copy of your data and information about how it is processed\n• **Rectification** — correct inaccurate or incomplete data\n• **Erasure** — request deletion of your data (subject to legal retention duties)\n• **Restriction** — ask us to pause processing in certain circumstances\n• **Portability** — receive your data in a structured, machine-readable format\n• **Objection** — object to processing based on legitimate interests, including profiling\n• **Withdraw consent** — at any time, for consent-based processing\n• **Not be subject to solely automated decisions** with legal or similarly significant effects (see section 12)\n\n**How to exercise your rights:** use the in-platform settings where available (profile editing, account deletion, marketing unsubscribe), email **privacy@yoyzie.ai**, or use our self-service data deletion page at yoyzie.ai/data-deletion.\n\nWe respond within **30 days** (extendable once by a further 30 days for complex requests, with notice). We may ask for verification of your identity before acting. Requests are free; a reasonable fee may apply only for manifestly unfounded or excessive repetitive requests.\n\n**Right to complain:** if you are unsatisfied with our response, you may lodge a complaint with the **Office of the Data Protection Commissioner (ODPC), Kenya** (www.odpc.go.ke) or, if you are in the EEA, your local supervisory authority. Please contact us first so we can try to resolve it directly.`,
          },
          {
            title: '11. Cookies, Local Storage & Tracking',
            content: `We use cookies and browser local storage for:\n\n**Strictly necessary (always active):** authentication session tokens, security (CSRF protection), load balancing, and remembering your logged-in state. The platform cannot function without these.\n\n**Preferences (active by default, can be cleared):** remembering your chosen theme (light/dark) and interface settings via local storage — these never leave your device and contain no personal identifiers beyond your preferences.\n\n**Analytics (only with consent where required):** aggregated usage statistics that help us understand which features are used so we can improve the product.\n\n**No advertising cookies.** We do not run third-party advertising or cross-site tracking cookies.\n\nYou can control cookies through your browser settings. Disabling strictly necessary cookies will prevent login from working. For questions about our cookie practices, contact privacy@yoyzie.ai.`,
          },
          {
            title: '12. Automated Decision-Making, AI & Profiling',
            content: `Yoyzie uses automation and AI in these ways:\n\n• **AI content generation** — captions, hashtags, trends, and variations are generated by language models at your request. You review and choose what to publish; we do not publish autonomously\n• **Style personalisation (profiling)** — analysing your connected accounts' content style to make suggestions sound like you. This profiling affects only the content suggestions you see; it has no legal or similarly significant effect on you\n• **Best-time recommendations** — statistical analysis of engagement patterns to suggest posting times\n• **Fraud and abuse detection** — automated signals may flag suspicious activity (e.g. credential stuffing, fake engagement). Automated flags may lead to **human review** before any action affecting your account\n\nWe do not make decisions about you that produce legal effects or similarly significant effects based **solely** on automated processing. If this ever changes, we will inform you and provide a way to request human review.\n\nAI-generated content may contain errors or hallucinations. **You are responsible for reviewing** anything generated before publishing it (see our Terms of Service).`,
          },
          {
            title: '13. Data Security',
            content: `We take security seriously and apply industry-standard measures, including:\n\n• **Encryption in transit** (TLS) for all data moving between you and our servers\n• **Encryption at rest** for sensitive secrets such as OAuth tokens, using AES-256\n• **Password hashing** with bcrypt (never stored or transmitted in plain text)\n• **Short-lived access tokens** and refresh-token rotation for sessions\n• **Role-based access control** — staff access to production data is limited, logged, and reviewed\n• **Rate limiting, monitoring, and audit logging** to detect and stop abuse\n• **Least-privilege infrastructure** and secrets managed outside the codebase\n\n**Breach notification:** if a personal data breach is likely to result in a risk to your rights, we will notify the ODPC within **72 hours** of becoming aware, and notify affected users without undue delay where the risk is high, with clear information about what happened and what we are doing.\n\nNo system is 100% secure; we cannot guarantee absolute security, but we are committed to responding quickly and transparently when incidents occur.`,
          },
          {
            title: '14. Children\'s Privacy',
            content: `Yoyzie AI is intended for users aged **18 and over**. We do not knowingly collect personal data from anyone under 18. If we learn that a user is under 18, we will delete their account and associated data.\n\nIf you believe a minor has created an account, contact us at privacy@yoyzie.ai and we will act promptly.`,
          },
          {
            title: '15. Third-Party Links & Embeds',
            content: `Our platform and legal documents may link to third-party websites (e.g. platform documentation, ODPC resources). We are not responsible for their privacy practices. Their use of your data is governed by their own policies — please review them separately.`,
          },
          {
            title: '16. Marketing Communications',
            content: `We send transactional emails (verification, receipts, security alerts, service notices) as needed to operate your account — these are not marketing and you cannot opt out while your account is active.\n\nMarketing emails (product updates, tips, offers) are sent **only with your consent**. Every marketing email includes an unsubscribe link, and you can also opt out from your account settings. Opting out of marketing never affects service emails or the core functionality of your account.`,
          },
          {
            title: '17. Account Deletion & Data Deletion',
            content: `You can delete your account from **Settings → Danger Zone** in the platform, or via yoyzie.ai/data-deletion.\n\nWhat happens when you delete:\n\n• Your login is disabled immediately and sessions are revoked\n• Connected social tokens are deleted immediately\n• Personal data (profile, content, analytics tied to your accounts) is erased within 30 days\n• Records we must keep by law (invoices, payout history) are retained for 7 years in a restricted, access-controlled archive\n• Aggregated, anonymised statistics that no longer identify you may be retained\n\nSome data may persist in encrypted backups for up to **90 days** for disaster-recovery purposes, after which it is permanently deleted; backups are access-controlled and are not used for any operational purpose during that window.`,
          },
          {
            title: '18. Changes to This Policy',
            content: `We may update this Privacy Policy to reflect changes in our practices, technology, legal requirements, or features. When we make material changes, we will:\n\n• Update the "Last updated" date at the top of this page\n• Notify you by email (for significant changes) at least 14 days before they take effect\n• Post a notice in the platform\n\nIf a change requires new consent under applicable law, we will ask for it before processing on that basis. Continued use of the platform after changes take effect constitutes acceptance of the updated policy; if you disagree, you may delete your account.`,
          },
          {
            title: '19. Contact Us & Data Protection Officer',
            content: `For privacy questions, requests, or complaints:\n\n• **Data Protection Officer / Privacy team:** privacy@yoyzie.ai\n• **General support:** support@yoyzie.ai\n• **Self-service deletion:** yoyzie.ai/data-deletion\n• **Postal address:** Yoyzie AI Ltd, Nairobi, Kenya\n\nWe aim to acknowledge all privacy enquiries within **5 business days**.`,
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
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/data-deletion" className="hover:text-white transition-colors">Data Deletion</Link>
          <Link href="/" className="hover:text-white transition-colors">Back to Yoyzie AI</Link>
        </div>
      </div>
    </div>
  );
}
