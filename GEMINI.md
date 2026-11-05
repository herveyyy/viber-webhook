# Viber Integration: Antigravity Agent Guidelines

Follow the conversational flow in `AGENTS.md`:
1. Ask the user for their Viber Auth Token (Channel info -> Developer Tools).
2. Ask if they want to:
   - (A) Use the hosted webhook (instant, no sign-in)
   - (B) Deploy to their own Vercel account (ask for their project name)
3. Run `node scripts/setup.js` with their chosen flags.
4. Report that their channel is connected and verified.
