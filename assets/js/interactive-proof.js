/**
 * Erbar-Maas Singular Intervention Interactive Lab Script
 * Zero-dependency vanilla JS implementation of InteractiveProof.tsx
 */
(function () {
  "use strict";

  // Elements lookup
  var root = document.getElementById("interactive-proof-lab");
  if (!root) return;

  var elements = {
    slideNumber: root.querySelector("#ipl-slide-number"),
    stepTitle: root.querySelector("#ipl-step-title"),
    stepExplanation: root.querySelector("#ipl-step-explanation"),
    matrixName: root.querySelector("#ipl-matrix-name"),
    matrixGrid: root.querySelector("#ipl-matrix-grid"),
    lambdaControl: root.querySelector("#ipl-lambda-control"),
    lambdaValue: root.querySelector("#ipl-lambda-value"),
    lambdaSlider: root.querySelector("#forcing-power-slider"),
    timeSlider: root.querySelector("#simulation-time-slider"),
    timeValue: root.querySelector("#ipl-time-value"),
    entropyValue: root.querySelector("#ipl-entropy-value"),
    massValue: root.querySelector("#ipl-mass-value"),
    scrubberBar: root.querySelector("#ipl-scrubber-bar"),
    btnPrev: root.querySelector("#btn-prev-step"),
    btnNext: root.querySelector("#btn-next-step"),
    btnAutoplay: root.querySelector("#btn-autoplay-toggle"),
    autoplayPlayIcon: root.querySelector("#autoplay-play-icon"),
    autoplayPauseIcon: root.querySelector("#autoplay-pause-icon"),
    autoplayBtnLabel: root.querySelector("#autoplay-btn-label"),
    btnReset: root.querySelector("#btn-reset-timeline"),
    speedControl: root.querySelector("#ipl-speed-control"),
    speedSlider: root.querySelector("#autoplay-speed-slider"),
    speedValue: root.querySelector("#ipl-speed-value"),
    dropdown: root.querySelector("#scene-selection-dropdown"),
    conceptTabs: root.querySelector("#ipl-concept-tabs"),
    conceptDetails: root.querySelector("#concept-details-content"),
    mathDisplay: root.querySelector("#math-display"),
    calcSliderA: root.querySelector("#calc-slider-a"),
    calcSliderB: root.querySelector("#calc-slider-b"),
    calcDisplayA: root.querySelector("#calc-display-a"),
    calcDisplayB: root.querySelector("#calc-display-b"),
    calcResultValue: root.querySelector("#ipl-calc-result-value"),
    
    // Nodes
    nodeA: root.querySelector(".ipl-node-a"),
    nodeB: root.querySelector(".ipl-node-b"),
    nodeC: root.querySelector(".ipl-node-c"),
    nodeCBadge: root.querySelector("#ipl-do-badge"),
    
    // SVG lines
    lineAC: root.querySelector("#ipl-line-ac"),
    lineBC: root.querySelector("#ipl-line-bc"),
    lineAB: root.querySelector("#ipl-line-ab"),
    legendBadge: root.querySelector("#ipl-legend-badge"),

    // Drawer Elements
    drawer: root.querySelector("#tutor-discussion-drawer"),
    standby: root.querySelector("#standby-notice-container"),
    drawerLabel: root.querySelector("#ipl-drawer-factor-label"),
    drawerRole: root.querySelector("#ipl-drawer-factor-role"),
    drawerDetails: root.querySelector("#ipl-drawer-factor-details"),
    btnCloseHighlight: root.querySelector("#btn-close-highlight"),
    chatHistory: root.querySelector("#comment-chat-history"),
    faqList: root.querySelector("#ipl-faq-list"),
    chatForm: root.querySelector("#ipl-chat-form"),
    chatInput: root.querySelector("#custom-math-query-input"),
    btnDiscoverAnchor: root.querySelector("#btn-discover-anchor")
  };

  // Math Helper: Logarithmic Mean Λ(a,b)
  function logarithmicMean(a, b) {
    if (a <= 0 || b <= 0) return 0;
    if (Math.abs(a - b) < 1e-9) return a;
    return (a - b) / (Math.log(a) - Math.log(b));
  }

  // Simple matrix exponential solver using Taylor series expansion: e^{t Q}
  function matrixExponential(Q, t) {
    var n = 3;
    var result = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    
    var currentTerm = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    
    for (var k = 1; k <= 30; k++) {
      var nextTerm = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      
      for (var r = 0; r < n; r++) {
        for (var c = 0; c < n; c++) {
          var sum = 0;
          for (var m = 0; m < n; m++) {
            sum += currentTerm[r][m] * Q[m][c];
          }
          nextTerm[r][c] = (sum * t) / k;
        }
      }
      
      for (var r = 0; r < n; r++) {
        for (var c = 0; c < n; c++) {
          result[r][c] += nextTerm[r][c];
          currentTerm[r][c] = nextTerm[r][c];
        }
      }
    }
    
    return result;
  }

  // Supporting Concepts definitions
  var SUPPORTING_CONCEPTS = {
    ctmc_generator: {
      id: 'ctmc_generator',
      title: 'Continuous-Time Markov Chain (CTMC) & Generator Q',
      type: 'Definition',
      math: 'Q_{ij} \\geq 0 \\text{ for } i \\neq j, \\quad \\sum_j Q_{ij} = 0',
      content: 'A continuous-time stochastic process over a finite state space. The generator matrix Q stores transition rates between system states. Off-diagonal elements represent rate intensities, while diagonals are negative, holding the total escape rate.'
    },
    gradient_flow: {
      id: 'gradient_flow',
      title: 'Entropy Gradient Flow',
      type: 'Theorem',
      math: '\\dot{p}(t) = -\\nabla_{\\mathcal{W}} \\mathcal{H}(p|\\pi)',
      content: 'An elegant formulation proving that reversible Markov chains act as the steepest descent of relative entropy under a specific discrete Riemannian geometry (the Erbar-Maas Wasserstein metric).'
    },
    erbar_maas: {
      id: 'erbar_maas',
      title: 'Erbar-Maas Metric',
      type: 'Definition',
      math: 'd_{\\mathcal{F}}(p_0, p_1)^2 = \\inf \\int_0^1 \\langle v_t, v_t \\rangle_{\\rho_t} dt',
      content: 'The correct discrete counterpart to the continuous Wasserstein-2 distance on state graphs. It replaces continuous mass transportation with flows along graph edges, weighted by the logarithmic mean of state densities.'
    },
    logarithmic_mean: {
      id: 'logarithmic_mean',
      title: 'Logarithmic Mean',
      type: 'Definition',
      math: '\\Lambda(a, b) = \\frac{a - b}{\\log a - \\log b}',
      content: 'The mathematical interpolation representing system "mobility" on graph edges. Crucial for discrete gradient structures: it links absolute density differences to local chemical potential gradients.'
    },
    pearl_surgery: {
      id: 'pearl_surgery',
      title: 'Pearl Surgery (Intervention)',
      type: 'Definition',
      math: 'P(X \\setminus \\{X_k\\} \\mid do(X_k = x_k^*))',
      content: 'A causal operation that models external, structural intervention. We sever all incoming causal influences (parents) to the variable X_k, fixing its value to x_k^*, while leaving adjacent causal dynamics unperturbed.'
    },
    singular_perturbation: {
      id: 'singular_perturbation',
      title: 'Singular Limit & Timescale Separation',
      type: 'Theorem',
      math: 'Q_\\lambda = Q_{do} + \\lambda R_k',
      content: 'By introducing a restoration rate of order λ toward the target state, the system segregates into two distinct timescales: an instant collapse of order O(1/λ) onto the intervention face, followed by slower structural evolution.'
    },
    projection_operator: {
      id: 'projection_operator',
      title: 'Intervention Face Projection Π',
      type: 'Definition',
      math: '\\Pi = \\lim_{\\lambda \\to \\infty} e^{t \\lambda R_k}',
      content: 'A mathematical transformation reflecting total mass collapse onto the intervention subspace. This operator zeroes out components outside the intervention face, mapping any arbitrary starting density into the target set.'
    },
    detailed_balance: {
      id: 'detailed_balance',
      title: 'Detailed Balance & Reversibility',
      type: 'Definition',
      math: '\\pi_i Q_{ij} = \\pi_j Q_{ji}',
      content: 'Reversibility ensures that the net probability flux between any pair of states is zero at equilibrium. Visually, it guarantees no circulating currents exist, which is necessary for the system to possess a well-defined potential (gradient flow).'
    }
  };

  // Proof Steps configuration
  var PROOF_STEPS = [
    {
      id: 0,
      title: 'Reversible CTMC & Causal State Space',
      subtitle: 'The Base System Dynamic & Reversibility',
      explanation: 'We formulate our system on a finite state graph with generator Q. Reversibility (detailed balance with respect to stationary measure π) guarantees our chain lacks circulating currents, enabling a clean potential landscape.',
      latex: '\\pi_i Q_{ij} = \\pi_j Q_{ji}, \\quad \\sum_j Q_{ij} = 0',
      concepts: ['ctmc_generator', 'detailed_balance'],
      highlights: {
        '\\pi_i Q_{ij} = \\pi_j Q_{ji}': {
          label: 'Detailed Balance Equation',
          role: 'Symmetric Energy Landscape',
          details: 'Ensures that microscopic transitions are balanced in equilibrium. In physics, this equates to time-reversal symmetry. In mathematics, it guarantees that the generator Q is self-adjoint on L²(π), meaning all its eigenvalues are real and non-positive.',
          faq: [
            { q: 'Why is Detailed Balance necessary here?', a: 'Without Detailed Balance, the system would have circulating current cycles. This creates non-conserved entropy loops, meaning relative entropy could not be described as a pure gradient descent flow under a symmetric metric.' },
            { q: 'How is the stationary distribution π defined?', a: 'The stationary distribution satisfies π Q = 0. It is the long-term stable limit of state occupational probabilities as time t → ∞.' }
          ]
        },
        '\\sum_j Q_{ij} = 0': {
          label: 'Row-Sum Conservation Condition',
          role: 'Probability Conservation',
          details: 'Guarantees that total probability is conserved (sums to 1) at all times t, since the rows of the generator matrix Q must sum to zero.',
          faq: [
            { q: 'Why are the diagonal elements negative?', a: 'The diagonal elements satisfy Q_ii = - Σ_{j ≠ i} Q_ij, which represents the total rate of leaving state i. It acts as an escape frequency.' }
          ]
        }
      }
    },
    {
      id: 1,
      title: 'The Erbar-Maas Metric Space',
      subtitle: 'Discrete Wasserstein Geometry',
      explanation: 'To view Markov evolution as an entropy gradient flow, we must equip our finite graph with the Erbar-Maas metric. This serves as the exact discrete analog of the L²-Wasserstein physical density transport distance.',
      latex: 'd_{\\mathcal{F}}(p_0, p_1)^2 = \\inf_v \\int_0^1 \\sum_{i \\sim j} \\frac{v_{ij}^2}{\\Lambda(p_i, p_j)} dt',
      concepts: ['erbar_maas', 'logarithmic_mean'],
      highlights: {
        '\\Lambda(p_i, p_j)': {
          label: 'Logarithmic Mean Multiplier',
          role: 'Interstate Transport Mobility Factor',
          details: 'Represented as Λ(a,b) = (a-b)/(log a - log b). This specific non-linear interpolation acts as the effective density or "mobility" of probability mass moving along graph edges.',
          faq: [
            { q: 'Why do we use Logarithmic Mean instead of simple Arithmetic Mean?', a: 'The Logarithmic Mean is mathematically required to relate state probability differences to local logarithmic gradient fluxes. Under any other mean, the relative entropy gradient wouldn\'t map cleanly to linear Markov generators.' },
            { q: 'What happens if p_i = p_j?', a: 'As p_i approaches p_j, the logarithmic mean converges smoothly to p_i. The function is continuous and positive for all positive allocations.' }
          ]
        },
        'd_{\\mathcal{F}}(p_0, p_1)^2': {
          label: 'Discrete Wasserstein Distance squared',
          role: 'Geometric Mass Transport Measure',
          details: 'Measures the shortest path energy required to dynamically transition density distribution p_0 into p_1 along graph connections.',
          faq: [
            { q: 'How does this compare to classical Euclidean distance?', a: 'Classical Euclidean distance ignores graph connectivity. The Erbar-Maas metric constrains flows strictly to existing edges, capturing the true configuration topology.' }
          ]
        }
      }
    },
    {
      id: 2,
      title: 'The Entropy Gradient Flow',
      subtitle: 'Markov Evolution as Steepest Descent',
      explanation: 'Under the Erbar-Maas metric, any reversible Markov dynamics is proven to contract relative information divergence. The evolution is mathematically equivalent to the steepest descent of the relative entropy scalar field.',
      latex: '\\dot{p}(t) = -\\nabla_{\\mathcal{W}} \\mathcal{H}(p \\mid \\pi), \\quad \\mathcal{H}(p \\mid \\pi) = \\sum p_i \\log\\frac{p_i}{\\pi_i}',
      concepts: ['gradient_flow', 'logarithmic_mean'],
      highlights: {
        '-\\nabla_{\\mathcal{W}} \\mathcal{H}(p \\mid \\pi)': {
          label: 'Waterstein Entropy Gradient',
          role: 'Driving Force of system decay',
          details: 'The direction of steepest local descent. Mass is pushed from high-entropy potential locations to low-entropy configurations, mimicking physical diffusion.',
          faq: [
            { q: 'What is relative entropy measuring here?', a: 'It measures information divergence (Kullback-Leibler divergence) between active distribution p(t) and equilibrium. It represents the remaining work capacity of the system.' },
            { q: 'Does this hold for non-reversible systems?', a: 'No, non-reversible networks introduce rotational components (conservative currents) that disrupt the pure symmetric Wasserstein gradient description.' }
          ]
        }
      }
    },
    {
      id: 3,
      title: 'Hard Pearl Intervention',
      subtitle: 'Surgical Graph Edge Cutting',
      explanation: 'We execute a hard causal "do-intervention" to fix coordinate X_k = x_k^*. This structural modification cuts off all incoming transition rates (parents) to the target coordinate, reducing the matrix generator to Q_do.',
      latex: 'Q_{do} (i, j) = 0 \\quad \\forall i, \\text{ where } j = x_k^* \\text{ is incoming}',
      concepts: ['pearl_surgery'],
      highlights: {
        'Q_{do}': {
          label: 'Polished Pearl Intervention Matrix',
          role: 'Causal Post-Surgical Dynamics',
          details: 'A generator representing the modified causal model. By severing incoming edges, we guarantee that the target coordinate’s state can never be influenced by external configurations, while its downstream effects can still propagate outward.',
          faq: [
            { q: 'How does this differ from simple conditioning?', a: 'Conditioning calculates standard probability slices in an untouched world (observing). Intervention physically reorganizes the system’s dynamics (doing) by severing causal paths.' }
          ]
        }
      }
    },
    {
      id: 4,
      title: 'Singular Perturbation Generator Q_λ',
      subtitle: 'Physical Model of Causal Directives',
      explanation: 'To show that surgery is a genuine physical limit, we define a parameterized generator Q_λ. Rather than cutting edges instantly, we introduce a fast-restoring restoring generator R_k with rate intensity scale λ.',
      latex: 'Q_\\lambda = Q_{do} + \\lambda R_k',
      concepts: ['singular_perturbation'],
      highlights: {
        'Q_{do} + \\lambda R_k': {
          label: 'Coupled Fast-Slow Dynamics Matrix',
          role: 'Timescale Separation Equation',
          details: 'Combines slow physical dynamics (Q_do) with an extremely fast restorative force (λR_k). As λ grows arbitrarily large, states outside the target face are rapidly pulled back.',
          faq: [
            { q: 'What does the restoring matrix R_k look like elements-wise?', a: 'For any state x_i ≠ x_k^*, transition rates into x_k^* occur at rate λ. The target state itself acts as an absorbing boundary under R_k.' }
          ]
        }
      }
    },
    {
      id: 5,
      title: 'The Projection onto the Intervention Face',
      subtitle: 'Singular Collapse & Mass Squeezing',
      explanation: 'As the rate parameter λ diverges, the transient dynamics decompose. System state probabilities instantly collapse onto the intervention face via a projection operator Π_k, eliminating all configurations outside the target target.',
      latex: '\\Pi_k = \\lim_{\\lambda \\to \\infty} e^{t \\lambda R_k}, \\quad \\{x : x_k = x_k^*\\}',
      concepts: ['projection_operator'],
      highlights: {
        '\\Pi_k': {
          label: 'Causal Face Boundary Projection Π_k',
          role: 'Geometric Squeezing Operator',
          details: 'A projection operator that zeroes out all state representations except for the target coordinate. Visually, it compresses the entire available state-space density directly onto the intervention plane.',
          faq: [
            { q: 'Is the projection matrix invertible?', a: 'No. The projection operator has determinant zero. It represents an lossy compression where information outside the face is permanently erased (absorbed).' }
          ]
        }
      }
    },
    {
      id: 6,
      title: 'The Singular Limit Equivalence',
      subtitle: 'Reuniting Perturbations with Surgery',
      explanation: 'We prove the beautiful final equivalence. Under singular perturbation, the matrix exponential of Q_λ converges exactly to the projected surgical operator. Pearl surgery is rigorously proven to be the timescale limit of physical restoration!',
      latex: '\\lim_{\\lambda \\to \\infty} e^{t(Q_{do} + \\lambda R_k)} = \\Pi_k e^{t \\Pi_k Q_{do} \\Pi_k}',
      concepts: ['singular_perturbation', 'projection_operator'],
      highlights: {
        '\\Pi_k e^{t \\Pi_k Q_{do} \\Pi_k}': {
          label: 'Projected Surgical Trajectory',
          role: 'Perfect Causal Homogenization',
          details: 'The final dynamical solution. System mass is first instantly projected onto the target face via Π_k, and thereafter evolves under the reduced surgical generator on the face.',
          faq: [
            { q: 'Why is this result useful for Mathlib formalization?', a: 'Because by working with finite matrices and eigenvalues, we bypass complicated infinite-dimensional analysis (weak convergence of measures, boundary flux conditions, Sobolev spaces) in favor of elegant finite-dimensional linear algebra!' }
          ]
        }
      }
    }
  ];

  // Mathematical System Constants
  var initialP = [0.65, 0.25, 0.10]; 
  var pi_vector = [0.20, 0.50, 0.30];

  var Q_base = [
    [-1.5, 1.25, 0.25],   
    [0.5, -0.9, 0.4],     
    [0.1667, 0.6667, -0.8333] 
  ];

  var Q_do = [
    [-1.25, 1.25, 0.0],
    [0.5, -0.5, 0.0],
    [0.1667, 0.6667, -0.8333]
  ];

  function getQ_lambda(l) {
    return [
      [-1.25 - l, 1.25, l],
      [0.5, -0.5 - l, l],
      [0.1667, 0.6667, -0.8333]
    ];
  }

  // App state
  var state = {
    currentStepId: 0,
    isPlaying: false,
    selectedHighlight: null,
    activeConceptTab: null,
    speed: 3500,
    lambda: 5,
    currentTime: 1.0,
    activeBoardHighlight: null,
    chatHistory: []
  };

  var stepTimer = null;

  // Initialize UI components
  function init() {
    setupEventListeners();
    buildScrubber();
    buildDropdown();
    updateStepUI();
  }

  // Bind Event Listeners
  function setupEventListeners() {
    // Media controls
    elements.btnPrev.addEventListener("click", handlePrev);
    elements.btnNext.addEventListener("click", handleNext);
    elements.btnAutoplay.addEventListener("click", handleTogglePlay);
    elements.btnReset.addEventListener("click", handleReset);
    
    // Sliders
    elements.timeSlider.addEventListener("input", function (e) {
      state.currentTime = parseFloat(e.target.value);
      elements.timeValue.textContent = state.currentTime.toFixed(1) + "s";
      updateLiveCalculations();
    });

    elements.lambdaSlider.addEventListener("input", function (e) {
      state.lambda = parseInt(e.target.value, 10);
      elements.lambdaValue.textContent = "λ = " + state.lambda;
      updateLiveCalculations();
    });

    elements.speedSlider.addEventListener("input", function (e) {
      state.speed = parseInt(e.target.value, 10);
      elements.speedValue.textContent = (state.speed / 1000).toFixed(1) + "s";
      if (state.isPlaying) {
        restartAutoplayTimer();
      }
    });

    // Scene quick jump
    elements.dropdown.addEventListener("change", function (e) {
      setIsPlaying(false);
      changeStep(parseInt(e.target.value, 10));
    });

    // Tutor Send Message
    elements.chatForm.addEventListener("submit", handleSendChatMessage);

    // Discover Anchor trigger
    elements.btnDiscoverAnchor.addEventListener("click", function () {
      var currentStep = PROOF_STEPS[state.currentStepId];
      var keys = Object.keys(currentStep.highlights);
      if (keys.length > 0) {
        selectHighlight(keys[0]);
      }
    });

    // Close Tutor Highlight Drawer
    elements.btnCloseHighlight.addEventListener("click", function () {
      selectHighlight(null);
    });
  }

  // Create timeline seeking bar
  function buildScrubber() {
    elements.scrubberBar.replaceChildren();
    PROOF_STEPS.forEach(function (step, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ipl-scrubber-segment" + (idx === state.currentStepId ? " is-active" : "");
      btn.title = "Seek: " + step.title;
      btn.addEventListener("click", function () {
        setIsPlaying(false);
        changeStep(idx);
      });
      elements.scrubberBar.appendChild(btn);
    });
  }

  // Create stage quick-jump dropdown
  function buildDropdown() {
    elements.dropdown.replaceChildren();
    PROOF_STEPS.forEach(function (step, idx) {
      var opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = (idx + 1) + ". " + step.title;
      elements.dropdown.appendChild(opt);
    });
  }

  // Trigger step changed updates
  function changeStep(idx) {
    if (idx < 0 || idx >= PROOF_STEPS.length) return;
    state.currentStepId = idx;
    state.selectedHighlight = null;
    
    var currentStep = PROOF_STEPS[idx];
    state.activeConceptTab = currentStep.concepts.length > 0 ? currentStep.concepts[0] : null;

    updateStepUI();
  }

  // Update UI based on active step index
  function updateStepUI() {
    var step = PROOF_STEPS[state.currentStepId];
    
    // Basic elements
    elements.slideNumber.textContent = "SLIDE " + (state.currentStepId + 1) + " / " + PROOF_STEPS.length;
    elements.stepTitle.textContent = step.title;
    elements.stepExplanation.textContent = step.explanation;
    elements.dropdown.value = state.currentStepId;

    // Disabled buttons safety
    elements.btnPrev.disabled = state.currentStepId === 0;
    elements.btnNext.disabled = state.currentStepId === PROOF_STEPS.length - 1;

    // Scrubber highlights
    Array.prototype.forEach.call(elements.scrubberBar.children, function (segment, idx) {
      segment.classList.toggle("is-active", idx <= state.currentStepId);
    });

    // Lambda slider control visibility
    if (state.currentStepId >= 4) {
      elements.lambdaControl.classList.remove("ipl-hidden");
    } else {
      elements.lambdaControl.classList.add("ipl-hidden");
    }

    // Node state classes
    elements.nodeCBadge.classList.toggle("ipl-hidden", state.currentStepId < 3);

    // Concept Tabs
    buildConceptTabs(step);
    updateConceptBox();

    // LaTeX Formula Display
    renderMathFormula(step);

    // Discussion drawer closure
    selectHighlight(state.selectedHighlight);

    // Recalculate simulations
    updateLiveCalculations();
  }

  // Create concept toggle buttons
  function buildConceptTabs(step) {
    elements.conceptTabs.replaceChildren();
    step.concepts.forEach(function (conceptKey) {
      var concept = SUPPORTING_CONCEPTS[conceptKey];
      if (!concept) return;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ipl-tab-btn" + (state.activeConceptTab === concept.id ? " is-active" : "");
      btn.textContent = concept.title;
      btn.addEventListener("click", function () {
        state.activeConceptTab = concept.id;
        Array.prototype.forEach.call(elements.conceptTabs.children, function (tab) {
          tab.classList.toggle("is-active", tab.textContent === concept.title);
        });
        updateConceptBox();
      });
      elements.conceptTabs.appendChild(btn);
    });
  }

  // Render text content inside details box
  function updateConceptBox() {
    elements.conceptDetails.replaceChildren();
    if (!state.activeConceptTab) {
      var p = document.createElement("p");
      p.className = "ipl-concept-text ipl-hidden";
      p.style.textAlign = "center";
      p.style.fontStyle = "italic";
      p.textContent = "Select a core concept above to visualize details.";
      elements.conceptDetails.appendChild(p);
      return;
    }

    var concept = SUPPORTING_CONCEPTS[state.activeConceptTab];
    if (!concept) return;

    var container = document.createElement("div");
    
    var meta = document.createElement("div");
    meta.className = "ipl-concept-meta";
    var typeSpan = document.createElement("span");
    typeSpan.className = "ipl-concept-type";
    typeSpan.textContent = concept.type;
    var gridSpan = document.createElement("span");
    gridSpan.className = "ipl-concept-gridname";
    gridSpan.textContent = "MAAS-GRID";
    meta.appendChild(typeSpan);
    meta.appendChild(gridSpan);

    var title = document.createElement("h4");
    title.className = "ipl-concept-title";
    title.textContent = concept.title;

    var text = document.createElement("p");
    text.className = "ipl-concept-text";
    text.textContent = concept.content;

    container.appendChild(meta);
    container.appendChild(title);
    container.appendChild(text);

    if (concept.math) {
      var math = document.createElement("div");
      math.className = "ipl-concept-math";
      math.textContent = concept.math;
      container.appendChild(math);
    }

    elements.conceptDetails.appendChild(container);
  }

  // Render raw LaTeX strings into clickable nodes
  function renderMathFormula(step) {
    elements.mathDisplay.replaceChildren();
    var pieces = step.latex.split(/(, | & |; )/);

    pieces.forEach(function (piece) {
      var highlightKeys = Object.keys(step.highlights);
      var matchFound = false;
      var matchedKey = "";

      for (var i = 0; i < highlightKeys.length; i++) {
        var key = highlightKeys[i];
        if (piece.indexOf(key) !== -1) {
          matchFound = true;
          matchedKey = key;
          break;
        }
      }

      if (matchFound) {
        var startIdx = piece.indexOf(matchedKey);
        var before = piece.substring(0, startIdx);
        var after = piece.substring(startIdx + matchedKey.length);

        var wrapper = document.createElement("span");
        wrapper.className = "ipl-math-piece";

        if (before) {
          var beforeSpan = document.createElement("span");
          beforeSpan.textContent = before;
          wrapper.appendChild(beforeSpan);
        }

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ipl-math-btn";
        if (state.selectedHighlight === matchedKey) {
          btn.classList.add("is-active");
        }
        btn.textContent = matchedKey;
        btn.title = "Click to discuss & highlight this formulation!";
        btn.addEventListener("click", function () {
          selectHighlight(matchedKey);
        });

        // Hover linkages
        btn.addEventListener("mouseenter", function () {
          btn.classList.add("is-hovered-source");
        });
        btn.addEventListener("mouseleave", function () {
          btn.classList.remove("is-hovered-source");
        });

        wrapper.appendChild(btn);

        if (after) {
          var afterSpan = document.createElement("span");
          afterSpan.textContent = after;
          wrapper.appendChild(afterSpan);
        }

        elements.mathDisplay.appendChild(wrapper);
      } else {
        var textNode = document.createElement("span");
        textNode.className = "ipl-math-piece";
        textNode.textContent = piece;
        elements.mathDisplay.appendChild(textNode);
      }
    });
  }

  // Calculate live values and update simulation graphics
  function updateLiveCalculations() {
    var activeQ;
    if (state.currentStepId <= 2) {
      activeQ = Q_base;
      elements.matrixName.textContent = "REVERSIBLE GENERATOR Q";
    } else if (state.currentStepId === 3) {
      activeQ = Q_do;
      elements.matrixName.textContent = "SURGICAL GENERATOR Q_do";
    } else {
      activeQ = getQ_lambda(state.lambda);
      elements.matrixName.textContent = "PERTURBED Q_λ (λ = " + state.lambda + ")";
    }

    // Matrix Exponential solver exp(t * Q)
    var activeDynamics = matrixExponential(activeQ, state.currentTime);

    // Compute live state distribution probabilities
    var currentPt = [0, 0, 0];
    for (var c = 0; c < 3; c++) {
      var sum = 0;
      for (var r = 0; r < 3; r++) {
        sum += initialP[r] * activeDynamics[r][c];
      }
      currentPt[c] = Math.max(0, Math.min(1.0, sum));
    }
    
    // Normalize density values to preserve exact sum of 1.0
    var total = currentPt[0] + currentPt[1] + currentPt[2];
    currentPt = [currentPt[0]/total, currentPt[1]/total, currentPt[2]/total];

    // Compute Shannon Entropy H(p | π) relative toDetailed Balance measure
    var computedEntropy = 0;
    for (var i = 0; i < 3; i++) {
      if (currentPt[i] > 0) {
        computedEntropy += currentPt[i] * Math.log(currentPt[i] / pi_vector[i]);
      }
    }

    // Render Matrix Cells HTML layout
    elements.matrixGrid.replaceChildren();
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var cellVal = activeQ[r][c];
        var cell = document.createElement("div");
        cell.className = "ipl-matrix-cell";
        if (cellVal < 0) {
          cell.classList.add("cell-negative");
        } else if (cellVal > 1.5) {
          cell.classList.add("cell-positive");
        }
        cell.textContent = cellVal.toFixed(3);
        elements.matrixGrid.appendChild(cell);
      }
    }

    // Update simulation indicators
    elements.entropyValue.textContent = computedEntropy.toFixed(5) + " nats";
    elements.massValue.textContent = "A: " + Math.round(currentPt[0]*100) + "% • B: " + Math.round(currentPt[1]*100) + "% • C: " + Math.round(currentPt[2]*100) + "%";

    // Update Nodes graphics
    elements.nodeA.querySelector(".ipl-node-prob").textContent = currentPt[0].toFixed(3);
    elements.nodeB.querySelector(".ipl-node-prob").textContent = currentPt[1].toFixed(3);
    elements.nodeC.querySelector(".ipl-node-prob").textContent = currentPt[2].toFixed(3);

    // Active state highlighting classes
    elements.nodeA.classList.toggle("is-active", currentPt[0] > 0.4);
    elements.nodeB.classList.toggle("is-active", currentPt[1] > 0.4);
    
    if (state.currentStepId >= 3) {
      elements.nodeC.classList.add("is-intervened");
      elements.nodeC.classList.remove("is-active");
    } else {
      elements.nodeC.classList.remove("is-intervened");
      elements.nodeC.classList.toggle("is-active", currentPt[2] > 0.4);
    }

    // Update lines styles in SVG network visualizer
    if (state.currentStepId < 3) {
      // Normal paths
      setSVGLine(elements.lineAC, "#818cf8", 2, "", 0.7);
      setSVGLine(elements.lineBC, "#818cf8", 2, "", 0.7);
      elements.legendBadge.textContent = "Standard reversible paths";
    } else if (state.currentStepId === 3) {
      // Pearl Surgery explicit cutoff
      setSVGLine(elements.lineAC, "#ef4444", 1, "5,5", 0.3);
      setSVGLine(elements.lineBC, "#ef4444", 1, "5,5", 0.3);
      elements.legendBadge.textContent = "C causal inputs severed";
    } else {
      // Perturbed stabilizer flow
      var forcingWidth = Math.min(5, 1 + state.lambda / 5);
      setSVGLine(elements.lineAC, "#f59e0b", forcingWidth, "3,3", 0.9, "url(#ipl-arrow-orange)");
      setSVGLine(elements.lineBC, "#f59e0b", forcingWidth, "3,3", 0.9, "url(#ipl-arrow-orange)");
      elements.legendBadge.textContent = "λ forcing restoration active";
    }

    // Log-Mean widget
    elements.calcDisplayA.textContent = "p_A = " + currentPt[0].toFixed(3);
    elements.calcDisplayB.textContent = "p_B = " + currentPt[1].toFixed(3);
    var liveLogMean = logarithmicMean(currentPt[0], currentPt[1]);
    elements.calcResultValue.textContent = liveLogMean.toFixed(6);
  }

  // Direct line attribute modification
  function setSVGLine(lineEl, color, width, dasharray, opacity, marker) {
    lineEl.setAttribute("stroke", color);
    lineEl.setAttribute("stroke-width", width);
    lineEl.setAttribute("stroke-dasharray", dasharray);
    lineEl.setAttribute("opacity", opacity);
    if (marker) {
      lineEl.setAttribute("marker-end", marker);
    } else {
      lineEl.setAttribute("marker-end", "url(#ipl-arrow-blue)");
    }
  }

  // Handle active highlighting clicks and slide drawers
  function selectHighlight(termKey) {
    state.selectedHighlight = termKey;
    var step = PROOF_STEPS[state.currentStepId];

    // Reset formula active styles
    Array.prototype.forEach.call(elements.mathDisplay.querySelectorAll(".ipl-math-btn"), function (btn) {
      btn.classList.toggle("is-active", btn.textContent === termKey);
    });

    if (termKey && step.highlights[termKey]) {
      var hl = step.highlights[termKey];
      
      elements.drawerLabel.textContent = hl.label;
      elements.drawerRole.textContent = hl.role;
      elements.drawerDetails.textContent = hl.details;

      // Populate FAQ shortcuts
      elements.faqList.replaceChildren();
      hl.faq.forEach(function (faqItem) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ipl-faq-btn";
        
        var icon = document.createElement("span");
        icon.className = "ipl-faq-btn-icon";
        icon.innerHTML = "&#9656;"; // arrow symbol
        
        var text = document.createElement("span");
        text.textContent = faqItem.q;

        btn.appendChild(icon);
        btn.appendChild(text);
        btn.addEventListener("click", function () {
          triggerChatQA(faqItem.q, faqItem.a);
        });

        elements.faqList.appendChild(btn);
      });

      // Reset chatbot feed logs
      state.chatHistory = [
        {
          sender: "tutor",
          text: "You selected **" + hl.label + "** (" + hl.role + ").\n\n" + hl.details + "\n\nAsk me anything custom about this mathematical representation, or click one of the pre-calculated discussion questions below!"
        }
      ];
      renderChatLogs();

      // Show drawer & hide standby
      elements.drawer.classList.remove("ipl-hidden");
      elements.standby.classList.add("ipl-hidden");
      
      // Auto scroll to chat drawer
      elements.drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      elements.drawer.classList.add("ipl-hidden");
      elements.standby.classList.remove("ipl-hidden");
    }
  }

  // Render chat logs
  function renderChatLogs() {
    elements.chatHistory.replaceChildren();
    state.chatHistory.forEach(function (msg) {
      var wrapper = document.createElement("div");
      wrapper.className = "ipl-chat-msg-wrapper msg-" + msg.sender;

      var label = document.createElement("span");
      label.className = "ipl-chat-sender-label";
      label.textContent = msg.sender === "user" ? "Your Query" : "Mathematics Explainer";

      var box = document.createElement("div");
      box.className = "ipl-chat-msg";
      
      // Basic bold formatter for Markdown support (**Text**)
      var formattedText = msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      box.innerHTML = formattedText;

      wrapper.appendChild(label);
      wrapper.appendChild(box);
      elements.chatHistory.appendChild(wrapper);
    });

    // Auto-scroll to bottom of chat history box
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  }

  // Pre-coded FAQ shortcuts submission
  function triggerChatQA(question, answer) {
    state.chatHistory.push({ sender: "user", text: question });
    renderChatLogs();
    
    // Simulate delay
    setTimeout(function () {
      state.chatHistory.push({ sender: "tutor", text: answer });
      renderChatLogs();
    }, 400);
  }

  // Submit custom student queries
  function handleSendChatMessage(e) {
    e.preventDefault();
    var query = elements.chatInput.value.trim();
    if (!query) return;

    elements.chatInput.value = "";
    state.chatHistory.push({ sender: "user", text: query });
    renderChatLogs();

    var currentStep = PROOF_STEPS[state.currentStepId];
    var selectedHighlight = state.selectedHighlight;

    setTimeout(function () {
      var response = "";
      var lowQuery = query.toLowerCase();

      if (selectedHighlight && currentStep.highlights[selectedHighlight]) {
        var hl = currentStep.highlights[selectedHighlight];
        if (lowQuery.indexOf("why") !== -1 || lowQuery.indexOf("reason") !== -1) {
          response = "Excellent mathematical query. In the context of **" + hl.label + "**, this formulation ensures total algebraic consistency on our finite causal graph. By parameterizing transition pathways, we avoid measure-theoretic complications (like weak convergence limits on Sobolev spaces), translating physical processes into manageable matrix transformations.";
        } else if (lowQuery.indexOf("metric") !== -1 || lowQuery.indexOf("distance") !== -1) {
          response = "The Erbar-Maas metric utilizes the Logarithmic Mean $\\Lambda(p_i, p_j)$ to scale spatial gradients. Under standard metrics, the speed of mass contraction does not match the scalar derivative of the Kullback-Leibler divergence. Logarithmic mobility serves as the missing link aligning probability curves to continuous thermodynamics.";
        } else {
          response = "Fascinating observation regarding **" + hl.label + "**. Within our Continuous-Time Markov Chain (CTMC) setup, this operator determines topological mass redistribution. In step " + (state.currentStepId + 1) + ", this algebraic behavior underpins the singular convergence theorem, proving that fast physical restoration (as $\\lambda \\to \\infty$) is equivalent to structural causal surgery.";
        }
      } else {
        if (lowQuery.indexOf("surge") !== -1 || lowQuery.indexOf("pearl") !== -1) {
          response = "Pearl surgery is causal, not probabilistic. It structuralizes external intervention by severing incoming causal vertices. Our proof demonstrates that this discontinuous \"surgery\" is mathematically equivalent to the continuous timescale limit of high-rate local stabilizers ($Q_\\lambda$).";
        } else if (lowQuery.indexOf("gradient") !== -1) {
          response = "Indeed! Over a finite graph, continuous density trajectories follow paths of steepest descent. The choice of Erbar-Maas metric organizes graph coordinates as a curved manifold, so that linear relaxation under Q matches the natural informational compression path.";
        } else {
          response = "Analyzing Step " + (state.currentStepId + 1) + " (" + currentStep.title + "), we evaluate the interaction between generator elements and state dynamics. By tweaking variables like $\\lambda$ (the forcing rate) and simulation times ($t$), you can observe how the system collapses onto the targeted intervention face (State C). Let me know if you would like algebraic details of any highlighted factor!";
        }
      }

      state.chatHistory.push({ sender: "tutor", text: response });
      renderChatLogs();
    }, 600);
  }

  // Auto-play interval timer mechanics
  function restartAutoplayTimer() {
    if (stepTimer) clearInterval(stepTimer);
    stepTimer = setInterval(function () {
      if (state.currentStepId < PROOF_STEPS.length - 1) {
        changeStep(state.currentStepId + 1);
      } else {
        setIsPlaying(false);
      }
    }, state.speed);
  }

  function setIsPlaying(playing) {
    state.isPlaying = playing;
    
    // Toggle active state classes
    elements.btnAutoplay.classList.toggle("is-playing", playing);
    elements.speedControl.classList.toggle("ipl-hidden", !playing);

    if (playing) {
      elements.autoplayPlayIcon.classList.add("ipl-hidden");
      elements.autoplayPauseIcon.classList.remove("ipl-hidden");
      elements.autoplayBtnLabel.textContent = "Pause";
      restartAutoplayTimer();
    } else {
      elements.autoplayPlayIcon.classList.remove("ipl-hidden");
      elements.autoplayPauseIcon.classList.add("ipl-hidden");
      elements.autoplayBtnLabel.textContent = "Auto-Play";
      if (stepTimer) {
        clearInterval(stepTimer);
        stepTimer = null;
      }
    }
  }

  function handleTogglePlay() {
    setIsPlaying(!state.isPlaying);
  }

  function handleNext() {
    setIsPlaying(false);
    if (state.currentStepId < PROOF_STEPS.length - 1) {
      changeStep(state.currentStepId + 1);
    }
  }

  function handlePrev() {
    setIsPlaying(false);
    if (state.currentStepId > 0) {
      changeStep(state.currentStepId - 1);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    state.lambda = 5;
    state.currentTime = 1.0;
    elements.lambdaSlider.value = 5;
    elements.lambdaValue.textContent = "λ = 5";
    elements.timeSlider.value = 1.0;
    elements.timeValue.textContent = "1.0s";
    changeStep(0);
  }

  // Self boot
  init();

})();
