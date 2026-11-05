---
name: viber-bot
description: Manage and operate Rakuten Viber bots & channels via MCP — send text messages, images, video, files, locations, contacts, broadcasts, inspect user profiles, and configure webhooks.
---

# Viber Bot & Channel Skill

This skill guides interaction with the Rakuten Viber Bot & Channels Post API using the `viber` MCP server tools powered by `@serhii.zghama/viber-mcp`.

## Available Tools & Usage

### 1. Messaging & Channel Posts

- **`send_message`**: Sends a plain text message to a specific Viber user (1-on-1).
  - `receiver`: (string) Viber user ID of the recipient.
  - `text`: (string) The text message body.
  - `sender`: (optional object) `{ name: string, avatar: string }` display override.

- **`send_picture`**: Sends an image to a user.
  - `receiver`: (string) Viber user ID.
  - `media`: (string) Public HTTPS URL of the image (JPEG, PNG).
  - `text`: (optional string) Caption for the image.

- **`send_video`**: Sends a video message.
  - `receiver`: (string) Viber user ID.
  - `media`: (string) Public HTTPS URL of the video (MP4).
  - `size`: (number) Video file size in bytes (max 26MB).
  - `duration`: (number) Video duration in seconds.

- **`send_file`**: Sends a document or generic file.
  - `receiver`: (string) Viber user ID.
  - `media`: (string) Public HTTPS URL of the file (max 50MB).
  - `size`: (number) File size in bytes.
  - `file_name`: (string) Name including extension (e.g. `report.pdf`).

- **`broadcast_message`**: Broadcasts a message to multiple recipients (up to 300 user IDs).
  - `broadcast_list`: (array of strings) Viber user IDs.
  - `text`: (string) Message text.

### 2. Account & User Management

- **`get_account_info`**: Retrieves current bot/channel details, webhook status, subscriber count, and superadmin member IDs.
- **`get_user_details`**: Retrieves profile details for a given Viber user ID.
- **`get_online`**: Checks whether specified user IDs are currently active / online.

### 3. Webhook Management

- **`set_webhook`**: Registers a public HTTPS endpoint with Viber.
  - `url`: (string) HTTPS callback URL (must respond with HTTP 200 to `{"event": "webhook"}`).
- **`remove_webhook`**: Unsets the current webhook.

## Channel Post API (Publishing Announcements)

For Viber **Channels** (broadcasting to all subscribers):
Send a POST request to `https://chatapi.viber.com/pa/post` with:
```json
{
  "from": "<superadmin_user_id>",
  "type": "text",
  "text": "Your channel announcement"
}
```
Requires headers `X-Viber-Auth-Token` and `Content-Type: application/json`.
An active webhook must be set before sending posts.
