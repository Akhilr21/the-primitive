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

const primitiveResearcherHtml = `
<section class="variant-note">
  <h3>Researcher Rewrite</h3>
  <p>This version rewrites the original Primitive article as a technical research note. It keeps the original thesis but reframes it through harness optimization, filesystem-mediated feedback, and human-governed recursive self-improvement.</p>
</section>
<section>
  <h3>Research Framing</h3>
  <p class="article-lede">The primitive is not a skill generator. It is a proposal for a local, inspectable harness-optimization substrate: a minimal system that turns repeated user-agent work into candidate changes to the environment around the model.</p>
  <p>The original article argues from a product and builder perspective: model capability is increasingly mediated by scaffolding, and the smallest useful intervention may be a local skill factory rather than a full rewrite of a coding agent. From a research perspective, the same claim can be stated more precisely: the object of optimization should shift from isolated prompts or skills toward the <em>harness</em>, meaning the executable procedure that controls context construction, tool access, memory, state updates, and review surfaces.</p>
  <p>This follows the central observation in <a href="https://arxiv.org/html/2603.28052v1">Meta-Harness: End-to-End Optimization of Model Harnesses</a>: performance depends not only on model weights, but also on the code that decides what information is stored, retrieved, and presented to the model. The paper frames harness engineering as a code-search problem over the model's surrounding system, not as a narrow prompt-editing problem.</p>
  <p>The Primitive takes that research direction and asks for the smallest locally useful instantiation. If Meta-Harness searches over task-specific harness programs at benchmark scale, the local primitive searches over personal workflow infrastructure at workspace scale.</p>
</section>

<section>
  <h3>From Meta-Harness to Local Primitive</h3>
  <p>Meta-Harness introduces an outer loop in which a proposer agent inspects prior candidate harnesses, execution traces, and evaluation scores stored in a filesystem, then proposes new harness code. Candidate harnesses are evaluated, their logs are written back into the filesystem, and the loop repeats. The important design choice is that the proposer receives rich, selective access to history through ordinary developer operations rather than a compressed prompt summary.</p>
  <p>The local primitive preserves that structure but changes the unit of work. Instead of optimizing a benchmark harness for online classification, retrieval-augmented reasoning, or TerminalBench-style coding tasks, it optimizes recurring local workflows. A workflow becomes an object that can be detected, named, bundled, critiqued, evaluated, and optionally promoted into future behavior.</p>
  <p>In formal terms, let a local agent environment be an executable harness <code>H_t</code> around a fixed model <code>M</code>. The harness determines which files are read, which tools are exposed, how state is persisted, how user preferences are retrieved, and what artifacts are produced. A user task produces a trajectory <code>tau_t</code>: commands, file edits, intermediate reasoning surfaces, generated artifacts, failures, and final outputs. The primitive's job is to convert repeated trajectories into a candidate harness delta <code>Delta H_t</code>.</p>
  <p>This makes the system recursive, but not mystical. It does not require changing model weights. It changes the local computational environment in which the model operates. The recursion is: harness-mediated work produces traces; traces diagnose weaknesses in the harness; proposed harness changes are reviewed; accepted changes modify the next work environment.</p>
</section>

<section>
  <h3>Why Skills Are an Output, Not the Primitive</h3>
  <p>The original article emphasizes a practical distinction: if the output is only <code>SKILL.md</code>, the system is too narrow. A skill is one possible artifact emitted by the loop. It is not the loop itself.</p>
  <p>From the Meta-Harness lens, this matters because the search space is code-space and workflow-space, not just instruction-space. A recurring workflow may need a skill, but it may also need a CLI command, a filesystem convention, a redaction policy, an evaluation harness, a browser automation, a document template, a rubric, a visual inspection page, or a promotion gate. Treating skills as the universal target would collapse the action space too aggressively.</p>
  <p>The primitive therefore needs an intermediate representation: a candidate optimization bundle. In the current local implementation, that bundle can include <code>workflow.json</code>, <code>evidence.json</code>, <code>SKILL.md</code>, <code>CRITIQUE.md</code>, and <code>scorecard.json</code>. The exact filenames are less important than the contract: every proposed persistent behavior should carry its evidence, trigger conditions, risks, evaluation criteria, and rollback story.</p>
  <p>This is the product analogue of the Meta-Harness filesystem. The filesystem is not merely storage; it is the feedback channel that gives future proposers access to prior source, traces, scores, and failures. Locally, the reviewable bundle becomes the boundary between automated discovery and human-governed persistence.</p>
</section>

<section>
  <h3>Credit Assignment Over Workflows</h3>
  <p>A major reason harness optimization is hard is credit assignment. Many failures appear at the final answer, but the cause may sit earlier in context selection, memory retrieval, tool ordering, prompt construction, state mutation, or evaluation design. Meta-Harness argues that compressed feedback can erase the information needed to connect downstream failures to earlier harness decisions.</p>
  <p>The Primitive inherits the same problem at the level of personal work. Suppose an agent repeatedly turns research notes into publishable field notes. A poor result may be caused by missing source preservation, weak outline generation, bad citation routing, inadequate visual QA, incorrect audience framing, or a stale local convention. A scalar rating such as "good" or "bad" is not enough to identify which part of the workflow should become infrastructure.</p>
  <p>The local factory therefore needs to retain high-granularity traces: which files were inspected, which commands were run, which artifacts were created, which edits were discarded, where the user corrected the agent, and which final structure survived review. Those traces allow the system to detect workflow families and propose targeted deltas. The optimization target becomes the procedure by which work is done, not the last output alone.</p>
  <p>This is why the primitive should be CLI-backed. A chat-only skill can notice a pattern, but a CLI can materialize the pattern as durable evidence and artifacts. It can read logs, redact sensitive data, write candidate bundles, run validation, compare alternatives, and expose a review UI outside the lifetime of a single conversation.</p>
</section>

<section>
  <h3>Human-Governed Recursive Self-Improvement</h3>
  <p>The phrase recursive self-improvement can sound like an unbounded autonomy claim. In this context it should mean something narrower and more useful: the harness can improve the local conditions for future harness-mediated work, under explicit review constraints.</p>
  <p>The local loop can be described as:</p>
  <ol>
    <li><code>Observe</code>: import trajectories from repeated work sessions.</li>
    <li><code>Decompose</code>: cluster trajectories into workflow families and identify likely harness-level bottlenecks.</li>
    <li><code>Propose</code>: generate candidate artifacts that modify future behavior.</li>
    <li><code>Critique</code>: attach risks, evidence, trigger rules, and evaluation criteria.</li>
    <li><code>Promote</code>: let the user accept, revise, reject, or roll back persistent changes.</li>
  </ol>
  <p>That loop is recursive because promotion changes the future environment that will generate the next traces. It is governed because persistence is not automatic. The system can search and propose, but the user controls which behaviors become part of the durable harness.</p>
  <p>This is the key difference between personalization and silent mutation. A useful personal harness should learn, but it should make its learning legible. It should answer: what pattern was observed, what artifact is proposed, what evidence supports it, what risk it introduces, when it should trigger, and how it can be removed.</p>
</section>

<section>
  <h3>Research Hypothesis</h3>
  <p>The research hypothesis is that a small local factory can approximate the first useful layer of Meta-Harness-style optimization for personal software. It will not discover globally optimal harnesses, and it should not pretend to. Its value is in turning tacit repeated work into inspectable, reviewable, persistent infrastructure.</p>
  <p>There are three testable claims:</p>
  <ul>
    <li><strong>Workflow recurrence is detectable.</strong> Local traces contain enough signal to identify repeated task families without requiring a centralized product telemetry system.</li>
    <li><strong>Harness deltas are useful artifacts.</strong> The right output is often not a final answer, but a change to the environment that improves future answers.</li>
    <li><strong>Reviewability is the safety boundary.</strong> Users are more likely to trust adaptive software when proposed persistence comes with evidence, critique, and rollback.</li>
  </ul>
  <p>If these claims hold, the Primitive becomes a bridge between current coding-agent workflows and adaptive personal software. It starts as a local CLI because that is the smallest substrate with enough agency, memory, and filesystem access to make the loop real. Over time, the same pattern can move into richer product surfaces: editors, research workspaces, document systems, browsers, and agent runtimes.</p>
  <p>The deeper point is that the primitive is not "make me a skill." It is: convert repeated work into governed harness updates. That is the smallest version of recursive self-improvement that feels immediately useful, inspectable, and safe enough to run in a personal workspace.</p>
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
    variants: {
      researcher: {
        read: "12 min",
        summary:
          "A research rewrite of the Primitive as a local, human-governed harness-optimization substrate grounded in Meta-Harness.",
        html: primitiveResearcherHtml
      }
    },
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
