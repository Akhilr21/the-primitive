const summaries = {
  builder: "Builder view: focus on what the CLI gives the agent that a skill alone cannot hold.",
  researcher: "Researcher view: focus on the local learning loop as a small eval substrate for personalization.",
  operator: "Operator view: focus on reviewable artifacts, promotion gates, and rollback before persistent behavior."
};

const phaseCards = document.querySelectorAll("[data-phase-card]");
const segments = document.querySelectorAll("[data-prior]");
const priorSummary = document.querySelector("#priorSummary");

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
  { threshold: 0.16 }
);

document.querySelectorAll(".map-card, .article section, .artifact").forEach((item) => {
  observer.observe(item);
});
