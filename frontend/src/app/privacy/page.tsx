import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Privacy Policy — Yoyzie AI' };

export default function PrivacyPage() {
  const updated = 'July 14, 2026';

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
            title: '1. Introduction',
            content: `Yoyzie AI ("we", "our", "us") is a Kenya-based AI-powered social media management and influencer marketing platform operated by Yoyzie AI Ltd. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our services at yoyzie.ai.\n\nBy using Yoyzie AI, you agree to the practices described in this policy. If you do not agree, please do not use our services.\n\nThis policy complies with the Kenya Data Protection Act 2019, the EU General Data Protection Regulation (GDPR), and other applicable data protection laws.`,
          },
          {
            title: '2. Data We Collect',
            content: `We collect the following categories of data:\n\n**Account Data:** Name, email address, phone number, profile photo, company name, job role, account type, and password (stored as a secure hash — we never store your plain-text password).\n\n**Social Media Data:** When you connect social accounts (Instagram, TikTok, Twitter/X, LinkedIn, etc.), we receive OAuth access tokens, your username, follower count, post metrics, and analytics data from those platforms. We only request the minimum permissions needed.\n\n**Content Data:** Posts, captions, hashtags, and media files you create or upload through Yoyzie AI.\n\n**Usage Data:** Pages visited, features used, session duration, device type, browser, and IP address.\n\n**Payment Data:** For billing, we collect payment method details. Card data is processed by Stripe and M-Pesa is processed by Safaricom Daraja. We do not store full card numbers on our servers.\n\n**AI Interaction Data:** Prompts you send to our AI assistant and the responses generated, to improve the service and maintain context within a session.\n\n**Influencer Wallet Data:** For influencer accounts — earnings, withdrawal history, M-Pesa numbers, PayPal emails, and bank details necessary for payouts.`,
          },
          {
            title: '3. How We Use Your Data',
            content: `We use your data to:\n\n• Provide, operate, and improve the Yoyzie AI platform\n• Generate AI-powered captions, hashtags, and content suggestions\n• Schedule and publish content to your connected social accounts on your behalf\n• Process payments and manage your subscription\n• Process influencer payouts via M-Pesa, PayPal, or bank transfer\n• Send transactional emails (account verification, password reset, payment receipts)\n• Detect and prevent fraud, bot activity, and platform abuse\n• Comply with legal obligations under Kenyan and international law\n• Provide customer support\n• Analyse aggregate usage trends to improve our product (we anonymise data for this purpose)`,
          },
          {
            title: '4. Legal Basis for Processing',
            content: `We process your data under the following legal bases:\n\n**Contract:** Processing necessary to deliver the services you signed up for.\n\n**Legitimate Interest:** Analytics to improve our service, security monitoring, and fraud prevention.\n\n**Consent:** Where we ask for your consent (e.g. marketing emails), you may withdraw it at any time.\n\n**Legal Obligation:** Where we are required to process data to comply with Kenyan law or court orders.`,
          },
          {
            title: '5. Social Media Platform Data',
            content: `When you connect a social media account, you authorise Yoyzie AI to act on your behalf. We:\n\n• Store OAuth access tokens encrypted at rest using AES-256 encryption\n• Use tokens only to perform actions you have authorised (posting, reading analytics)\n• Never sell or share your social media credentials with third parties\n• Refresh tokens automatically when they expire\n• Delete tokens immediately when you disconnect an account\n\nYour connected platform data is governed by both this policy and the privacy policies of those platforms (Meta, TikTok, Twitter/X, LinkedIn, etc.).`,
          },
          {
            title: '6. Data Sharing',
            content: `We do not sell your personal data. We share data only with:\n\n**Service Providers:** Cloud hosting (AWS/Vercel), payment processors (Stripe, Safaricom Daraja, PayPal), email delivery (Resend), and analytics tools. All providers are contractually bound to protect your data.\n\n**AI Providers:** Prompts sent to our AI assistant are processed by AI model providers. We do not send your full profile or sensitive financial data in these requests.\n\n**Law Enforcement:** Where required by law, court order, or to prevent imminent harm.\n\n**Business Transfers:** If Yoyzie AI is acquired or merges with another entity, your data may be transferred. We will notify you in advance.`,
          },
          {
            title: '7. Data Retention',
            content: `We retain your data for as long as your account is active plus an additional period required by law or legitimate business purposes:\n\n• Account data: Retained for the duration of your account plus 90 days after deletion\n• Payment records: 7 years as required by Kenyan financial regulations\n• Social media tokens: Deleted immediately upon account disconnection\n• AI conversation logs: Deleted after 90 days\n• Analytics data: Retained for up to 2 years in aggregate, anonymised form`,
          },
          {
            title: '8. Your Rights',
            content: `Under the Kenya Data Protection Act 2019 and GDPR, you have the right to:\n\n• **Access:** Request a copy of all personal data we hold about you\n• **Correction:** Request correction of inaccurate data\n• **Deletion:** Request deletion of your account and personal data (see our Data Deletion page)\n• **Portability:** Receive your data in a machine-readable format\n• **Restriction:** Request that we stop certain processing activities\n• **Objection:** Object to processing based on legitimate interest\n• **Withdraw Consent:** Withdraw marketing consent at any time\n\nTo exercise these rights, email us at privacy@yoyzie.ai or use the data deletion page at yoyzie.ai/data-deletion. We will respond within 30 days.`,
          },
          {
            title: '9. Security',
            content: `We protect your data using industry-standard security measures including:\n\n• HTTPS/TLS encryption for all data in transit\n• AES-256 encryption for sensitive data at rest (OAuth tokens, wallet details)\n• Bcrypt hashing for passwords (we never store plain-text passwords)\n• JWT authentication with short-lived access tokens (60 minutes)\n• Rate limiting and brute-force protection on all authentication endpoints\n• Regular security audits and penetration testing\n• Role-based access controls for internal staff\n• Immutable audit logs for all admin actions\n\nDespite these measures, no system is 100% secure. If you discover a security vulnerability, please report it to security@yoyzie.ai.`,
          },
          {
            title: '10. Cookies',
            content: `We use the following types of cookies:\n\n• **Essential cookies:** Required for login sessions and security (cannot be disabled)\n• **Analytics cookies:** Help us understand how users interact with the platform (opt-out available)\n• **Preference cookies:** Store your settings like theme and language\n\nWe do not use advertising or tracking cookies. You can manage cookie preferences in your browser settings.`,
          },
          {
            title: '11. Children\'s Privacy',
            content: `Yoyzie AI is not intended for users under 18 years of age. We do not knowingly collect personal data from children. If we discover we have collected data from a minor, we will delete it immediately. If you believe a minor has registered, please contact us at privacy@yoyzie.ai.`,
          },
          {
            title: '12. International Transfers',
            content: `Your data may be processed on servers located outside Kenya (e.g. in the EU or USA) by our cloud service providers. We ensure appropriate safeguards are in place for these transfers, including standard contractual clauses where required.`,
          },
          {
            title: '13. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email and by posting a notice on the platform. The updated policy will be effective from the date shown at the top of this page.`,
          },
          {
            title: '14. Contact Us',
            content: `For privacy-related questions or to exercise your rights:\n\n• Email: privacy@yoyzie.ai\n• Data Deletion: yoyzie.ai/data-deletion\n• Postal: Yoyzie AI Ltd, Nairobi, Kenya\n\nFor general support: support@yoyzie.ai`,
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
