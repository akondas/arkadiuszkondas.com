---
id: 20
readingTime: 6
title: "The accounting system is being built. It still will not work."
description: "Soon after I argued cognitive debt had gone invisible, two serious prescriptions surfaced. Margaret-Anne Storey proposed a Triple Debt Model with manual discipline. Entire.io is building an AI-native SDLC with agent infrastructure. The taxonomy is right. Both treatments assume the wrong thing is scarce."
sources:
    -
        - "/ai-did-not-invent-cognitive-debt-it-made-it-invisible"
        - "AI did not invent cognitive debt. It made it invisible."
    -
        - "https://newsletter.getdx.com/p/cognitive-debt-the-hidden-risk-in"
        - "Cognitive Debt: The Hidden Risk in AI-Driven Development - Margaret-Anne Storey, DX"
    -
        - "https://entire.io/vision"
        - "Entire.io Vision"
---

I recently published [*AI did not invent cognitive debt. It made it invisible.*](/ai-did-not-invent-cognitive-debt-it-made-it-invisible). I argued that cognitive debt is not new. We have accumulated it since Stack Overflow copy-paste. But AI-generated code erases the tells that used to make prior debt diagnosable. The post closed by saying the accounting system did not exist yet, and to be careful who tried to sell us one.

A response in DX arrived within days. Around the same time, a newly public platform vision joined the debate from the opposite direction.

The conversation has already come up three times. A teammate slides me one of the two pieces, asks what I think. This post is what I have been telling them.

One answer is manual, from a researcher I respect. The other is infrastructural, from a company betting real capital on an AI-native developer platform. Neither is a grift. Both accept the diagnosis the previous post advanced. Both propose to manage the debt.

I think they are wrong in the same way. This post is about which way.

### The researcher's version

Dr. Margaret-Anne Storey, an empirical software engineering researcher of long standing, published [*Cognitive Debt: The Hidden Risk in AI-Driven Development*](https://newsletter.getdx.com/p/cognitive-debt-the-hidden-risk-in) in DX's newsletter. Her framing is the strongest I have read. She extends Peter Naur's *Programming as Theory Building* into a **Triple Debt Model**: technical debt is a property of code, cognitive debt is a property of teams, and **intent debt** is the erosion of externalized rationale that developers and agents need to safely maintain the codebase.

I think the taxonomy is genuinely useful. Separating cognitive debt from intent debt names something that was getting smeared together in industry discourse. The code is one artifact. The team's shared theory is another. The written record of why decisions were made is a third. They decay on different timescales and they require different interventions.

Her prescriptions are where I stop nodding.

The short list: require at least one human to fully understand each AI-generated change before shipping, document not just what changed but why, establish regular retrospectives and knowledge-sharing checkpoints, use pair programming and TDD, write tests that capture intent, maintain continuously-updated design documents, treat prototypes as disposable.

Every one of those prescriptions presumes a human who reasoned through the code well enough to externalize the theory.

That is exactly what the invisibility argument says is disappearing. The METR 2025 study measured it directly: experienced developers working on codebases they knew well were 19% slower with AI tools than without, and felt faster. Her prescriptions lean on the thing METR says we are worst at.

"Document the why" presumes a why. The engineer who accepted the diff without building the mental model has no why to document. The document will get written. Neatly, plausibly, with a green checkmark next to it. And it will be the bot's why, not the engineer's.

The critique is not that Storey's prescriptions are wrong in principle. It is that they assume the very thing the invisibility argument identifies as scarce.

### The platform's version

[Entire.io's vision](https://entire.io/vision) is the infrastructural answer to the same diagnosis. Their opening sentence is the invisibility thesis quoted back: *"massive volumes of code are generated faster than any human can reasonably understand."* Same problem. Opposite treatment.

Three pillars. First, **version control for agents**: a git-compatible database layer capturing intent, constraints, and agent context as first-class data. Second, a **semantic reasoning layer**: persistent shared memory for agent-to-agent collaboration, so agents do not overwrite, collide, or lose understanding. Third, an **AI-native SDLC**: an interface that lets humans review, approve, and deploy hundreds of changes per day without feeling like the bottleneck.

The team making this bet is serious and the diagnosis is right. What I do not buy is that any of the three pillars addresses the failure mode Storey and I are both pointing at.

Version-controlling agent context logs prompt history, tool calls, and constraint state. It makes the agent's reasoning legible to the next agent. That is useful. It does not construct a human mental model. The engineer who has to defend the diff in review still has none, no matter how cleanly the agent's deliberation was captured. The principal was not written down. It was never booked.

A semantic reasoning layer coordinates agents with *each other*. Agents colliding is a real problem, but not the cognitive-debt problem. It does not make the code legible to a human. It is about the blast radius of agents, not human theory-holding.

An AI-native SDLC optimized for hundreds of approvals per day treats human review as the thing to route around. That is what the number means. You cannot both ship a diff per minute and defend it in a month.

The infrastructure makes the code more legible to machines. The missing legibility is to humans.

### The assembly-line tell

Entire's own framing analogy is the giveaway. They reach for the moving assembly line replacing craft-based automotive production. It is an attractive analogy. It is also the wrong one.

The moving assembly line worked because the *specification* was authored upstream. A human engineer held the blueprint in their head before the line existed. Parts became interchangeable because the design was fixed. Workers on the line did not need to hold the theory of the car because the theory lived in the blueprint and in the engineers who authored it.

In software, the specification *is* the theory. There is no prior blueprint. The act of writing the code is the act of authoring the spec. If no engineer authors the theory, the assembly line has nothing to assemble. It has an output stream with no invariants to preserve.

This is the structural answer to why both prescriptions fail at the same layer. The Triple Debt Model is right as taxonomy. Technical, cognitive, intent are distinct. But all three assume a principal was booked. The invisibility case is the zero-principal case. Neither documentation discipline nor agent infrastructure can pay down a debt whose principal was never recorded.

### What is actually scarce

The accounting system does not exist yet, I said. Be careful who you let sell you one.

Two versions are in public view. The manual version from a researcher. The infrastructural version from a platform. Both builders are serious. Neither is a grift. Both accept the diagnosis.

It still will not work. Not because the builders are unserious, but because both treatments assume the wrong thing is scarce.

Code is not scarce. Documentation discipline is not scarce. Infrastructure for agents is not scarce.

What is scarce is the engineer who held the theory long enough to defend the diff.

The test from the previous post still applies. Can the engineer explain this code, from memory, two weeks after shipping it? That is also the test for the prescriptions. If the answer stays no after the prescription ships, the prescription did not fix the thing.

No model manufactures that. No document manufactures that. No semantic layer manufactures that. It is built one engineer at a time, one system at a time, one explain-back at a time. And the systems we are being sold all optimize for not needing it.
