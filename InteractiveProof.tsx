import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, ArrowLeft, ArrowRight, RotateCcw, 
  BookOpen, HelpCircle, MessageSquare, ChevronRight, 
  Lightbulb, Shield, ShieldCheck, Cpu, Info, Check, Send, 
  Network, TrendingDown, ArrowUpRight, Maximize2, Settings, Zap
} from 'lucide-react';

// Math Helper: Logarithmic Mean Λ(a,b)
const logarithmicMean = (a: number, b: number): number => {
  if (a <= 0 || b <= 0) return 0;
  if (Math.abs(a - b) < 1e-9) return a;
  return (a - b) / (Math.log(a) - Math.log(b));
};

// Simple matrix exponential solver using Taylor series expansion: e^{t Q}
// Since Q is a 3x3 generator matrix, 20-30 terms of Taylor series is extremely accurate for small t
const matrixExponential = (Q: number[][], t: number): number[][] => {
  const n = 3;
  // Identity matrix
  let result = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  
  let currentTerm = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  
  // Power series terms
  for (let k = 1; k <= 30; k++) {
    // Next term: Term_k = Term_{k-1} * (t * Q) / k
    const nextTerm = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let sum = 0;
        for (let m = 0; m < n; m++) {
          sum += currentTerm[r][m] * Q[m][c];
        }
        nextTerm[r][c] = (sum * t) / k;
      }
    }
    
    // Add to result and update currentTerm
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[r][c] += nextTerm[r][c];
        currentTerm[r][c] = nextTerm[r][c];
      }
    }
  }
  
  return result;
};

// Define Supporting Theorem or Definition interface
interface SupportingConcept {
  id: string;
  title: string;
  type: 'Definition' | 'Theorem';
  math?: string;
  content: string;
}

// Global Knowledge Base of supporting definitions/theorems for the CTMC Causal Interventions
const SUPPORTING_CONCEPTS: Record<string, SupportingConcept> = {
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

interface ProofStep {
  id: number;
  title: string;
  subtitle: string;
  explanation: string;
  latex: string;
  concepts: string[];
  mathHighlightKey?: string;
  highlights: Record<string, {
    label: string;
    role: string;
    details: string;
    faq: { q: string; a: string }[];
  }>;
}

const PROOF_STEPS: ProofStep[] = [
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

export const InteractiveProof: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [activeConceptTab, setActiveConceptTab] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'tutor'; text: string }[]>([]);
  const [speed, setSpeed] = useState(3500); 
  const [lambda, setLambda] = useState(5); // Restoration rate parameter
  const [currentTime, setCurrentTime] = useState(1.0); // Simulation time t
  const [activeBoardHighlight, setActiveBoardHighlight] = useState<string | null>(null);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = PROOF_STEPS[currentStepId];

  // Mathematical System Definitions: States A, B, C.
  // We wish to project/intervene on state C (Index 2).
  // Base State Occupations / Initial density of state
  const initialP = [0.65, 0.25, 0.10]; 

  // Reversible Base Generator Matrix Q
  const Q_base = [
    [-1.5, 1.25, 0.25],   // Transitions out from A
    [0.5, -0.9, 0.4],     // Transitions out from B
    [0.1667, 0.6667, -0.8333] // Transitions out from C
  ];

  // Stationary measure π (Detailed Balance vector)
  const pi_vector = [0.20, 0.50, 0.30];

  // Modified Generator after Pearl Surgery Q_do (Incoming edges into targeted State C are killed)
  // This means from state A to C (Q[0][2] = 0) and B to C (Q[1][2] = 0).
  // To preserve probability row-sums, the diagonal is adjusted accordingly.
  const Q_do = [
    [-1.25, 1.25, 0.0],
    [0.5, -0.5, 0.0],
    [0.1667, 0.6667, -0.8333]
  ];

  // Restoring Fast Generator R_k (Fast resets to state C)
  // Transitions from A to C copy at rate lambda, from B to C copy at rate lambda.
  const getQ_lambda = (l: number): number[][] => {
    return [
      [-1.25 - l, 1.25, l],
      [0.5, -0.5 - l, l],
      [0.1667, 0.6667, -0.8333]
    ];
  };

  // Compute live matrix trajectories based on state
  const activeQ = currentStepId <= 2 ? Q_base : (currentStepId === 3 ? Q_do : getQ_lambda(lambda));
  const activeDynamics = matrixExponential(activeQ, currentTime);

  // Live probabilities p(t) = initialP * exp(t * Q)
  const computePt = (p_init: number[], expM: number[][]): number[] => {
    const result = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let r = 0; r < 3; r++) {
        sum += p_init[r] * expM[r][c];
      }
      result[c] = Math.max(0, Math.min(1.0, sum)); // bound limits
    }
    // Normalize to exact 1.0 due to tiny numerical float errors
    const total = result[0] + result[1] + result[2];
    return [result[0]/total, result[1]/total, result[2]/total];
  };

  const currentPt = computePt(initialP, activeDynamics);

  // Custom live calculated Erbar-Maas Metric Value & Relative Entropy H(p|π)
  const computedEntropy = currentPt.reduce((acc, val, idx) => {
    if (val <= 0) return acc;
    return acc + val * Math.log(val / pi_vector[idx]);
  }, 0);

  // Auto-play timer for slide transition
  useEffect(() => {
    if (isPlaying) {
      stepTimerRef.current = setTimeout(() => {
        if (currentStepId < PROOF_STEPS.length - 1) {
          setCurrentStepId(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    } else if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [currentStepId, isPlaying, speed]);

  // Clean state when step changes
  useEffect(() => {
    setSelectedHighlight(null);
    setActiveBoardHighlight(null);
    if (currentStep.concepts.length > 0) {
      setActiveConceptTab(currentStep.concepts[0]);
    }
  }, [currentStepId]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepId < PROOF_STEPS.length - 1) {
      setCurrentStepId(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepId > 0) {
      setCurrentStepId(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepId(0);
    setLambda(5);
    setCurrentTime(1.0);
  };

  // Highlighting specific terms
  const handleSelectHighlight = (termKey: string) => {
    setSelectedHighlight(termKey);
    const hl = currentStep.highlights[termKey];
    if (hl) {
      setChatHistory([
        {
          sender: 'tutor',
          text: `You selected **${hl.label}** (${hl.role}).\n\n${hl.details}\n\nAsk me anything custom about this mathematical representation, or click one of the pre-calculated discussion questions below!`
        }
      ]);
    }
  };

  const handleFaqClick = (q: string, a: string) => {
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'tutor', text: a }
    ]);
  };

  // Simulate Custom Chatbot Interaction for Advanced Math Queries
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const query = userQuestion;
    setChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuestion('');

    setTimeout(() => {
      let response = '';
      const lowQuery = query.toLowerCase();

      if (selectedHighlight) {
        const hl = currentStep.highlights[selectedHighlight];
        if (lowQuery.includes('why') || lowQuery.includes('reason')) {
          response = `Excellent mathematical query. In the context of **${hl.label}**, this formulation ensures total algebraic consistency on our finite causal graph. By parameterizing transition pathways, we avoid measure-theoretic complications (like weak convergence limits on Sobolev spaces), translating physical processes into manageable matrix transformations.`;
        } else if (lowQuery.includes('metric') || lowQuery.includes('distance')) {
          response = `The Erbar-Maas metric utilizes the Logarithmic Mean $\\Lambda(p_i, p_j)$ to scale spatial gradients. Under standard metrics, the speed of mass contraction does not match the scalar derivative of the Kullback-Leibler divergence. Logarithmic mobility serves as the missing link aligning probability curves to continuous thermodynamics.`;
        } else {
          response = `Fascinating observation regarding **${hl.label}**. Within our Continuous-Time Markov Chain (CTMC) setup, this operator determines topological mass redistribution. In step ${currentStepId + 1}, this algebraic behavior underpins the singular convergence theorem, proving that fast physical restoration (as $\\lambda \\to \\infty$) is equivalent to structural causal surgery.`;
        }
      } else {
        if (lowQuery.includes('surge') || lowQuery.includes('pearl')) {
          response = `Pearl surgery is causal, not probabilistic. It structuralizes external intervention by severing incoming causal vertices. Our proof demonstrates that this discontinuous "surgery" is mathematically equivalent to the continuous timescale limit of high-rate local stabilizers ($Q_\\lambda$).`;
        } else if (lowQuery.includes('gradient')) {
          response = `Indeed! Over a finite graph, continuous density trajectories follow paths of steepest descent. The choice of Erbar-Maas metric organizes graph coordinates as a curved manifold, so that linear relaxation under Q matches the natural informational compression path.`;
        } else {
          response = `Analyzing Step ${currentStepId + 1} (${currentStep.title}), we evaluate the interaction between generator elements and state dynamics. By tweaking variables like $\\lambda$ (the forcing rate) and simulation times ($t$), you can observe how the system collapses onto the targeted intervention face (State C). Let me know if you would like algebraic details of any highlighted factor!`;
        }
      }

      setChatHistory(prev => [...prev, { sender: 'tutor', text: response }]);
    }, 700);
  };

  // Render highlighted mathematical terms elegantly in interactive panels
  const renderMathFormula = () => {
    const rawLatex = currentStep.latex;
    const pieces = rawLatex.split(/(, | & |; )/);

    return (
      <div id="math-display" className="flex flex-wrap items-center justify-center gap-2 font-mono text-base md:text-xl text-stone-900 border-stone-200 border bg-[#FAF9F5] py-4 px-5 rounded-lg select-none shadow-inner w-full max-w-xl">
        {pieces.map((piece, i) => {
          const highlightKeys = Object.keys(currentStep.highlights);
          let matchFound = false;
          let matchedKey = '';

          for (const key of highlightKeys) {
            if (piece.includes(key)) {
              matchFound = true;
              matchedKey = key;
              break;
            }
          }

          if (matchFound) {
            const startIdx = piece.indexOf(matchedKey);
            const before = piece.substring(0, startIdx);
            const after = piece.substring(startIdx + matchedKey.length);

            return (
              <span key={i} className="flex items-center gap-1">
                {before && <span>{before}</span>}
                <button
                  id={`btn-hl-${matchedKey.replace(/\\|\s/g, '')}`}
                  onClick={() => handleSelectHighlight(matchedKey)}
                  onMouseEnter={() => setActiveBoardHighlight(matchedKey)}
                  onMouseLeave={() => setActiveBoardHighlight(null)}
                  className={`px-1.5 py-0.5 rounded transition-all duration-150 font-bold border ${
                    selectedHighlight === matchedKey
                      ? 'bg-nobel-gold/20 text-stone-950 border-nobel-gold scale-105 ring-2 ring-nobel-gold/40'
                      : activeBoardHighlight === matchedKey
                      ? 'bg-stone-200 border-stone-400 text-stone-950'
                      : 'bg-[#F2F0E8] border-dashed border-stone-350 text-stone-700 hover:border-stone-500 hover:bg-[#EAE8DF]'
                  } cursor-pointer text-xs md:text-sm`}
                  title="Click to discuss & highlight this formulation!"
                >
                  {matchedKey}
                </button>
                {after && <span>{after}</span>}
              </span>
            );
          }

          return <span key={i} className="text-xs md:text-sm font-semibold text-stone-800">{piece}</span>;
        })}
      </div>
    );
  };

  return (
    <div id="interactive-proof-lab" className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12">
      
      {/* Title & Introduction Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-nobel-gold/10 text-nobel-gold text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-3 border border-nobel-gold/20">
          <TrendingDown size={14} className="text-nobel-gold" /> Causal Modeling Limit
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-2">Erbar-Maas Singular Intervention Theorem</h2>
        <p className="text-stone-500 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Interactive theorem builder proving that Pearl’s discontinuous graph surgeries can be recovered exactly as the infinite-rate singular state perturbation of physical Continuous-Time Markov Chain (CTMC) models.
        </p>
      </div>

      {/* Main Flash-like Interface Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
        
        {/* Left Column: CTMC Animation, Matrix Display, State Graphs */}
        <div className="lg:col-span-7 bg-stone-950 rounded-2xl flex flex-col justify-between border border-stone-800 shadow-2xl relative overflow-hidden min-h-[560px]">
          
          {/* Subtle Dynamic Stage Gridlines Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40"></div>
          
          {/* Header Info Banner */}
          <div className="p-4 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-sm z-10 flex justify-between items-center text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-nobel-gold animate-pulse"></span>
              CTMC CAUSAL SIMULATOR 1.2
            </span>
            <span>SLIDE {currentStepId + 1} / {PROOF_STEPS.length}</span>
          </div>

          {/* Active Theorem Vector Board Arena */}
          <div className="flex-1 flex flex-col p-6 relative gap-6 z-10 justify-center">
            
            {/* Finite Causal Graph Visualization (States A, B, C) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Box A: The Visual Graph Map */}
              <div id="causal-graph-map" className="bg-stone-900/60 p-5 rounded-xl border border-stone-800 flex flex-col justify-center items-center h-64 relative">
                <span className="text-[9px] font-mono font-bold tracking-widest text-stone-400 uppercase absolute top-3 left-3">Finite Causal State Network</span>
                
                {/* Simulated Graph Workspace */}
                <div className="relative w-full h-full flex justify-around items-center">
                  
                  {/* Causal Node 1 (State A) */}
                  <div className="flex flex-col items-center absolute left-6 bottom-12">
                    <motion.div 
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                        currentPt[0] > 0.4 ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-lg' : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      A
                    </motion.div>
                    <span className="text-[10px] text-indigo-300 font-mono mt-1 font-semibold">{currentPt[0].toFixed(3)}</span>
                  </div>

                  {/* Causal Node 2 (State B) */}
                  <div className="flex flex-col items-center absolute right-6 bottom-12">
                    <motion.div 
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                        currentPt[1] > 0.4 ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-lg' : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      B
                    </motion.div>
                    <span className="text-[10px] text-indigo-300 font-mono mt-1 font-semibold">{currentPt[1].toFixed(3)}</span>
                  </div>

                  {/* Causal Node 3 - Intervened/Stabilized State C */}
                  <div className="flex flex-col items-center absolute top-6">
                    <motion.div 
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-[13px] font-mono font-black transition-all duration-300 relative ${
                        currentStepId >= 3 
                          ? 'bg-amber-900/80 border-amber-400 text-white ring-4 ring-amber-500/20' 
                          : currentPt[2] > 0.4 
                          ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-lg' 
                          : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      C
                      {currentStepId >= 3 && (
                        <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 bg-amber-500 text-stone-950 font-bold text-[8px] rounded-full uppercase tracking-wider font-mono">DO</span>
                      )}
                    </motion.div>
                    <span className="text-[10px] text-amber-300 font-mono mt-1 font-semibold">{currentPt[2].toFixed(3)}</span>
                  </div>

                  {/* Dynamic Causal Directional Lines / Flux Arrows */}
                  <svg className="w-full h-full absolute inset-0 pointer-events-none select-none z-0">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
                      </marker>
                      <marker id="arrow-blue" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                      </marker>
                    </defs>

                    {/* Transition from A to C: Severed completely in surgical state do-intervention */}
                    {currentStepId < 3 ? (
                      <line x1="60" y1="170" x2="160" y2="70" stroke="#818cf8" strokeWidth="2.0" markerEnd="url(#arrow-blue)" className="opacity-70 animate-pulse" />
                    ) : currentStepId >= 4 ? (
                      // Display forcing restoration under high lamda values
                      <line x1="60" y1="170" x2="160" y2="70" stroke="#f59e0b" strokeWidth={Math.min(5, 1+lambda/5)} strokeDasharray="3,3" markerEnd="url(#arrow)" className="opacity-90 transition-all duration-300" />
                    ) : (
                      // Explicit surgery cut
                      <line x1="60" y1="170" x2="160" y2="70" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" className="opacity-30" />
                    )}

                    {/* Transition from B to C: Severed in do-intervention */}
                    {currentStepId < 3 ? (
                      <line x1="260" y1="170" x2="160" y2="70" stroke="#818cf8" strokeWidth="2.0" markerEnd="url(#arrow-blue)" className="opacity-70" />
                    ) : currentStepId >= 4 ? (
                      <line x1="260" y1="170" x2="160" y2="70" stroke="#f59e0b" strokeWidth={Math.min(5, 1+lambda/5)} strokeDasharray="3,3" markerEnd="url(#arrow)" className="opacity-90 transition-all duration-300" />
                    ) : (
                      <line x1="260" y1="170" x2="160" y2="70" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" className="opacity-30" />
                    )}

                    {/* Symmetric dynamic base connection between A and B */}
                    <line x1="100" y1="190" x2="220" y2="190" stroke="#818cf8" strokeWidth="1.5" className="opacity-80" />
                  </svg>

                </div>

                {/* Legend Badge */}
                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-stone-500">
                  {currentStepId >= 3 ? 'C causal inputs severed' : 'Standard reversible paths'}
                </div>
              </div>

              {/* Box B: Generator Matrix Q Heatmap Details */}
              <div id="generator-heatmap-detail" className="bg-stone-900/60 p-5 rounded-xl border border-stone-800 flex flex-col h-64 relative justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-stone-400 uppercase">Active Matrix Algebra</span>
                  <p className="text-[10px] text-stone-500 font-mono mt-1.5 uppercase">
                    {currentStepId <= 2 ? 'Reversible Generator Q' : currentStepId === 3 ? 'Surgical Generator Q_do' : `Perturbed Q_λ (λ = ${lambda})`}
                  </p>
                </div>

                {/* Elegant Numerical Matrix Layout */}
                <div className="my-auto font-mono text-xs md:text-sm text-center text-stone-200 grid grid-cols-3 gap-2 bg-stone-950/80 p-3 rounded-lg border border-stone-800 shadow-inner">
                  {activeQ.map((rowArr, rIdx) => 
                    rowArr.map((cellVal, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`} 
                        className={`py-1.5 rounded transition-colors duration-300 font-bold ${
                          cellVal < 0 
                            ? 'bg-rose-950/20 text-rose-400 border border-rose-900/40' 
                            : cellVal > 1.5 
                            ? 'bg-amber-950/30 text-amber-300 border border-amber-900/30' 
                            : 'bg-stone-900/50 text-stone-400 border border-stone-800'
                        }`}
                      >
                        {cellVal.toFixed(3)}
                      </div>
                    ))
                  )}
                </div>

                {/* Physical Slider adjustments only when we are in singular perturbation steps */}
                {currentStepId >= 4 && (
                  <div className="flex flex-col gap-1 text-[10px] font-mono mt-1">
                    <div className="flex justify-between text-stone-400 font-bold text-[9px]">
                      <span>RESTORATIVE RATE λ (Forcing Power):</span>
                      <span className="text-amber-400 font-bold">λ = {lambda}</span>
                    </div>
                    <input 
                      id="forcing-power-slider"
                      type="range"
                      min="1"
                      max="40"
                      step="1"
                      value={lambda}
                      onChange={(e) => setLambda(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Simulated Live Evolution Information Monitor */}
            <div id="simulation-monitor" className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-950/80 border border-stone-800 p-4 rounded-xl backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-semibold">Active Simulation Time t</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <input 
                    id="simulation-time-slider"
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="flex-1 accent-indigo-500 h-1 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-stone-200 font-bold transition-all w-8 text-right">{currentTime.toFixed(1)}s</span>
                </div>
              </div>

              <div className="flex flex-col justify-center border-l md:border-l border-stone-800 pl-4">
                <span className="text-[9px] font-mono text-stone-400 uppercase">Information Entropy H(p|π)</span>
                <span className="text-sm font-mono mt-1 text-emerald-400 font-black tracking-wide">
                  {computedEntropy.toFixed(5)} nats
                </span>
              </div>

              <div className="flex flex-col justify-center border-l border-stone-800 pl-4">
                <span className="text-[9px] font-mono text-stone-400 uppercase">State-Space Mass</span>
                <span className="text-sm font-mono mt-1 text-indigo-400 font-semibold">
                  A: {(currentPt[0]*100).toFixed(0)}% • B: {(currentPt[1]*100).toFixed(0)}% • C: {(currentPt[2]*100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Slider Explanation Banner */}
            <div className="text-center w-full bg-stone-950/50 border border-stone-800/40 p-4 rounded-xl backdrop-blur-md">
              <h3 className="font-serif text-base text-white mb-2">{currentStep.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">{currentStep.explanation}</p>
            </div>

          </div>

          {/* Scrubber Timeline & Player Control Rails */}
          <div className="p-4 bg-stone-950 border-t border-stone-800 mt-auto z-10">
            
            {/* Scrubber Progression dots */}
            <div className="px-2 mb-3.5 flex items-center justify-between gap-3 select-none">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-black">1. BASE STOCHASTICS</span>
              <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden relative flex mx-2">
                {PROOF_STEPS.map((stepData, idx) => (
                  <button
                    id={`dot-seek-${idx}`}
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepId(idx);
                    }}
                    className={`h-full flex-1 border-r border-stone-900 transition-colors duration-200 relative cursor-pointer ${
                      idx <= currentStepId ? 'bg-nobel-gold' : 'bg-stone-800 hover:bg-stone-700'
                    }`}
                    title={`Seek: ${stepData.title}`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-black">7. CAUSAL LIMIT</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Media Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-prev-step"
                  onClick={handlePrev}
                  disabled={currentStepId === 0}
                  className="p-2 border border-stone-850 bg-stone-900/40 rounded-lg hover:bg-stone-800 disabled:opacity-30 text-stone-300 disabled:pointer-events-none cursor-pointer"
                  title="Previous Slide"
                >
                  <ArrowLeft size={16} />
                </button>

                <button
                  id="btn-autoplay-toggle"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 ${
                    isPlaying 
                      ? 'bg-nobel-gold/10 text-nobel-gold border border-nobel-gold/30 hover:bg-nobel-gold/20 animate-pulse' 
                      : 'bg-nobel-gold text-stone-950 hover:bg-nobel-gold/90'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={14} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Auto-Play
                    </>
                  )}
                </button>

                <button
                  id="btn-next-step"
                  onClick={handleNext}
                  disabled={currentStepId === PROOF_STEPS.length - 1}
                  className="p-2 border border-stone-850 bg-stone-900/40 rounded-lg hover:bg-stone-800 disabled:opacity-30 text-stone-300 disabled:pointer-events-none cursor-pointer"
                  title="Next Slide"
                >
                  <ArrowRight size={16} />
                </button>

                <button
                  id="btn-reset-timeline"
                  onClick={handleReset}
                  className="p-2 border border-stone-850 bg-stone-900/40 rounded-lg hover:bg-stone-800 text-stone-400 cursor-pointer"
                  title="Reset Simulator Settings"
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              {/* Speed Controller */}
              {isPlaying && (
                <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                  <span>AUTOPLAY LAPSE:</span>
                  <input
                    type="range"
                    min="2000"
                    max="8000"
                    step="500"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-16 accent-nobel-gold cursor-pointer"
                  />
                  <span>{(speed / 1000).toFixed(1)}s</span>
                </div>
              )}

              {/* Slide Scene Dropdown Quick-Jump */}
              <div className="text-xs font-mono text-stone-400 flex items-center gap-1">
                <span>STAGE:</span>
                <select 
                  id="scene-selection-dropdown"
                  value={currentStepId} 
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStepId(Number(e.target.value));
                  }}
                  className="bg-stone-900 border border-stone-800 py-1.5 px-2 rounded-lg text-stone-200 focus:outline-none focus:border-nobel-gold text-xs font-bold"
                >
                  {PROOF_STEPS.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      {idx + 1}. {s.title}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Theorems Context, Math Algebra Box, definitions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Box 1: Supporting Theoretical Knowledge Base Card */}
          <div id="theory-knowledge-card" className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col shadow-sm">
            <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-nobel-gold" />
              Dynamic Knowledge Base
            </h3>
            
            {/* Step specific tabs references */}
            <div className="flex flex-wrap gap-1.5 mb-4 select-none">
              {currentStep.concepts.map((conceptKey) => {
                const concept = SUPPORTING_CONCEPTS[conceptKey];
                return (
                  <button
                    id={`concept-tab-${concept.id}`}
                    key={concept.id}
                    onClick={() => setActiveConceptTab(concept.id)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border transition-all duration-200 cursor-pointer ${
                      activeConceptTab === concept.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {concept.title}
                  </button>
                );
              })}
            </div>

            {/* Supporting definition detail element */}
            <div id="concept-details-container" className="flex-1 bg-stone-50 border border-stone-200/60 rounded-xl p-4 flex flex-col justify-between min-h-[180px]">
              {activeConceptTab && SUPPORTING_CONCEPTS[activeConceptTab] ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono tracking-wider text-nobel-gold font-bold uppercase">
                        {SUPPORTING_CONCEPTS[activeConceptTab].type}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono font-bold uppercase">MAAS-GRID</span>
                    </div>
                    <h4 className="font-serif text-base text-stone-900 font-bold mb-1.5">
                      {SUPPORTING_CONCEPTS[activeConceptTab].title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {SUPPORTING_CONCEPTS[activeConceptTab].content}
                    </p>
                  </div>
                  {SUPPORTING_CONCEPTS[activeConceptTab].math && (
                    <div className="mt-3 bg-[#F3F2EC] py-2 px-3 rounded font-mono text-xs text-stone-850 text-center border border-stone-200/50">
                      {SUPPORTING_CONCEPTS[activeConceptTab].math}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-stone-400 italic text-center my-auto">Select a core concept above to visualize details.</p>
              )}
            </div>
          </div>

          {/* Box 2: LaTeX Structural Equation Display panel */}
          <div id="equation-display-container" className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center justify-center shadow-sm relative">
            <div className="absolute top-3 right-3 text-[8px] font-mono text-stone-400 bg-stone-50 border px-2 py-0.5 rounded tracking-widest uppercase font-bold">Algebraic Proof Face</div>
            <h4 className="font-serif text-xs text-stone-500 uppercase tracking-widest mb-3.5 text-center">Active Mathematical Statement</h4>
            {renderMathFormula()}
            <p className="text-[9px] text-stone-400 text-center mt-3 leading-relaxed">
              <Info size={10} className="inline mr-1" /> Anchor nodes: click any <span className="border-b border-dashed border-stone-400 text-stone-700 font-medium">underlined algebraic sequence</span> above to toggle detailed tutoring.
            </p>
          </div>

          {/* Box 3: Logarithmic Mean Real-Time Calculator Widget */}
          <div id="log-mean-calculator-widget" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h4 className="font-serif text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5 border-b pb-2">
              <Settings size={15} className="text-nobel-gold" />
              Erbar-Maas Edge Mobility Calculator
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
              Continuous entropy trajectories evaluate edge weights using the Logarithmic Mean Λ(p_i, p_j). Compute live values between hypothetical state density distributions:
            </p>
            
            <div className="flex gap-4 items-center justify-between">
              <div className="flex flex-col gap-1 w-5/12">
                <span className="text-[9px] font-mono text-stone-400">DENSITY P_A:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-stone-700">0.05</span>
                  <input 
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={initialP[0]}
                    disabled // bonded to system value
                    className="w-full accent-nobel-gold h-1"
                  />
                  <span className="text-[11px] font-mono font-bold text-stone-750">0.95</span>
                </div>
                <div className="text-center font-mono font-bold text-xs mt-1 bg-stone-50 py-1 rounded border">
                  p_A = {currentPt[0].toFixed(3)}
                </div>
              </div>

              <div className="text-stone-300 font-black text-xl italic pt-2">↔</div>

              <div className="flex flex-col gap-1 w-5/12">
                <span className="text-[9px] font-mono text-stone-400">DENSITY P_B:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-stone-700">0.05</span>
                  <input 
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={initialP[1]}
                    disabled
                    className="w-full accent-nobel-gold h-1"
                  />
                  <span className="text-[11px] font-mono font-bold text-stone-750">0.95</span>
                </div>
                <div className="text-center font-mono font-bold text-xs mt-1 bg-stone-50 py-1 rounded border">
                  p_B = {currentPt[1].toFixed(3)}
                </div>
              </div>
            </div>

            <div className="mt-4 bg-stone-900 leading-relaxed rounded-xl p-3 text-center border text-white text-xs font-mono">
              <span className="text-stone-400">Λ(p_A, p_B) = </span>
              <span className="font-bold text-amber-300 text-sm">
                {logarithmicMean(currentPt[0], currentPt[1]).toFixed(6)}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Discussion Chatbot Q&A Drawer (appears dynamically upon click of highlights) */}
      <AnimatePresence>
        {selectedHighlight && currentStep.highlights[selectedHighlight] && (
          <motion.div
            id="tutor-discussion-drawer"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 items-stretch"
          >
            {/* Left Column context overview */}
            <div className="md:col-span-4 p-6 bg-stone-50 border-r border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider text-nobel-gold font-bold uppercase mb-1 block">Active Mathematical Factor</span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  {currentStep.highlights[selectedHighlight].label}
                </h3>
                <div className="w-12 h-0.5 bg-nobel-gold mb-4"></div>
                <p className="text-[10px] font-mono uppercase font-black text-stone-500 mb-3 tracking-widest">
                  ALGEBRAIC ROLE: <span className="text-amber-700">{currentStep.highlights[selectedHighlight].role}</span>
                </p>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {currentStep.highlights[selectedHighlight].details}
                </p>
              </div>

              {/* Close Button */}
              <button
                id="btn-close-highlight"
                onClick={() => setSelectedHighlight(null)}
                className="mt-6 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-850 transition-colors cursor-pointer self-start uppercase tracking-wider"
              >
                Clear Highlight
              </button>
            </div>

            {/* Right Chat Dialog pane */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between max-h-[480px]">
              
              <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5 select-none">
                  <MessageSquare size={16} className="text-nobel-gold" />
                  Algebraic Tutor & Q&A Discussion
                </h4>
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold">VIRTUAL COACH</span>
              </div>

              {/* Dynamic scrollable Chat history */}
              <div id="comment-chat-history" className="flex-1 overflow-y-auto min-h-[160px] max-h-[220px] bg-stone-50 rounded-xl p-4 border border-stone-200/50 flex flex-col gap-3 font-sans mb-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                      {msg.sender === 'user' ? 'Your Query' : 'Mathematics Explainer'}
                    </span>
                    <div className={`p-3 text-xs rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-nobel-gold text-white rounded-tr-none font-medium' 
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested pre-coded questions for high-speed discussion assistance */}
              <div id="faq-shortcuts-area" className="mb-4">
                <span className="text-[9px] font-bold font-mono tracking-widest text-stone-400 uppercase block mb-1.5">Direct Explanatory Inquiries:</span>
                <div className="flex flex-col gap-1.5 pb-1 max-h-[120px] overflow-y-auto">
                  {currentStep.highlights[selectedHighlight].faq.map((item, idx) => (
                    <button
                      id={`faq-shortcut-${idx}`}
                      key={idx}
                      onClick={() => handleFaqClick(item.q, item.a)}
                      className="text-left text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-lg p-2 flex items-center transition-all duration-150 group cursor-pointer text-stone-700"
                    >
                      <ChevronRight size={12} className="text-nobel-gold group-hover:translate-x-0.5 transition-transform mr-1.5 flex-shrink-0" />
                      <span className="font-medium">{item.q}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat send element for custom student inquiries */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  id="custom-math-query-input"
                  type="text"
                  placeholder="Ask a custom question regarding this theorem structure..."
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-205 py-2 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-nobel-gold focus:border-nobel-gold text-stone-850"
                />
                <button
                  id="btn-submit-tutor"
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <Send size={12} /> Send
                </button>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standby notice explaining how to run highlighted discussions */}
      {!selectedHighlight && (
        <div id="standby-notice-container" className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-nobel-gold/10 text-nobel-gold rounded-full border border-nobel-gold/20 flex-shrink-0">
              <Lightbulb size={24} className="animate-pulse text-nobel-gold" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-stone-900 font-bold mb-1">Click Algebraic Statements to Discuss</h4>
              <p className="text-xs text-stone-500 max-w-xl leading-relaxed font-sans">
                We have embedded active highlighted anchors inside the math formulations. Click any underlined statement in the active math block to open the interactive discussion tutor.
              </p>
            </div>
          </div>
          <button 
            id="btn-discover-anchor"
            onClick={() => {
              const keys = Object.keys(currentStep.highlights);
              if (keys.length > 0) {
                handleSelectHighlight(keys[0]);
              }
            }}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer tracking-wider uppercase flex items-center gap-1.5"
          >
            <Zap size={14} /> Quick Demo Highlight
          </button>
        </div>
      )}

    </div>
  );
};
