const MAX_SHOUT_CHARS = 500;
const MAX_POST_BYTES = 100 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SHOUT_LIMIT = { windowSeconds: 10 * 60, count: 20 };
const POST_LIMIT = { windowSeconds: 60 * 60, count: 12 };
const IMAGE_LIMIT = { windowSeconds: 10 * 60, count: 10 };
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]);

let jwksCache = null;
let schemaReady = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/treehouse/api/")) {
      return env.ASSETS.fetch(request);
    }

    return handleRoomApi(request, env);
  }
};

export async function handleRoomApi(request, env) {
  const url = new URL(request.url);

  try {
    if (!url.pathname.startsWith("/treehouse/api/")) {
      throw httpError(404, "Not found.");
    }

    const user = await requireAccessUser(request, env);
    await ensureDatabase(env);
    return await handleApi(request, env, user, url);
  } catch (error) {
    return jsonError(error);
  }
}

async function handleApi(request, env, user, url) {
  const method = request.method.toUpperCase();
  const pathname = url.pathname.replace(/\/+$/, "");

  if (method === "GET" && pathname === "/treehouse/api/me") {
    return json({
      user: publicUser(user, env),
      permissions: { can_delete_all: isAdmin(user, env) }
    });
  }

  if (method === "GET" && pathname === "/treehouse/api/entries") {
    return listEntries(env, user, url);
  }

  if (method === "POST" && pathname === "/treehouse/api/shouts") {
    return createShout(request, env, user);
  }

  if (method === "POST" && pathname === "/treehouse/api/posts") {
    return createPost(request, env, user);
  }

  if (method === "POST" && pathname === "/treehouse/api/images") {
    return uploadImage(request, env, user);
  }

  const postMatch = pathname.match(/^\/us\/api\/posts\/([^/]+)$/);
  if (method === "GET" && postMatch) {
    return getPost(env, user, decodeURIComponent(postMatch[1]));
  }

  const imageMatch = pathname.match(/^\/us\/api\/images\/([^/]+)$/);
  if (method === "GET" && imageMatch) {
    return serveImage(env, decodeURIComponent(imageMatch[1]));
  }

  const deleteMatch = pathname.match(/^\/us\/api\/entries\/([^/]+)$/);
  if (method === "DELETE" && deleteMatch) {
    return hideEntry(env, user, decodeURIComponent(deleteMatch[1]));
  }

  return json({ error: "Not found." }, { status: 404 });
}

async function listEntries(env, user, url) {
  const kind = url.searchParams.get("kind");
  if (kind !== "shout" && kind !== "post") {
    throw httpError(400, "Expected kind=shout or kind=post.");
  }

  const limit = kind === "shout" ? 100 : 50;
  const result = await env.DB.prepare(
    `SELECT id, slug, kind, title, summary, body_text, tags_json, image_key,
            author_email, author_handle, created_at, updated_at
       FROM room_entries
      WHERE kind = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ?`
  ).bind(kind, limit).all();

  return json({
    entries: result.results.map((entry) => serializeEntry(entry, user, env))
  });
}

async function createShout(request, env, user) {
  const input = await readJson(request);
  const body = normalizeText(input.body || input.body_text || "");
  const imageKey = normalizeText(input.image_key || "");

  if (!body) throw httpError(400, "Shout cannot be empty.");
  if (body.length > MAX_SHOUT_CHARS) {
    throw httpError(400, `Shouts are limited to ${MAX_SHOUT_CHARS} characters.`);
  }

  if (imageKey && env.ROOM_IMAGES) {
    const obj = await env.ROOM_IMAGES.head(imageKey);
    if (!obj) throw httpError(400, "Referenced image was not found. Please upload the image first.");
  }

  await checkRateLimit(env, `shout:${user.email}`, SHOUT_LIMIT);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO room_entries (
       id, slug, kind, title, summary, body_markdown, body_text, tags_json, image_key,
       author_email, author_handle, created_at, updated_at
     ) VALUES (?, NULL, 'shout', NULL, NULL, ?, ?, '[]', ?, ?, ?, ?, ?)`
  ).bind(id, body, body, imageKey || null, user.email, user.handle, now, now).run();

  return json({
    entry: {
      id,
      kind: "shout",
      body_text: body,
      image_url: imageKey ? `/treehouse/api/images/${imageKey}` : null,
      author_handle: user.handle,
      created_at: now,
      updated_at: now,
      can_delete: true
    }
  }, { status: 201 });
}

async function createPost(request, env, user) {
  const input = await readJson(request);
  const rawMarkdown = String(input.body_markdown || input.markdown || "");
  const size = new TextEncoder().encode(rawMarkdown).byteLength;

  if (!rawMarkdown.trim()) throw httpError(400, "Markdown post cannot be empty.");
  if (size > MAX_POST_BYTES) throw httpError(400, "Markdown posts are limited to 100 KB in v1.");

  await checkRateLimit(env, `post:${user.email}`, POST_LIMIT);

  const parsed = parseFrontMatter(rawMarkdown);
  const bodyMarkdown = parsed.body.trim();
  if (!bodyMarkdown) throw httpError(400, "Markdown body cannot be empty after front matter.");

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const title = coerceTitle(parsed.data.title) || firstMarkdownHeading(bodyMarkdown) || "Untitled note";
  const summary = coerceSummary(parsed.data.summary) || summarizeMarkdown(bodyMarkdown);
  const tags = coerceTags(parsed.data.tags);
  const slug = await uniqueSlug(env, slugify(title), id);
  const bodyText = markdownToPlainText(bodyMarkdown).slice(0, 1200);

  await env.DB.prepare(
    `INSERT INTO room_entries (
       id, slug, kind, title, summary, body_markdown, body_text, tags_json,
       author_email, author_handle, created_at, updated_at
     ) VALUES (?, ?, 'post', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    slug,
    title,
    summary,
    bodyMarkdown,
    bodyText,
    JSON.stringify(tags),
    user.email,
    user.handle,
    now,
    now
  ).run();

  return json({
    post: {
      id,
      slug,
      kind: "post",
      title,
      summary,
      tags,
      author_handle: user.handle,
      created_at: now,
      updated_at: now,
      can_delete: true
    }
  }, { status: 201 });
}

async function uploadImage(request, env, user) {
  if (!env.ROOM_IMAGES) {
    throw httpError(503, "Image storage is not configured.");
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    throw httpError(415, "Expected multipart/form-data.");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (_error) {
    throw httpError(400, "Invalid multipart form data.");
  }

  const file = formData.get("image");
  if (!file || typeof file.name !== "string") {
    throw httpError(400, "No image file provided in the 'image' field.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw httpError(400, "Image type must be JPEG, PNG, GIF, WebP, or SVG.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw httpError(400, `Images are limited to ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB.`);
  }

  await checkRateLimit(env, `image:${user.email}`, IMAGE_LIMIT);

  const ext = extensionForMime(file.type);
  const key = `${crypto.randomUUID()}.${ext}`;

  await env.ROOM_IMAGES.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=604800",
      contentDisposition: "inline"
    }
  });

  return json({
    key,
    url: `/treehouse/api/images/${key}`
  }, { status: 201 });
}

function extensionForMime(mime) {
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg"
  };
  return map[mime] || "bin";
}

async function serveImage(env, key) {
  if (!env.ROOM_IMAGES) {
    throw httpError(503, "Image storage is not configured.");
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(key)) {
    throw httpError(400, "Invalid image key.");
  }

  const obj = await env.ROOM_IMAGES.get(key);
  if (!obj) throw httpError(404, "Image not found.");

  const headers = new Headers();
  const httpMetadata = obj.httpMetadata || {};
  if (httpMetadata.contentType) headers.set("content-type", httpMetadata.contentType);
  if (httpMetadata.cacheControl) headers.set("cache-control", httpMetadata.cacheControl);
  headers.set("referrer-policy", "no-referrer");
  headers.set("cross-origin-resource-policy", "same-origin");

  return new Response(obj.body, { headers });
}

async function getPost(env, user, slugOrId) {
  const entry = await env.DB.prepare(
    `SELECT id, slug, kind, title, summary, body_markdown, body_text, tags_json, image_key,
            author_email, author_handle, created_at, updated_at
       FROM room_entries
      WHERE kind = 'post'
        AND deleted_at IS NULL
        AND (id = ? OR slug = ?)
      LIMIT 1`
  ).bind(slugOrId, slugOrId).first();

  if (!entry) throw httpError(404, "Markdown post not found.");

  const post = serializeEntry(entry, user, env);
  post.body_html = renderMarkdown(entry.body_markdown);
  return json({ post });
}

async function hideEntry(env, user, id) {
  const entry = await env.DB.prepare(
    `SELECT id, author_email
       FROM room_entries
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1`
  ).bind(id).first();

  if (!entry) throw httpError(404, "Entry not found.");
  if (entry.author_email !== user.email && !isAdmin(user, env)) {
    throw httpError(403, "Only the author or room owner can hide this entry.");
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE room_entries
        SET deleted_at = ?, updated_at = ?
      WHERE id = ?`
  ).bind(now, now, id).run();

  return json({ ok: true });
}

async function ensureDatabase(env) {
  if (!env.DB) {
    throw httpError(503, "D1 binding DB is not configured.");
  }

  if (!schemaReady) {
    schemaReady = createSchema(env.DB);
  }

  return schemaReady;
}

async function createSchema(db) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS room_entries (
      id TEXT PRIMARY KEY,
      slug TEXT,
      kind TEXT NOT NULL CHECK (kind IN ('shout', 'post')),
      title TEXT,
      summary TEXT,
      body_markdown TEXT NOT NULL,
      body_text TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      author_email TEXT NOT NULL,
      author_handle TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    )`
  ).run();

  await db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_room_entries_kind_created
       ON room_entries (kind, created_at DESC)`
  ).run();

  await db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_room_entries_author_created
       ON room_entries (author_email, created_at DESC)`
  ).run();

  await db.prepare(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_room_entries_slug
       ON room_entries (slug)
      WHERE kind = 'post' AND slug IS NOT NULL AND deleted_at IS NULL`
  ).run();

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS room_rate_limits (
      key TEXT PRIMARY KEY,
      window_start TEXT NOT NULL,
      count INTEGER NOT NULL
    )`
  ).run();

  try {
    await db.prepare(
      `ALTER TABLE room_entries ADD COLUMN image_key TEXT`
    ).run();
  } catch (_error) {
    // Column already exists — safe to ignore.
  }
}

async function checkRateLimit(env, keyPrefix, rule) {
  const bucket = Math.floor(Date.now() / 1000 / rule.windowSeconds);
  const key = `${keyPrefix}:${bucket}`;
  const windowStart = new Date(bucket * rule.windowSeconds * 1000).toISOString();

  const row = await env.DB.prepare(
    `INSERT INTO room_rate_limits (key, window_start, count)
     VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET count = count + 1
     RETURNING count`
  ).bind(key, windowStart).first();

  if (row.count > rule.count) {
    throw httpError(429, "Rate limit reached. Try again later.");
  }
}

async function uniqueSlug(env, base, id) {
  const cleanBase = base || "post";
  let slug = cleanBase;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await env.DB.prepare(
      `SELECT id FROM room_entries
        WHERE slug = ? AND kind = 'post' AND deleted_at IS NULL
        LIMIT 1`
    ).bind(slug).first();

    if (!existing) return slug;
    slug = `${cleanBase}-${id.slice(0, 8 + attempt)}`;
  }

  return `${cleanBase}-${crypto.randomUUID().slice(0, 8)}`;
}

async function requireAccessUser(request, env) {
  const localUser = localDevelopmentUser(request, env);
  if (localUser) return localUser;

  const teamDomain = normalizeTeamDomain(env.ACCESS_TEAM_DOMAIN);
  const audience = String(env.ACCESS_AUD || "").trim();
  if (!teamDomain || !audience) {
    throw httpError(503, "Cloudflare Access team domain or audience is not configured.");
  }

  let token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const parts = cookie.trim().split("=");
      if (parts[0] === "CF_Authorization") {
        token = parts.slice(1).join("=");
        break;
      }
    }
  }
  if (!token) throw httpError(403, "Missing Cloudflare Access JWT.");

  const payload = await verifyAccessJwt(token, teamDomain, audience);
  const email = normalizeEmail(payload.email);
  if (!email) throw httpError(403, "Cloudflare Access JWT did not include an email.");

  return {
    email,
    handle: handleFromEmail(email),
    name: typeof payload.name === "string" ? payload.name : "",
    sub: typeof payload.sub === "string" ? payload.sub : ""
  };
}

function localDevelopmentUser(request, env) {
  const email = normalizeEmail(env.DEV_ROOM_EMAIL);
  if (!email) return null;

  const hostname = new URL(request.url).hostname;
  if (hostname !== "localhost" && hostname !== "127.0.0.1") return null;

  return {
    email,
    handle: handleFromEmail(email),
    name: "Local Developer",
    sub: "local-development"
  };
}

async function verifyAccessJwt(token, teamDomain, audience) {
  const parts = token.split(".");
  if (parts.length !== 3) throw httpError(403, "Invalid Cloudflare Access JWT.");

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  if (header.alg !== "RS256" || !header.kid) {
    throw httpError(403, "Unsupported Cloudflare Access JWT.");
  }

  const key = await importJwtKey(teamDomain, header.kid);
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );

  if (!verified) throw httpError(403, "Invalid Cloudflare Access JWT signature.");

  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== teamDomain) throw httpError(403, "Invalid Cloudflare Access JWT issuer.");
  if (typeof payload.exp === "number" && payload.exp < now - 60) {
    throw httpError(403, "Expired Cloudflare Access JWT.");
  }
  if (typeof payload.nbf === "number" && payload.nbf > now + 60) {
    throw httpError(403, "Cloudflare Access JWT is not valid yet.");
  }
  if (!audienceMatches(payload.aud, audience)) {
    throw httpError(403, "Cloudflare Access JWT audience mismatch.");
  }

  return payload;
}

async function importJwtKey(teamDomain, kid) {
  const jwks = await getJwks(teamDomain);
  const jwk = jwks.keys.find((candidate) => candidate.kid === kid);
  if (!jwk) throw httpError(403, "Cloudflare Access signing key was not found.");

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

async function getJwks(teamDomain) {
  const now = Date.now();
  if (jwksCache && jwksCache.teamDomain === teamDomain && jwksCache.expiresAt > now) {
    return jwksCache.value;
  }

  const response = await fetch(`${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw httpError(503, "Could not fetch Cloudflare Access signing keys.");

  const value = await response.json();
  jwksCache = {
    teamDomain,
    value,
    expiresAt: now + 60 * 60 * 1000
  };
  return value;
}

function audienceMatches(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  return actual === expected;
}

function normalizeTeamDomain(value) {
  const trimmed = String(value || "").trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

function base64UrlDecode(value) {
  const bytes = base64UrlToBytes(value);
  return new TextDecoder().decode(bytes);
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw httpError(415, "Expected application/json.");
  }

  try {
    return await request.json();
  } catch (_error) {
    throw httpError(400, "Invalid JSON.");
  }
}

function serializeEntry(entry, user, env) {
  return {
    id: entry.id,
    slug: entry.slug || null,
    kind: entry.kind,
    title: entry.title || null,
    summary: entry.summary || null,
    body_text: entry.body_text || null,
    image_url: entry.image_key ? `/treehouse/api/images/${entry.image_key}` : null,
    tags: parseTagsJson(entry.tags_json),
    author_handle: entry.author_handle,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    can_delete: entry.author_email === user.email || isAdmin(user, env)
  };
}

function publicUser(user, env) {
  return {
    email: user.email,
    handle: user.handle,
    name: user.name || "",
    is_admin: isAdmin(user, env)
  };
}

function isAdmin(user, env) {
  const admins = String(env.ROOM_OWNER_EMAILS || "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
  return admins.includes(user.email);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function handleFromEmail(email) {
  return (email.split("@")[0] || "guest")
    .replace(/[^a-zA-Z0-9_.-]/g, "")
    .slice(0, 32) || "guest";
}

function normalizeText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function parseTagsJson(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function parseFrontMatter(markdown) {
  const trimmedStart = markdown.replace(/^\uFEFF/, "");
  const firstLine = trimmedStart.match(/^([+-]{3})\r?\n/);
  if (!firstLine) return { data: {}, body: markdown };

  const delimiter = firstLine[1];
  const closing = new RegExp(`\\n${escapeRegExp(delimiter)}\\r?\\n`);
  const rest = trimmedStart.slice(firstLine[0].length);
  const match = rest.match(closing);
  if (!match || typeof match.index !== "number") return { data: {}, body: markdown };

  const frontMatter = rest.slice(0, match.index);
  const body = rest.slice(match.index + match[0].length);
  return { data: parseSafeFrontMatter(frontMatter), body };
}

function parseSafeFrontMatter(source) {
  const data = {};
  source.split(/\r?\n/).forEach((line) => {
    const yaml = line.match(/^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.+?)\s*$/);
    const toml = line.match(/^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*(.+?)\s*$/);
    const match = yaml || toml;
    if (!match) return;

    const key = match[1].toLowerCase();
    if (key !== "title" && key !== "summary" && key !== "tags") return;
    data[key] = parseFrontMatterValue(match[2]);
  });
  return data;
}

function parseFrontMatterValue(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed.slice(1, -1).split(",").map((item) => parseFrontMatterValue(item));
  }
  return trimmed;
}

function coerceTitle(value) {
  const title = normalizeText(Array.isArray(value) ? value[0] : value);
  return title ? title.slice(0, 120) : "";
}

function coerceSummary(value) {
  const summary = normalizeText(Array.isArray(value) ? value[0] : value);
  return summary ? summary.slice(0, 280) : "";
}

function coerceTags(value) {
  const rawTags = Array.isArray(value) ? value : String(value || "").split(",");
  return rawTags
    .map((tag) => normalizeText(tag).replace(/^["']|["']$/g, "").slice(0, 32))
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .slice(0, 12);
}

function firstMarkdownHeading(markdown) {
  const line = markdown.split(/\r?\n/).find((candidate) => /^#{1,3}\s+\S/.test(candidate));
  return line ? line.replace(/^#{1,3}\s+/, "").trim().slice(0, 120) : "";
}

function summarizeMarkdown(markdown) {
  return markdownToPlainText(markdown).slice(0, 220);
}

function markdownToPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return slug || "post";
}

function renderMarkdown(markdown) {
  const withSafeImages = markdown.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (_match, alt, url) => {
    if (url.startsWith("/treehouse/api/images/")) {
      const decoded = url.replace(/&amp;/g, "&");
      return `<img src="${escapeAttribute(decoded)}" alt="${escapeHtml(alt || "")}" loading="lazy" referrerpolicy="no-referrer">`;
    }
    return "[image omitted]";
  });
  const lines = withSafeImages.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  let quote = [];
  let inCode = false;
  let code = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    list = [];
  }

  function flushQuote() {
    if (!quote.length) return;
    blocks.push(`<blockquote>${quote.map((item) => `<p>${renderInline(item)}</p>`).join("")}</blockquote>`);
    quote = [];
  }

  function flushCode() {
    if (!code.length) return;
    blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
    code = [];
  }

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = heading[1].length + 1;
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      flushQuote();
      list.push(listItem[1]);
      continue;
    }

    const quoteLine = line.match(/^\s*>\s?(.+)$/);
    if (quoteLine) {
      flushParagraph();
      flushList();
      quote.push(quoteLine[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }

  flushCode();
  flushParagraph();
  flushList();
  flushQuote();

  return blocks.join("\n");
}

function renderInline(value) {
  const codeSegments = [];
  let escaped = escapeHtml(value).replace(/`([^`]+)`/g, (_match, code) => {
    const token = `\u0000CODE${codeSegments.length}\u0000`;
    codeSegments.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  escaped = escaped.replace(/\[([^\]]+)]\(([^)\s]+)\)/g, (_match, label, href) => {
    const decodedHref = href.replace(/&amp;/g, "&");
    if (!isSafeHref(decodedHref)) return label;
    return `<a href="${escapeAttribute(decodedHref)}" rel="nofollow noreferrer noopener" target="_blank">${label}</a>`;
  });

  escaped = escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  codeSegments.forEach((html, index) => {
    escaped = escaped.replace(`\u0000CODE${index}\u0000`, html);
  });

  return escaped;
}

function isSafeHref(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:";
  } catch (_error) {
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function jsonError(error) {
  const status = Number(error.status || 500);
  const message = status >= 500 ? error.message || "Internal server error." : error.message;
  return json({ error: message }, { status });
}

function json(payload, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(payload), {
    ...init,
    headers
  });
}
