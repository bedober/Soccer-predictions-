import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3001);
const tiktokApi = 'https://open.tiktokapis.com/v2';
const schedules = new Map();

app.use(express.json({ limit: '1mb' }));

function validatePost(body) {
  const { title, videoUrl, privacyLevel } = body;
  if (!title?.trim()) return 'A post title is required.';
  if (!videoUrl || !/^https:\/\//.test(videoUrl)) return 'A publicly reachable HTTPS video URL is required.';
  if (!['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'].includes(privacyLevel)) return 'Select a valid TikTok privacy level.';
  return null;
}

async function publishToTikTok(post) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) throw new Error('TIKTOK_ACCESS_TOKEN is not configured on the server.');
  const response = await fetch(`${tiktokApi}/post/publish/video/init/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      post_info: {
        title: post.title,
        privacy_level: post.privacyLevel,
        disable_duet: post.disableDuet,
        disable_comment: post.disableComment,
        disable_stitch: post.disableStitch,
      },
      source_info: { source: 'PULL_FROM_URL', video_url: post.videoUrl },
    }),
  });
  const payload = await response.json();
  if (!response.ok || payload.error?.code !== 'ok') throw new Error(payload.error?.message || 'TikTok rejected the post request.');
  return payload.data;
}

async function executeSchedule(id) {
  const scheduled = schedules.get(id);
  if (!scheduled || scheduled.status !== 'scheduled') return;
  try {
    const data = await publishToTikTok(scheduled);
    schedules.set(id, { ...scheduled, status: 'submitted', publishId: data.publish_id, updatedAt: new Date().toISOString() });
  } catch (error) {
    schedules.set(id, { ...scheduled, status: 'failed', error: error.message, updatedAt: new Date().toISOString() });
  }
}

function armSchedule(id, publishAt) {
  const delay = new Date(publishAt).getTime() - Date.now();
  if (delay <= 0) return executeSchedule(id);
  // Re-arm in bounded intervals so long future dates do not overflow setTimeout.
  setTimeout(() => armSchedule(id, publishAt), Math.min(delay, 2_147_000_000));
}

app.post('/api/tiktok/posts', async (req, res) => {
  const validationError = validatePost(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const data = await publishToTikTok(req.body);
    return res.status(202).json({ status: 'submitted', publishId: data.publish_id });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
});

app.post('/api/tiktok/schedules', (req, res) => {
  const validationError = validatePost(req.body);
  const publishAt = new Date(req.body.publishAt);
  if (validationError) return res.status(400).json({ error: validationError });
  if (Number.isNaN(publishAt.getTime()) || publishAt <= new Date()) return res.status(400).json({ error: 'Choose a future publish date and time.' });
  const id = crypto.randomUUID();
  const scheduled = { id, ...req.body, status: 'scheduled', createdAt: new Date().toISOString() };
  schedules.set(id, scheduled);
  armSchedule(id, scheduled.publishAt);
  return res.status(201).json(scheduled);
});

app.get('/api/tiktok/schedules', (_req, res) => res.json([...schedules.values()]));

app.listen(port, () => console.log(`Goalwire API listening at http://localhost:${port}`));
