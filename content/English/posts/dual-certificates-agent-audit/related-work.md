+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Related Work"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-2"
weight = 2
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

Probing, patching, and causal abstraction.
Causal abstraction, latent-knowledge elicitation, nullspace projection, and amnesic probing are natural sources of proxy-style evidence: when they expose a probe variable $Z_t = (S_t)$ and the required conditional assumptions hold, its MI with action can be interpreted through the proxy certificate. Causal tracing/ROME, representation engineering, and activation addition provide intervention-style evidence when the patch affects action only through $S_t$.

Black-box audit and network information theory.
Property testing and black-box safety auditing study what can be inferred from outputs alone. The distinction here is that output-only access can support behavioral tests, but it does not by itself provide a lower bound on $_act$; $_state^UB$ remains computable from topology when structural access is available. The static certificate proof applies a cut-set upper bound to the time-unrolled DAG (full derivation in Appendix app:netinfo).

Diffusion language-model agents.
LLaDA instantiates large-scale masked diffusion language modeling with bidirectional denoising and instruction-following ability. Recent agent work further studies diffusion LMs in multi-step decision and tool-use workflows, including matched comparisons to autoregressive agents. These systems make intermediate denoising latents a natural non-ReAct hidden channel for the dynamic certificate.

---

[Previous: Introduction](/en/posts/dual-certificates-agent-audit/introduction/) | [Contents](/en/posts/dual-certificates-agent-audit/) | [Next: Setup and Audit Regime](/en/posts/dual-certificates-agent-audit/setup-and-audit-regime/)
