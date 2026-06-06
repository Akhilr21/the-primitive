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

let currentPrior = "builder";
let currentSiteMode = "technical";
let currentPrimitivePhase = "observe";
let currentKnowledgeNode = "primitive";
let currentArticleSlug = "the-primitive";

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

const siteCopy = {
  technical: {
    heroKicker: "AGI loading / harness boot sequence",
    heroDek: "Field notes from the software layer around model intelligence, rendered as an interactive bootloader.",
    mapKicker: "Inspectable Substrate",
    mapTitle: "The Skill Factory Is a Loop, Not a Prompt",
    seriesKicker: "Imported Harness Series",
    seriesTitle: "One Surface, 3 Harness Field Notes",
    knowledgeKicker: "Primitive Source Tree",
    knowledgeTitle: "Where the Primitive Comes From",
    knowledgeIntro:
      "A folder-style map of the two foundation papers, the harness layer they imply, and the article that sits on top.",
    railTitle: "Reader Harness",
    footerLead: "AGI Loading wraps",
    footerTail: "as a playable article surface.",
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
    knowledgeKicker: "Source Map",
    knowledgeTitle: "The Article Is Built on 2 Earlier Ideas",
    knowledgeIntro:
      "Think of this like a project folder: the article is the visible page, but underneath it are the papers and tool ideas that make it work.",
    railTitle: "Reader Guide",
    footerLead: "AGI Loading turns",
    footerTail: "into an interactive reading room.",
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
    primitive: {
      type: "article",
      title: "the-primitive",
      summary:
        "The Primitive is the synthesis layer: it asks what reusable unit should persist when AI work starts to improve the tools around itself.",
      tags: ["CLI-backed primitive", "persistent behavior", "human review"],
      flow: ["Paper 01 frames harnesses", "Paper 02 formalizes recursive search", "Primitive asks what should persist"]
    },
    papers: {
      type: "folder",
      title: "papers",
      summary:
        "The foundation folder. These papers supply the claims that a harness is more than a prompt and that recursive improvement can target the scaffold around the model.",
      tags: ["source arguments", "research priors", "harness theory"],
      flow: ["Define harness", "Define meta-loop", "Route both into the primitive"]
    },
    "paper-one": {
      type: "paper 01",
      title: "Autonomous Harness Engineering",
      summary:
        "This paper establishes the inner/outer loop: a task harness runs the model, while a meta-layer inspects traces and rewrites the harness itself.",
      tags: ["inner loop", "outer loop", "trace inspection"],
      flow: ["Run task", "Capture trace", "Rewrite scaffold", "Evaluate next harness"]
    },
    "paper-two": {
      type: "paper 02",
      title: "Meta-Harness / arXiv 2603.28052v1",
      summary:
        "This paper makes the RSI move explicit: search over harness code and histories, evaluate candidates, and promote the next harness without changing the base model weights.",
      tags: ["recursive self-improvement", "candidate harnesses", "Pareto frontier"],
      flow: ["Read prior code + logs", "Propose delta H", "Score candidates", "Promote H_t+1"]
    },
    harness: {
      type: "runtime folder",
      title: "harness-runtime",
      summary:
        "The implementation layer implied by both papers: tools, memory, context, traces, state, evaluation gates, and rollback become first-class surfaces.",
      tags: ["tools", "memory", "eval gates"],
      flow: ["Tools + memory", "Trace store", "Quality signal", "Promotion gate"]
    },
    site: {
      type: "surface",
      title: "agi-loading.surface",
      summary:
        "The site turns the abstract dependency graph into a reader surface: imported field notes, interactive diagrams, and mode-aware explanations.",
      tags: ["reader", "diagram layer", "site copy modes"],
      flow: ["Import articles", "Map dependencies", "Expose diagrams", "Let readers switch modes"]
    }
  },
  plain: {
    primitive: {
      type: "article",
      title: "the-primitive",
      summary:
        "This article asks a simple question: when an AI workflow gets better, what part should be saved so future work improves too?",
      tags: ["main idea", "what should persist", "review before keeping"],
      flow: ["Idea 1: tools around AI matter", "Idea 2: tools can improve themselves", "Article: what do we save?"]
    },
    papers: {
      type: "folder",
      title: "papers",
      summary:
        "This folder holds the two ideas underneath the article: first, AI needs a working setup around it; second, that setup can be tested and improved.",
      tags: ["background", "2 source ideas", "foundation"],
      flow: ["Understand the setup", "Understand improvement", "Build the article"]
    },
    "paper-one": {
      type: "paper 01",
      title: "Autonomous Harness Engineering",
      summary:
        "The first idea: AI does better when it has a surrounding workbench of tools, memory, context, and feedback.",
      tags: ["AI workbench", "tools + memory", "learning from attempts"],
      flow: ["Do work", "Save what happened", "Notice failures", "Improve the workbench"]
    },
    "paper-two": {
      type: "paper 02",
      title: "Meta-Harness / arXiv 2603.28052v1",
      summary:
        "The second idea: instead of only asking the model to be smarter, improve the workflow around the model and test better versions.",
      tags: ["self-improvement", "better versions", "keep the winners"],
      flow: ["Look at past attempts", "Make a better setup", "Test options", "Keep the best one"]
    },
    harness: {
      type: "tool folder",
      title: "harness-runtime",
      summary:
        "This is the workbench: the tools, memory, saved history, tests, and review gates that make improvement possible.",
      tags: ["tools", "saved history", "tests"],
      flow: ["Choose tools", "Remember the run", "Check quality", "Approve or reject"]
    },
    site: {
      type: "surface",
      title: "agi-loading.surface",
      summary:
        "This website makes the map visible, so a reader can see how the article grows out of the earlier papers.",
      tags: ["reader", "interactive map", "plain/technical modes"],
      flow: ["Show the articles", "Show the source tree", "Explain the loop", "Let readers choose language"]
    }
  }
};

function buildSeriesGrid() {
  seriesGrid.innerHTML = articles
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
    return { name: "source", article: currentArticleSlug };
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
      (activeRoute.name === "source" && linkPath === "/source") ||
      (activeRoute.name === "article" && linkPath.startsWith("/article/"));

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

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
  }
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
  const item = knowledgeMaps[currentSiteMode][node] || knowledgeMaps[currentSiteMode].primitive;

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
