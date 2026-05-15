+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Dynamic Certificate: Decision Relevance via Conditional DPI"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-5"
weight = 5
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

The dynamic certificate targets $_act:= I(S_t; A_t T_t)$. Since $S_t$ is unobservable, we specify probes whose measured variables satisfy $X_t S_t A_t$ given $ T_t$. Conditional DPI supplies the correctness argument: $I(X_t; A_t T_t) _act$.

proposition[Probe Certificates from Conditional DPI]

For any admissible probe variable $X_t$ with $X_t S_t A_t$ given $ T_t$, the probe measurement $I(X_t; A_t T_t)$ is a valid lower-bound certificate for $_act$.
proposition

Replay certificates.

Let $R_t \wild, replay\$ indicate whether a missing state fragment is reconstructed under the same visible trace $ T_t$ (controlled re-execution, not paraphrase variation). Then $I(R_t; A_t T_t) = JS(P_wild, P_replay T_t) _act$. Discrete action spaces admit direct empirical JS estimation over either realized actions or model-reported action probabilities; the experiments below state which is used.

Intervention certificates.
Let $_hidden$ be an exogenous perturbation to a suspected unlogged module (cache, memory buffer, scratchpad). If $_hidden S_t A_t$ given $ T_t$, then $I(_hidden; A_t T_t) _act$. Discrete action spaces admit direct conditional action-distribution shift estimates, such as JS divergence; for continuous action spaces, InfoNCE or MINE can be used. Requires gray-box perturbation access; the most direct causal probe of the three.

Proxy certificates.
Let $Z_t = f(S_t)$ be a readable coarsening of the operative state (tool-logit projection, attention summary). Since $Z_t S_t A_t$ given $ T_t$, conditional DPI yields $I(Z_t; A_t T_t) _act$. We estimate this quantity by fitting predictors $p(A_t T_t)$ and $p(A_t T_t, Z_t)$ and taking their cross-entropy gap, $ I(Z_t; A_t T_t)$.

Aggregation.
A single certificate class can miss some causal paths. Define $_act^LB:= \ I(R_t; A_t T_t), I(_hidden; A_t T_t), I(Z_t; A_t T_t) \$. By monotonicity of the maximum, the aggregate remains a valid lower bound on $_act$.

Activation profiles.
The scalar certificate is the maximum over an indexed family of admissible probes. Keeping the index gives an *activation profile*
\[
(j):= I(X_t^(j); A_t T_t),
\]
where $j$ may denote a scratchpad field, a denoising step, an activation layer, or a communication edge. The static certificate identifies where residual capacity can reside; the activation profile identifies where that capacity is behaviorally used. The experiments below keep this algebra fixed while changing the index: module in ReAct, time in the diffusion LM, and communication edge in the multi-agent setting.

---

[Previous: Static Certificate: Structural Upper Bound via Untraced-Channel Capacity](/en/posts/dual-certificates-agent-audit/static-certificate/) | [Contents](/en/posts/dual-certificates-agent-audit/) | [Next: Empirical Diagnostics](/en/posts/dual-certificates-agent-audit/empirical-discussion/)
