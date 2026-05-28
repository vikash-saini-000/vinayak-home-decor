const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #000000; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
    .header { padding: 40px 32px 24px; text-align: center; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); }
    .logo { font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #a78bfa; }
    .body { padding: 32px; }
    .body h2 { color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 16px; }
    .body p { color: #a1a1aa; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .cta { display: inline-block; padding: 14px 32px; background: #ffffff; color: #000000; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; margin-top: 8px; }
    .footer { padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); }
    .footer p { color: #52525b; font-size: 12px; margin: 0; }
    .highlight { color: #a78bfa; font-weight: 600; }
    .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }
  </style>
</head>
<body>
  <div style="padding: 24px;">
    <div class="container">
      <div class="header">
        <div class="logo">campus<span>crush</span></div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>Campus Crush — Anonymous mutual matching for college students.</p>
        <p style="margin-top: 8px;">This is an automated message. Please do not reply.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const welcomeTemplate = (name) =>
  baseTemplate(`
    <h2>Welcome, ${name}! 💫</h2>
    <p>You've joined the most private way to discover mutual feelings on campus.</p>
    <div class="divider"></div>
    <p><span class="highlight">How it works:</span></p>
    <p>1. Search and add your secret crushes</p>
    <p>2. If they add you back, we'll notify both of you</p>
    <p>3. Identities stay hidden until you both agree to reveal</p>
    <div class="divider"></div>
    <p>Your privacy is our priority. No one will ever know you added them unless it's mutual — and even then, only with your explicit consent.</p>
    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="cta">Open Dashboard</a>
  `);

const mutualCrushTemplate = (name) =>
  baseTemplate(`
    <h2>Someone feels the same way 👀</h2>
    <p>Hey ${name},</p>
    <p>One of the people you added as a crush has <span class="highlight">also added you</span>.</p>
    <div class="divider"></div>
    <p>Their identity is still hidden. You can choose to:</p>
    <p>✨ <strong>Reveal Match</strong> — if they also agree, identities become visible</p>
    <p>🤫 <strong>Not Now</strong> — keep it hidden for later</p>
    <p>❌ <strong>Decline</strong> — permanently hide this match</p>
    <div class="divider"></div>
    <p>Head to your dashboard to respond.</p>
    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="cta">View Pending Matches</a>
  `);

const matchRevealedTemplate = (name, matchName) =>
  baseTemplate(`
    <h2>It's a match! 🎉</h2>
    <p>Hey ${name},</p>
    <p>Both you and <span class="highlight">${matchName}</span> agreed to reveal your identities.</p>
    <div class="divider"></div>
    <p>The feelings are mutual. What happens next is up to you both.</p>
    <p>You can now see each other's profiles on your dashboard.</p>
    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="cta">See Your Match</a>
  `);

module.exports = { welcomeTemplate, mutualCrushTemplate, matchRevealedTemplate };
