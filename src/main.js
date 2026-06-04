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
const referenceStack = document.querySelector("#referenceStack");
const activeAuthor = document.querySelector("#activeAuthor");
const activeTopics = document.querySelector("#activeTopics");

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

function renderReferences(article) {
  referenceStack.innerHTML = article.references.length
    ? article.references
        .map(
          (reference, index) => `
            <a class="reference-card" href="${reference.href}" target="_blank" rel="noreferrer">
              <span>${String(index + 1).padStart(2, "0")} / ${reference.kind}</span>
              <p>${reference.label}</p>
            </a>
          `
        )
        .join("")
    : `<p class="empty-note">No references attached.</p>`;
}

function renderArticle(slug = "the-primitive", options = {}) {
  const article = articles.find((item) => item.slug === slug) || articles[0];

  document.documentElement.style.setProperty("--active-accent", article.accent);
  articleTitle.textContent = article.title;
  articleSummary.textContent = article.summary;
  articleMeta.textContent = `Harness Series / ${article.issue} / ${article.author}`;
  articleIssue.textContent = article.issue;
  articleReadTime.textContent = `${formatDate(article.date)} / ${article.read}`;
  activeAuthor.textContent = article.author;
  activeTopics.textContent = article.topics.join(" / ");
  articleBody.innerHTML = normalizeImportedHtml(article.html);

  seriesGrid.querySelectorAll("[data-article]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.article === article.slug);
  });

  buildToc();
  renderReferences(article);
  observeDynamicContent();

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("article", article.slug);
    window.history.pushState({ article: article.slug }, "", url);
  }
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
  document.querySelectorAll(".map-card, .series-card, .article-body section, .article-body > figure, .artifact, .reference-card").forEach((item) => {
    observer.observe(item);
  });
}

buildSeriesGrid();
renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");

window.addEventListener("popstate", () => {
  renderArticle(new URLSearchParams(window.location.search).get("article") || "the-primitive");
});
