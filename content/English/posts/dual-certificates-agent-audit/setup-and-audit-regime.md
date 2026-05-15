+++
date = "2026-05-15T11:13:18+00:00"
draft = false
title = "Setup and Audit Regime"
categories = ["Academic Papers"]
venue = "NeurIPS 2026"
disciplines = ["AI Audit", "Information Theory"]
tags = ["AI audit", "agent audit", "dual certificates", "information theory", "formal verification", "Lean 4"]
translationKey = "dual-certificates-agent-audit-3"
weight = 3
ShowToc = true
hideSummary = true
ShowPostNavLinks = false

[build]
  list = "never"
+++

Standard information-theoretic notation follows. All logarithms are base 2; entropy and mutual information are reported in bits.

At step $t$: *full trace* $T_t$ (all intermediate activations), *recorded trace* $ T_t T_t$ (auditor-visible), *operative state* $S_t$ (internal computation), *action* $A_t$ (next token), *unrecorded sources* $U_t$ (exogenous inputs not in $ T_t$).

## Two Core Audit Quantities

definition[Core Audit Quantities]

The two quantities targeted by the dual certificate are:
itemize
**Structural unrecoverability:** $_state:= H(S_t T_t)$, the residual entropy of the operative state given the visible trace.
**Residual decision relevance:** $_act:= I(S_t; A_t T_t)$, the mutual information between operative state and next action given the visible trace.
itemize
Neither quantity is directly computable in deployment: $_state$ requires recovering the full internal-state distribution, and $_act$ requires observing $S_t$. The dual-certificate framework targets:
itemize
a *structural upper bound* $_state^UB _state$, computed from deployment topology (§4);
an *empirical lower bound* $_act^LB _act$, estimated via probe variables (§5).
itemize
The reported audit pair is $(_state^UB, _act^LB)$.
definition

Neither quantity is identifiable from behavioral observations alone: different causal graphs can produce identical joint distributions over $( T_t, A_t)$ pairs, so observing outputs does not fix $H(S_t T_t)$ or $I(S_t; A_t T_t)$. The static certificate addresses the first with structural access to topology; the dynamic certificate addresses the second with gray-box probe access.

remark[Complementarity and Inheritance]

By the data processing inequality, $_act _state$. The certificates inherit this ordering at their respective bound directions but remain independent axes of audit evidence:
itemize
If $_state^UB = 0$ (fully logged architecture), then $_state = 0$ and $_act = 0$; any valid lower bound satisfies $_act^LB = 0$.
If $_act^LB = 0$ under the best available probe, hidden state may still exist: $_state^UB$ can be large while the current task does not activate the hidden capacity (dormant unrecoverable state). The contrapositive ($_act^LB > 0 _state^UB > 0$) follows from the DPI ordering.
itemize
The audit interpretation is therefore two-dimensional: deployment teams must report both the residual channel budget and the strongest admissible behavioral probe, not collapse them into a single hiddenness score.
remark

## Audit Access Modes

enumerate
*Structural access.* The auditor has the deployment architecture, logging manifest, and protocol budgets. This is sufficient to compute $_state^UB$ from topology (§4) but gives no dynamic lower bound.

*Controlled replay access.* The auditor can rerun the same system under wild and replayed states while holding the visible trace fixed. This supports replay certificates when the replay mechanism affects the action only through missing state recovery.

*Proxy or intervention access.* The auditor can read a proxy $Z_t=f(S_t)$ or perturb a hidden module. These support conditional-DPI lower bounds on $_act$ (§5).
enumerate

The paper's empirical core uses these access modes in a controlled ReAct agent. It does not use paraphrase- or format-based black-box replay as evidence for internal decision relevance.

---

[Previous: Related Work](/en/posts/dual-certificates-agent-audit/related-work/) | [Contents](/en/posts/dual-certificates-agent-audit/) | [Next: Static Certificate: Structural Upper Bound via Untraced-Channel Capacity](/en/posts/dual-certificates-agent-audit/static-certificate/)
