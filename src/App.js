import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import {
  Brain,
  Users,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Clipboard,
  Save,
  Trash2,
  CheckCircle,
  Sparkles,
  Zap,
  Heart,
  Target
} from 'lucide-react';

export default function BehaviorAnalyzer() {
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [toast, setToast] = useState(null);
  const [savedInsights, setSavedInsights] = useState([]);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // Interactive UI states
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [savingPulse, setSavingPulse] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Move behaviorPatterns to useCallback to memoize it
  const behaviorPatterns = useCallback(() => ({
    conformity: {
      keywords: ['agree', 'group', 'fit in', 'peer pressure', 'same as others', 'follow'],
      behaviorType: 'Social Conformity',
      emoji: '👥',
      color: 'from-blue-500 to-cyan-500',
      keyPatterns: [
        'Modifying behavior to match group expectations',
        'Suppressing personal opinions to maintain harmony',
        'Seeking acceptance through behavioral alignment'
      ],
      psychologicalPrinciples: ['Social Proof (Cialdini)', 'Normative Social Influence', 'Groupthink'],
      motivations:
        'Driven by the fundamental human need for belonging and acceptance. Fear of rejection or social exclusion often overrides personal conviction.',
      predictions:
        'May lead to suppressed individuality, reduced innovation in group settings, and potential resentment. Long-term conformity can erode self-confidence and authentic expression.',
      suggestions:
        'Create psychologically safe environments where dissent is valued. Encourage anonymous feedback mechanisms. Practice and reward independent thinking before group discussions.'
    },
    phoneAddiction: {
      keywords: ['phone', 'check', 'scroll', 'social media', 'notification', 'screen'],
      behaviorType: 'Digital Compulsion',
      emoji: '📱',
      color: 'from-purple-500 to-pink-500',
      keyPatterns: [
        'Habitual checking behavior triggered by anxiety or boredom',
        'Variable reward seeking (likes, messages, updates)',
        'Displacement activity to avoid present moment discomfort'
      ],
      psychologicalPrinciples: ['Variable Ratio Reinforcement Schedule', 'Fear of Missing Out (FOMO)', 'Dopamine-driven feedback loops'],
      motivations:
        'Smartphones provide intermittent rewards that are highly addictive. Each check offers potential novelty or social validation, creating a dopamine cycle. Also serves as an escape from uncertainty.',
      predictions:
        'Decreased attention span, reduced quality of face-to-face interactions, increased anxiety when device is unavailable, and diminished ability to tolerate boredom or uncertainty.',
      suggestions:
        'Implement "phone stacking" during conversations. Use app timers and grayscale mode. Practice mindfulness techniques. Schedule specific "check-in" times rather than constant monitoring.'
    },
    surveillance: {
      keywords: ['watching', 'manager', 'boss', 'harder when', 'observed', 'monitoring'],
      behaviorType: 'Hawthorne Effect',
      emoji: '👁️',
      color: 'from-orange-500 to-red-500',
      keyPatterns: [
        'Performance increases under observation',
        'Motivation shifts from intrinsic to extrinsic',
        'Behavior modification based on perceived expectations'
      ],
      psychologicalPrinciples: ['Hawthorne Effect', 'Social Facilitation', 'Self-Presentation Theory'],
      motivations:
        'Awareness of being observed triggers heightened self-awareness and desire to meet perceived standards. Performance becomes about impression management rather than intrinsic task engagement.',
      predictions:
        'Decreased autonomous motivation over time. Performance may drop when surveillance ends. Can create anxiety and reduce workplace satisfaction if sustained.',
      suggestions:
        'Build trust-based rather than surveillance-based management systems. Focus on outcomes over activities. Develop intrinsic motivation through autonomy, mastery, and purpose.'
    },
    scarcity: {
      keywords: ['limited', 'scarce', 'running out', 'last chance', 'exclusive', 'urgent'],
      behaviorType: 'Scarcity-Driven Decision Making',
      emoji: '⏰',
      color: 'from-yellow-500 to-orange-500',
      keyPatterns: [
        'Accelerated decision-making under perceived scarcity',
        'Increased perceived value of limited resources',
        'Bypassing rational evaluation processes'
      ],
      psychologicalPrinciples: ['Scarcity Heuristic', 'Loss Aversion', 'Reactance Theory'],
      motivations:
        'Scarcity triggers primal survival instincts and loss aversion. The fear of missing out on a limited opportunity overrides careful deliberation. Urgency short-circuits normal decision-making.',
      predictions:
        "May lead to impulsive purchases, buyer's remorse, and decisions misaligned with actual needs. Can create artificial urgency that damages trust when overused.",
      suggestions:
        'Use ethical scarcity only when genuine. For consumers: implement cooling-off periods for urgent decisions. Ask "Would I buy this without the time pressure?" For marketers: balance urgency with transparency.'
    },
    defensive: {
      keywords: ['defensive', 'feedback', 'criticism', 'reject', 'excuse', 'blame'],
      behaviorType: 'Defensive Reactivity',
      emoji: '🛡️',
      color: 'from-red-500 to-pink-500',
      keyPatterns: [
        'Automatic self-protection response to perceived threat',
        'Cognitive dissonance reduction through rationalization',
        'External attribution of negative outcomes'
      ],
      psychologicalPrinciples: ['Ego Defense Mechanisms', 'Cognitive Dissonance', 'Attribution Bias'],
      motivations:
        'Feedback threatens self-image and triggers protective mechanisms. The brain perceives criticism as a threat to identity, activating fight-or-flight responses before rational processing occurs.',
      predictions:
        "Missed growth opportunities, strained relationships, reputation as someone who can't receive feedback. Over time, isolation from honest communication and stunted professional development.",
      suggestions:
        'Practice the "2-second pause" before responding to feedback. Separate feedback on actions from threats to identity. Use "feedback journaling" to reflect later when emotions settle. Create psychological safety.'
    },
    procrastination: {
      keywords: ['delay', 'procrastinate', 'put off', 'later', 'avoid', 'deadline'],
      behaviorType: 'Task Avoidance & Procrastination',
      emoji: '🐌',
      color: 'from-green-500 to-emerald-500',
      keyPatterns: [
        'Present bias favoring immediate gratification over future benefits',
        'Anxiety or perfectionism creating avoidance behavior',
        'Temporal discounting of future consequences'
      ],
      psychologicalPrinciples: ['Present Bias', 'Temporal Discounting', 'Anxiety-Driven Avoidance'],
      motivations:
        'Often stems from fear of failure, perfectionism, or task aversiveness rather than laziness. The brain prioritizes immediate emotional relief over future rewards, creating a cycle of short-term gains.',
      predictions:
        'Increased stress as deadlines approach, reduced quality of work, self-criticism and decreased self-efficacy. Can become a self-fulfilling prophecy where procrastination confirms negative beliefs.',
      suggestions:
        'Use the "2-minute rule" to overcome initial resistance. Break tasks into smaller, concrete actions. Time-box work sessions. Address underlying anxiety or perfectionism through self-compassion.'
    },
    mirroring: {
      keywords: ['copy', 'mirror', 'imitate', 'mimic', 'same body language', 'match'],
      behaviorType: 'Behavioral Mirroring & Rapport',
      emoji: '🪞',
      color: 'from-indigo-500 to-purple-500',
      keyPatterns: [
        'Unconscious mimicry of gestures and speech patterns',
        'Synchronization building interpersonal connection',
        'Chameleon effect in social interactions'
      ],
      psychologicalPrinciples: ['Chameleon Effect', 'Mirror Neurons', 'Rapport Building'],
      motivations:
        'Automatic neural response that builds empathy and connection. Mirroring signals "I\'m like you" at a subconscious level, reducing social distance and increasing trust and liking.',
      predictions:
        'Enhanced relationship building, increased persuasiveness, and social influence. Authentic mirroring strengthens bonds; deliberate manipulation can backfire if detected.',
      suggestions:
        'Allow natural mirroring in genuine conversations. Be aware of your own mirroring tendencies. In professional settings, use subtle matching to build rapport. Avoid excessive or obvious mirroring.'
    },
    anchoring: {
      keywords: ['first', 'initial', 'starting point', 'reference', 'comparison', 'anchor'],
      behaviorType: 'Cognitive Anchoring Bias',
      emoji: '⚓',
      color: 'from-cyan-500 to-blue-500',
      keyPatterns: [
        'Heavy reliance on first piece of information received',
        'Insufficient adjustment from initial anchor',
        'Arbitrary numbers influencing subsequent judgments'
      ],
      psychologicalPrinciples: ['Anchoring Bias', 'Insufficient Adjustment', 'Priming Effects'],
      motivations:
        'The brain uses mental shortcuts to process information efficiently. Initial information creates a reference point that disproportionately influences subsequent judgments, even when the anchor is arbitrary.',
      predictions:
        'Systematic bias in negotiations, pricing decisions, and estimates. Can be exploited in sales and marketing. Leads to suboptimal decisions when anchors are misleading.',
      suggestions:
        'Actively seek multiple reference points before making decisions. Question the source and relevance of initial information. In negotiations, consider making the first offer to set the anchor.'
    }
  }), []);

  const analyzeBehavior = useCallback((inputText = null) => {
    const text = (inputText ?? scenario ?? '').trim();
    if (!text) return;

    setLoading(true);
    setAnalysis(null);
    setMatchedKeywords([]);
    setToast(null);

    // Fake processing / simulate progress
    setTimeout(() => {
      const lowerScenario = text.toLowerCase();
      const patterns = behaviorPatterns();

      // Find best matching pattern
      let bestMatch = null;
      let maxMatches = 0;
      let bestMatchedKeywords = [];

      for (const pattern of Object.values(patterns)) {
        const matches = pattern.keywords.filter((keyword) => lowerScenario.includes(keyword));
        if (matches.length > maxMatches) {
          maxMatches = matches.length;
          bestMatch = pattern;
          bestMatchedKeywords = matches;
        }
      }

      // Default analysis if no strong match
      if (!bestMatch) {
        bestMatch = {
          behaviorType: 'General Human Behavior',
          emoji: '🧠',
          color: 'from-slate-500 to-gray-500',
          keyPatterns: [
            'Complex interaction of cognitive, emotional, and social factors',
            'Influenced by context, past experiences, and current needs',
            'Rational and irrational elements combining in decision-making'
          ],
          psychologicalPrinciples: ['Cognitive-Behavioral Theory', 'Social Learning Theory', 'Motivation Theory'],
          motivations:
            'Human behavior is multi-determined, arising from biological drives, learned patterns, social context, and cognitive processing. Understanding requires examining the interplay of these factors.',
          predictions:
            'Behavior tends to persist when reinforced and diminish when consequences are negative. Context changes can shift patterns. Self-awareness and intentional practice can modify habitual responses.',
          suggestions:
            'Start by identifying triggers and patterns. Consider what needs the behavior serves. Experiment with alternative responses. Seek feedback from trusted others. Professional guidance can help.'
        };
        bestMatchedKeywords = [];
      }

      setAnalysis(bestMatch);
      setMatchedKeywords(bestMatchedKeywords);

      // Finish progress
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setToast('✨ Analysis complete!');
        // brief celebratory animation
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
      }, 350);
    }, 900);
  }, [scenario, behaviorPatterns]);

  // Auto-analyze (debounced) when enabled
  useEffect(() => {
    if (!autoAnalyze) return;
    if (!scenario.trim()) return;
    const id = setTimeout(() => analyzeBehavior(scenario), 600);
    return () => clearTimeout(id);
  }, [scenario, autoAnalyze, analyzeBehavior]);

  // Load saved insights on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('behavioriq.savedInsights');
      if (raw) setSavedInsights(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load saved insights', e);
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(6);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return Math.min(92, p + Math.random() * 12);
      });
    }, 200);

    return () => clearInterval(progressRef.current);
  }, [loading]);

  const exampleScenarios = [
    "Someone always agrees with the group even when they disagree privately",
    "A person checks their phone every few minutes despite being in conversation",
    "An employee works harder when their manager is watching",
    "A customer buys more when they see 'limited time offer'"
  ];

  const onKeyDownHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      analyzeBehavior();
    }
  };

  const copyToClipboard = async (text, label = '') => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`✅ ${label || 'Copied to clipboard'}`);
    } catch (e) {
      setToast('❌ Unable to copy');
    }
  };

  const saveInsight = () => {
    if (!analysis) return;
    const item = {
      id: Date.now(),
      title: analysis.behaviorType,
      scenario: scenario,
      analysis,
      savedAt: new Date().toISOString()
    };
    const next = [item, ...savedInsights].slice(0, 20);
    setSavedInsights(next);
    localStorage.setItem('behavioriq.savedInsights', JSON.stringify(next));
    setToast('💾 Insight saved!');
    setSavingPulse(true);
    setTimeout(() => setSavingPulse(false), 700);
  };

  const removeInsight = (id) => {
    const next = savedInsights.filter((s) => s.id !== id);
    setSavedInsights(next);
    localStorage.setItem('behavioriq.savedInsights', JSON.stringify(next));
    setToast('🗑️ Removed');
  };

  // Confetti component (small CSS-based celebration)
  const Confetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#f43f5e'];
    return (
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{ left: `${(i / 15) * 100}%`, backgroundColor: colors[i % colors.length] }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-200 to-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          {celebrate && <Confetti />}
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg blur opacity-75 animate-pulse" />
              <div className="relative bg-white px-6 py-3 rounded-lg">
                <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-2 icon-bounce" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-800 mb-3 gradient-title">
            BehaviorIQ
          </h1>
          <p className="text-lg text-gray-600 font-medium tracking-wide">AI-Powered Human Behavior Analysis 🧬</p>
          <p className="text-sm text-indigo-600 mt-2">Understand the psychology behind every action</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 bg-white/80 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/20">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${activeTab === 'analyze'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${activeTab === 'insights'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Learn
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'analyze' ? (
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 relative border border-white/20 card-hover">
              {/* Progress bar */}
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-t-2xl overflow-hidden">
                <div
                  className="h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 progress-bar shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <label className="block text-gray-800 font-bold mb-3 text-lg">🎯 Describe a behavior or scenario:</label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                onKeyDown={onKeyDownHandler}
                placeholder="Example: A team member becomes defensive when receiving constructive feedback..."
                className="w-full h-32 p-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none bg-indigo-50/50 text-gray-800 placeholder-gray-500 font-medium transition-all"
                aria-label="Behavior scenario input"
              />

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-semibold mr-2">💡 Try these:</span>
                {exampleScenarios.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setScenario(example);
                      analyzeBehavior(example);
                    }}
                    className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1.5 rounded-full hover:shadow-md keyword-animate font-medium border border-indigo-200 hover:border-indigo-400"
                    title={`Use example: ${example}`}
                  >
                    {example.slice(0, 35)}...
                  </button>
                ))}

                <button
                  onClick={() => {
                    setScenario('');
                    setAnalysis(null);
                    setMatchedKeywords([]);
                    setToast('🗑️ Input cleared');
                  }}
                  className="ml-auto text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 font-medium border border-gray-300 transition-all"
                >
                  Clear
                </button>
              </div>

              {/* Shortcut hint & Auto-analyze toggle */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-600 font-semibold">⌨️ Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-800 font-bold">Ctrl/Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-800 font-bold">Enter</kbd> to analyze</div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 font-semibold">⚡ Auto-analyze</div>
                  <button
                    onClick={() => setAutoAnalyze(!autoAnalyze)}
                    aria-pressed={autoAnalyze}
                    className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all ${autoAnalyze ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300'} shadow-md`}
                    title="Toggle auto analyze"
                  >
                    <span className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-transform ${autoAnalyze ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => analyzeBehavior()}
                  disabled={loading || !scenario.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 text-lg"
                >
                  {loading ? '🔄 Analyzing...' : '🚀 Analyze Behavior'}
                </button>

                <button
                  onClick={() => copyToClipboard(scenario, 'Scenario')}
                  disabled={!scenario.trim()}
                  className="flex items-center gap-2 px-4 rounded-xl border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-all font-semibold disabled:opacity-50"
                  title="Copy scenario"
                >
                  <Clipboard className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            {/* Results Section */}
            {analysis && (
              <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 relative result-slide">
                {/* Emoji icon with glow */}
                <div className="absolute -top-6 right-8 text-5xl animate-bounce">
                  {analysis.emoji}
                </div>

                {/* celebratory icon */}
                <div className="absolute -top-4 left-8">
                  <CheckCircle className="w-10 h-10 text-green-500 animate-pulse" />
                </div>

                {/* Behavior Type with gradient background */}
                <div className={`bg-gradient-to-r ${analysis.color} rounded-xl p-6 text-white shadow-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6" />
                    <h3 className="font-black text-xl">Behavior Pattern Detected</h3>
                  </div>
                  <p className="text-3xl font-black">{analysis.behaviorType}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => copyToClipboard(analysis.behaviorType, 'Behavior type')}
                      className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                      title="Copy behavior type"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                    <button
                      onClick={saveInsight}
                      className={`text-white hover:bg-white/20 p-2 rounded-lg transition-all ${savingPulse ? 'animate-save-pulse' : ''}`}
                      title="Save insight"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Key Patterns */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-600 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-black text-lg text-gray-800">🎯 Key Patterns</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.keyPatterns.map((pattern, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-700">
                        <span className="text-purple-600 font-bold">→</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Matched keywords */}
                  {matchedKeywords.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">🔍 Matched keywords:</div>
                      <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((kw, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const appended = scenario ? `${scenario} ${kw}` : kw;
                              setScenario(appended);
                              analyzeBehavior(appended);
                            }}
                            className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1.5 rounded-full hover:shadow-lg keyword-animate font-bold border border-purple-300 hover:border-purple-500 transform hover:scale-110"
                            title={`Add "${kw}" to the scenario and re-run`}
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Psychology section */}
                <div className="bg-gradient-to-br from-pink-50 to-red-50 border-l-4 border-pink-600 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-pink-600" />
                    <h3 className="font-black text-lg text-gray-800">🧠 Psychological Principles</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.psychologicalPrinciples.map((principle, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-700">
                        <span className="text-pink-600 font-bold">•</span>
                        <span className="font-semibold">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Motivations and Predictions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                    <h4 className="font-black text-gray-800 mb-2 flex items-center gap-2">💭 Underlying Motivations</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{analysis.motivations}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
                    <h4 className="font-black text-gray-800 mb-2 flex items-center gap-2">🔮 Likely Outcomes</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{analysis.predictions}</p>
                  </div>
                </div>

                {/* Actionable Insights */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-2xl transform hover:scale-102 transition-transform">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5" />
                    <h3 className="font-black text-lg">✨ Actionable Insights</h3>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-white flex-1 leading-relaxed font-medium">{analysis.suggestions}</p>
                    <button
                      onClick={() => copyToClipboard(analysis.suggestions, 'Insights')}
                      className="p-2 rounded-lg bg-white text-indigo-700 hover:bg-white/90 transition-all flex-shrink-0 font-bold"
                      title="Copy insights"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Insights */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">💾 Saved Insights</h3>
                <div className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{savedInsights.length} saved</div>
              </div>

              {savedInsights.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-semibold">No saved insights yet — save useful analyses to revisit them later 💡</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedInsights.map((s) => (
                    <li key={s.id} className="flex items-start gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-800">{s.title}</div>
                          <div className="text-xs text-gray-500 font-semibold">{new Date(s.savedAt).toLocaleString()}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 italic">{s.scenario}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(s.analysis, null, 2), 'Saved insight')}
                            className="text-xs bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-300 font-bold transition-all"
                          >
                            <Clipboard className="w-3 h-3 inline mr-1" /> Copy
                          </button>
                          <button
                            onClick={() => {
                              setScenario(s.scenario);
                              setAnalysis(s.analysis);
                              setToast('📂 Loaded into workspace');
                            }}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-300 font-bold transition-all"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => removeInsight(s.id)}
                            className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-full hover:bg-red-300 font-bold flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20">
            <h2 className="text-4xl font-black text-gray-800 mb-8 text-center">🎓 How BehaviorIQ Works</h2>

            <div className="space-y-6 mb-10">
              {[
                { step: '1', icon: Brain, title: 'Pattern Recognition', desc: 'Our AI identifies behavioral patterns using psychological frameworks and research-backed principles.' },
                { step: '2', icon: Target, title: 'Context Analysis', desc: 'We analyze the context and underlying motivations driving the behavior.' },
                { step: '3', icon: Lightbulb, title: 'Actionable Insights', desc: 'Get practical suggestions based on established psychological principles and behavioral science.' }
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="flex gap-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-lg transition-all border-l-4 border-indigo-600">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-black text-xl shadow-lg">
                      {step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-gray-800 mb-2 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      {title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl border-2 border-indigo-300">
              <h3 className="font-black text-gray-800 mb-6 text-xl">🚀 Use Cases</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { emoji: '👔', title: 'Management', desc: 'Understand team dynamics and improve leadership' },
                  { emoji: '📊', title: 'Marketing', desc: 'Decode customer behavior and decision-making' },
                  { emoji: '🌱', title: 'Personal Growth', desc: 'Gain insights into your own behavioral patterns' },
                  { emoji: '🎨', title: 'UX Design', desc: 'Create better user experiences based on behavior' }
                ].map(({ emoji, title, desc }, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed right-6 bottom-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 animate-bounce border border-white/20 backdrop-blur-md z-50 font-bold">
          <Sparkles className="w-5 h-5 animate-spin" />
          <div>{toast}</div>
        </div>
      )}
    </div>
  );
}
