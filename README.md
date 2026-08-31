# Goalwire admin dashboard

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to your environment and set `TIKTOK_ACCESS_TOKEN` to an OAuth access token issued for the TikTok account that will publish.
3. In one terminal run `npm run server`; in another run `npm run dev`.

## TikTok posting

The dashboard schedules a post through the local API at `/api/tiktok/schedules`. When the scheduled time arrives, the server sends the public HTTPS video URL to TikTok's Content Posting API with `PULL_FROM_URL`.

Keep the OAuth access token server-side. The browser only calls the local API and never receives the token. The connected TikTok application and account must have the Content Posting API capability and the appropriate publishing authorization before submissions can succeed.

Schedules are held in memory in this starter implementation; use a durable job queue or database before deploying it to production.
