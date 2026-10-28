import { createPlaygroundClient } from '../lib/api.js';
import { formatAttempt, formatAttemptList, formatList } from '../lib/format.js';

// Read-only smoke test. Submission (the only write path) needs a Playground
// token and is exercised by the unit tests with an injected fetch.
const baseUrl = process.env.PLAYGROUND_API_BASE || 'https://play.bohrium.com';
const client = createPlaygroundClient({ baseUrl, timeoutMs: 30000 });

const result = await client.listChallenges({ perPage: 5 });
console.log(`base: ${client.baseUrl}`);
console.log(`total: ${result.total}, pages: ${result.pages}`);
console.log('');
console.log(formatList(result));

const first = result.items[0];
if (first) {
  const detail = await client.getChallenge(first.id);
  console.log('');
  console.log(`detail: ${detail.id} · ${detail.title} · content chars: ${detail.content.length} · resources: ${detail.resources.length}`);

  const attempts = await client.listAttempts(first.id, { limit: 5, sort: 'score' });
  console.log('');
  console.log(formatAttemptList({ ...attempts, challengeId: first.id }));

  const target = attempts.items[0];
  if (target) {
    const attempt = await client.getAttempt(target.id);
    console.log('');
    console.log(formatAttempt(attempt));
  }
}
