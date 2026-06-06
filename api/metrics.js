const EVENTS_KEY = "agi-loading:metrics:events";
const MAX_EVENTS = 5000;

const memoryStore = globalThis.__agiLoadingMetrics || {
  events: []
};

globalThis.__agiLoadingMetrics = memoryStore;

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(data));
}

function getStorageConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    token
  };
}

async function redisCommand(command) {
  const config = getStorageConfig();
  if (!config) {
    throw new Error("Redis storage is not configured.");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(command)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Redis command failed: ${response.status} ${text}`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
}

async function saveEvent(event) {
  const config = getStorageConfig();
  if (!config) {
    memoryStore.events.unshift(event);
    memoryStore.events = memoryStore.events.slice(0, MAX_EVENTS);
    return "memory";
  }

  await redisCommand(["LPUSH", EVENTS_KEY, JSON.stringify(event)]);
  await redisCommand(["LTRIM", EVENTS_KEY, 0, MAX_EVENTS - 1]);
  return "redis";
}

async function readEvents(limit) {
  const config = getStorageConfig();
  if (!config) {
    return {
      storage: "memory",
      events: memoryStore.events.slice(0, limit)
    };
  }

  const rawEvents = await redisCommand(["LRANGE", EVENTS_KEY, 0, limit - 1]);
  return {
    storage: "redis",
    events: rawEvents.map((event) => JSON.parse(event))
  };
}

function sanitizeText(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim().slice(0, 280);
}

function sanitizeUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(String(value));
    return `${parsed.origin}${parsed.pathname}`.slice(0, 300);
  } catch {
    return sanitizeText(value).slice(0, 300);
  }
}

function sanitizeEvent(body, req) {
  const now = new Date().toISOString();
  const event = {
    id: sanitizeText(body.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    type: ["view", "click"].includes(body.type) ? body.type : "view",
    sessionId: sanitizeText(body.sessionId || "anonymous").slice(0, 80),
    source: sanitizeText(body.source || "direct").toLowerCase().slice(0, 80),
    referrerHost: sanitizeText(body.referrerHost || "direct").toLowerCase().slice(0, 120),
    path: sanitizeText(body.path || "/").slice(0, 180),
    route: sanitizeText(body.route || "").slice(0, 80),
    article: sanitizeText(body.article || "").slice(0, 120),
    label: sanitizeText(body.label || ""),
    href: sanitizeUrl(body.href || ""),
    viewport: sanitizeText(body.viewport || ""),
    ts: body.ts && !Number.isNaN(Date.parse(body.ts)) ? new Date(body.ts).toISOString() : now,
    receivedAt: now
  };

  const forwardedHost = req.headers["x-forwarded-host"] || req.headers.host || "";
  event.host = sanitizeText(forwardedHost).slice(0, 180);

  return event;
}

function summarize(events) {
  const summary = {
    totalEvents: events.length,
    views: 0,
    clicks: 0,
    sources: {},
    paths: {},
    articles: {},
    clickTargets: {}
  };

  events.forEach((event) => {
    if (event.type === "view") {
      summary.views += 1;
    }

    if (event.type === "click") {
      summary.clicks += 1;
      const clickKey = event.label || event.href || "unknown";
      summary.clickTargets[clickKey] = (summary.clickTargets[clickKey] || 0) + 1;
    }

    const source = event.source || "direct";
    const path = event.path || "/";
    const article = event.article || "none";
    summary.sources[source] = (summary.sources[source] || 0) + 1;
    summary.paths[path] = (summary.paths[path] || 0) + 1;
    summary.articles[article] = (summary.articles[article] || 0) + 1;
  });

  return summary;
}

function filterEvents(events, query) {
  return events.filter((event) => {
    if (query.type && event.type !== query.type) {
      return false;
    }

    if (query.source && event.source !== query.source.toLowerCase()) {
      return false;
    }

    if (query.path && event.path !== query.path) {
      return false;
    }

    if (query.article && event.article !== query.article) {
      return false;
    }

    return true;
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const event = sanitizeEvent(req.body || {}, req);
      const storage = await saveEvent(event);
      sendJson(res, 201, { ok: true, storage, eventId: event.id });
      return;
    }

    if (req.method === "GET") {
      const limit = Math.min(Number(req.query.limit || 250) || 250, 1000);
      const result = await readEvents(Math.max(limit, 250));
      const events = filterEvents(result.events, req.query).slice(0, limit);
      sendJson(res, 200, {
        ok: true,
        storage: result.storage,
        summary: summarize(events),
        events
      });
      return;
    }

    res.setHeader("allow", "GET, POST");
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error.message || "Metrics request failed."
    });
  }
};
