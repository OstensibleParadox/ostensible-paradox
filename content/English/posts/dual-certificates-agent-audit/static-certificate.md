+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Static Certificate: Structural Upper Bound via Untraced-Channel Capacity"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-4"
weight = 4
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

The static certificate upper-bounds $_state = H(S_t T_t)$ from deployment topology. Information not in the visible trace that can influence $S_t$ must travel through unlogged channels. Bounding those channels' worst-case capacity bounds the hidden-state entropy.

## Time-Unrolled Deployment Graph and Component Budgets

Let $G_t = (V_t, E_t)$ be the time-unrolled DAG of the deployment up to step $t$. Nodes are state updates, tool calls, memory reads/writes, messages; edges are information channels. Three object classes: unrecorded sources $U_t$ (retrieval results, external memory, unlogged messages), the visible trace $ T_t$, and the operative state $S_t$. Let $C_unlogged$ be all reachable edge cuts separating $U_t$ from $S_t$.

A set of edges is *software-orthogonal* if, conditioned on $ T_t$, the channel outputs factor: $p(\y_e\_e E' \x_e\, T_t) = _e E' p(y_e x_e, T_t)$. This holds when unlogged channels use independent API calls or separate memory regions (see Appendix app:netinfo for non-orthogonal remediation).

lemma[Additive decomposition]

Under software orthogonality with per-edge budgets $c_e$, the induced cut capacity decomposes: $C_cut() _e E(, ^c) c_e$.
lemma

When software orthogonality fails (for example, when two unlogged channels share a hidden state variable) the per-edge sum $_e E(, ^c) c_e$ still upper-bounds $C_cut()$ by sub-additivity of mutual information across coupled channels: $I(X_; Y_^c T_t, X_^c) _e I(X_e; Y_e T_t) _e c_e$. Orthogonality is required for *tightness* of the additive decomposition, not for validity of the upper bound (formal treatment in Appendix app:netinfo).

Per-edge budgets $c_e$ are read from interface specifications: $K |V|$ for a $K$-token text channel over vocabulary $V$, $d Q$ for a $d$-dimensional quantized state, $ |_states|$ for a discrete scheduler. The discretization parameter $Q$ is an auditor-side choice (we use $Q=256$, 8-bit audit discretization throughout); tighter or coarser discretizations shift the bound proportionally without changing the structural claim. All per-edge bounds are worst-case (maximum-entropy) bounds; tighter empirical bounds only improve the certificate.

The bound has three parts. The term $_nominal$ is the residual uncertainty that remains even after a complete internal trace; for a fully instrumented software agent this is typically zero. The cut term is an audit budget for information that can still enter $S_t$ through unlogged interfaces. The directed-MI notation prices that worst-case flow formally, while the implemented certificate only needs per-edge budgets and a min-cut over the unlogged part of the deployment graph.

proposition[Static Certificate via Cut-Set Bound]

For any cut $$ separating $U_t$ from $S_t$ with induced capacity $C_cut() = _p(X_ T_t) I(X_ Y_^c T_t, X_^c)$,
\[
H(S_t T_t) \;\; H(S_t T_t)__nominal \;+\; _ C_cut().
\]
Setting $_state^UB:= _nominal + _ C_cut()$ gives $_state _state^UB$.
proposition

Here $X_$ denotes the input signals entering edges crossing the cut, $Y_^c$ the corresponding output signals, and $X_^c$ the boundary state on the sink side (formal definitions in Appendix app:netinfo).

corollary[Additive form]

Under software orthogonality, $_state^UB = _nominal + _C C_unlogged _e C c_e$, a discrete min-cut on the unlogged subgraph.
corollary

*Proof sketch:* Chain-rule gives $H(S_t T_t) = H(S_t T_t) + I(S_t; M_t T_t)$ where $M_t = T_t T_t$. Every path from $U_t$ to $S_t$ crosses a cut $$, so $M_t$ is $d$-separated from $S_t$ by the cross-cut signals; DPI yields $I(S_t; M_t T_t) C_cut()$. Minimizing over cuts and substituting Lemma 4.1 completes the proof (full derivation in Appendix app:netinfo).

corollary[Autoregressive zero-cut]

If the system is a strict autoregressive core and $ T_t$ includes the full context window, then $C_unlogged = $, every cut has zero induced capacity, and $_state^UB = 0$.
corollary

---

[Previous: Setup and Audit Regime](/en/posts/dual-certificates-agent-audit/setup-and-audit-regime/) | [Contents](/en/posts/dual-certificates-agent-audit/) | [Next: Dynamic Certificate: Decision Relevance via Conditional DPI](/en/posts/dual-certificates-agent-audit/dynamic-certificate/)
