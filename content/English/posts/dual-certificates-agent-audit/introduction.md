+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Introduction"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-1"
weight = 1
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

Consider a ReAct-style agent shipped with an unlogged scratchpad of capacity $16,384$ bits per turn. A regression test on output traces shows no behavioral change, yet the same trace under controlled replay with the scratchpad disabled reveals a $0.0163$-bit shift in the tool-token probability distribution on planning tasks. The disagreement is not a probing artifact. It is a structural feature of the audit: the recorded trace fails to distinguish two qualitatively different systems, one whose hidden capacity is dormant on the test distribution and one whose hidden capacity is active. Identifying which holds is the audit task.

These are two distinct quantities: how much internal state escapes the trace, and how much of that drives the next action. Output-only and black-box audit views can leave them merged into a single "hiddenness" judgment that is neither computable nor diagnostic. A system with a large logging gap but no behavioral hidden drive is indistinguishable from one with a small gap but strong drive, though the audit implications differ.

We propose a dual-certificate protocol that answers each question separately. The static certificate $_state^UB$ upper-bounds residual entropy $H(S_t T_t)$ from deployment topology alone, using a cut-set bound on untraced channels. The dynamic certificate $_act^LB$ lower-bounds residual decision relevance $I(S_t; A_t T_t)$ via one of three probe classes (replay, intervention, or proxy) depending on the auditor's access regime. The two certificates are independent axes: a system with large $_state^UB$ and small $_act^LB$ has unrecoverable but dormant state; a system with both large has unrecoverable and active state. Both are auditable. Neither is visible to a single scalar.

The dynamic axis can also be indexed. Instead of asking only whether residual state matters, an auditor can ask *where* it matters: which module, denoising step, or communication edge carries decision relevance. This turns the certificate from a scalar diagnostic into an activation profile over the hidden-state geometry of the deployment.

Conditioning on $ T_t$ is part of the protection, not a nuisance term. If a model writes a steganographic or compressed rationale into the recorded trace, that information is in $ T_t$ and is conditioned away by $I(S_t; A_t T_t)$. The dynamic certificate measures residual decision relevance beyond the logged trace; it does not count hiddenness that has already been made visible to the audit record.

**Contributions.** We define a dual-certificate framework $(_state^UB, _act^LB)$ for agent audit. Proposition 4.1 gives a topological upper bound on residual hidden-state entropy via a min-cut on untraced channels. Proposition 5 is not a new information-theoretic inequality; it is the audit reduction that turns conditional DPI into three admissible lower-bound probes—replay, intervention, and proxy—for residual decision relevance.

We evaluate the protocol on three residual-state geometries: a ReAct scratchpad module, a diffusion-LM denoising trajectory, and a multi-agent private-report edge. The same calculation is reused across these settings, but the index changes from module to time step to communication edge. Appendix calibrations cover read-only proxy estimation and a synthetic ground-truth setting where the static bound matches true hidden-state entropy. A Lean 4 artifact mechanizes Corollary 4.1 from Mathlib first principles and proves the trace-gap chain rule and conditional DPI from finite-discrete definitions, with only the cut-set capacity bound remaining as an external structural premise for Proposition 4.1. (See §sec:external-axioms for the precise boundary.)

---

[Contents](/en/posts/dual-certificates-agent-audit/) | [Next: Related Work](/en/posts/dual-certificates-agent-audit/related-work/)
