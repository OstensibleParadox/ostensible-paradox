+++
title = 'From Boolean Verdicts to Quantitative Witnesses: Why DAG Topology Needs a Trail Semantics'
date = '2026-05-19T03:30:00+08:00'
draft = false
categories = ['Explorative Thoughts']
tags = ['causal inference', 'qif', 'd-separation', 'bayes ball', 'trail semantics', 'information flow']
+++

Since Pearl (2009), causal inference on DAGs has crystallized around a powerful but austere toolkit: boolean d-separation and do-calculus. Does evidence flow? Full stop. Does it flow after an intervention? Full stop. This framework is sufficient for causal *identification*—determining whether an effect is estimable from observed data. But it is curiously silent on a question that seems equally natural: **how much** flows, **through which channels**, and with **what residual structure**?

I want to argue that this silence is not a minor gap; it is a symptom of two communities talking past each other. And the bridge between them is a rigorous notion of *trail as witness*.

---

## The Boolean Trap

Traditional DAG analysis gives you a verdict at the endpoints. $X$ is d-separated from $Y$ given $Z$: True or False. The intervened distribution $P(y \mid do(x))$ is identifiable: Yes or No. This is the "full stop" regime.

But a boolean verdict discards the path. It tells you that water reaches the tap, but not whether it travelled through lead pipes, detoured through a cistern, or was siphoned off midway. To know the *texture* of a causal chain—to distinguish a default association from a derived conclusion, or to know whether an observed correlation persists because of the presence of one variable or the absence of another—you need to traverse the trail in slow motion, node by node, junction by junction.

Trail traversal gives the texture of causal chains; endpoint booleans do not.

---

## Two Communities, One Missing Link

Remarkably, two intellectual neighborhoods have been circling this problem from opposite ends without quite meeting in the middle:

**The Causal Inference community (Pearl et al.)** is structurally obsessed. It abstracts the world into absolute black-and-white: if d-separation holds, the answer is True; otherwise, False. They are plumbers who care only whether the pipe is open, not what contaminant rides the flow. After 2009, the field's theoretical engine on this particular front seems to have stalled—perhaps because every remaining graph-theoretic challenge starts to look like the Four Color Problem, solvable only by brute force unless a new representational insight appears.

**The Quantitative Information Flow (QIF) community (Alvim, Palamidessi, Smith et al.)** is capacity-obsessed. They compute leakage in bits, bound it with Shannon capacity, and seek KKT certificates for optimality. But their channel models are often toy simplifications, stripped of topological depth. They measure the volume of water without being able to trace the pipe's winding route through the labyrinth.

Both communities study DAGs plus information flow. Yet:
- Causal inference has the topology but no quantitative bound.
- QIF has the quantitative machinery but no trail-level topological witness.

No one has connected them. Why? Because the causal side asks "Is it identifiable?" and the QIF side asks "How many bits leak?"—and neither side has a formalism that answers both at once while retaining the path as a first-class object.

---

## Lemma 1: The Collider Ancestor Leak & Rerouting

Consider a collider $u \rightarrow w \leftarrow v$. Textbook d-separation says evidence can pass through $w$ only when $w$ or a descendant is observed. But this description conflates two distinct phenomena.

Suppose we are testing whether $X$ and $Y$ are d-separated given $Z$. If a descendant of $w$ leads *only* to $X$ or $Y$ and **not** to $Z$, then the collider is not "activated by $Z$" in any global sense. It is activated because it creates a connected route from a source to a destination. The conditioning set is, locally, a red herring.

### Path Normalization / Rerouting

**Claim:** If a descendant of $w$ leads to $X$, the original long path was never necessary; the descendant path itself provides a shorter route.

*Proof sketch.* Take any active trail passing through collider $w$ and reaching $X$ via descendant $d$. Replace the subpath from $w$ to $X$ with $w \leadsto d \leadsto X$. By minimality of active trails (or induction on cutset size), the rerouted path is no longer than the original and preserves endpoint connectivity. The original trail was therefore non-minimal, containing a redundant detour shortcuttable through the collider's own descendant. ∎

The upshot: collider "activation" is often just topological connectivity leaking outward, not a special global event mediated by the conditioning set.

---

## Lemma 2: The Junction Obligation Problem

If we accept that trails matter, we need a local criterion for their validity that does not require re-scanning the entire graph at every step.

### Decompiling the Trail

Decompose an active trail into a stateful path type—call it `ActiveRoute` or `BayesBallPathT`. Each traversal step carries a direction tag:

- **`outOf`**: leaving via an outgoing edge.
- **`into`**: entering via an incoming edge.

These tags are not bookkeeping; they encode the *obligation* imposed by the junction just traversed.

### Global Topology → Local Type Constraints

In the global formulation, a junction $(A, B, C)$ is valid only after inspecting the whole graph and the conditioning set. Under the state-machine view:

1. **Obligations are pushed to interfaces.** The direction label at a boundary encodes what junction type is expected on the other side.
2. **Composition is type checking.** Concatenating two path segments requires only that the output state of the first matches the input obligation of the second. No global inspection needed.
3. **Local consistency implies global consistency.** If every adjacent pair of segments satisfies their shared interface obligation, the entire trail is valid by construction.

The global topological constraint of d-separation becomes a **local type-system constraint** on path segments. The type of a segment is its pair of boundary states; composition is well-typed iff obligations align.

---

## What Is Still Missing

Lemmas 1 and 2 give us a cleaner, more local way to reason about *whether* a trail is active. But they do not yet answer the quantitative question:

> Not "does information flow?" but "how many bits flow through this specific trail?"

That question requires machinery that currently lives only in QIF:
- **Channel capacity** between observables and secrets along a specific topological route.
- **KKT conditions** to certify that a given leakage bound is optimal under the graph's structural constraints.
- **Shannon bounds** that respect the DAG's conditional-independence structure rather than assuming a flat channel matrix.

What does not yet exist—and what I am groping toward—is a framework where:
1. The DAG provides the topological syntax.
2. The trail provides the witness (the specific path whose capacity we measure).
3. KKT + channel capacity provide the quantitative certificate.
4. A proof assistant (Lean4, Coq) checks both the topological type constraints (Lemma 2) and the information-theoretic bounds.

---

## Takeaway

Pearl's boolean tools are not wrong; they are *insufficient* for anyone who wants to know the texture of a causal chain. QIF's quantitative tools are not wrong; they are *topologically blind*. The missing piece is a **trail semantics** that makes the path a first-class object—so that we can ask not only whether an intervention opens a channel, but how wide that channel is, what contaminants it carries, and whether the leakage is bounded.

We need to move from "full stop" to "slow-motion replay." The trail is the witness.
