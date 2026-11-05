# Viber Bot & Channel Plugin for Antigravity

Integrate and automate Rakuten Viber Bot & Channels Post API directly within Antigravity. Powered by `@serhii.zghama/viber-mcp`, this plugin provides MCP tools for messaging, broadcasting, media sharing, user profiling, and webhook administration.

## Features

- **Channel Publishing & 1-on-1 Messaging**: Post updates to Viber Channels or chat 1-on-1 with users.
- **Rich Media**: Send pictures, MP4 videos, documents/files, locations, and contact cards.
- **Audience Broadcasting**: Broadcast announcements to lists of up to 300 Viber subscribers.
- **Account & Insights**: Query subscriber metrics, channel status, user profiles, and online presence.
- **Webhook Administration**: Register and manage HTTPS callback webhooks.

## Installation

### Method 1: Using the install script
From the root of this repository:
```bash
bun run install:plugin
# or
npm run install:plugin
```

### Method 2: Manual Installation
Copy the `plugin` folder into your global Antigravity plugins directory:

- **Windows:**
  ```powershell
  Copy-Item -Recurse -Force plugin "$HOME\.gemini\config\plugins\viber"
  ```
- **macOS / Linux:**
  ```bash
  mkdir -p ~/.gemini/config/plugins/viber
  cp -r plugin/* ~/.gemini/config/plugins/viber/
  ```

## Configuration

In your `~/.gemini/config/plugins/viber/mcp_config.json` (or via environment variables):

```json
{
  "mcpServers": {
    "viber": {
      "command": "npx",
      "args": [
        "-y",
        "@serhii.zghama/viber-mcp"
      ],
      "env": {
        "VIBER_AUTH_TOKEN": "your-viber-auth-token",
        "VIBER_SENDER_NAME": "MyBot"
      }
    }
  }
}
```

Replace `your-viber-auth-token` with your Viber Bot/Channel authentication token.
