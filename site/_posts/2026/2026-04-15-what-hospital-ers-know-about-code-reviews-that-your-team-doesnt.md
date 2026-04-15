---
id: 18
readingTime: 17
title: "What hospital ERs know about code reviews that your team doesn't"
description: "Hospital emergency rooms, call centers, and highway traffic have been optimized by queueing theory for decades. Your PR queue obeys the same math but nobody on your team has done the calculations. Seven equations reveal why it breaks."
sources:
    -
        - "https://en.wikipedia.org/wiki/Kingman%27s_formula"
        - "Kingman's formula - Wikipedia"
    -
        - "https://en.wikipedia.org/wiki/Jackson_network"
        - "Jackson network - Wikipedia"
    -
        - "https://www.johndcook.com/blog/2022/01/12/mm2/"
        - "M/M/1 vs M/M/2 - John D. Cook"
    -
        - "https://josnyder.com/blog/2024/queueing_theory_swe.html"
        - "Queueing Theory for the Working Software Engineer - Josh Snyder"
    -
        - "https://less.works/less/principles/queueing_theory"
        - "Flow & Queueing Theory - LeSS Framework"
    -
        - "https://sback.it/publications/icse2018seip.pdf"
        - "Modern Code Review: A Case Study at Google - Sadowski et al., ICSE 2018"
    -
        - "https://arxiv.org/html/2503.05040"
        - "No Silver Bullets: Understanding Software Cycle Time - Empirical Software Engineering, 2025"
    -
        - "https://getdx.com/research/measuring-developer-productivity-with-the-dx-core-4/"
        - "Measuring Developer Productivity with the DX Core 4"
    -
        - "https://web.mit.edu/urban_or_book/www/book/chapter4/4.9.1.html"
        - "Priority Queueing - MIT Urban Operations Research"
    -
        - "https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/"
        - "Move faster, wait less: Improving code review time at Meta"
    -
        - "https://link.springer.com/article/10.1007/s10664-022-10143-4"
        - "Pull Request Latency Explained - Zhang et al., Empirical Software Engineering, 2022"
    -
        - "https://graphite.com/research/median-time-to-merge-prs"
        - "The Median Developer's PRs Take 14 Hours to Merge - Graphite"
    -
        - "https://erikbern.com/2018/03/27/waiting-time-load-factor-and-queueing-theory.html"
        - "Waiting time, load factor, and queueing theory - Erik Bernhardsson"
    -
        - "https://www.allaboutlean.com/kingman-formula/"
        - "The Kingman Formula - AllAboutLean"
    -
        - "https://static0.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf"
        - "Code Review at Cisco Systems - SmartBear"
    -
        - "https://fffej.substack.com/p/four-things-queueing-theory-can-teach"
        - "Four Things Queueing Theory Can Teach Software Development"
    -
        - "https://linearb.io/blog/code-review-metrics"
        - "Code Review Metrics - LinearB"
    -
        - "https://dev.to/vitalii_petrenko_dev/the-hidden-cost-of-slow-code-reviews-data-from-8-million-prs-5fei"
        - "The Hidden Cost of Slow Code Reviews: Data from 8 Million PRs"
    -
        - "https://workweave.dev/blog/the-price-of-mandatory-code-reviews"
        - "The Price of Mandatory Code Reviews - Workweave"
    -
        - "https://getdx.com/blog/pitfalls-of-developer-activity-metrics/"
        - "Pitfalls of Tracking Developer Activity Metrics - getDX"
---

When you walk into a hospital emergency room, you enter one of the most mathematically optimized queueing systems on the planet. Decades of operations research have gone into deciding how many nurses to staff per shift, how to triage patients, how to stagger doctor schedules, and how to handle the 3 AM surge after the bars close. The math behind these decisions has saved countless lives.

Your pull request queue faces the same fundamental problems. PRs arrive at variable rates. Reviewers have limited capacity. Some items are urgent. Servers (reviewers) go on breaks. The queue builds up, people wait, and the system either flows or it doesn't. The difference is that hospitals have been applying queueing theory to these problems since the 1960s. Most engineering teams have never heard of the equations that govern their review process.

In my [last post](/slow-code-reviews-the-silent-velocity-killer), I showed you the metrics that reveal slow code reviews: TTFR, cycle time, PR size distribution, load factor. I argued that your review queue is a silent velocity killer, and I gave you numbers to prove it. That post scratched the surface. Now I want to go deeper: into the math itself.

Queueing theory was born in 1909 when a Danish mathematician named Agner Krarup Erlang studied telephone switchboards in Copenhagen. He wanted to know: how many operators does a telephone exchange need so that callers don't wait too long? The math he developed has since been applied to hospital ERs, highway traffic, call centers, and packet routing. Your PR queue obeys the same laws. The question is whether you understand them well enough to stop fighting the math and start using it.

## Kingman's formula: the equation that explains everything

If you read only one section of this post, read this one. Kingman's formula, published in 1961, is the equation that hospital administrators use to predict ER wait times. It also happens to be the most important equation for understanding your PR queue. It describes the average waiting time as the product of three independent factors:

> W = V × U × T

Where:

- **V** = variability factor = (c_a² + c_s²) / 2
- **U** = utilization factor = ρ / (1 − ρ)
- **T** = average service time = 1 / μ

The c_a² and c_s² terms are the squared coefficients of variation for arrival times and service times, respectively. They measure how spread out the data is relative to its mean. A value of 0 means perfectly predictable. A value of 1 means exponentially random. Above 1 means highly erratic.

In my last post, I focused on U, the utilization factor. I showed how wait times explode as utilization approaches 1. At 90% utilization, U = 9. At 95%, U = 19. That is real and important.

But Kingman's formula reveals something most engineering managers never consider: **V and U multiply each other**. Variability doesn't add to the utilization problem. It multiplies it.

Here's a concrete example. Two teams, same average review speed (μ), same number of incoming PRs:

**Team A** runs at 70% utilization but has high variability. Some PRs take 10 minutes to review. Others take 4 hours. The arrival pattern is bursty: quiet mornings, then 6 PRs land after lunch. Their variability factor V = 3.0.

**Team B** runs at 80% utilization but has low variability. PRs are similar sizes, review times cluster around 30 minutes, and submissions are spread evenly through the day. Their V = 0.5.

Team A's wait: 3.0 × (0.7/0.3) × T = **7.0T**

Team B's wait: 0.5 × (0.8/0.2) × T = **2.0T**

Team A has 10% lower utilization and **3.5× longer wait times**. Purely because of variance.

When I first ran these numbers for my own team, I could not believe it. We had been obsessing over utilization (are our reviewers busy enough?) while completely ignoring variance. Our PRs ranged from 15-line config changes to 2,000-line feature branches. That variance was costing us more than the extra reviewer we had been begging management to approve.

Let me put a dollar figure on this. If your average review time T is 30 minutes, Team A waits 3.5 hours per PR while Team B waits 1 hour. That is 2.5 extra hours of delay per PR. Your developers are not sitting idle. They context-switch to other work, which is exactly the WIP trap I described in my last post. The cost is not idle time. It is split attention, slower rework responses, and longer cycle times. If your team processes 8 PRs per day and your fully loaded engineer cost is $150/hour, the variance tax is roughly $3,000 per day. That is **$750,000 per year**, for a single team, in developer time spent waiting for reviews that would have been faster if the PRs were just more uniform in size. No fancy tooling required to fix it. No headcount increase. Just smaller, more consistent PRs.

<div class="kingman-explorer" id="kingman-explorer">
    <h3>Kingman's Formula Explorer</h3>
    <p class="kingman-subtitle">Drag the sliders to see how utilization and variability affect wait times</p>
    <div class="kingman-controls">
        <div class="kingman-slider-group">
            <label>
                <span>Utilization (&rho;)</span>
                <span class="kingman-val" id="kingman-rho-value">70%</span>
            </label>
            <input type="range" id="kingman-rho" min="10" max="99" value="70" step="1">
        </div>
        <div class="kingman-slider-group">
            <label>
                <span>Variability (V)</span>
                <span class="kingman-val" id="kingman-var-value">1.0</span>
            </label>
            <input type="range" id="kingman-var" min="1" max="50" value="10" step="1">
        </div>
    </div>
    <div class="kingman-presets">
        <button id="kingman-team-a">Team A: High variance, &rho;=70%</button>
        <button id="kingman-team-b">Team B: Low variance, &rho;=80%</button>
    </div>
    <div class="kingman-chart-wrap">
        <canvas id="kingman-chart"></canvas>
    </div>
    <div class="kingman-readout">
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Wait per PR</div>
            <div class="kingman-readout-value" id="kingman-wait">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Wait multiplier</div>
            <div class="kingman-readout-value" id="kingman-multiplier">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Annual cost (8 PRs/day)</div>
            <div class="kingman-readout-value" id="kingman-cost">&mdash;</div>
        </div>
    </div>
</div>

This is the insight that changes everything: **standardizing PR size is not just a "best practice." It is a queueing optimization.** Every time you break a 2,000-line PR into four 400-line PRs of similar complexity, you are reducing c_s² (the variance of service time), which directly reduces the variability multiplier V. The math does not care why you did it. It rewards you anyway.

Don Reinertsen, who wrote the definitive book on applying queueing theory to product development, puts it bluntly: reducing variability has the same mathematical effect as adding capacity. A team that can't hire more reviewers can still slash wait times by making their PRs more uniform.

## The rework amplifier: Jackson networks

In 1957, James R. Jackson proved something about networks of interconnected queues that has direct implications for your review pipeline. When queues feed into each other , with items sometimes looping back, the effective arrival rate at any node can be computed from a set of traffic equations.

Your code review pipeline is a Jackson network. Think about what actually happens:

1. A developer writes code and opens a PR (enters the review queue)
2. A reviewer examines it. With probability **r**, they request changes (let's say r = 0.30)
3. The author reworks the code and resubmits (back to the review queue)
4. The reviewer looks again. With probability **r'**, they request more changes (r' = 0.15)
5. Eventually, the PR gets approved and merged

The traffic equation for the review queue becomes:

> λ_review = λ_incoming / (1 − r / (1 − r'))

With r = 0.30 and r' = 0.15:

> λ_review = λ_incoming / (1 − 0.30 / 0.85) = λ_incoming / 0.647 ≈ **1.55 × λ_incoming**

Your review queue sees 55% more traffic than your raw incoming PR rate 🤯.

Let that sink in. You are measuring incoming PRs and thinking that is your demand. It is not. The queue is busier than it looks because the same PRs cycle through it multiple times. And nobody is counting the loops.

<div class="kingman-explorer" id="jackson-explorer">
    <h3>Rework Amplifier</h3>
    <p class="kingman-subtitle">See how rejection rate inflates your review queue's real workload (r' = r/2)</p>
    <div class="kingman-controls">
        <div class="kingman-slider-group">
            <label>
                <span>First-pass rejection rate (r)</span>
                <span class="kingman-val" id="jackson-r-value">30%</span>
            </label>
            <input type="range" id="jackson-r" min="5" max="50" value="30" step="1">
        </div>
    </div>
    <div class="qi-bars">
        <div class="qi-bar-row">
            <span class="qi-bar-label">Incoming PRs</span>
            <div class="qi-bar-track">
                <div class="qi-bar-fill-solid" id="jackson-bar-incoming" style="background: #1abc9c; width: 33%;"></div>
            </div>
            <span class="qi-bar-num">100</span>
        </div>
        <div class="qi-bar-row">
            <span class="qi-bar-label">Reviews needed</span>
            <div class="qi-bar-track">
                <div class="qi-bar-fill" id="jackson-bar-effective" style="width: 52%;">
                    <div class="qi-bar-segment" id="jackson-seg-new" style="background: #1abc9c; flex: 0 0 65%;">new</div>
                    <div class="qi-bar-segment" id="jackson-seg-rework" style="background: #e67e22; flex: 0 0 35%;">rework</div>
                </div>
            </div>
            <span class="qi-bar-num" id="jackson-num-effective">155</span>
        </div>
    </div>
    <div class="kingman-readout">
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Amplification</div>
            <div class="kingman-readout-value" id="jackson-amp">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Per 100 PRs</div>
            <div class="kingman-readout-value" id="jackson-extra">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Queue load</div>
            <div class="kingman-readout-value" id="jackson-load">&mdash;</div>
        </div>
    </div>
</div>

Here's what makes this powerful: **a small improvement in first-pass quality has an outsized effect on the entire system.** If you reduce r from 0.30 to 0.20 (through better tests, clearer requirements, or pair programming), the amplification factor drops from 1.55 to 1.31. That's a 16% reduction in effective review load, which, via Kingman's formula, produces a disproportionately large drop in wait times because the utilization factor U is nonlinear.

In my last post I described rework rate as a metric to track. Now you know the math behind it. Rework is not just a quality signal. It is a queue multiplier. Every percentage point you shave off the rejection rate pays dividends at every downstream node.

## The first extra reviewer is worth 93× the second

Here is a number that will change how you think about reviewer staffing. John D. Cook worked through the M/M/c queueing model (the same model hospitals use to decide how many nurses to staff per shift) for a system where a single reviewer is nearly saturated (arrival rate 5.8 per day, service rate 6 per day per reviewer):

With **1 reviewer**: average wait = 4.83 time units.

With **2 reviewers**: average wait = 0.051 time units.

Going from one reviewer to two didn't cut wait time in half. It cut it by a factor of **93**. Not a typo. Ninety-three. The queue went from "broken" to "basically instant."

But the reverse is also true. Once you have enough reviewers that utilization is moderate, adding more does almost nothing. Going from 5 to 6 reviewers when utilization is already 60% barely moves the needle.

This is formalized by the **Halfin-Whitt square-root staffing rule** from 1981. The number of servers you need is:

> c = A + β√A

Where A is the offered load in Erlangs (total PR volume divided by per-reviewer capacity) and β is a quality-of-service parameter, typically between 1.0 and 2.0.

The critical insight: the safety margin scales as the **square root** of the load, not linearly. If your offered load is 16 Erlangs, you need roughly 16 + 1.5 × √16 = **22 reviewers** for good service, not 32.

The practical takeaway: **you don't need to permanently overstaff reviews. You need to be smart about when you add the one extra person.** Rotating a single additional reviewer into the pool during high-volume periods (post-sprint pushes, before release cuts) provides massive improvement. That same person added during quiet periods provides virtually nothing.

Most staffing decisions in engineering treat reviewer allocation as linear: twice the PRs, twice the reviewers. Queueing theory says that's wasteful. The relationship is sublinear, and the biggest bang for your buck comes from the first reviewer above the critical threshold.

## Priority is a zero-sum game

This one hurts. ERs know it as triage: the chest pain patient goes before the sprained ankle. Every engineering team I've worked with has their own version: hotfixes get reviewed first, urgent bugs jump the queue. It feels like the right thing to do.

In 1965, Leonard Kleinrock proved a conservation law for queueing systems that applies to any work-conserving, non-preemptive scheduling discipline:

> Σ ρ_k × W_k = constant

The weighted sum of waiting times across all priority classes is **invariant** regardless of how you order them. This is not an approximation. It is a mathematical proof. Priority scheduling is a zero-sum game on weighted waiting time.

Let me make it concrete. Suppose 20% of your PRs are "urgent" (hotfixes, utilization ρ₁ = 0.15) and 80% are "normal" (features, ρ₂ = 0.60). Total utilization is 0.75.

Without priority (first come, first served), both classes wait the same amount: W = 4 × W₀.

Now add priority for hotfixes:

- Hotfixes: W₁ = 1.18 × W₀ (3.4× faster than before)
- Features: W₂ = 4.71 × W₀ (18% slower than before)

The hotfixes improved dramatically. But the improvement came directly from the features, which now wait longer. The total weighted wait didn't change. You didn't speed up the system. You redistributed the pain.

<div class="kingman-explorer" id="priority-explorer">
    <h3>Priority Zero-Sum Visualizer</h3>
    <p class="kingman-subtitle">Drag to see how labeling more PRs "urgent" redistributes &mdash; but never reduces &mdash; total wait</p>
    <div class="kingman-controls">
        <div class="kingman-slider-group">
            <label>
                <span>PRs labeled "urgent"</span>
                <span class="kingman-val" id="priority-pct-value">20%</span>
            </label>
            <input type="range" id="priority-pct" min="5" max="70" value="20" step="1">
        </div>
    </div>
    <div class="priority-chart-wrap">
        <canvas id="priority-chart"></canvas>
    </div>
    <div class="kingman-readout">
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Urgent wait</div>
            <div class="kingman-readout-value" id="priority-urgent">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Normal wait</div>
            <div class="kingman-readout-value" id="priority-normal">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Without priority (FCFS)</div>
            <div class="kingman-readout-value" id="priority-fcfs">&mdash;</div>
        </div>
    </div>
</div>

Be honest. How many of your PRs are labeled high priority right now? If the answer is more than 20%, you are not prioritizing. Everything is urgent means nothing is.

It gets worse. The proportion of "urgent" PRs always grows, because once a label exists people use it. The denominator for normal PRs shrinks toward zero. When cumulative utilization of priority classes approaches 1, low-priority PRs wait forever. This is **priority starvation**, and it is the mathematical explanation for why technical debt PRs rot at the bottom of every review queue.

And preemptive priority (dropping a review mid-way to look at something urgent) is even more destructive. It doesn't just redistribute wait time. It adds the cost of the reviewer reloading context on the interrupted PR. You lose twice.

I learned this one the hard way. On a previous team, we introduced a "fast-track" label for production issues. Within three months, 40% of PRs carried the label. Feature work ground to a halt, and nobody understood why. The math was right there. We just did not know to look.

The conservation law does not mean you should never prioritize. It means you should do it with eyes open. Every time you fast-track a PR, you are explicitly choosing to slow down others by a quantifiable amount. If you cannot articulate what you are willing to slow down, you are not prioritizing. You are just creating an illusion of speed.

## Your reviewer's calendar is a queueing parameter

Classical queueing theory assumes the server is always available, patiently waiting for the next item to arrive. Hospital researchers realized this was fiction decades ago. Doctors do rounds, nurses change shifts, specialists get called to surgery. They developed "server vacation" models to capture reality. Your reviewers have the same problem. They go to meetings. They write their own code. They eat lunch. They take PTO. They get pulled into incidents.

In queueing theory, this is modeled as **server vacations**. The fundamental result, proven independently by Doshi (1986) and Fuhrmann & Cooper (1985), is the stochastic decomposition theorem:

> W_vacation = W_standard + E[V²] / (2 × E[V])

The average waiting time with vacations equals the standard queueing wait **plus** an additional term that depends on the reviewer's unavailability pattern. The term E[V²] / (2 × E[V]) is the expected residual vacation time: how long, on average, a PR has to wait for the reviewer to come back from whatever they're doing.

Let me plug in real numbers. A reviewer has meetings, coding blocks, and other interruptions that average E[V] = 2 hours, with variance Var[V] = 1 hour². The additional wait is:

> E[V²] / (2 × E[V]) = (Var[V] + E[V]²) / (2 × E[V]) = (1 + 4) / 4 = **1.25 hours**

Every PR that arrives while this reviewer is "on vacation" waits an extra 1.25 hours, on top of whatever the normal queue wait would be.

Notice something critical: the **variance** of the vacation duration appears in the formula. A reviewer who takes predictable one-hour coding blocks (low variance) causes less delay than one who sometimes does 30 minutes and sometimes disappears for 4 hours (high variance), even if the average unavailability is identical.

This has an immediate practical consequence: **synchronized schedules are catastrophic for review queues.** When every reviewer is in the same standup, the same planning meeting, the same lunch hour, the system effectively shuts down. During those windows, every incoming PR hits a "vacation" at every potential reviewer simultaneously.

Staggering meeting schedules across the team is not just a nice organizational idea. It is a mathematically sound queueing optimization. If half your reviewers are in a meeting while the other half are available, the vacation penalty is dramatically lower than if everyone is blocked at the same time.

I once mapped out my team's calendar and realized that between 10:00 and 11:30 every morning, all five reviewers were in meetings simultaneously. Every PR opened during that window sat dead for 90 minutes minimum. We split the standup into two groups and staggered the planning sessions. TTFR dropped by over an hour within two weeks. No new hires. No new tools. Just calendar Tetris.

## Your averages are lying to you

Here is a sentence that should make every engineering manager uncomfortable: your average review time is almost certainly not what you think it is.

Standard queueing models assume service times follow exponential or at least well-behaved distributions. PR review times do not. A 2025 paper in *Empirical Software Engineering*, analyzing 55,000+ cycle time observations across 216 organizations, found that software cycle times follow **Weibull distributions** with heavy right tails: the majority cluster near the low end, but a long tail extends far to the right. Google's data from 9 million code reviews confirms this: 70% of changes commit within 24 hours, but the tail stretches to weeks.

Heavy-tailed distributions break queueing models in a specific way. Remember Kingman's variability factor V = (c_a² + c_s²) / 2. For a lognormal distribution with moderate spread (σ = 1.5), c_s² ≈ 8.5, which gives V ≈ 4.75. **Wait times are nearly 5× what standard exponential models predict**, at the same utilization and same mean review time.

Mor Harchol-Balter, who wrote the definitive textbook on queueing theory for computer systems, proved something that should bother you: for heavy-tailed service times, **the longer a task has been in service, the longer its remaining service time is expected to be.** A PR that has been "in review" for 3 days is not about to be finished. The math says it will take even longer. This is the opposite of what intuition suggests.

There is a related phenomenon called the **inspection paradox**, well known in ER research where patients consistently report longer waits than hospital data suggests, that explains why developers and managers disagree about review speed.

Imagine 80% of your PRs take 2 hours to review and 20% take 24 hours. The true mean review time is 0.8 × 2 + 0.2 × 24 = **6.4 hours**. That's what your dashboard shows.

But if you tap a developer on the shoulder at a random time and ask "how long has the current PR been waiting?", you're more likely to catch a long-waiting PR in flight than a short one. This is length-biased sampling: longer intervals occupy more of the timeline. The expected observed wait under this sampling is approximately **18.5 hours**, nearly 3× the true mean.

This is exactly the class-size paradox: a university truthfully advertises an average class size of 30, yet the average student experiences a class of 60+. More students are in the big classes, so more students report big classes.

The practical consequence: your manager sees "average review time: 6 hours" and thinks the process is fine. Your developers experience 18+ hours because they're living inside the long tail. Both are correct. They're measuring different things.

**Stop managing to averages.** I have not seen a single engineering effectiveness dashboard that defaults to showing P90 review times. They all show averages. I think that is a mistake. Use P50 (median), P90, and P95 percentiles instead. And focus your improvement efforts on the tail: shrinking P95 from 3 days to 1 day does more for overall flow than shrinking P50 from 2 hours to 1 hour. The outliers are what break the system.

## Amdahl's Law explains the DORA paradox

Recent research, including the 2025 DORA report, found something puzzling: AI coding assistants boost individual output significantly, but organizational delivery metrics stay flat.

How? Gene Amdahl answered this question in 1967, decades before anyone thought to ask it. His law states:

> Speedup = 1 / ((1 − p) + p / s)

Where p is the fraction of the process that you speed up, and s is the speedup factor.

Consider a typical software delivery pipeline: coding (40% of lead time), code review (35%), and CI/deploy (25%). Your split will differ, measure it, but the math works the same way. If AI makes coding 3× faster (s = 3 for the coding portion):

> Speedup = 1 / ((0.60) + 0.40 / 3) = 1 / 0.733 = **1.36×**

You invested in a tool that made coding 3× faster and got a 36% improvement in total delivery speed. The 60% of lead time that isn't coding (review + deploy) dominates the equation.

Even if you made coding infinitely fast (s → ∞):

> Speedup = 1 / 0.60 = **1.67×**

The theoretical maximum. You can never more than double delivery speed by accelerating coding alone. The sequential bottleneck, code review, caps the gain.

<div class="kingman-explorer" id="amdahl-explorer">
    <h3>Amdahl's Law Calculator</h3>
    <p class="kingman-subtitle">Speed up coding or review &mdash; see which actually moves the needle</p>
    <div class="kingman-controls">
        <div class="kingman-slider-group">
            <label>
                <span>Coding speedup</span>
                <span class="kingman-val" id="amdahl-code-value">3&times;</span>
            </label>
            <input type="range" id="amdahl-code" min="10" max="200" value="30" step="5">
        </div>
        <div class="kingman-slider-group">
            <label>
                <span>Review speedup</span>
                <span class="kingman-val" id="amdahl-review-value">1&times;</span>
            </label>
            <input type="range" id="amdahl-review" min="10" max="200" value="10" step="5">
        </div>
    </div>
    <div class="qi-bars">
        <div class="qi-bar-row">
            <span class="qi-bar-label">Before</span>
            <div class="qi-bar-track">
                <div class="qi-bar-fill" style="width: 100%;">
                    <div class="qi-bar-segment" style="background: #3498db; flex: 0 0 40%;">Coding 40%</div>
                    <div class="qi-bar-segment" style="background: #e67e22; flex: 0 0 35%;">Review 35%</div>
                    <div class="qi-bar-segment" style="background: #95a5a6; flex: 0 0 25%;">CI 25%</div>
                </div>
            </div>
        </div>
        <div class="qi-bar-row">
            <span class="qi-bar-label">After</span>
            <div class="qi-bar-track">
                <div class="qi-bar-fill" id="amdahl-after-fill" style="width: 73%;">
                    <div class="qi-bar-segment" id="amdahl-after-code" style="background: #3498db;"></div>
                    <div class="qi-bar-segment" id="amdahl-after-review" style="background: #e67e22;"></div>
                    <div class="qi-bar-segment" id="amdahl-after-ci" style="background: #95a5a6;"></div>
                </div>
            </div>
            <span class="qi-bar-num" id="amdahl-bar-speedup"></span>
        </div>
    </div>
    <div class="amdahl-legend">
        <div class="amdahl-legend-item"><div class="amdahl-legend-dot" style="background:#3498db;"></div> Coding</div>
        <div class="amdahl-legend-item"><div class="amdahl-legend-dot" style="background:#e67e22;"></div> Review</div>
        <div class="amdahl-legend-item"><div class="amdahl-legend-dot" style="background:#95a5a6;"></div> CI/Deploy</div>
    </div>
    <div class="kingman-readout">
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Total speedup</div>
            <div class="kingman-readout-value" id="amdahl-speedup">&mdash;</div>
        </div>
        <div class="kingman-readout-item">
            <div class="kingman-readout-label">Coding-only ceiling</div>
            <div class="kingman-readout-value" id="amdahl-ceiling">&mdash;</div>
        </div>
    </div>
</div>

This is exactly what Eliyahu Goldratt argued in *The Goal* back in 1984: every improvement not made at the constraint is an illusion. If review is your constraint, making developers produce more code faster just builds inventory in the review queue. You increased λ without increasing μ. The queue grows.

The corrected strategy: apply acceleration to the bottleneck itself. Faster reviews, more reviewers, smaller PRs that are faster to review, automated pre-review for mechanical checks. Under Amdahl's Law, improving the bottleneck has exponential returns while improving non-bottlenecks has diminishing ones.

## The psychology behind the math

The equations above describe what happens in the queue. They don't describe what it feels like to wait in one. Anyone who has sat in an ER waiting room knows: the clock on the wall and the clock in your head run at very different speeds.

In 1984, David Maister published "The Psychology of Waiting Lines" at Harvard Business School, identifying eight propositions about how perceived wait time diverges from actual wait time. Four of them map directly to code review.

**Pre-process waits feel longer than in-process waits.** A PR sitting untouched feels far worse than one where a reviewer has left even a brief "looking at this, will review after standup" comment. The difference between zero response and a 10-second acknowledgment is psychologically enormous. This is why Time to First Review matters more than total cycle time for developer satisfaction, and why Meta built their "Nudgebot" to send automated reminders, cutting their 3+ day review backlog by 12%.

**Uncertain waits feel longer than known, finite waits.** A developer who opens a PR and gets no signal about when review will happen experiences the worst kind of wait. Teams that set explicit SLAs ("all PRs get first review within 4 business hours") convert uncertain waits to known, finite ones. The actual duration may not change. The experience does.

**Unfair waits feel longer than equitable waits.** When one developer's PRs consistently get reviewed within hours while another's languish for days, the slower developer perceives the entire system as broken, regardless of aggregate metrics. This connects directly to the reviewer load distribution problem from my last post. The Gini coefficient of review assignments isn't just an equity metric. It's a psychological one.

**Occupied time feels shorter than unoccupied time.** This is the dangerous one. A developer who switches to new work while waiting for review feels better psychologically. The idle anxiety disappears. But this is exactly the WIP death spiral from my last post: they're now carrying two things in progress, their context is split, and when the review feedback finally comes, they'll take days to respond. Maister's prescription (keep people occupied) is the queueing theorist's nightmare.

## What the math says you should do

These seven equations aren't theoretical curiosities. They are models of your delivery pipeline, approximations rather than simulators, but they capture the same directional physics that govern every ER, every call center, and every highway on-ramp. They operate whether you understand them or not. But if you do understand them, three things become clear. Three things that feel counterintuitive until you've internalized the math.

**First: reduce variance, not just utilization.** Kingman's formula says variability and utilization multiply each other. You can't always hire more reviewers. You can always make PRs more uniform. Enforce size limits. Use templates that standardize review effort. Spread PR submissions across the day instead of batching them. Every reduction in variance pays dividends at every utilization level.

**Second: add slack, not speed.** The M/M/c model and Amdahl's Law both say the same thing from different angles: a team at 70% utilization dramatically outperforms one at 90%, and accelerating the non-bottleneck is almost worthless. Stop trying to maximize reviewer utilization. Reviewers with slack capacity process the queue exponentially faster than saturated ones. Slack is not waste. Slack is what prevents the queue from exploding.

**Third: stop labeling things urgent**, unless you are willing to explicitly, quantifiably slow down everything else. Kleinrock's conservation law guarantees that priority is zero-sum. If you can't name what you're deprioritizing, you're not making a decision. You're making noise.

My last post showed you where it hurts. This post showed you why it hurts. The math does not care about your sprint goals, your roadmap, or your headcount freeze. It cares about arrival rates, service rates, variance, and utilization. Work with those, and the queue will reward you. Fight them, and you'll keep wondering why features take weeks to reach production.

In the next post, I will cover exactly how to fix this: from setting turnaround targets to review rotations, stacked PRs, and knowing when to ditch async reviews entirely.

Have you ever computed your team's variability factor? Or your review queue's load factor broken down by variance? I am curious which equation surprised you the most. Let me know in the comments or reach out directly.

<link rel="stylesheet" href="/assets/css/kingman.css" />
<script src="/assets/js/kingman.js"></script>
<script src="/assets/js/jackson.js"></script>
<script src="/assets/js/priority.js"></script>
<script src="/assets/js/amdahl.js"></script>
