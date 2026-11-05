# Viber Bot & Channel Operational Guidelines

When interacting with the Viber Messenger Bot & Channels Post API via MCP:

## 1. Message Dispatch & Recipient Validation
- **Channels vs 1-on-1 Chats:**
  - **Viber Channels:** Posts are published to all subscribers using the Channel Superadmin ID as the sender (`from`), calling `/pa/post`.
  - **1-on-1 Bot Chats:** Target `receiver` must be a valid Viber User ID (obtained through subscription callbacks or incoming webhook events). Phone numbers cannot be passed directly as the `receiver` for `send_message`.
- **Broadcast Lists:** Viber restricts broadcast calls to a maximum of 300 recipient IDs per request. Batch larger lists into multiple calls.

## 2. Webhook Requirements
- Viber requires an active public HTTPS webhook with a trusted CA-issued SSL certificate to enable outbound messaging and receive incoming callbacks.
- Webhook endpoints must respond to Viber verification pings (`{"event": "webhook"}`) with HTTP 200 OK.
- Do not call `set_webhook` or `remove_webhook` unless explicitly requested by the user, as changing webhooks disrupts message routing.

## 3. Media & File Hosting Requirements
- **HTTPS Only:** All URLs for pictures (`send_picture`), videos (`send_video`), and files (`send_file`) must be publicly accessible over HTTPS with valid SSL certificates.
- **Supported Formats:**
  - Pictures: JPEG, PNG. Max file size: 1MB for photos, 3MB for high-res.
  - Video: MP4, H264. Max file size: 26MB. Duration specified in seconds.
  - Files: Document formats (PDF, DOCX, ZIP, etc.). Max file size: 50MB.

## 4. Privacy & Token Security
- Never expose or log the raw `VIBER_AUTH_TOKEN` in plain conversation text.
- Respect user privacy: never export or log personal user details (phone numbers, full names, locations) returned from Viber API calls to untrusted external systems.
