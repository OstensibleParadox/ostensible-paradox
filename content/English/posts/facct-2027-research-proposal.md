+++
title = 'FAccT 2027 Research Topic Study'
date = '2026-08-18T18:00:00+08:00'
draft = false
categories = ['AI Ethics', 'Social Sciences']
tags = ['FAccT', 'AIES', 'Algorithmic Auditing', 'Recommender Systems', 'Attachment Theory', 'Algorithmic Bias', 'Platform Governance', 'Black-Box Auditing', 'Sociotechnical Systems']
translationKey = 'facct-2027-research-proposal'
+++

## Research Direction 2: Algorithmic Mediation of Quasi-Clinical Discourse and Auditing Gendered Psychological Ontologies

### 1. Theoretical Genealogy: Connecting Two Traditions of "Anxiety"

The theoretical impetus of this study arises from bridging two psychological paradigms that have historically evolved in parallel isolation:

- **Adult Attachment Theory**: Grounded in the study of threat appraisal and affect regulation within close relationships, this tradition conceptualizes *attachment anxiety* and *attachment avoidance* as distinct relational regulation strategies. Contemporary empirical research increasingly treats these constructs not as rigid, immutable personality typologies, but as **continuous, relationship-specific, and context-dependent dimensions**.
- **Occupational Stress & Job Strain Research**: Since Robert Karasek's seminal formulation of the **Job Demand–Control Model**, this discipline has demonstrated that acute psychological strain arises from the structural convergence of high external demands and low decision latitude (autonomy). In short, subjective strain and anxiety do not simply scale with the volume of responsibility borne by an individual, but depend fundamentally on the degree of substantive control they exercise over the processes generating those outcomes.

We do not claim that these two forms of "anxiety" are psychometrically identical. Rather, we propose a **structural bridging hypothesis**: an individual's behavioral manifestation of anxiety, withdrawal, or avoidance in intimate relationships is largely a situational *regulation policy* deployed in response to specific configurations of **autonomy–responsibility–control**, rather than an immutable personality trait.

Consequently, the same person may exhibit hypervigilance, compulsive validation-seeking, and severe anxiety in an occupational setting characterized by "high responsibility and low control," yet adopt withdrawal and detachment in a romantic relationship characterized by high exit rights, expansive personal autonomy, or minimal relational maintenance burdens. This framework fundamentally rewrites the core research inquiry from "what kind of person is anxious/avoidant?" to:

$$\textbf{Under what structural configurations of power, responsibility, informational opacity, and exit costs do individuals adopt anxious versus avoidant regulation policies?}$$

This theoretical reframing provides a critical lens for de-essentializing gender disparities. Rather than reducing the folk observation that "women appear more anxious, men appear more avoidant" to innate biological or psychological differences, we examine how gendered social roles systematically allocate asymmetric relational maintenance burdens, instrumental control, informational transparency, and exit rights. Observable attachment patterns represent systemic outputs of role structures; when this structural layer is obscured, socially engineered behavioral adaptations are readily repackaged by popular discourse and algorithmic systems as intrinsic individual and gendered psychological attributes.

---

### 2. The Social Media Problem: From Dynamic Construct to Gendered Folk Ontology

Our investigation focuses on the **secondary transformation and ontological reduction** this psychological construct undergoes upon entering social media therapy-talk and algorithmic distribution channels.

Attachment dimensions—originally continuous, relational, and highly context-dependent—are drastically compressed across digital platforms into discrete identity typologies such as "the anxious person" or "the avoidant partner." These typologies become rapidly fused with gender stereotypes and prescriptive moral valuations. The core problem extends far beyond the mere popular vulgarization of clinical concepts; it concerns whether algorithmic recommender systems actively function as technical conduits driving the following structural transition:

$$\text{Context-Dependent Regulation} \longrightarrow \text{Categorical Label} \longrightarrow \text{Gendered Identity} \longrightarrow \text{Moralized Folk Taxonomy}$$

Accordingly, the central research question is formulated as:

> **Central Research Question:**  
> When social media platforms mediate the dissemination of popular attachment and relationship discourse, do algorithmic recommender systems actively stabilize and accelerate the conversion of a dynamic, relational psychological construct into a gendered, categorical, and self-reinforcing folk ontology?

#### Core Thesis Statement
> **Abstract Core Claim:**  
> *"A continuous and context-dependent psychological construct is being transformed by platform-mediated popular discourse into a gendered categorical ontology, and recommender systems may amplify that transformation asymmetrically."*

---

### 3. Methodological Lineage: FAccT-Style Black-Box Platform Auditing

Methodologically, this study directly builds upon the traditions of **black-box auditing**, **controlled sock-puppet auditing**, and **sociotechnical auditing** established within **ACM FAccT** and the broader algorithmic accountability literature, deliberately moving beyond static computational text analysis (the conventional CSS paradigm).

Key milestones in this auditing lineage include:
- **Ali et al. (CSCW 2019)**: Demonstrated through live Facebook ad deployments that platform delivery optimization inherently introduces substantial gender and racial skew even under strictly neutral advertiser controls.
- **Imana et al. (WWW 2021)**: Advanced paired-ad auditing methodologies to uncover systemic gender discrimination in job ad delivery across Facebook and LinkedIn.
- **FAccT 2024 & FTC Regulatory Frameworks**: Established the empirical efficacy of third-party black-box audits relying on paired synthetic inputs and advertiser-facing delivery telemetry.

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
- **Data Ingestion**: Multi-platform scraping across TikTok, Instagram Reels, YouTube Shorts, and Reddit communities (e.g., `r/attachment_theory`, `r/dating_advice`), constructing longitudinal datasets spanning several years.
- **Semantic & Association Metrics**: Quantify the temporal intensification of asymmetric semantic pairings:
  - $\text{Male References (Man)} \longrightarrow \text{Avoidant / Emotionally Unavailable / Narcissistic / Toxic}$
  - $\text{Female References (Woman)} \longrightarrow \text{Anxious / Needy / Overgiving / Healing}$
- **Discourse Function Annotation**: Construct fine-grained taxonomies distinguishing **Empirical Observation**, **Self-Labeling**, **Partner-Labeling**, and **Moral Judgment**, measuring the empirical transition from descriptive psychology to prescriptive moral classification.

#### Layer 2: Controlled Recommender Audit
- **Counterfactual Sockpuppet Design**:
  Deploy batches of clean, strictly matched automated personas with minimal counterfactual perturbations:
  - Account Persona Gender: Female profile vs. Male profile;
  - Relationship Query Pairs: `"why does my boyfriend pull away"` vs. `"why does my girlfriend pull away"`;
  - Interaction Framing: Anxious-framed engagement signals vs. Avoidant-framed engagement signals;
  - Baseline Equivalence: Identical initial dwell times, scrolling velocity, and system environments.
- **Transition Probabilities & Hazard Rates**:
  Track recommendation trajectories across multi-step sequences ($t = 1, \dots, T$) to calculate hazard rates and Markov transition probabilities across polarized thematic clusters:
  - `"Avoidant men"` / `"Anxious women"` / `"Narcissistic ex"`
  - `"Divine feminine"` / `"Masculine detachment"` / `"Attachment healing"`
- **Audit Objective**: Test whether identical relational dilemmas are channeled into radically divergent psychological explanation pipelines solely based on the user's imputed gender role.

#### Layer 3: Self-Labeling Endogenous Feedback Loop
- **Modeling Endogenous Identity Reinforcement**:
  $$\text{Initial Relational Concern} \longrightarrow \text{Attachment-Themed Exposure} \longrightarrow \text{Self / Partner Labeling} \longrightarrow \text{Specialized Exposure}$$
- **Cognitive and Algorithmic Collusion**:
  When a user searches for ordinary relationship friction (e.g., "why hasn't he replied?"), the recommender proactively delivers "avoidant attachment" explanatory narratives. Cloaked in clinical authority, the user adopts this label and seeks confirmatory content. Recommenders interpret this as high-relevance feedback, narrowing future recommendations toward pathologized content. Consequently, all ambiguous everyday behaviors in the relationship become retrospectively coded as evidence of personality pathology.
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

This study elevates popular relationship discourse into a critical challenge for algorithmic accountability. By extending black-box auditing from economic allocation to quasi-clinical epistemic mediation, this research demonstrates **how recommender systems actively participate in transforming situational psychological regulation patterns into gendered, categorical, and self-reinforcing folk psychological ontologies**.

---

*This work is licensed under a [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) International License. Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)*
