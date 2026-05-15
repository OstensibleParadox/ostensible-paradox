+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Dual Certificates for Agent Audit: Separating Structural Unrecoverability from Decision Relevance"
description = "Auditing a deployed language-model agent requires two separable quantities: how much operative state escapes the recorded trace, and how much of that residual state drives behavior. We introduce a dual-certificate..."
summary = "Auditing a deployed language-model agent requires two separable quantities: how much operative state escapes the recorded trace, and how much of that residual state drives behavior. We introduce a dual-certificate..."
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit"
ShowToc = true
ShowPostNavLinks = false
+++

## Abstract

Auditing a deployed language-model agent requires two separable quantities: how much operative state escapes the recorded trace, and how much of that residual state drives behavior. We introduce a dual-certificate protocol. The static certificate $_state^UB$ upper-bounds residual hidden-state entropy by a min-cut on untraced channels. The dynamic certificate $_act^LB$ lower-bounds residual decision relevance through an admissible probe taxonomy—replay, intervention, proxy—under conditional data processing. The two axes are independent. In ReAct experiments, logging ablates the static bound from $16,464$ to $0$ bits; controlled replay separates dormant calculator from active planning tasks under the same topology as a soft policy shift ($0.0163$ bits, 95% CI $[0.0124,0.0208]$) with argmax tool selections unchanged. Indexing $_act^LB$ over hidden-channel coordinates produces an activation profile. On an LLaDA denoising trajectory, perturbations stay near the floor through early steps and rise at the final binding step ($0.110$ bits, 95% CI $[0.052,0.234]$). On a multi-agent communication edge, swapping a worker's private report gives $0.901$ bits, 95% CI $[0.873,0.928]$. A Lean 4 artifact mechanizes the autoregressive zero-cut case and proves the conditional-DPI and chain-rule reductions from Mathlib first principles, with only the cut-set capacity bound remaining as an external structural premise.

## Contents

- [Introduction](/en/posts/dual-certificates-agent-audit/introduction/)
- [Related Work](/en/posts/dual-certificates-agent-audit/related-work/)
- [Setup and Audit Regime](/en/posts/dual-certificates-agent-audit/setup-and-audit-regime/)
- [Static Certificate: Structural Upper Bound via Untraced-Channel Capacity](/en/posts/dual-certificates-agent-audit/static-certificate/)
- [Dynamic Certificate: Decision Relevance via Conditional DPI](/en/posts/dual-certificates-agent-audit/dynamic-certificate/)
- [Empirical Diagnostics](/en/posts/dual-certificates-agent-audit/empirical-discussion/)
