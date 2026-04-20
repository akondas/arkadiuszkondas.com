---
id: 19
readingTime: 7
title: "AI did not invent cognitive debt. It made it invisible."
description: "Thoughtworks Technology Radar Vol 34 flags codebase cognitive debt as Caution. The debt is not new. We have carried it since Stack Overflow. What is new is that you cannot feel it anymore, and no one has a framework for measuring debt you cannot see."
sources:
    -
        - "https://www.thoughtworks.com/radar"
        - "Technology Radar Vol 34 - Thoughtworks"
    -
        - "https://pages.cs.wisc.edu/~remzi/Naur.pdf"
        - "Programming as Theory Building - Peter Naur, 1985"
    -
        - "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/"
        - "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity - METR"
---

D., one of my seniors, is walking me through a PR on the payment retry path. Three hundred lines, moderate size, already approved two weeks ago and sitting on a branch behind a feature flag. He is confident. He knows this code. He wrote it.

I stop him on line 147. A retry loop wrapped in a try-catch, with a 500ms backoff, bailing out after three attempts and returning a hardcoded `PaymentStatus::PENDING` instead of propagating the exception.

"Why PENDING and not FAILED here?"

He pauses. He rereads his own code. Scrolls up. Scrolls down.

"I think this handles the timeout case differently from a hard decline, so we do not want the customer to see a failure on a transient network blip. Let me check."

The pause lasts maybe half a minute. In a code review session that is a long time.

He checks. He was half right. The branch also swallows a specific exception from our payment provider that should never be swallowed. Nobody caught it in review. The tests pass. The flag is off in production, which is the only reason this conversation is not happening in an incident channel.

He wrote every line of this file. He shipped it. He cannot defend it.

And he is not the only one.

What I watched D. do in that review has a name. He did not forget a method signature. He did not lose context on a legacy module he inherited. He paused on code he had authored, shipped, and signed off on. He could not reconstruct the reasoning behind it. That is cognitive debt. On his own code.

I have watched this happen to four engineers in the last three months. Three of them were senior. All four use AI assistants daily.

Thoughtworks put a name on it in [Technology Radar Vol 34](https://www.thoughtworks.com/radar): codebase cognitive debt. Their framing is straightforward. When AI generates the code, it is easy to accept a working solution without building the mental model that usually comes with writing it yourself. The understanding never gets constructed. Over time the gap compounds. The system gets harder to reason about, harder to debug, harder to evolve. And the people on the team cannot tell you why any specific part of it works the way it does.

The radar marks this **Caution**. Not *Trial*. Not *Assess*. Caution.

That distinction matters. *Trial* means they think it is worth pursuing. *Assess* means it is worth a look. *Caution* is the quadrant for things to approach carefully or avoid. The most-read technology radar in the industry is not telling teams to experiment. It is telling them to slow down.

<div class="cd-visual cd-radar">
<svg viewBox="0 0 460 380" role="img" aria-labelledby="cd-radar-title cd-radar-desc">
<title id="cd-radar-title">Thoughtworks Technology Radar ring placement</title>
<desc id="cd-radar-desc">A quarter-circle radar with four rings labelled Adopt, Trial, Assess, and Caution. Codebase cognitive debt is plotted on the outermost Caution ring.</desc>
<path class="cd-ring cd-ring-caution" d="M 240,320 L 325,320 A 285,285 0 0,0 40,35 L 40,120 A 200,200 0 0,1 240,320 Z" style="stroke:#e67e22;stroke-width:1.5" />
<path class="cd-ring cd-ring-assess" d="M 170,320 L 240,320 A 200,200 0 0,0 40,120 L 40,190 A 130,130 0 0,1 170,320 Z" />
<path class="cd-ring cd-ring-trial" d="M 105,320 L 170,320 A 130,130 0 0,0 40,190 L 40,255 A 65,65 0 0,1 105,320 Z" />
<path class="cd-ring cd-ring-adopt" d="M 40,320 L 105,320 A 65,65 0 0,0 40,255 Z" />
<line class="cd-axis-line" x1="40" y1="320" x2="330" y2="320" />
<line class="cd-axis-line" x1="40" y1="320" x2="40" y2="30" />
<text class="cd-ring-label" x="72" y="342">Adopt</text>
<text class="cd-ring-label" x="137" y="342">Trial</text>
<text class="cd-ring-label" x="205" y="342">Assess</text>
<text class="cd-ring-label" x="282" y="342">Caution</text>
<text class="cd-ring-sublabel" x="282" y="355">(Hold)</text>
<line class="cd-marker-leader" x1="211" y1="149" x2="248" y2="108" />
<circle class="cd-marker" cx="211" cy="149" r="7" />
<text class="cd-marker-label" x="253" y="112">codebase cognitive debt</text>
</svg>
<p class="cd-caption">Thoughtworks Technology Radar Vol 34 places codebase cognitive debt on the outermost ring. Proceed carefully, or avoid.</p>
</div>

So the debt has a name. What the radar does not explain is why this version of the debt is more dangerous than every previous version we have lived through. That is what the rest of this post is for.

Before I go further I want to be honest about something. Cognitive debt is not a 2026 invention. We have been accumulating it for as long as we have been shipping software.

I have lived through several versions of it.

The Stack Overflow copy-paste era is the obvious one. A junior pastes a regex from the accepted answer. It validates emails, mostly. Nobody on the team can explain the lookahead. Nobody wants to touch it. When a customer reports that addresses with a plus sign bounce, the fix is to paste a different answer from further down the same thread. I have shipped code like this. So have you.

Vendored dependencies are another. Fifteen years ago in PHP world, vendoring a library you half-trusted into `/lib` was a normal Tuesday. The package did what you needed. You read maybe twenty percent of it during the initial review. Six months later a CVE drops and somebody on the team has to read the other eighty percent under pressure, in production, with a customer on the phone.

Legacy modules are the third. Every sufficiently old codebase has a file that three former engineers touched and one current engineer is afraid of. The comments lie. The tests cover the happy path. The original author left in 2019. The module still processes payments. You do not rewrite it because you cannot prove what will break.

Auto-generated code belongs on the list too. A 6,000-line ORM migration. A scaffolded admin panel nobody reads until it breaks. Protobuf stubs checked into the repo. We have always had machines producing code humans do not read.

None of this was a golden age. The debt was real and it hurt.

<div class="cd-visual cd-timeline">
<svg viewBox="0 0 800 320" role="img" aria-labelledby="cd-timeline-title cd-timeline-desc">
<title id="cd-timeline-title">Visibility of cognitive debt across five eras</title>
<desc id="cd-timeline-desc">A descending line connecting five eras of cognitive debt: Stack Overflow copy-paste, vendored dependencies, legacy modules, auto-generated code, and AI-generated code. Each generation sits lower on a visibility axis than the one before, with AI-generated code at the floor.</desc>
<line class="cd-axis-line" x1="70" y1="30" x2="70" y2="255" />
<line class="cd-axis-line" x1="70" y1="255" x2="760" y2="255" />
<text class="cd-axis-label" x="64" y="38" text-anchor="end">HIGH</text>
<text class="cd-axis-label" x="64" y="258" text-anchor="end">NONE</text>
<text class="cd-axis-label" x="22" y="145" transform="rotate(-90 22 145)" text-anchor="middle">visibility / friction</text>
<polyline class="cd-connector" points="140,60 280,95 420,135 560,175 700,235" />
<circle class="cd-dot" cx="140" cy="60" r="7" />
<circle class="cd-dot" cx="280" cy="95" r="7" />
<circle class="cd-dot" cx="420" cy="135" r="7" />
<circle class="cd-dot" cx="560" cy="175" r="7" />
<circle class="cd-dot-accent" cx="700" cy="235" r="8" />
<text class="cd-era-label" x="140" y="283">Stack Overflow</text>
<text class="cd-era-year" x="140" y="298">copy-paste regex</text>
<text class="cd-era-label" x="280" y="283">Vendored deps</text>
<text class="cd-era-year" x="280" y="298">half-read libs</text>
<text class="cd-era-label" x="420" y="283">Legacy modules</text>
<text class="cd-era-year" x="420" y="298">ghost authors</text>
<text class="cd-era-label" x="560" y="283">Auto-generated</text>
<text class="cd-era-year" x="560" y="298">scaffolds, stubs</text>
<text class="cd-era-label" x="700" y="283">AI-generated</text>
<text class="cd-era-year" x="700" y="298">prompt, accept</text>
</svg>
<p class="cd-caption">Each generation of cognitive debt has left less evidence behind. The trend is not new, but the floor is.</p>
</div>

What is new is how invisible it has become.

The difference is not scale. We have shipped larger systems before. It is not speed either. Deadlines were always short. It is not the volume of code no human reads. We have been checking in machine-generated files for a decade.

The difference is invisibility.

**Shift 1: the friction is gone.** Every previous version of cognitive debt left a trace. Copy-pasting a regex from Stack Overflow took an act. You opened the browser, scanned the answer, pasted it, tweaked it. Vendoring a library meant downloading a tarball and watching it land in `/lib`. Auto-generated stubs came with a banner comment nobody wrote by accident. Each of these actions put a mental bookmark in place: *I did not reason this through from scratch.* The bookmark survived the commit. You could come back to it. AI-generated code arrives without that bookmark. It is typed into the same editor, in the same style, on the same branch, attributed to the same author. A week later the engineer cannot tell the difference. Neither can the reviewer.

**Shift 2: authorship is ambiguous at the individual level.** Ask an engineer which lines in their PR they reasoned through and which the agent produced, and most of the time they cannot give you a clean answer. Self-assessment of comprehension has always been unreliable. We overrate what we think we understand. With an agent in the loop it gets worse, because the felt experience of shipping fast is louder than the actual state of the code. [METR's 2025 study on AI-assisted open-source development](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) measured this directly: experienced developers working on codebases they knew well were **19% slower** with AI tools than without. They reported feeling faster. That gap between perceived and actual is the invisibility argument in empirical form. You cannot debug what you cannot see, and you cannot see what feels fine.

**Shift 3: the memory loss is systemic.** Old cognitive debt was personal. One engineer did not understand one function. You routed around it, or you asked them, or you read the code. AI-era debt is collective. Nobody on the team holds the theory of the module. The model that produced it does not remember it. The next agent that touches it starts from zero context. The system has no author. This shows up as [slow code reviews](/slow-code-reviews-the-silent-velocity-killer) that stall because no reviewer can anchor the diff to intent, and it shows up in the metrics your team already collects and cannot explain, the kind of queueing failure I wrote about in [hospital ERs](/what-hospital-ers-know-about-code-reviews-that-your-team-doesnt). The team has forgotten in aggregate what no single person ever knew.

Peter Naur named this failure mode forty years before we had the tooling to reproduce it at scale. In [Programming as Theory Building](https://pages.cs.wisc.edu/~remzi/Naur.pdf) he argued that the code is the artifact. The theory, the mental model of why it works, lives only in the programmer's head, and it cannot be reconstructed from the source alone. When no programmer holds the theory, the code is a fossil. Still executable. No longer understood.

So how do you tell, in practice, whether your team is accumulating this debt or moving fast? This is the test I run.

> Can this engineer explain this code, from memory, two weeks after shipping it?

If the answer is no, that is cognitive debt. It is not a crime. It is not a firing offense. It is not evidence that somebody is a bad engineer or that the AI tooling was a mistake. It is a signal, the way a leverage ratio is a signal. Cognitive debt is not inherently bad, the same way financial debt is not inherently bad. Leverage is how you build things you could not otherwise afford. The problem is *unmeasured* debt. A team that knows it carries cognitive debt on a module can plan around it. A team that does not know gets surprised in an incident channel at 2 a.m.

Once you have the signal, the question is what to do with it. I have seen teams try three responses that help. They rotate module ownership on a real cadence, not just function ownership inside a PR, so more than one person has had to sit with the theory of a system. They ask for explain-back during code review instead of treating an approval click as the end state. The reviewer says *walk me through why this branch returns PENDING* and listens for the pause. And they re-onboard engineers to their own code quarterly, the way you would onboard a new hire, because two weeks is already long enough to forget and a quarter is long enough to be honest about it.

The radar itself points in the same direction. Thoughtworks recommends feedback sensors for coding agents, tracking team cognitive load, and architectural fitness functions that continuously enforce key constraints as AI accelerates output. Directionally right, still vague. A fitness function that fails a build when cyclomatic complexity crosses a threshold is real leverage. A cognitive-load metric that collapses into tickets-per-sprint is theatre. The sensor is only useful when it measures the code, not the team's comfort with it.

None of this is a playbook. It is a set of examples of what a response could look like when you take the signal seriously. What to actually do with it is the harder question.

I do not have a framework for you, and I am suspicious of anyone who does. The Thoughtworks radar marks this **Caution**, not **Trial**, for a reason. The industry has not figured out how to manage this debt yet. Anyone pitching you a complete solution is either selling a product or has not sat with the problem long enough.

What I have instead is a short list of questions I am actually uncertain about.

**Is there a measurement for team comprehension that does not collapse into lines-of-code ownership or commit counts?**
Every proxy reaches for the same surrogates. Lines authored. PRs merged. Files touched. None tell you whether the team holds the theory of the system. I do not know what a real metric looks like, and I am skeptical of every dashboard that claims it does.

**Do AI code review tools close the comprehension gap, or widen it?**
An automated reviewer that approves the diff before a human engages with it is not a reviewer. It is another layer of plausible-looking assent between the author and the code. I am not sure which side these tools land on, and the answer probably depends on how the team uses them.

**What does onboarding look like on a team where the codebase has no human author?**
The old answer was pair with somebody who wrote it. If the model produced it and no engineer reconstructed the theory, who hands the new hire the mental model? I have no good answer. Most teams will find out the hard way.

The debt is real.

The accounting system does not exist yet.

Be careful who you let sell you one.

<link rel="stylesheet" href="/assets/css/cognitive-debt.css" />
