# Claude Guidelines - Viber Webhook & Bot Integration

## Project Overview
This repository contains:
1. **Webhook & Channel Post API Server**: Bun + Hono application deployable to Vercel Edge.
2. **Antigravity & Agent Plugin**: Bundled MCP server, skills, and agents for controlling Viber channels and bots.

## Common Commands
- `bun dev` - Start the local development server on port 3000
- `bun run install:plugin` - Install the plugin into Antigravity
- `bunx vercel --prod` - Deploy the serverless webhook service to Vercel

## Viber MCP Server Configuration
To use with Claude Desktop or Claude Code, add to your MCP settings:
```json
{
  "mcpServers": {
    "viber": {
      "command": "npx",
      "args": ["-y", "@serhii.zghama/viber-mcp"],
      "env": {
        "VIBER_AUTH_TOKEN": "your-viber-auth-token",
        "VIBER_SENDER_NAME": "MyBot"
      }
    }
  }
}
```
