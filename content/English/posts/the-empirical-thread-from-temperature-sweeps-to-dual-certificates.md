+++
title = 'The Empirical Thread: From Temperature Sweeps to Dual Certificates'
date = '2026-05-21T03:33:10+08:00'
draft = false
categories = ['Explorative Thoughts']
tags = ['empirical-methodology', 'dual-certificates', 'information-theory', 'lean4']
translationKey = 'empirical-thread-temperature-sweeps-dual-certificates'
+++

The NeurIPS paper represents the culmination of the ideas first outlined in the empirical heart of `2026jan.tex`. Yet, looking at the two side-by-side, they are almost unrecognizable. The conceptual core remains, but the underlying methodology has been entirely replaced, transforming a set of heuristic observations into a rigorous mathematical framework.

The transition from the early, naïve experiments to the formal machinery of the NeurIPS paper is best understood through its structural components:

| 2026jan.tex (Naïve Heuristics) | neurips26/paper/main.tex (Rigorous Framework) |
| :--- | :--- |
| **Agency Index** = $D_{KL}$ / MDL (compression ratio) | **Static Certificate** $\varepsilon_{\text{state}}^{\text{UB}}$ = min-cut on untraced channels |
| **CMI** = Gini of eigenvector centrality | **Dynamic Certificate** $\delta_{\text{act}}^{\text{LB}} = I(S_t; A_t \mid \tilde{T}_t)$ via conditional DPI |
| **SRD** = Cosine similarity recurrence | **Replay/Intervention/Proxy** probe taxonomy with JS divergence |
| **Temperature Sweeps** on Llama/Phi | **Controlled Scratchpad Ablation** on Qwen2.5-7B ReAct |
| **Phase Transitions** at $\tau \approx 0.9$ | **Temporal Activation Profiles** on LLaDA denoising steps |
| **"Variance Spikes"** treated as qualitative anomalies | **Explicit 95% CIs** via trajectory-block bootstrap with dormant/active task splits |
| **Claimed Lean Artifact** (never detailed or verified) | **Full Lean 4 Table**: 12 theorems, zero `sorry`s, and explicit hypotheses |

Despite this massive methodological overhaul, the core intuition survived intact: we are dealing with two fundamentally separate questions. 

First, *how much hidden state exists?* Second, *how much of that hidden state actively drives behavior?* 

In the early draft of `2026jan.tex`, this duality was captured by the distinction between "structural collapse" (measured via the Gini of eigenvector centrality) and "strategic deviation" (measured via the Agency Index). In the NeurIPS paper, this separation is mathematically formalized through the independence of the static certificate $\varepsilon_{\text{state}}^{\text{UB}}$ and the dynamic certificate $\delta_{\text{act}}^{\text{LB}}$. What began as a set of loose qualitative hunches has finally found its rigorous, verifiable expression.
