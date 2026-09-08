import { Platform, Share } from 'react-native';
import { PROFILE, REPOS, SKILLS, TIMELINE } from '../data/profile';

/**
 * Builds a self-contained HTML resume from the live profile data and hands it
 * to the platform's native save path:
 *
 *   web  -> Blob + anchor download (progressive, works offline)
 *   app  -> expo-file-system write + expo-sharing sheet
 */

export const RESUME_FILENAME = 'Moe-Kyaw-Aung-Resume.html';

const pick = (list: typeof REPOS) =>
  list
    .map(
      (r) => `
        <div class="proj">
          <div class="proj-top">
            <span class="proj-name">${r.displayName}</span>
            <span class="meta">${r.language} · &#9733; ${r.stars} · ${r.forks} fork${r.forks === 1 ? '' : 's'}</span>
          </div>
          <p class="desc">${r.description}</p>
          <ul>${r.features.map((f) => `<li>${f}</li>`).join('')}</ul>
          <a href="${r.url}">${r.url.replace('https://', '')}</a>
        </div>`,
    )
    .join('');

export function buildResumeHtml(): string {
  const skillSections = SKILLS.map(
    (g) => `
      <h3>${g.title}</h3>
      <p class="skills">${g.items.map((i) => i.name).join(' · ')}</p>`,
  ).join('');

  const history = TIMELINE.map(
    (t) => `
      <div class="job">
        <div class="job-top"><strong>${t.title}</strong><span class="meta">${t.year}</span></div>
        <div class="place">${t.place}</div>
        <p>${t.body}</p>
      </div>`,
  ).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${PROFILE.name} — Resume</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 40px 22px 64px;
    background: #F7F2EA; color: #1B1610;
    font: 15px/1.62 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .sheet { max-width: 860px; margin: 0 auto; }
  header { border-bottom: 2px solid #E3A857; padding-bottom: 22px; margin-bottom: 28px; }
  h1 { font-size: 34px; letter-spacing: -0.7px; margin: 0 0 6px; font-weight: 650; }
  .role { font-size: 17px; color: #B9722F; font-weight: 600; margin: 0 0 12px; }
  .contact { color: #6B6152; font-size: 13.5px; display: flex; flex-wrap: wrap; gap: 6px 16px; }
  .contact a { color: #1B1610; }
  h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #B9722F; margin: 34px 0 12px; }
  h3 { font-size: 14px; margin: 16px 0 4px; }
  p { margin: 6px 0 10px; }
  .lead { font-size: 15.5px; color: #3A342A; }
  .skills { color: #6B6152; margin: 0 0 4px; }
  .job { padding: 12px 0; border-top: 1px solid rgba(60,42,24,0.10); }
  .job:first-of-type { border-top: 0; }
  .job-top, .proj-top { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
  .place { color: #B9722F; font-size: 13px; font-weight: 600; }
  .meta { color: #9A8F7E; font-size: 12px; white-space: nowrap; }
  .proj { padding: 14px 0; border-top: 1px solid rgba(60,42,24,0.10); }
  .proj:first-of-type { border-top: 0; }
  .proj-name { font-weight: 640; font-size: 15.5px; }
  .desc { color: #3A342A; }
  ul { margin: 6px 0 8px; padding-left: 18px; color: #6B6152; font-size: 14px; }
  li { margin-bottom: 3px; }
  a { color: #B9722F; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { max-width: none; }
    h2 { color: #B9722F; }
  }
</style>
</head>
<body>
<div class="sheet">
  <header>
    <h1>${PROFILE.name}</h1>
    <p class="role">${PROFILE.title} · ${PROFILE.title2}</p>
    <div class="contact">
      <span>${PROFILE.location}</span>
      <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>
      <span>${PROFILE.phone}</span>
      <a href="${PROFILE.githubUrl}">${PROFILE.handle}</a>
      <a href="${PROFILE.gravatarUrl}">Gravatar</a>
    </div>
  </header>

  <h2>Profile</h2>
  <p class="lead">${PROFILE.gravatarBio.replace(/\n\n/g, '</p><p class="lead">')}</p>

  <h2>Experience</h2>
  ${history}

  <h2>Core skills</h2>
  ${skillSections}

  <h2>Selected work — ${REPOS.length} senior-level builds</h2>
  ${pick(REPOS)}

  <h2>Summary</h2>
  <p class="skills">${REPOS.reduce((n, r) => n + r.stars, 0)} stars earned · ${REPOS.reduce((n, r) => n + r.forks, 0)} forks · 679 public repositories · open to senior mobile and full-stack roles.</p>
</div>
</body>
</html>`;
}

export type DownloadResult = { ok: boolean; message: string; method: string };

export async function downloadResume(): Promise<DownloadResult> {
  const html = buildResumeHtml();

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = RESUME_FILENAME;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      return { ok: true, method: 'browser', message: `${RESUME_FILENAME} saved` };
    } catch (e) {
      return { ok: false, method: 'browser', message: 'Could not start the download.' };
    }
  }

  try {
    const { File, Paths, Directory } = await import('expo-file-system');
    const Sharing = await import('expo-sharing');

    // expo-file-system SDK 54+ uses a class-based API: `new File(dir, name)`.
    const target = new File(Paths.cache, RESUME_FILENAME);
    // `append` defaults to false, which truncates and overwrites in place.
    target.write(html);

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      return { ok: true, method: 'file', message: `Saved to ${target.uri}` };
    }
    await Sharing.shareAsync(target.uri, {
      mimeType: 'text/html',
      dialogTitle: 'Save resume',
      UTI: 'public.html',
    });
    return { ok: true, method: 'share', message: 'Resume ready to save or send' };
  } catch (e) {
    // Last-resort fallback: use the native share sheet on the raw text.
    try {
      await Share.share({
        title: `${PROFILE.name} — Resume`,
        message: html,
      });
      return { ok: true, method: 'share-fallback', message: 'Resume shared' };
    } catch {
      return { ok: false, method: 'none', message: 'Download unavailable on this device.' };
    }
  }
}
