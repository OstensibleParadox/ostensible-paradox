+++
title = 'FAccT 2027 Research Topic Study'
date = '2026-08-18T18:00:00+08:00'
draft = false
categories = ['AI Ethics', 'Social Sciences']
tags = ['FAccT', 'AIES', 'Algorithmic Auditing', 'Recommender Systems', 'Attachment Theory', 'Algorithmic Bias', 'Platform Governance', 'Black-Box Auditing']
translationKey = 'facct-2027-research-proposal'
+++

## Research Direction 2: Algorithmic Mediation of Quasi-Clinical Discourse and Auditing Gendered Psychological Ontologies

### 1. Research Background & Genealogy of Black-Box Algorithmic Audits

Within the literature on algorithmic bias and platform auditing, empirical investigations employing real-world commercial environments and black-box methodologies have established a rigorous and influential lineage.

Key milestones in this research trajectory include:
- **Ali et al. (CSCW 2019)**: In their seminal audit of Facebook's ad-delivery algorithms, the researchers ran controlled live advertising campaigns while holding target parameters, budgets, and creative content constant. They demonstrated that platform delivery optimization inherently introduces substantial gender and racial skews without explicit advertiser targeting instructions.
- **Imana et al. (WWW 2021)**: Methodologically strengthened paired-ad audits by conducting cross-platform audits comparing job advertisement delivery across Facebook and LinkedIn.
- **FAccT 2024 Literature**: Advanced black-box audits using real-world education and employment ads to evaluate racial and gender delivery disparities across Meta's infrastructure. Regulatory bodies, such as the Federal Trade Commission (FTC), have similarly adopted third-party audit paradigms relying on advertiser-accessible delivery statistics as a gold standard for empirical compliance testing.

However, when pivoting from traditional **allocation harm** (e.g., ad impressions, credit, job visibility) to the pervasive emergence of **popular therapy-talk and attachment theory discourse** on contemporary social platforms (e.g., TikTok, Instagram Reels, YouTube Shorts, Reddit), conventional Computational Social Science (CSS) paradigms—such as "scraping posts $\to$ running NLP text classification $\to$ identifying sexist language"—prove insufficient for FAccT/AIES inquiry. Such workflows merely document user-generated sentiment rather than interrogating algorithmic responsibility.

To construct a submission aligned with the standards of **ACM FAccT** and **AAAI/ACM AIES**, the central inquiry must undergo a conceptual leap: moving beyond "what users express online" to investigating **how platform recommender systems actively mediate, structure, and amplify a gendered quasi-clinical taxonomy (algorithmic mediation of quasi-clinical discourse)**.

---

### 2. Core Research Questions & Ontological Transformation

#### 2.1 From Static Probabilities to Dynamic Causal Mediation

Traditional computational analyses typically measure static conditional disparities:
$$P(\text{``avoidant''} \mid \text{male reference}) > P(\text{``avoidant''} \mid \text{female reference})$$

In contrast, our research interrogates the dynamic causal pathway engineered by algorithmic curation:
$$\text{Platform Exposure} \longrightarrow \text{Attachment Labeling} \longrightarrow \text{Gender Stereotype Reinforcement}$$

#### 2.2 The Ontological Shift in Psychological Constructs

In clinical and personality psychology, attachment orientation is a continuous, context-dependent, and fluid psychological construct. Under platform optimization mechanics, however, it undergoes a four-stage reduction and ontological reification:

$$\text{Continuous Dimension} \longrightarrow \text{Discrete Type} \longrightarrow \text{Rigid Identity} \longrightarrow \text{Moral Category}$$

#### 2.3 Core Thesis Statement

> **Abstract Core Claim:**  
> *"A continuous and context-dependent psychological construct is being transformed by platform-mediated popular discourse into a gendered categorical ontology, and recommender systems may amplify that transformation asymmetrically."*

---

### 3. Three-Tier Empirical Audit Architecture

To systematically examine this phenomenon across macro-discourse, micro-recommendation mechanics, and user cognitive feedback, we propose a three-tiered empirical audit framework:

```
+-----------------------------------------------------------------------------+
| Layer 1: Longitudinal Corpus Audit                                          |
| Measure temporal evolution of gender roles & quasi-clinical attachment tags |
+-----------------------------------------------------------------------------+
                                     │
                                     ▼
+-----------------------------------------------------------------------------+
| Layer 2: Controlled Recommender Audit                                       |
| Paired counterfactual sockpuppets measuring multi-step transition hazards   |
+-----------------------------------------------------------------------------+
                                     │
                                     ▼
+-----------------------------------------------------------------------------+
| Layer 3: Self-Labeling Endogenous Feedback Loop                             |
| Model closed loop: Query → Recommended Therapy-Talk → Self-Diagnosis → Bias |
+-----------------------------------------------------------------------------+
```

#### Layer 1: Longitudinal Corpus Audit
- **Data Ingestion**: Multi-platform scraping across TikTok, Instagram Reels, YouTube Shorts, and Reddit communities (e.g., `r/attachment_theory`, `r/dating_advice`), establishing longitudinal discourse datasets spanning multiple years.
- **Semantic & Association Metrics**: Quantify the temporal intensification of asymmetric semantic pairings:
  - $\text{Male / Men} \longrightarrow \text{Avoidant / Emotionally Unavailable / Narcissistic / Toxic}$
  - $\text{Female / Women} \longrightarrow \text{Anxious / Needy / Overgiving / Healing}$
- **Discourse Function Annotation**: Construct fine-grained taxonomies distinguishing **Empirical Observation**, **Self-Labeling**, **Partner-Labeling**, and **Moral Judgment**, verifying whether the construct has shifted from descriptive psychology to prescriptive moral classification.

#### Layer 2: Controlled Recommender Audit
- **Counterfactual Sockpuppet Design**:
  Deploy batches of clean, strictly matched automated personas with minimal counterfactual perturbations:
  - Account Persona Gender: Female profile vs. Male profile;
  - Relationship Query Pairs: `"why does my boyfriend pull away"` vs. `"why does my girlfriend pull away"`;
  - Interaction Framing: Anxious-framed engagement signals vs. Avoidant-framed engagement signals;
  - Baseline Equivalence: Identical initial dwell times, scrolling cadence, and system environments.
- **Transition Probabilities & Hazard Rates**:
  Record recommendation feeds across multi-step recommendation trajectories ($t = 1, \dots, T$) to estimate hazard rates and Markov transition probabilities across polarized thematic clusters:
  - `"Avoidant men"` / `"Anxious women"` / `"Narcissistic ex"`
  - `"Divine feminine"` / `"Masculine detachment"` / `"Attachment healing"`
- **Audit Objective**: Determine whether identical relational dilemmas are channeled into radically bifurcated psychological explanation pipelines solely based on the user's imputed gender role.

#### Layer 3: Self-Labeling Endogenous Feedback Loop
- **Modeling Endogenous Identity Reinforcement**:
  $$\text{Initial Query} \longrightarrow \text{Recommended Therapy-Talk} \longrightarrow \text{Self / Partner Diagnosis} \longrightarrow \text{Algorithmic Entrenchment}$$
- **Cognitive and Algorithmic Collusion**:
  When a user searches for ordinary relationship friction (e.g., "why hasn't he replied?"), the recommender proactively serves "avoidant attachment" explanatory narratives. Cloaked in clinical authority, the user internalizes this label and continues seeking confirmatory content. Recommenders interpret this as high-relevance feedback, narrowing future recommendations toward pathologized content. Consequently, all ambiguous everyday behaviors in the relationship become retrospectively coded as evidence of personality pathology.
- **Sociotechnical Mechanism**: The recommender does not merely assign latent tags to passive users; **it actively socializes and instructs users on how to classify themselves and others in interpersonal life**.

---

### 4. Theoretical Contributions & Shift in Harm Paradigms

This inquiry introduces a fundamental paradigm shift in algorithmic fairness and platform governance:

| Dimension | Traditional Algorithmic Harm Paradigm | Proposed Quasi-Clinical Mediation Paradigm |
| :--- | :--- | :--- |
| **Causal Pathway** | $\text{Platform Classifier} \to \text{Allocation Harm}$ | $\text{Platform-Mediated Folk Classifier} \to \text{Epistemic / Relational Harm}$ |
| **Harm Manifestation** | Tangible resource loss in credit, housing, hiring | Epistemic injustice, pathologization of intimacy, stereotype entrenchment |
| **System Role** | Direct Decision-Maker (automated scoring/verdicts) | Meaning Mediator (optimizing engagement via clinical taxonomies) |
| **Accountability** | Explicit model weight skew; localized liability | Diffused liability: platform provides scaffold; user executes diagnosis |
| **Regulatory Status** | Governed by anti-discrimination and consumer law | Unregulated gray zone between health misinformation and entertainment |

Platforms escape conventional classifier scrutiny because their algorithms do not issue direct diagnostic outputs. By optimizing purely for engagement metrics, they push quasi-clinical taxonomies into public discourse. Because the diagnostic act is displaced onto the end user, traditional audits focusing on output classification bias fail to capture the systemic relational harm.

---

### 5. Target Venue Framing & Submission Strategy

To maximize academic impact, the framing can be strategically tailored across venues:

#### 5.1 ACM FAccT: Sociotechnical Analysis, Epistemic Harm, and Platform Governance
- **Emphasis**: Intersect algorithmic curation with therapy-speak proliferation, gender power dynamics, epistemic authority, and platform accountability.
- **Governance Analysis**: Examine regulatory loopholes where pseudo-clinical content circumvents standard platform policies on medical misinformation and algorithmic accountability.

#### 5.2 AAAI/ACM AIES: Formal Modeling, Causal Inference, and Dynamic Bias Amplification
- **Emphasis**: Rigorous causal auditing frameworks, counterfactual fairness formulations, Markovian recommendation drift models, and multi-step bias amplification dynamics.

#### 5.3 Feasibility & Resource Allocation
- **Baseline Protocol**: High feasibility with minimal capital expenditure. Requires automated sockpuppet infrastructure, residential proxy pools, network traffic logging, and rigorous qualitative/quantitative annotation.
- **Extended Protocol (Live Ad-Delivery Audit)**: Analogous to Ali et al. and FAccT 2024, researchers can purchase real relationship coaching / attachment workshop ads, leveraging advertiser-side delivery metrics to measure demographic skew in how platforms distribute targeted relationship diagnostics.

---

### 6. Conclusion

This study elevates popular relationship discourse into a critical challenge for algorithmic accountability. By extending black-box auditing from economic allocation to quasi-clinical epistemic mediation, this research provides vital empirical tools and theoretical frameworks to assess how recommender systems reshape social cognition and human intimacy.

---

*This work is licensed under a [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) International License. Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)*
