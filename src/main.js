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
    status: "local skill factory online",
    stages: [
      ["Observe", "Codex traces", "Repeated work enters the local factory as raw behavior."],
      ["Decompose", "Workflow family", "The harness groups sessions by files, commands, artifacts, and outcomes."],
      ["Synthesize", "Candidate bundle", "The system proposes a reusable artifact instead of silently mutating itself."],
      ["Promote", "Future behavior", "You accept, revise, reject, or install what should persist."]
    ]
  },
  "autonomous-harness-engineering": {
    status: "outer loop inspecting traces",
    stages: [
      ["Task", "Inner harness", "The model runs with tools, memory, context, and state."],
      ["Trace", "Failure surface", "Execution history exposes where the harness helped or failed."],
      ["Rewrite", "Outer loop", "A meta-agent compares candidates and rewrites the scaffold."],
      ["Eval", "New harness", "Scores decide whether the next harness deserves to run."]
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
renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");

window.addEventListener("popstate", () => {
  renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");
});
