export function verificationEmailHtml({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Yoyzie AI account</title>
</head>
<body style="margin:0;padding:0;background-color:#050A14;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050A14;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#0D1525;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:560px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0066FF,#00D4AA);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-size:18px;font-weight:bold;">⚡</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">Yoyzie AI<span style="color:#0066FF;">.</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                Verify your email address
              </h1>
              <p style="margin:0 0 24px;color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;">
                Hi ${name || 'there'}, welcome to Yoyzie AI! Click the button below to verify your email and activate your account.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#0066FF;border-radius:12px;box-shadow:0 8px 32px rgba(0,102,255,0.3);">
                    <a href="${verificationUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:-0.2px;">
                      Verify my email →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.06);font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:13px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;word-break:break-all;">
                <a href="${verificationUrl}" style="color:#0066FF;font-size:13px;text-decoration:none;">${verificationUrl}</a>
              </p>

              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:13px;line-height:1.6;">
                This link expires in <strong style="color:rgba(255,255,255,0.5);">24 hours</strong>. 
                If you didn't create a Yoyzie AI account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;text-align:center;">
                © 2025 Yoyzie AI · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
