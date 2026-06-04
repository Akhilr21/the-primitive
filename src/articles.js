import autonomousHtml from "../content/posts/autonomous-harness-engineering.html?raw";
import infrastructureHtml from "../content/posts/harnesses-as-self-improving-infrastructure.html?raw";

const primitiveHtml = `
<section>
  <h3>Recap</h3>
  <p class="article-lede">I spent a lot of time reflecting on my last field note. Harness Engineering is crucial when we think about this next phase in AI, where it is less about model intelligence alone and more focused on the scaffolding around the model itself.</p>
  <p>The idea of the meta-harness hinges on an interface that continuously optimizes and learns. I personally believe it is a foundational concept for personalized software. There is a lot of theoretical research happening, and it is a fun but very large frontier problem to solve.</p>
  <p>The smallest useful primitive, however, may be much smaller. It may not require rewriting Codex or Claude Code, or creating a complex training framework that sits over the model itself.</p>
  <p>In my opinion, this primitive could start as a local skill factory: a meta-harness that observes repeated work, decomposes that work into workflow families, generates reviewable optimization artifacts, critiques them, and lets the user decide what should become part of the future work environment.</p>
  <p>Frontier engineers are already doing this by asking Codex to build skills from their workflows. But the deeper primitive is broader than skills. It is a local learning loop for turning repeated work into infrastructure, and it can scale across product surfaces.</p>
  <p>Instead of just talking about it, I dedicated a weekend to steering the build of the CLI myself.</p>
</section>
<section>
  <h3>My Approach</h3>
  <p>The goal for this first primitive was to keep it intentionally small. I wanted the primitive to ask one simple question:</p>
  <blockquote>What work does this person keep doing that should become a reusable system behavior?</blockquote>
  <p>I also needed a primitive that could scale into something much larger, which led me to build a CLI.</p>
  <p>The current factory imports local Codex traces, finds repeated workflows, and produces candidate optimization bundles. Sometimes that bundle may become a skill. But the important point is that the output is not just <code>SKILL.md</code>.</p>
  <p>The output is a reviewable package:</p>
  <ul>
    <li><code>workflow.json</code>: the detected workflow family</li>
    <li><code>evidence.json</code>: the sessions and signals behind the candidate</li>
    <li><code>SKILL.md</code>: the proposed reusable behavior</li>
    <li><code>CRITIQUE.md</code>: risks, strengths, and review questions</li>
    <li><code>scorecard.json</code>: the eval criteria and promotion verdict</li>
  </ul>
  <p>That structure matters because a personalized harness should not silently mutate itself.</p>
  <p>If the system proposes a new behavior, the user should be able to ask: why does this exist, what traces support it, when should it trigger, what risks does it introduce, and what would make it worth installing?</p>
  <p>That is the line I care about most. A meta-harness cannot just optimize. It has to make optimization legible, and this becomes increasingly important when we think beyond the primitive.</p>
</section>
<section>
  <h3>Why a CLI?</h3>
  <p>The obvious pushback is: why build a CLI at all? Why not just create a Codex skill or Claude skill that reads logs and generates more skills?</p>
  <p>That is a fair point. If the goal is just to help your coding tool get to know you a bit better, I would argue a skill is the right choice. But if we are trying to build a primitive that scales into something more, the skill is only the invocation surface.</p>
  <p>The skill can decide when the factory should run. The CLI gives the factory a durable place to operate. It can read files, redact secrets, write artifacts, compare runs, store eval outputs, generate UI scaffolds, and persist outside a single chat session.</p>
  <p>That separation gives the system a cleaner shape:</p>
  <ol>
    <li>The agent notices repeated work.</li>
    <li>A skill or tool wrapper invokes the factory.</li>
    <li>The CLI performs the factory work.</li>
    <li>The workspace stores the evidence and artifacts.</li>
    <li>The UI lets the user inspect, tune, reject, revise, or promote the output.</li>
  </ol>
  <p>The CLI is not the final user experience. It is the substrate that makes the future user experience trustworthy.</p>
</section>
<section>
  <h3>CLI + Sandbox Agents</h3>
  <p>The CLI becomes more important when you think about sandboxed agent runtimes, a new primitive natively built into the Agents SDK from OpenAI.</p>
  <p>As agents move into persistent workspaces where they can inspect files, run commands, edit artifacts, use tools, and resume from saved state, the CLI stops being something a person runs manually. It becomes a local control plane that an agent can call.</p>
  <p>This is especially useful in the CLI architecture because it no longer behaves like a simple skill generator. Instead, it becomes a mechanical self-learning loop:</p>
  <blockquote>agent observes work -> local factory builds candidate infrastructure -> eval layer critiques it -> user promotes what should persist.</blockquote>
  <p>The interesting part is the freedom we have in the final artifact. The output does not have to be a skill every time, and in fact it often should not. Sometimes the right artifact is a checklist, eval, CLI command, UI component, project scaffold, browser automation, or filesystem convention.</p>
  <p>As we start thinking about what the scaffolding could become, and what interfaces it can interact with, we start knocking on the door of generative software grounded by a simple goal:</p>
  <blockquote>The factory's job is to learn what optimization artifact should exist and how it is served to the user.</blockquote>
</section>
<section>
  <h3>What's Next?</h3>
  <p>If you have gotten to this point, I sincerely thank you. For those frustrated by the number of questions I have left unanswered, I empathize with you. This is not a simple problem, and there are many questions left unsolved.</p>
  <p>The simplest way I have thought about validating my ongoing hypotheses is by optimizing my own workspace. For example, I keep asking Codex to turn messy research notes into structured field notes. The CLI can detect that repeated workflow and capture the workspace pattern behind it: the files I inspect, the context I preserve, the intermediate artifacts I create, and the shape of the final output.</p>
  <p>It then generates a candidate bundle: the proposed skill, the evidence behind it, a critique, and a scorecard explaining when that pattern should trigger again.</p>
  <p>I review the bundle, decide whether it actually matches how I work, and either reject, revise, or promote it into my future environment.</p>
  <p>Over time, even that learning and promotion loop can become more automated, as the harness gets better at knowing which patterns are safe, useful, and worth carrying forward.</p>
</section>
`;

export const articles = [
  {
    slug: "the-primitive",
    issue: "I.03",
    title: "The Primitive",
    author: "Akhil Ramaswamy",
    date: "2026-06-04",
    read: "8 min",
    summary: "Why the smallest useful meta-harness may be a CLI-backed learning loop, not just a skill.",
    topics: ["primitive", "skill-factory", "CLI substrate"],
    accent: "#99e35d",
    html: primitiveHtml,
    references: [
      {
        kind: "source",
        label: "Source Google Doc",
        href: "https://docs.google.com/document/d/1uefuLa-DUoFzvlmSFwC8kbj3hrRPAN7m/edit"
      },
      {
        kind: "source",
        label: "The Primitive GitHub repository",
        href: "https://github.com/Akhilr21/the-primitive"
      }
    ]
  },
  {
    slug: "autonomous-harness-engineering",
    issue: "I.01",
    title: "Autonomous Harness Engineering?",
    author: "Akhil Ramaswamy",
    date: "2026-05-14",
    read: "2 min",
    summary: "A field note on the Meta-Harness paper, coding agents, and why the harness around a model may matter as much as the model itself.",
    topics: ["meta-harness", "coding agents", "traces"],
    accent: "#ff8aa8",
    html: autonomousHtml,
    references: [
      {
        kind: "paper",
        label: "Meta-Harness: End-to-End Optimization of Model Harnesses, arXiv:2603.28052",
        href: "https://arxiv.org/abs/2603.28052"
      }
    ]
  },
  {
    slug: "harnesses-as-self-improving-infrastructure",
    issue: "I.02",
    title: "Harnesses as Self-Improving Infrastructure",
    author: "Vishal Tandale",
    date: "2026-05-12",
    read: "18 min",
    summary: "Connecting agent harnesses to a decade of recommendation infrastructure, and the next step toward adaptive, per-user interfaces.",
    topics: ["infrastructure", "recommendation", "personalization"],
    accent: "#7eb6ff",
    html: infrastructureHtml,
    references: [
      {
        kind: "paper",
        label: "Meta-Harness: End-to-End Optimization of Model Harnesses, arXiv:2603.28052",
        href: "https://arxiv.org/abs/2603.28052"
      },
      {
        kind: "essay",
        label: "LangChain — The anatomy of an agent harness",
        href: "https://www.langchain.com/blog/the-anatomy-of-an-agent-harness"
      },
      {
        kind: "paper",
        label: "Google Research — Ranking systems reference",
        href: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf"
      },
      {
        kind: "essay",
        label: "LinkedIn Engineering — Engineering the next generation of LinkedIn's feed",
        href: "https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed"
      },
      {
        kind: "demo",
        label: "DocLayer — auto-improving harness prototype",
        href: "https://doclayer-one.vercel.app/mocks/"
      },
      {
        kind: "demo",
        label: "Meta IDE workspace — auto-improving harness prototype",
        href: "https://meta-ide-workspace-mocks-20260513.vercel.app/"
      },
      {
        kind: "source",
        label: "OpenAI — Introducing GPT-5.3-Codex",
        href: "https://openai.com/index/introducing-gpt-5-3-codex/"
      }
    ]
  }
];
