import { articles } from "./articles.js";

const summaries = {
  technical: {
    builder: "Builder view: focus on what the CLI gives the agent that a skill alone cannot hold.",
    researcher: "Researcher view: the Primitive article becomes a technical rewrite grounded in Meta-Harness and harness-level credit assignment.",
    operator: "Operator view: focus on reviewable artifacts, promotion gates, and rollback before persistent behavior."
  },
  plain: {
    builder: "Builder view: focus on how the site learns from repeated work and turns it into better tools.",
    researcher: "Researcher view: focus on the feedback loop: try something, study what happened, improve the setup.",
    operator: "Operator view: focus on what is safe to keep, what needs review, and what should be rolled back."
  }
};

const phaseCards = document.querySelectorAll("[data-phase-card]");
const treeItems = document.querySelectorAll("[data-knowledge-node]");
const segments = document.querySelectorAll("[data-prior]");
const siteModeButtons = document.querySelectorAll("[data-site-mode]");
const priorSummary = document.querySelector("#priorSummary");
const seriesGrid = document.querySelector("#seriesGrid");
const articleBody = document.querySelector("#articleBody");
const articleTitle = document.querySelector("#articleTitle");
const articleSummary = document.querySelector("#articleSummary");
const articleMeta = document.querySelector("#articleMeta");
const articleIssue = document.querySelector("#articleIssue");
const articleReadTime = document.querySelector("#articleReadTime");
const articleToc = document.querySelector("#articleToc");
const bootButton = document.querySelector("#bootButton");
const bootFill = document.querySelector("#bootFill");
const bootPercent = document.querySelector("#bootPercent");
const bootConsole = document.querySelector("#bootConsole");
const simStage = document.querySelector("#simStage");
const simControls = document.querySelector("#simControls");
const simStatus = document.querySelector("#simStatus");
const rsiKicker = document.querySelector("#rsiKicker");
const rsiTitle = document.querySelector("#rsiTitle");
const rsiSummary = document.querySelector("#rsiSummary");
const rsiMetrics = document.querySelector("#rsiMetrics");
const rsiStage = document.querySelector("#rsiStage");
const heroKicker = document.querySelector("#heroKicker");
const heroDek = document.querySelector("#heroDek");
const mapKicker = document.querySelector("#mapKicker");
const mapTitle = document.querySelector("#map-title");
const seriesKicker = document.querySelector("#seriesKicker");
const seriesTitle = document.querySelector("#series-title");
const railTitle = document.querySelector("#rail-title");
const footerLead = document.querySelector("#footerLead");
const footerTail = document.querySelector("#footerTail");
const knowledgeKicker = document.querySelector("#knowledgeKicker");
const knowledgeTitle = document.querySelector("#knowledge-title");
const knowledgeIntro = document.querySelector("#knowledgeIntro");
const knowledgeType = document.querySelector("#knowledgeType");
const knowledgeCardTitle = document.querySelector("#knowledgeTitle");
const knowledgeSummary = document.querySelector("#knowledgeSummary");
const knowledgeTags = document.querySelector("#knowledgeTags");
const knowledgeFlow = document.querySelector("#knowledgeFlow");
const routePages = document.querySelectorAll("[data-route-page]");
const routeLinks = document.querySelectorAll("[data-route-link]");
const metricsQuery = document.querySelector("#metricsQuery");
const metricsCards = document.querySelector("#metricsCards");
const metricsRows = document.querySelector("#metricsRows");
const metricsSource = document.querySelector("#metricsSource");
const metricsType = document.querySelector("#metricsType");
const metricsPath = document.querySelector("#metricsPath");

let currentPrior = "builder";
let currentSiteMode = "technical";
let currentPrimitivePhase = "observe";
let currentKnowledgeNode = "paper-one";
let currentArticleSlug = "the-primitive";
let lastTrackedView = "";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const siteCopy = {
  technical: {
    heroKicker: "AGI loading / harness boot sequence",
    heroDek: "Field notes from the software layer around model intelligence, rendered as an interactive bootloader.",
    mapKicker: "Inspectable Substrate",
    mapTitle: "The Skill Factory Is a Loop, Not a Prompt",
    seriesKicker: "Imported Harness Series",
    seriesTitle: "One Surface, 3 Harness Field Notes",
    knowledgeKicker: "Lineage Map",
    knowledgeTitle: "How the Harness Thread Branches",
    knowledgeIntro:
      "A lineage graph of the shared harness paper, the articles that split from it, and the loose ideas that may later reconnect as load-bearing pieces.",
    railTitle: "Reader Harness",
    footerLead:
      "AGI Loading is a set of field notes on understanding self-learning systems at the harness and model level, extending",
    footerTail: "to understand what RSI could look like. It is an OSS community; if you have ideas, reach out.",
    phases: {
      observe: ["Observe Work", "Import local traces and ask what work keeps recurring."],
      decompose: ["Find Families", "Group sessions by signals, files, handoffs, and repeated outcomes."],
      synthesize: ["Generate Bundles", "Emit a reviewable package, not just a hidden behavior change."],
      critique: ["Critique Risk", "Make strengths, risks, trigger rules, and promotion gates legible."]
    }
  },
  plain: {
    heroKicker: "AGI loading / plain English mode",
    heroDek: "A guided reading room for understanding how AI systems can get better by improving the tools around them.",
    mapKicker: "Start Here",
    mapTitle: "The Main Idea: Better Tools Create Better AI Work",
    seriesKicker: "Reading Path",
    seriesTitle: "3 Notes About Building Smarter AI Workflows",
    knowledgeKicker: "Lineage Map",
    knowledgeTitle: "How the Ideas Split and Reconnect",
    knowledgeIntro:
      "The articles can look scattered in the moment. This map shows the shared starting point, the two branches, and how a loose idea can later plug a real gap.",
    railTitle: "Reader Guide",
    footerLead:
      "AGI Loading is a set of field notes on understanding self-learning systems at the harness and model level, extending",
    footerTail: "to understand what RSI could look like. It is an OSS community; if you have ideas, reach out.",
    phases: {
      observe: ["Watch the Work", "Notice what people and AI agents keep doing again and again."],
      decompose: ["Find the Pattern", "Group similar work so the system can see what usually goes right or wrong."],
      synthesize: ["Build a Better Tool", "Turn that pattern into something reusable that people can inspect."],
      critique: ["Keep or Reject", "Decide what is safe to keep, what needs edits, and what should be thrown away."]
    }
  }
};

const knowledgeMaps = {
  technical: {
    "paper-one": {
      type: "shared root",
      title: "Autonomous Harness Engineering",
      summary:
        "The root claim: the model is only one part of the intelligence system. The harness around it holds tools, traces, memory, context, and the outer loop that can learn from prior work.",
      tags: ["shared origin", "harness layer", "outer loop"],
      flow: ["Name the harness", "Make traces inspectable", "Ask what can improve", "Branch into applications"]
    },
    recs: {
      type: "field note",
      title: "Harnesses as Self-Improving Infrastructure",
      summary:
        "This article branches from Autonomous Harness Engineering by moving the harness idea into recommendation systems. It shows how retrieval, ranking, feedback, metrics, and product surfaces already behave like adaptive harness infrastructure.",
      tags: ["Vishal Tandale", "sub-branch", "adaptive ranking"],
      flow: ["Parent defines harnesses", "This article applies the idea to recommendations", "Feedback becomes harness memory", "Ranking becomes self-improving behavior"]
    },
    primitive: {
      type: "current leaf",
      title: "The Primitive",
      summary:
        "This article branches from Autonomous Harness Engineering by asking what should persist after the harness learns. It argues that the smallest useful unit may not be a prompt or isolated skill, but a CLI-backed learning harness with state, evidence, review gates, and rollback.",
      tags: ["Akhil Ramaswamy", "sub-branch", "RSI substrate"],
      flow: ["Parent defines the harness loop", "This article asks what should persist", "CLI gives the unit substrate", "Review gates decide what survives"]
    },
    unfocused: {
      type: "drift zone",
      title: "Loose threads",
      summary:
        "Some notes will look unfocused because they are exploring around the edge of the concept: metrics, social distribution, interfaces, evals, source maps, and reader priors.",
      tags: ["exploration", "weak signal", "not wasted"],
      flow: ["Notice side question", "Write partial note", "Leave trace", "Wait for missing context"]
    },
    "future-hole": {
      type: "reconnect",
      title: "Later, a missing hole appears",
      summary:
        "The dynamic version of this map should let a disconnected note snap back into the graph once a later article reveals the hole it fills. What looked like drift becomes lineage evidence.",
      tags: ["dynamic graph", "latent dependency", "future synthesis"],
      flow: ["New problem appears", "Old note becomes relevant", "Edge gets promoted", "Lineage updates"]
    }
  },
  plain: {
    "paper-one": {
      type: "shared root",
      title: "Autonomous Harness Engineering",
      summary:
        "The starting idea: AI systems are not just models. They also include the workbench around the model: tools, memory, saved attempts, feedback, and tests.",
      tags: ["starting point", "AI workbench", "learning setup"],
      flow: ["Name the workbench", "Save attempts", "Look for improvement", "Branch into articles"]
    },
    recs: {
      type: "field note",
      title: "Harnesses as Self-Improving Infrastructure",
      summary:
        "This article branches from the first harness note by applying the idea to recommendation systems. The system is not just choosing content; it is becoming infrastructure that learns from what people do.",
      tags: ["Vishal Tandale", "sub-branch", "adaptive systems"],
      flow: ["Parent names harnesses", "This article applies them to recommendations", "Feedback changes the system", "The loop becomes clearer"]
    },
    primitive: {
      type: "current leaf",
      title: "The Primitive",
      summary:
        "This article branches from the first harness note by asking what should actually be saved and reused when a workflow improves. The current answer is a small learning harness, not just a prompt.",
      tags: ["Akhil Ramaswamy", "sub-branch", "reviewable"],
      flow: ["Parent names harnesses", "This article asks what persists", "The primitive needs substrate", "Review decides what survives"]
    },
    unfocused: {
      type: "loose ideas",
      title: "Loose threads",
      summary:
        "Some articles may feel disconnected because they are exploring nearby questions. That is not always bad; it can be how the map finds the next gap.",
      tags: ["exploration", "nearby ideas", "weak signal"],
      flow: ["Ask side question", "Write the note", "Keep the trace", "See if it returns"]
    },
    "future-hole": {
      type: "reconnect",
      title: "Later, a missing hole appears",
      summary:
        "A future article may reveal that an older loose idea was actually important. The map should be able to reconnect that idea instead of treating it as noise.",
      tags: ["future link", "hidden value", "dynamic map"],
      flow: ["Find a new gap", "Remember old note", "Connect it back", "Update the lineage"]
    }
  }
};

function buildSeriesGrid() {
  const chronologicalArticles = [...articles].sort((a, b) => new Date(`${a.date}T12:00:00`) - new Date(`${b.date}T12:00:00`));

  seriesGrid.innerHTML = chronologicalArticles
    .map(
      (article) => `
        <button class="series-card" type="button" data-article="${article.slug}" style="--card-accent: ${article.accent}">
          <span class="num">${article.issue}</span>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <span class="series-meta">${formatDate(article.date)} / ${article.read} / ${article.author}</span>
        </button>
      `
    )
    .join("");

  seriesGrid.querySelectorAll("[data-article]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo(`/article/${button.dataset.article}`);
    });
  });
}

function getRouteFromLocation() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path.startsWith("/article/")) {
    return {
      name: "article",
      article: decodeURIComponent(path.replace("/article/", "")) || "the-primitive"
    };
  }

  if (path === "/map") {
    return { name: "map", article: currentArticleSlug };
  }

  if (path === "/source") {
    return { name: "home", article: currentArticleSlug };
  }

  if (path === "/metrics") {
    return { name: "metrics", article: currentArticleSlug };
  }

  const legacyArticle = new URLSearchParams(window.location.search).get("article");
  return { name: "home", article: legacyArticle || currentArticleSlug };
}

function updateRouteLinks(activeRoute) {
  routeLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
    const isActive =
      (activeRoute.name === "home" && linkPath === "/") ||
      (activeRoute.name === "map" && linkPath === "/map") ||
      (activeRoute.name === "article" && linkPath.startsWith("/article/")) ||
      (activeRoute.name === "metrics" && linkPath === "/metrics");

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderRoute(options = {}) {
  const route = getRouteFromLocation();
  updateRouteLinks(route);

  routePages.forEach((page) => {
    page.classList.toggle("is-route-active", page.dataset.routePage === route.name);
  });

  if (route.name === "article") {
    renderArticle(route.article);
  }

  if (route.name === "home") {
    seriesGrid.querySelectorAll("[data-article]").forEach((button) => {
      button.classList.remove("is-active");
    });
  }

  if (route.name === "metrics") {
    loadMetrics();
  }

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
  }

  trackPageView(route);
}

function navigateTo(path) {
  const url = new URL(window.location.href);
  url.pathname = path;
  url.hash = "";
  window.history.pushState({}, "", url);
  renderRoute({ smooth: true });
}

const simPresets = {
  "the-primitive": {
    status: "harness RSI scaffold online",
    stages: [
      ["Trace", "Work history", "Files, commands, outcomes, and reader choices become inspectable experience."],
      ["Diagnose", "Failure family", "The harness finds repeated breakdowns instead of optimizing from one scalar score."],
      ["Rewrite", "Candidate code", "The meta-loop proposes a concrete bundle that changes future behavior."],
      ["Promote", "Next harness", "Review gates decide what persists, rolls back, or re-enters search."]
    ]
  },
  "autonomous-harness-engineering": {
    status: "outer loop inspecting traces",
    stages: [
      ["Run", "H_t + model", "The current harness wraps the model with tools, memory, context, and state."],
      ["Log", "Trace store", "Prompts, tool calls, outputs, scores, and state updates stay available as raw history."],
      ["Search", "Meta-harness", "A proposer reads prior code and traces before editing the scaffold."],
      ["Select", "H_t+1", "Candidate harnesses compete through evals before one becomes the next runtime."]
    ]
  },
  "harnesses-as-self-improving-infrastructure": {
    status: "recommendation harness simulator",
    stages: [
      ["Retrieve", "Candidate set", "Indexes and memory pull a huge field of possible outputs."],
      ["Generate", "Variants", "Models and policies create candidate surfaces."],
      ["Rank", "Scored set", "Signals, embeddings, and counts sort for expected value."],
      ["Allocate", "Rendered world", "The harness turns model outputs into product behavior and trace memory."]
    ]
  }
};

const rsiDiagrams = {
  technical: {
    observe: {
    kicker: "Harness RSI / phase 01",
    title: "Runtime Trace Capture",
    summary:
      "The current harness runs the work and leaves behind the raw material for improvement: prompts, tool calls, model outputs, state updates, and local files.",
    metrics: ["Full trace", "State delta", "No compression first"],
    active: 1,
    nodes: [
      ["Request", "User work enters a concrete local environment."],
      ["H_t runtime", "The harness decides context, tools, memory, and state."],
      ["Output + trace", "Every run emits both an answer and diagnostic exhaust."],
      ["History store", "The next loop can inspect source, scores, and traces."]
    ],
    loopNote: "RSI begins when the system can inspect the consequences of its own scaffold."
    },
    decompose: {
    kicker: "Harness RSI / phase 02",
    title: "Failure Attribution",
    summary:
      "The meta-loop does not just ask whether the last attempt scored well. It compares traces across attempts to find which harness decisions caused later failures.",
    metrics: ["Cross-run search", "Causal hints", "Workflow families"],
    active: 2,
    nodes: [
      ["Trace history", "Prior candidates remain searchable instead of being summarized away."],
      ["Pattern finder", "Repeated failures cluster by files, commands, handoffs, and decisions."],
      ["Harness slot", "The system identifies what to change: retrieval, memory, prompt, or tool flow."],
      ["Risk frame", "Known regressions become constraints for the next proposal."]
    ],
    loopNote: "This is the credit-assignment move: blame the harness shape, not just the model answer."
    },
    synthesize: {
    kicker: "Harness RSI / phase 03",
    title: "Candidate Harness Generation",
    summary:
      "A proposer turns diagnosis into executable changes. The artifact is a reviewable harness bundle, not a vibe shift hidden inside the next prompt.",
    metrics: ["Delta H", "Candidate beam", "Reviewable code"],
    active: 0,
    nodes: [
      ["Meta-proposer", "Reads prior code and traces through ordinary developer operations."],
      ["Delta H", "Edits retrieval, memory, state updates, prompts, or orchestration."],
      ["Candidate bundle", "Ships code, evidence, assumptions, and rollback notes together."],
      ["Interface check", "Invalid or brittle harnesses fail before promotion."]
    ],
    loopNote: "The search target is code-space: the scaffold around the model becomes the thing evolving."
    },
    critique: {
    kicker: "Harness RSI / phase 04",
    title: "Evaluate, Promote, Repeat",
    summary:
      "Candidates run against tasks, produce scores and traces, and either enter the frontier or feed the next round of diagnosis. The loop improves the harness while the base model stays fixed.",
    metrics: ["Eval score", "Pareto frontier", "H_t -> H_t+1"],
    active: 3,
    nodes: [
      ["Eval tasks", "Run candidates where behavior can be compared."],
      ["Scores + logs", "Quality, cost, failures, and reasoning traces return to the store."],
      ["Frontier", "Promotion weighs performance against risk and context cost."],
      ["Next harness", "Accepted changes become the runtime for future work."]
    ],
    loopNote: "Harness-level RSI is a repeatable promotion loop: run, log, rewrite, evaluate, persist."
    }
  },
  plain: {
    observe: {
      kicker: "Tool improvement / step 01",
      title: "Save What Happened",
      summary:
        "The system does the work, then keeps a useful record of what happened: the request, the tools used, the result, and where it struggled.",
      metrics: ["What happened", "What changed", "Keep the details"],
      active: 1,
      nodes: [
        ["Request", "Someone asks the AI system to do real work."],
        ["Current setup", "The system chooses tools, context, memory, and steps."],
        ["Result + record", "It produces an answer and a trail of how it got there."],
        ["History", "The next round can learn from this record."]
      ],
      loopNote: "Self-improvement starts when the system can look back at how its own setup behaved."
    },
    decompose: {
      kicker: "Tool improvement / step 02",
      title: "Spot the Repeating Problem",
      summary:
        "Instead of only asking whether the final answer was good, the site shows how to compare many attempts and find the recurring weak spot.",
      metrics: ["Compare attempts", "Find causes", "Name the pattern"],
      active: 2,
      nodes: [
        ["Past attempts", "Keep earlier examples available for comparison."],
        ["Pattern finder", "Look for the same mistakes across different runs."],
        ["Weak spot", "Name the part of the workflow that needs to change."],
        ["Guardrails", "Remember what must not break next time."]
      ],
      loopNote: "The key move is to improve the surrounding workflow, not just ask the model to try harder."
    },
    synthesize: {
      kicker: "Tool improvement / step 03",
      title: "Make a Better Version",
      summary:
        "The system proposes a concrete change people can review: a better prompt, memory rule, tool flow, checklist, or interface.",
      metrics: ["New version", "Options", "Reviewable"],
      active: 0,
      nodes: [
        ["Idea maker", "Use the pattern to propose a better workflow."],
        ["Change", "Edit the prompt, tool order, memory, or rules."],
        ["Candidate", "Package the proposed change with evidence."],
        ["Check", "Reject changes that are confusing or unsafe."]
      ],
      loopNote: "This is the practical version of recursive improvement: make the workflow itself easier to improve."
    },
    critique: {
      kicker: "Tool improvement / step 04",
      title: "Test It, Then Keep the Best",
      summary:
        "New versions run against examples. Good ones can become the default; weak ones feed the next round of learning.",
      metrics: ["Test result", "Best options", "Next setup"],
      active: 3,
      nodes: [
        ["Tests", "Try the new version on real tasks."],
        ["Results", "Record quality, cost, mistakes, and surprises."],
        ["Best set", "Keep the versions that improve outcomes without adding too much risk."],
        ["Next setup", "Use the winning version for future work."]
      ],
      loopNote: "The loop is simple: do the work, study the record, make a better setup, test it, repeat."
    }
  }
};

function getSessionId() {
  const key = "agiLoadingSessionId";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const sessionId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(key, sessionId);
  return sessionId;
}

function getReferrerHost() {
  if (!document.referrer) {
    return "direct";
  }

  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "") || "direct";
  } catch {
    return "unknown";
  }
}

function getTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const taggedSource = params.get("src") || params.get("utm_source") || params.get("source") || params.get("ref");

  if (taggedSource) {
    return taggedSource.toLowerCase().replace(/[^a-z0-9_-]+/g, "_").slice(0, 80);
  }

  const referrerHost = getReferrerHost();
  if (referrerHost.includes("linkedin")) {
    return "linkedin";
  }

  return referrerHost === "direct" ? "direct" : referrerHost;
}

function metricPayload(type, details = {}) {
  const route = getRouteFromLocation();
  return {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    type,
    sessionId: getSessionId(),
    source: getTrafficSource(),
    referrerHost: getReferrerHost(),
    path: window.location.pathname,
    route: route.name,
    article: route.article || currentArticleSlug,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ts: new Date().toISOString(),
    ...details
  };
}

function sendMetric(type, details = {}) {
  const payload = metricPayload(type, details);
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/metrics", blob);
    return;
  }

  fetch("/api/metrics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

function trackPageView(route) {
  const viewKey = `${window.location.pathname}${window.location.search}:${route.name}:${route.article || ""}`;
  if (lastTrackedView === viewKey) {
    return;
  }

  lastTrackedView = viewKey;
  sendMetric("view", {
    label: document.title
  });
}

function metricEntries(record, limit = 6) {
  return Object.entries(record || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => `<span><strong>${escapeHtml(label)}</strong>${count}</span>`)
    .join("");
}

function renderMetrics(payload) {
  const summary = payload.summary || {};
  const storageLabel = payload.storage === "redis" ? "persistent Redis" : "local memory";
  metricsCards.innerHTML = `
    <div class="metric-card">
      <span>Total Events</span>
      <strong>${summary.totalEvents || 0}</strong>
      <small>${storageLabel}</small>
    </div>
    <div class="metric-card">
      <span>Views</span>
      <strong>${summary.views || 0}</strong>
      <small>route loads</small>
    </div>
    <div class="metric-card">
      <span>Clicks</span>
      <strong>${summary.clicks || 0}</strong>
      <small>buttons + links</small>
    </div>
    <div class="metric-card wide">
      <span>Sources</span>
      <div class="metric-list">${metricEntries(summary.sources) || "<em>No sources yet</em>"}</div>
    </div>
    <div class="metric-card wide">
      <span>Top Clicks</span>
      <div class="metric-list">${metricEntries(summary.clickTargets) || "<em>No clicks yet</em>"}</div>
    </div>
  `;

  metricsRows.innerHTML = (payload.events || []).length
    ? payload.events
        .map(
          (event) => `
            <tr>
              <td>${escapeHtml(new Date(event.ts).toLocaleString())}</td>
              <td>${escapeHtml(event.type)}</td>
              <td>${escapeHtml(event.source)}</td>
              <td>${escapeHtml(event.path)}</td>
              <td>${escapeHtml(event.label || event.href || event.article || event.route)}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="5">No events matched this query.</td></tr>`;
}

async function loadMetrics() {
  if (!metricsCards || !metricsRows) {
    return;
  }

  const params = new URLSearchParams({ limit: "250" });
  if (metricsSource?.value.trim()) {
    params.set("source", metricsSource.value.trim());
  }
  if (metricsType?.value) {
    params.set("type", metricsType.value);
  }
  if (metricsPath?.value.trim()) {
    params.set("path", metricsPath.value.trim());
  }

  metricsCards.innerHTML = `<div class="metric-card wide"><span>Loading</span><strong>Querying events...</strong></div>`;

  try {
    const response = await fetch(`/api/metrics?${params.toString()}`, { headers: { accept: "application/json" } });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Metric query failed.");
    }
    renderMetrics(payload);
  } catch (error) {
    metricsCards.innerHTML = `
      <div class="metric-card wide">
        <span>Metrics unavailable</span>
        <strong>${escapeHtml(error.message)}</strong>
        <small>Add Redis REST env vars for production persistence.</small>
      </div>
    `;
    metricsRows.innerHTML = `<tr><td colspan="5">No query results available.</td></tr>`;
  }
}

function normalizeImportedHtml(html) {
  return html
    .replaceAll('href="/recommendation-harness"', 'href="https://harnessseries-site.vercel.app/recommendation-harness"')
    .replaceAll('href="/posts/', 'href="https://harnessseries-site.vercel.app/posts/');
}

function buildToc() {
  const headings = [...articleBody.querySelectorAll("h2, h3")];

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `${slugify(heading.textContent || "section")}-${index + 1}`;
    }
  });

  articleToc.innerHTML = headings.length
    ? headings
        .slice(0, 9)
        .map((heading, index) => `<a href="#${heading.id}"><span>${String(index + 1).padStart(2, "0")}</span>${heading.textContent}</a>`)
        .join("")
    : `<a href="#article"><span>01</span>Start</a>`;
}

function renderSim(slug, activeIndex = 0) {
  const preset = simPresets[slug] || simPresets["the-primitive"];
  simStatus.textContent = preset.status;
  simControls.innerHTML = preset.stages
    .map(
      ([label], index) => `
        <button class="sim-step ${index === activeIndex ? "is-active" : ""}" type="button" data-sim-step="${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>${label}
        </button>
      `
    )
    .join("");

  const nodes = preset.stages
    .map(
      ([label, artifact, detail], index) => `
        <button class="sim-node ${index === activeIndex ? "is-active" : ""}" type="button" data-sim-step="${index}">
          <span>${label}</span>
          <strong>${artifact}</strong>
          <small>${detail}</small>
        </button>
      `
    )
    .join("");

  simStage.innerHTML = `
    <div class="sim-orbit" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
    <div class="sim-nodes">${nodes}</div>
  `;

  document.querySelectorAll("[data-sim-step]").forEach((item) => {
    item.addEventListener("click", () => renderSim(slug, Number(item.dataset.simStep)));
  });
}

function renderPrimitiveDiagram(phase = "observe") {
  currentPrimitivePhase = phase;
  const diagram = rsiDiagrams[currentSiteMode][phase] || rsiDiagrams[currentSiteMode].observe;

  rsiKicker.textContent = diagram.kicker;
  rsiTitle.textContent = diagram.title;
  rsiSummary.textContent = diagram.summary;
  rsiMetrics.innerHTML = diagram.metrics.map((metric) => `<span>${metric}</span>`).join("");
  rsiStage.innerHTML = `
    <div class="rsi-rail" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="rsi-nodes">
      ${diagram.nodes
        .map(
          ([label, detail], index) => `
            <div class="rsi-node ${index === diagram.active ? "is-active" : ""}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${label}</strong>
              <small>${detail}</small>
            </div>
          `
        )
        .join("")}
    </div>
    <p class="rsi-loop-note">${diagram.loopNote}</p>
  `;
}

function renderKnowledgeMap(node = "primitive") {
  currentKnowledgeNode = node;
  const item = knowledgeMaps[currentSiteMode][node] || knowledgeMaps[currentSiteMode]["paper-one"];

  treeItems.forEach((treeItem) => {
    const isSelected = treeItem.dataset.knowledgeNode === node;
    treeItem.classList.toggle("is-active", isSelected);
    treeItem.setAttribute("aria-selected", String(isSelected));
  });

  knowledgeType.textContent = item.type;
  knowledgeCardTitle.textContent = item.title;
  knowledgeSummary.textContent = item.summary;
  knowledgeTags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  knowledgeFlow.innerHTML = item.flow
    .map(
      (step, index) => `
        <div class="knowledge-flow-step">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${step}</strong>
        </div>
      `
    )
    .join("");
}

function updatePriorSummary() {
  priorSummary.textContent = summaries[currentSiteMode][currentPrior] || summaries.technical.builder;
}

function getArticleVariant(article) {
  if (article.slug === "the-primitive" && currentPrior === "researcher") {
    return article.variants?.researcher || {};
  }

  return {};
}

function renderSiteCopy() {
  const copy = siteCopy[currentSiteMode] || siteCopy.technical;

  heroKicker.textContent = copy.heroKicker;
  heroDek.textContent = copy.heroDek;
  mapKicker.textContent = copy.mapKicker;
  mapTitle.textContent = copy.mapTitle;
  seriesKicker.textContent = copy.seriesKicker;
  seriesTitle.textContent = copy.seriesTitle;
  knowledgeKicker.textContent = copy.knowledgeKicker;
  knowledgeTitle.textContent = copy.knowledgeTitle;
  knowledgeIntro.textContent = copy.knowledgeIntro;
  railTitle.textContent = copy.railTitle;
  footerLead.textContent = copy.footerLead;
  footerTail.textContent = copy.footerTail;

  phaseCards.forEach((card) => {
    const phase = card.dataset.phaseCard;
    const phaseCopy = copy.phases[phase];
    card.querySelector(".map-card-title").textContent = phaseCopy[0];
    card.querySelector("p").textContent = phaseCopy[1];
  });

  siteModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.siteMode === currentSiteMode);
  });

  updatePriorSummary();
  renderPrimitiveDiagram(currentPrimitivePhase);
  renderKnowledgeMap(currentKnowledgeNode);
}

function setSiteMode(mode, options = {}) {
  currentSiteMode = mode === "plain" ? "plain" : "technical";
  window.localStorage.setItem("agiLoadingSiteMode", currentSiteMode);
  renderSiteCopy();

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("site", currentSiteMode);
    window.history.pushState({ article: url.searchParams.get("article"), site: currentSiteMode }, "", url);
  }
}

function renderArticle(slug = "the-primitive", options = {}) {
  const article = articles.find((item) => item.slug === slug) || articles[0];
  const variant = getArticleVariant(article);
  currentArticleSlug = article.slug;

  document.documentElement.style.setProperty("--active-accent", "var(--accent)");
  articleTitle.textContent = article.title;
  articleSummary.textContent = variant.summary || article.summary;
  articleMeta.textContent = `AGI Loading / ${article.issue} / ${article.author}`;
  articleIssue.textContent = article.issue;
  articleReadTime.textContent = `${formatDate(article.date)} / ${variant.read || article.read}`;
  articleBody.innerHTML = normalizeImportedHtml(variant.html || article.html);

  seriesGrid.querySelectorAll("[data-article]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.article === article.slug);
  });

  buildToc();
  renderSim(article.slug);
  observeDynamicContent();

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    url.pathname = `/article/${article.slug}`;
    url.searchParams.delete("article");
    window.history.pushState({}, "", url);
  }
}

function runBootSequence() {
  const logs = [
    "> calibrating agency budget...",
    "> loading harness series priors...",
    "> simulating outer-loop rewrites...",
    "> opening reader cockpit...",
    "> AGI loading: 100%"
  ];

  bootButton.disabled = true;
  bootButton.textContent = "Booting...";
  bootConsole.innerHTML = "";
  bootFill.style.width = "100%";
  bootPercent.textContent = "100%";

  logs.forEach((line, index) => {
    window.setTimeout(() => {
      const entry = document.createElement("span");
      entry.textContent = line;
      bootConsole.append(entry);
      if (index === logs.length - 1) {
        bootButton.textContent = "Boot Complete";
        document.querySelector("#series").scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }, 220 * index);
  });
}

segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    currentPrior = segment.dataset.prior;
    segments.forEach((item) => item.classList.toggle("is-active", item === segment));
    updatePriorSummary();
    renderArticle(currentArticleSlug);
  });
});

siteModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSiteMode(button.dataset.siteMode, { updateUrl: true });
  });
});

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    navigateTo(url.pathname);
  });
});

phaseCards.forEach((card) => {
  card.addEventListener("click", () => {
    phaseCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    renderPrimitiveDiagram(card.dataset.phaseCard);
  });
});

treeItems.forEach((item) => {
  item.addEventListener("click", () => {
    renderKnowledgeMap(item.dataset.knowledgeNode);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button");
  if (!target || target.closest("#metricsQuery")) {
    return;
  }

  const label = target.dataset.metricLabel || target.textContent || target.getAttribute("aria-label") || target.href || "interaction";
  sendMetric("click", {
    label: label.replace(/\s+/g, " ").trim().slice(0, 120),
    href: target.href || "",
    article: target.dataset.article || currentArticleSlug
  });
});

if (metricsQuery) {
  metricsQuery.addEventListener("submit", (event) => {
    event.preventDefault();
    loadMetrics();
  });
}

if (bootButton) {
  bootButton.addEventListener("click", runBootSequence);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

function observeDynamicContent() {
  document
    .querySelectorAll(".map-card, .tree-item, .knowledge-card, .series-card, .article-body section, .article-body > figure, .article-sim")
    .forEach((item) => {
      observer.observe(item);
    });
}

buildSeriesGrid();
const initialParams = new URLSearchParams(window.location.search);
const storedSiteMode = window.localStorage.getItem("agiLoadingSiteMode");
const initialSiteMode = initialParams.get("site");
currentSiteMode = initialSiteMode === "plain" || initialSiteMode === "technical" ? initialSiteMode : storedSiteMode === "plain" ? "plain" : "technical";
renderSiteCopy();
renderArticle(getRouteFromLocation().article);
renderRoute({ scroll: false });

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  currentSiteMode = params.get("site") === "plain" ? "plain" : "technical";
  renderSiteCopy();
  renderRoute({ scroll: false });
});
