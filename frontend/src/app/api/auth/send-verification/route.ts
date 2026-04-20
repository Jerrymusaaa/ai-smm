import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { verificationEmailHtml } from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64url');
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const isDev = process.env.NODE_ENV === 'development';

    const { data, error } = await resend.emails.send({
      from: 'Yoyzie AI <onboarding@resend.dev>',
      // In development, Resend only delivers to your own verified email
      // Replace the line below with your Resend account email while testing locally
      to: isDev ? process.env.RESEND_TEST_EMAIL! : email,
      subject: 'Verify your Yoyzie AI account',
      html: verificationEmailHtml({ name, verificationUrl }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Verification email sent:', data?.id);
    console.log('Verification URL:', verificationUrl);

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Send verification error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
