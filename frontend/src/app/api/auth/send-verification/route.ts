import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { verificationEmailHtml } from '@/lib/emails';

// Lazily instantiate the Resend client so builds don't require RESEND_API_KEY;
// it is only needed when this route actually handles a request.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64url');
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const isDev = process.env.NODE_ENV === 'development';

    const { data, error } = await getResend().emails.send({
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
