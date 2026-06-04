import { articles } from "./articles.js";

const summaries = {
  builder: "Builder view: focus on what the CLI gives the agent that a skill alone cannot hold.",
  researcher: "Researcher view: focus on the local learning loop as a small eval substrate for personalization.",
  operator: "Operator view: focus on reviewable artifacts, promotion gates, and rollback before persistent behavior."
};

const phaseCards = document.querySelectorAll("[data-phase-card]");
const segments = document.querySelectorAll("[data-prior]");
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
      renderArticle(button.dataset.article, { updateUrl: true });
      document.querySelector(".article-header").scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });
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
  const diagram = rsiDiagrams[phase] || rsiDiagrams.observe;

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

function renderArticle(slug = "the-primitive", options = {}) {
  const article = articles.find((item) => item.slug === slug) || articles[0];

  document.documentElement.style.setProperty("--active-accent", article.accent);
  articleTitle.textContent = article.title;
  articleSummary.textContent = article.summary;
  articleMeta.textContent = `AGI Loading / ${article.issue} / ${article.author}`;
  articleIssue.textContent = article.issue;
  articleReadTime.textContent = `${formatDate(article.date)} / ${article.read}`;
  articleBody.innerHTML = normalizeImportedHtml(article.html);

  seriesGrid.querySelectorAll("[data-article]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.article === article.slug);
  });

  buildToc();
  renderSim(article.slug);
  observeDynamicContent();

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("article", article.slug);
    window.history.pushState({ article: article.slug }, "", url);
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
    const prior = segment.dataset.prior;
    segments.forEach((item) => item.classList.toggle("is-active", item === segment));
    priorSummary.textContent = summaries[prior];
  });
});

phaseCards.forEach((card) => {
  card.addEventListener("click", () => {
    phaseCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    renderPrimitiveDiagram(card.dataset.phaseCard);
  });
});

bootButton.addEventListener("click", runBootSequence);

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
  document.querySelectorAll(".map-card, .series-card, .article-body section, .article-body > figure, .article-sim").forEach((item) => {
    observer.observe(item);
  });
}

buildSeriesGrid();
renderPrimitiveDiagram();
renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");

window.addEventListener("popstate", () => {
  renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");
});
