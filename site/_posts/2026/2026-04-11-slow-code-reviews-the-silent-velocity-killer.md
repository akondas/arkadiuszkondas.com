---
id: 17
title: "Slow code reviews: the silent velocity killer"
description: "Your team ships fast, your CI is green, your sprints look healthy. But there is a silent killer hiding in plain sight: slow code reviews. Let me show you the numbers."
sources:
    -
        - "https://graphite.com/research/median-time-to-merge-prs"
        - "The Median Developer's PRs Take 14 Hours to Merge"
    -
        - "https://google.github.io/eng-practices/review/reviewer/speed.html"
        - "Speed of Code Reviews - Google Engineering Practices"
    -
        - "https://www.infoq.com/articles/co-creation-patterns-software-development/"
        - "From Async Code Reviews to Co-Creation Patterns"
    -
        - "https://jonnyzzz.com/blog/2026/01/16/code-review-bottleneck/"
        - "Stop Optimizing Code Generation"
    -
        - "https://www.michaelagreiler.com/code-reviews-at-google/"
        - "Code Reviews at Google are Lightweight and Fast"
    -
        - "https://josnyder.com/blog/2024/queueing_theory_swe.html"
        - "Queueing Theory for the Working Software Engineer"
    -
        - "https://getdx.com/research/measuring-developer-productivity-with-the-dx-core-4/"
        - "Measuring Developer Productivity with the DX Core 4"
    -
        - "https://getdx.com/blog/engineering-metrics-top-teams/"
        - "The Engineering Metrics Used by Top Dev Teams"
    -
        - "https://workweave.dev/blog/the-price-of-mandatory-code-reviews"
        - "The Price of Mandatory Code Reviews"
    -
        - "https://linearb.io/blog/code-review-metrics"
        - "Code Review Metrics - LinearB"
    -
        - "https://www.usehaystack.io/blog/engineering-metrics-that-matter-how-to-evaluate-and-improve-code-reviews"
        - "Engineering Metrics That Matter - Haystack"
    -
        - "https://help.pluralsight.com/help/review-metrics"
        - "Review Metrics - Pluralsight Flow"
    -
        - "https://getdx.com/blog/pitfalls-of-developer-activity-metrics/"
        - "Pitfalls of Tracking Developer Activity Metrics"
    -
        - "https://getdx.com/blog/3-metrics-for-measuring-the-impact-of-ai-on-code-quality/"
        - "Three Metrics for Measuring the Impact of AI on Code Quality"
---

Your CI pipeline runs in 4 minutes. Your deployments are fully automated. Sprint velocity looks great on paper. And yet features take weeks to reach production.

Where does all that time go?

I will tell you where. It sits in your pull request queue, silently rotting.

## The numbers nobody talks about

Graphite research across thousands of repositories shows that the median PR with reviews takes **14 hours to merge**. The average across all teams? **128 hours**. That's more than 5 working days for a single pull request.

Read that again. Your engineer finishes a feature in the morning, opens a PR, and the next meaningful thing that happens to that code is... tomorrow. Or the day after. Or next week. The code just sits there, getting stale like bread on the counter 🤯.

And the worst part? Most teams have no idea this is happening. They track sprint velocity, deployment frequency, even lines of code. But nobody is watching the queue.

I know because I was one of those managers. When I first pulled TTFR numbers for my own team, I was convinced the tool was broken. It wasn't broken. We were just blind to where the time actually went.

## The metrics that reveal the problem

If you want to fix slow code reviews, you need to measure them. Not with gut feeling, not with "it feels like reviews are slow". With actual numbers. Here are the metrics every engineering manager should track.

### Time to First Review (TTFR)

This is the single most important metric. It measures the time between a PR being opened and the first reviewer commenting or approving.

The median organization averages **15 hours** for TTFR. The fastest quartile is under 10 hours. The slowest? Over 23 hours. Google aims for same-day response and achieves median review completion in under 4 hours.

LinearB benchmarks break it down further: elite teams achieve pickup time under 1 hour, healthy teams under 4 hours, and anything over a full business day needs improvement. One important detail: LinkedIn measures this at P50 and P90 in **business hours**, not calendar hours. Weekends and nights don't count. If your tool measures in calendar time, your numbers look worse than reality. Make sure you know which one you are tracking.

Workweave's research across their customer base adds a concrete cost: PR turnaround under 3 hours maintains baseline developer productivity. Once it crosses 8 hours, productivity drops by a factor of 2.1x. Not because people stop working. Because they start working on the wrong things.

Why does this matter so much? Because TTFR sets the pace for everything that follows. A PR that sits untouched for a day signals to the author: "move on to something else." And that is exactly what they do. They pull in new work, increase WIP, and start the death spiral I will describe later.

### Review Cycle Time

The full elapsed time from PR opened to PR merged. This includes wait time (idle, nobody looking), review time (active examination), and rework time (addressing feedback and re-review).

Here's the thing most people miss: **wait time typically dwarfs everything else**. The actual review takes 20 minutes. The rework takes an hour. But the waiting between rounds? Days.

Break this metric down into its components. Haystack decomposes review time into three sub-phases: **First Response Time** (how quickly someone looks at it), **Rework Time** (how long the author spends addressing feedback), and **Idle Completion Time** (dead time between final revision and merge). Each phase has different causes and different fixes. Lumping them together hides where the real problem is.

If your cycle time is 3 days and the active work totals 2 hours, you have a process problem, not a capacity problem.

This distinction matters more than it sounds. A PR's lifecycle is made of **wait time** (sitting in a queue, nobody looking), **think time** (a reviewer actively reading and evaluating), and **rework time** (the author addressing feedback). When I talk about slow reviews being a problem, I mean the wait time, not the thinking. A reviewer who spends 45 focused minutes on a PR the same morning it was opened is infinitely more valuable than one who spends 10 distracted minutes three days later. The first is fast and thorough. The second is slow and shallow. The goal is to compress the wait, not the thought.

### PR Size Distribution

Research consistently shows that code reviews are most effective when the number of modified lines stays **under 400 lines**. Google takes this much further. Their median change is only 24 lines.

Track the distribution of PR sizes on your team. If you see a lot of PRs above 400 lines, you have found a root cause. Large PRs are slow to review because reviewers cannot maintain focus. They get skimmed instead of reviewed. And that 2,000-line PR that sat in the queue for a week? Nobody actually reviewed it thoroughly. They approved it to make it go away. Be honest, you have done it too. I have.

### Number of Review Rounds

How many back-and-forth cycles does a typical PR go through before it gets merged? One round (submit, review, approve) is healthy. Two rounds is normal for complex changes. Three or more rounds is a red flag.

High round counts multiply wait time. If each round adds a day of wait time, a PR that goes through 4 rounds takes a week just in queue time, even if the total active review time is under an hour.

Track your average rounds per PR. If it's consistently above 2, investigate why. Common causes: unclear requirements, missing coding standards, PRs that are too large to review effectively in one pass, or reviewers who nitpick instead of focusing on what matters.

### Review Depth

Review rounds tell you how many times the feedback loop runs. Review depth tells you whether anything meaningful happens inside each loop.

A "review" that consists of clicking Approve on a 500-line PR with zero comments is not a review. It's a checkbox. LinearB calls this out explicitly: they flag shallow reviews (approval with no comments on large PRs) as a risk signal. Code Climate goes further and classifies every review comment by size: Large (20+ words, likely substantive), Regular (8-20 words), or Trivial (fewer than 8 words). Pluralsight Flow measures review coverage at the hunk level: what percentage of changed code sections actually received a comment.

Workweave's data makes the tradeoff concrete. Teams with review quality scores above 75 (on their AI-assessed scale) had **61% fewer bugs**. The cost? A **38% reduction in review speed**. That's the real question every engineering manager must answer: how much speed are you willing to trade for quality? Most teams never make this choice consciously. They just rubber-stamp and hope for the best.

If you only measure review speed, you'll optimize for fast approvals. Pair it with a depth metric and you optimize for fast *and* meaningful reviews. I learned this the hard way when my team's TTFR looked great but our production incidents kept climbing. Fast approvals, zero substance.

### Author Response Time

Almost every review metric focuses on the reviewer. How fast did they pick up the PR? How many comments did they leave? But the feedback loop has two sides.

Author response time measures how long the PR author takes to address reviewer feedback and push updates. Haystack tracks this as "Follow-up Time" and found it's often the hidden bottleneck. A reviewer responds within 2 hours, the author takes 2 days to address the feedback. From the outside, the PR looks stuck "in review." In reality, the reviewer did their job. The author moved on to other work and never came back.

This connects directly to the WIP death spiral. When an author has 3 other things in progress, addressing review feedback drops to the bottom of the priority list. The PR ages, the branch gets stale, merge conflicts appear, and eventually the rework costs more than the original implementation.

Track the time between "changes requested" and the author's next push. If it's consistently over a day, your team has an author responsiveness problem, not a reviewer speed problem.

### Reviewer Load Distribution

Not all reviewers are created equal. In most teams, one or two senior engineers end up reviewing 60-70% of all PRs. They become the bottleneck nobody talks about. On one of my teams, our senior backend engineer was reviewing so many PRs that his own feature work was constantly late. We blamed him for being slow. Turns out he was just drowning in everyone else's code.

Track the number of open PRs assigned to each reviewer. If someone has 8 pending reviews while others have 1, you don't have a review speed problem, you have a load balancing problem. Google's internal tooling uses the Gini coefficient to quantify this inequality. A Gini of 0 means perfectly even distribution. A Gini approaching 1 means one person reviews everything. Most teams have never computed this number, but any spreadsheet can do it.

High reviewer load leads to longer queues, context switching fatigue, and eventually rubber-stamping. Three LGTMs on a PR that nobody actually read. That is worse than a slow review. A slow review might eventually surface a problem. A rubber-stamped review gives you the false confidence that the code was vetted when it wasn't.

There is a second dimension here that getDX and the "Software Engineering at Google" book both emphasize: **knowledge distribution**. Track how many distinct people have reviewed code in a given directory or module over the past quarter. If only one person ever reviews the authentication module, that's not just a load problem. It's a bus factor problem. When that person goes on vacation, nobody can meaningfully review auth changes. Reviews either stall or get rubber-stamped by someone who doesn't understand the code. Distribute review work not just for speed, but for organizational resilience.

### Rework Rate

The 2025 DORA report introduced rework rate as the 5th official DORA metric. It measures the ratio of deployments made to fix bugs versus planned feature work.

Why does this belong in a code review article? Because rework is the downstream cost of poor reviews. When reviews are rushed (because the queue is too long and everyone is under pressure to approve faster), bugs escape to production. Those bugs generate unplanned work that further slows down the team, including the reviewers.

As AI tools increase PR volume and size, reviewers face cognitive overload and miss subtle bugs. The result: a documented 9% increase in bug rates, directly driving higher rework rates.

Workweave's research adds an interesting angle here. They compared teams with mandatory code reviews against teams without. Teams with reviews produced 3.7 bugs per developer. Teams without produced 8.9 bugs per developer (2.4x more). But the bug reduction has diminishing returns: the biggest improvement comes from going from zero reviews to just 0.5 reviews per PR on average. After that, each additional review adds less protection. This means a quick, focused review from one person catches most problems. Three slow reviews from three people rarely catch three times as much.

One important warning from getDX: never track rework rate in isolation. Always pair it with a quality metric like change failure rate or escaped defect rate. A team can have low rework simply because nobody bothers to fix the bugs they ship.

### Flow Efficiency

This is the ratio of active work time to total elapsed time. Dragan Stepanovic's research across 40,000+ PRs shows that flow efficiency in async code review workflows is extremely low.

If a PR takes 3 days from open to merge, but the actual human work (writing code, reviewing, addressing feedback) totals 3 hours, your flow efficiency is about 4%. The other 96% is just waiting.

Most teams have never calculated this number. When they do, it's a wake-up call.

### Escaped Defects

The rate of bugs that make it to production despite code review. If you track post-merge bugs and correlate them with their PRs, you can measure how effective your reviews actually are.

A study by Capers Jones analyzing over 12,000 software projects found that formal code reviews detected 60-65% of hidden defects, while informal reviews caught fewer than 50%. Microsoft research adds something interesting here: reviewers primarily improve maintainability, not catch bugs. If your team thinks reviews are for bug catching but your escaped defect rate is high, the process isn't delivering what you think it is.

### Approval-to-Merge Time

This is the metric that nobody tracks and everybody wastes time on. It measures the gap between the final approval on a PR and the moment it actually gets merged.

Think about it. The code is written. The review is done. Everyone agrees it is good. And then... it sits there. For hours. Sometimes days.

Haystack calls this "Idle Completion Time" and treats it as the third sub-phase of review cycle time. Common causes: CI pipelines that take too long to run after approval, merge conflicts from a branch that went stale during review, deploy freezes, or simply nobody clicking the merge button because the author moved on to other work.

Haystack recommends keeping this under 1 hour. If yours is higher, look at your CI pipeline speed and whether you have auto-merge enabled for approved PRs. This is often the easiest metric to fix because it's pure process friction, no human behavior change required.

### PR Revert Rate

The percentage of merged PRs that get reverted. getDX defines it as: (number of reverted PRs) / (total PRs, excluding the revert PRs themselves).

This is different from escaped defects. Escaped defects require incident tracking, post-mortems, and correlating production bugs back to specific PRs. That's slow and often incomplete. Reverts are immediate and unambiguous. A revert means the review process let something through that it shouldn't have.

Track this metric over time. A rising revert rate after introducing AI coding tools is a clear signal that your review process isn't keeping pace with increased code volume. getDX specifically recommends monitoring PR revert rate as one of three key metrics for measuring AI's impact on code quality, alongside change failure rate and code maintainability scores.

A healthy revert rate depends on your context, but if more than 5% of your PRs get reverted, something in your review process needs attention.

### Review System Load Factor

This is the metric nobody tracks yet. I think they should.

If you have heard of Little's Law (I'll use it later in this post), you know queueing theory has something to say about software delivery. But there is another concept from queueing theory that applies directly to code reviews: the **utilization rate**, often written as **ρ** (rho).

The formula is simple:

> ρ = λ / μ

Where **λ** (lambda) is the arrival rate (average number of PRs opened per day that need review) and **μ** (mu) is the service rate (average number of PRs your team can review and merge per day).

When ρ is low (say 0.5), the system has spare capacity. PRs get reviewed quickly. Life is good.

When ρ approaches 0.7, queues start forming. Wait times grow noticeably.

When ρ crosses 0.85, something interesting happens: **wait times grow exponentially**. Not linearly. A team running at 90% utilization doesn't have 10% longer wait times than a team at 80%. It has 2-3x longer wait times. This is not opinion. It's the mathematical property of any queueing system described by the Pollaczek-Khinchine formula.

Here's what makes this metric so powerful: **it's predictive, not retrospective**. TTFR and cycle time tell you what already happened. The load factor tells you what's about to happen.

Imagine your team of 6 reviewers handles an average of 12 PRs per day (μ = 12). Currently, 9 PRs arrive per day (λ = 9). Your load factor is 0.75. Queues exist but they're manageable.

Now your company rolls out an AI coding assistant. Individual developer output increases by 30%. Suddenly 12 PRs arrive per day. Your load factor hits 1.0. The queue grows without bound. Cycle times go through the roof.

This is exactly what the 2025 DORA report describes: AI boosts individual output but organizational delivery stays flat. The load factor explains why. We increased λ without increasing μ.

To compute your own load factor:

1. Count how many PRs were opened per day over the last 2 weeks (that's your λ)
2. Count how many PRs were reviewed and merged per day over the same period (that's your μ)
3. Divide λ by μ

If the result is below **0.7**, your review system has healthy headroom. Between **0.7 and 0.85** is the danger zone: things work but any spike in PR volume (a new feature push, an AI tool rollout, a returning colleague clearing their backlog) will cause queue explosion. Above **0.85**, you're already in trouble, even if cycle time metrics haven't caught up yet.

The fix is straightforward in theory: either reduce λ (fewer, smaller PRs), increase μ (more reviewers, faster reviews, automation), or both. In practice, most teams only react after cycle times have already blown up. The load factor gives you weeks of advance warning.

I haven't seen any engineering effectiveness tool surface this as a named metric. Swarmia's working agreements and LinearB's benchmarks get close, but they measure outcomes (cycle time exceeded target) rather than system capacity.

I don't compute this every week. But I do check it quarterly, and especially before any change that affects PR volume: rolling out AI tools, onboarding new team members, or entering a high-output sprint. Think of it less as a dashboard metric and more as a smoke detector. You don't stare at it, but when it goes off, you pay attention.

## The WIP death spiral 🌀

These metrics don't exist in isolation. They feed each other in a vicious cycle that I call the WIP death spiral. Let me walk you through it.

1. A developer opens a PR. Nobody reviews it for a day.
2. The developer does the rational thing: starts new work.
3. Now they have two things in progress. Their context is split.
4. More developers do the same. Open PRs pile up.
5. Reviewers now have a wall of pending reviews. They feel overwhelmed.
6. Reviews get delayed further. Or they get rubber-stamped.
7. Back to step 1, but worse.

This is not a people problem. It is a systems problem. And Little's Law explains it precisely:

> Average cycle time = Average WIP / Average throughput

If your team of 5 has 15 open PRs and merges 5 per day, the average cycle time is 3 days. Reduce WIP to 5 open PRs (one per developer), and cycle time drops to 1 day. Nobody worked faster. The system just flows better.

## Context switching makes it worse

Every time a developer switches from their current work to review someone else's code, there is a cost. Research by Dr. Gloria Mark at UC Irvine shows it takes an average of **23 minutes and 15 seconds** to fully regain focus after an interruption. For complex coding tasks, Carnegie Mellon research extends this to **45 minutes**.

Now do the math: if a developer does 3 code reviews per day, switching context each time, they lose over an hour just in recovery time. Not review time. Recovery time. And interrupted tasks take twice as long and contain twice as many errors.

The irony? Slow reviews cause more context switching, not less. When a PR comes back after 2 days with feedback, the author has to reload the entire mental model of what they were doing. Fast reviews (within hours) mean the context is still fresh.

## The DORA connection

If you care about DORA metrics (and you should), code review time is eating your Lead Time for Changes. getDX's DX Core 4 framework unifies DORA, SPACE, and DevEx into four dimensions: Speed, Effectiveness, Quality, and Business Impact. Code review metrics span all four. That's not a coincidence. Review is the crossroads where speed meets quality.

The 2025 DORA report found that AI coding assistants boost individual output (21% more tasks completed, 98% more pull requests merged) but organizational delivery metrics stay flat.

The bottleneck has shifted. We optimized the machine. We forgot about the humans sitting between the machine and production.

As the report states: "Without end-to-end visibility, teams optimize locally (making code generation faster) while the actual constraint shifts to review, integration, and deployment."

LinearB's 2026 benchmark data makes the review bottleneck even more visible: AI-generated PRs wait **4.6 times longer** before a human picks them up, and when finally reviewed, only **32.7%** are accepted. Compare that to **84.4%** for human-authored PRs. There is a trust gap. Reviewers spend more time scrutinizing AI-generated code because they can't assume the author understood what they wrote. More code in, slower reviews out. The queue grows.

## What to measure first

If you're starting from zero, here's what I recommend:

1. **TTFR and Cycle Time**: pull these from your git platform today. GitHub, GitLab, or tools like Sleuth, LinearB, Swarmia can generate these automatically. Share the numbers with your team. Target: TTFR under 4 business hours.
2. **PR Size Distribution**: this is the leading indicator. If your PRs are too big, everything else will be slow. Target: 80% of PRs under 400 lines.
3. **Open PR Count**: simple but powerful. How many PRs are open right now? That's your WIP. Little's Law tells you the rest. Target: no more than 1-2 open PRs per developer.

Start with these three. They will tell you where the pain is.

## What NOT to measure

Knowing what to measure matters. Knowing what to avoid matters more. getDX published a thorough analysis of metric anti-patterns, and I agree with all of them:

- **Individual PR counts or commit counts.** This incentivizes cherry-picking small, easy tasks over hard, valuable work.
- **Lines of code per developer.** Shifts focus from solving problems to producing volume. A developer who deletes 500 lines of dead code is more valuable than one who adds 500 lines of unnecessary abstraction.
- **Code review comment volume.** Encourages reviewers to write more words, not better feedback. Three meaningful comments beat twenty nitpicks.
- **PR approval rates per individual.** getDX warns this "damages trust and undermines collaboration" when used for performance evaluation. People stop giving honest feedback if their approval rate is being watched.

The common thread: any code review metric used as an **individual performance measure** will be gamed. Use these metrics at the team level to surface process bottlenecks. Never use them to rank people.

## What you can do today without a dashboard

You don't need management buy-in or tooling to start improving. If you're a developer reading this:

- **Review before you start new work.** Check your review queue every morning before writing new code. This single habit breaks the WIP death spiral at the source.
- **Make your PRs smaller.** If it's over 400 lines, split it. Smaller PRs get faster, better reviews.
- **Write better PR descriptions.** Explain *why*, not just *what*. Link the ticket. Add a screenshot for UI changes. A reviewer who understands context gives better feedback in less time.
- **Talk instead of waiting.** For complex changes, a 10-minute call beats two days of async back-and-forth.

The metrics in this post help managers see the system. But the system is made of individual habits.

In the next post, I will cover exactly how to fix this: from setting turnaround targets to review rotations, stacked PRs, and knowing when to ditch async reviews entirely. The metrics tell you where it hurts. The solutions make the pain stop.

Have you measured your own TTFR? I'm curious what number surprised you the most. Let me know in the comments or reach out directly.
